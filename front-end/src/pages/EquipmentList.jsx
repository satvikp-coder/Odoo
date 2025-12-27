import React, { useState, useEffect } from 'react';
import { Wrench, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EquipmentList = () => {
  const navigate = useNavigate();
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const [eqRes, reqRes] = await Promise.all([
          fetch('http://localhost:3000/api/equipment'),
          fetch('http://localhost:3000/api/requests')
        ]);

        const equipment = await eqRes.json();
        const requests = await reqRes.json();

        const mergedData = equipment.map(eq => {
          const activeCount = requests.filter(r => 
            r.equipmentId === eq.id && 
            ['New', 'In Progress'].includes(r.stage)
          ).length;

          return {
            ...eq,
            teamName: eq.maintenance_team ? eq.maintenance_team.name : 'Unassigned',
            smart_button_count: activeCount
          };
        });

        setEquipmentData(mergedData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 flex gap-2 items-center text-slate-500"><Loader className="animate-spin"/> Loading Assets...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Equipment Assets</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Serial Number</th>
              <th className="p-4">Team</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {equipmentData.map((eq) => (
              <tr key={eq.id} className="hover:bg-slate-50 transition">
                {/* NAME */}
                <td className="p-4 font-medium text-slate-800">{eq.name}</td>
                
                {/* SERIAL NUMBER (Backend uses serial_number) */}
                <td className="p-4 text-slate-500">{eq.serial_number || 'N/A'}</td>
                
                {/* TEAM */}
                <td className="p-4">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                    {eq.teamName}
                  </span>
                </td>

                {/* SMART BUTTON ACTION */}
                <td className="p-4">
                  <button 
                    onClick={() => navigate(`/?filter=${eq.name}`)}
                    className="flex items-center gap-2 border border-slate-300 px-3 py-1.5 rounded-lg hover:border-purple-500 hover:text-purple-600 transition group bg-white"
                  >
                    <Wrench size={14} />
                    <span className="text-sm font-medium">Maintenance</span>
                    
                    {/* THE SMART BADGE */}
                    {eq.smart_button_count > 0 && (
                      <span className="bg-purple-100 text-purple-700 text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                        {eq.smart_button_count}
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentList;
