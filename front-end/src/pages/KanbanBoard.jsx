import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, Clock, User, Ban, X, FileText, Loader } from 'lucide-react';

const KanbanBoard = () => {
 
  const user = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest', role: 'Viewer', id: null };

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedRequestId, setDraggedRequestId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const filterName = searchParams.get('filter');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/requests');
        const data = await response.json();

        // MAPPING: Convert Backend Database format to Frontend UI format
        const formattedData = data.map(req => ({
          id: req.id,
          subject: req.subject,
          equipment: req.equipment ? req.equipment.name : 'Unknown Asset', // Flatten object
          stage: req.stage,
          priority: 'Medium', // Default, or fetch if added to backend later
          tech: req.technician ? req.technician.name : 'Unassigned', // Flatten object
          scheduled: req.scheduled_date,
          overdue: false, // specific logic can be added here
          duration: req.duration || 0
        }));

        setRequests(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch Kanban board:", err);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const displayRequests = filterName 
    ? requests.filter(r => r.equipment === filterName)
    : requests;

  const columns = ["New", "In Progress", "Repaired", "Scrap"];

  const handleDragStart = (e, id) => {
    setDraggedRequestId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    if (!draggedRequestId) return;

    if (user.role === 'Viewer') {
      alert("⚠️ Viewers cannot move cards. Please login as Technician or Manager.");
      return;
    }

    const request = requests.find(r => r.id === draggedRequestId);
    
    let duration = request.duration;
    
    if (targetStage === 'Repaired' && request.stage !== 'Repaired') {
      const hours = window.prompt("⏱️ How many hours did this take?");
      if (hours) duration = parseFloat(hours);
    }

    if (targetStage === 'Scrap' && request.stage !== 'Scrap') {
      if (user.role !== 'Manager' && user.role !== 'Admin') {
        alert("⛔ Only Managers and Admins can scrap equipment!");
        return;
      }
      if(!window.confirm("⚠️ Are you sure? This will mark the equipment as UNUSABLE.")) {
        return; 
      }
    }

    const updatedRequests = requests.map(req => 
      req.id === draggedRequestId 
        ? { ...req, stage: targetStage, duration: duration, tech: (targetStage === 'In Progress' && req.tech === 'Unassigned') ? user.name : req.tech } 
        : req
    );
    setRequests(updatedRequests);
    setDraggedRequestId(null);


    try {
      await fetch(`http://localhost:3000/api/requests/${draggedRequestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: targetStage,
          duration: duration,
          technicianId: (targetStage === 'In Progress' && request.tech === 'Unassigned') ? user.id : undefined
        })
      });
    } catch (err) {
      console.error("Failed to update request:", err);
      alert("Failed to save changes to server.");
    }
  };

  if (loading) return <div className="p-10 flex gap-2 items-center text-slate-500"><Loader className="animate-spin"/> Loading Board...</div>;

  return (
    <div className="p-2">
      {/* --- CUSTOM HEADER BASED ON ROLE --- */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Maintenance Board</h2>
          <p className="text-slate-500 mt-2 flex items-center gap-2">
            Welcome back, <span className="font-bold text-purple-600">{user.name}</span> 
            
            {/* Role Badge */}
            <span className={`px-2 py-1 rounded text-xs uppercase font-bold border ${
              user.role === 'Manager' 
                ? 'bg-purple-100 text-purple-700 border-purple-200' 
                : 'bg-blue-100 text-blue-700 border-blue-200'
            }`}>
              {user.role}
            </span>
          </p>
        </div>
        
        {/* Right Side: Filters & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Active Filter Badge */}
          {filterName && (
            <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg border border-purple-200 text-sm">
              <span className="font-medium">Filter: {filterName}</span>
              <button 
                onClick={() => setSearchParams({})} 
                className="hover:bg-purple-200 rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Manager Only Export Button */}
          {user.role === 'Manager' && (
            <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 shadow-sm">
              <FileText size={16} />
              Export Report
            </button>
          )}
        </div>
      </div>
      
      {/* --- KANBAN COLUMNS --- */}
      <div className="grid grid-cols-4 gap-4 h-[calc(100vh-180px)]">
        {columns.map(stage => (
          <div 
            key={stage}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
            className={`p-4 rounded-xl flex flex-col transition-colors duration-200
              ${stage === 'Scrap' ? 'bg-red-50 border-2 border-dashed border-red-200' : 'bg-slate-100 shadow-inner'}
            `}
          >
            <h3 className="font-bold text-slate-700 mb-4 flex justify-between items-center">
              {stage}
              <span className="bg-white px-2 py-1 rounded-full text-xs shadow-sm text-slate-500">
                {displayRequests.filter(r => r.stage === stage).length}
              </span>
            </h3>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {displayRequests.filter(req => req.stage === stage).map(req => (
                <div 
                  key={req.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, req.id)}
                  className={`bg-white p-4 rounded-lg shadow-sm border-l-4 cursor-grab active:cursor-grabbing hover:shadow-md transition group
                    ${req.overdue ? 'border-red-500' : 'border-green-500'} 
                    ${stage === 'Scrap' ? 'opacity-75 grayscale' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold uppercase ${stage === 'Scrap' ? 'line-through text-red-500' : 'text-slate-500'}`}>
                      {req.equipment}
                    </span>
                    {req.overdue && stage !== 'Repaired' && (
                      <AlertTriangle size={14} className="text-red-500" />
                    )}
                  </div>
                  
                  <h4 className="font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors">{req.subject}</h4>
                  
                  {/* --- DURATION SECTION (Only for Repaired) --- */}
                  {stage === 'Repaired' && req.duration > 0 && (
                    <div className="flex items-center gap-1 text-xs text-slate-600 mb-2 bg-slate-100 p-1 rounded w-fit">
                      <Clock size={12} /> {req.duration} Hours spent
                    </div>
                  )}

                  {stage === 'Scrap' && (
                    <div className="flex items-center gap-1 text-xs text-red-600 font-bold mb-2 border border-red-200 bg-red-50 p-1 rounded">
                      <Ban size={12} /> SCRAPPED
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-50 mt-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-xs">
                        {req.tech ? req.tech[0] : <User size={12}/>}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">{req.tech}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
