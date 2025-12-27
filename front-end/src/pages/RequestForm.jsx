import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, AlertCircle } from 'lucide-react';

// 1. THE FAKE DATABASE (Mock Data)
// This simulates fetching equipment details from a server
const EQUIPMENT_DB = [
  { id: 1, name: "Canon Printer X1", category: "Electronics", team: "IT Support" },
  { id: 2, name: "Hydraulic Press 500T", category: "Heavy Machinery", team: "Mechanics" },
  { id: 3, name: "Office AC Unit #4", category: "HVAC", team: "Facility Maint." },
  { id: 4, name: "Dell Server Rack", category: "Electronics", team: "IT Support" },
  { id: 5, name: "Conveyor Belt Motor", category: "Heavy Machinery", team: "Mechanics" },
];

const RequestForm = () => {
  const navigate = useNavigate();

  // 2. FORM STATE
  const [formData, setFormData] = useState({
    title: '',
    equipment: '',
    priority: 'Medium',
    description: '',
    // These will be auto-filled:
    category: '',
    team: ''
  });

  // 3. THE AUTO-FILL LOGIC
  const handleEquipmentChange = (e) => {
    const selectedEqName = e.target.value;
    
    // Find the equipment details in our "Database"
    const eqDetails = EQUIPMENT_DB.find(item => item.name === selectedEqName);

    if (eqDetails) {
      // Auto-fill the other fields!
      setFormData(prev => ({
        ...prev,
        equipment: selectedEqName,
        category: eqDetails.category,
        team: eqDetails.team
      }));
    } else {
      setFormData(prev => ({ ...prev, equipment: selectedEqName }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to backend
    // For now, we just go back to the board
    alert("Request Created! (Auto-assigned to " + formData.team + ")");
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">New Maintenance Request</h1>
        <p className="text-slate-500">Select equipment to auto-route this ticket.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        
        {/* Title Input */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Issue Title</label>
          <input 
            required
            type="text" 
            placeholder="e.g. Leaking Oil"
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        {/* 🧠 SMART DROPDOWN (Auto-Fill Trigger) */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Select Equipment</label>
          <select 
            required
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
            value={formData.equipment}
            onChange={handleEquipmentChange}
          >
            <option value="">-- Choose Equipment --</option>
            {EQUIPMENT_DB.map(eq => (
              <option key={eq.id} value={eq.name}>{eq.name}</option>
            ))}
          </select>
        </div>

        {/* READ-ONLY AUTO-FILLED FIELDS */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Category</label>
            <p className="font-medium text-slate-800">{formData.category || "---"}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Assigned Team</label>
            <p className="font-bold text-purple-600">{formData.team || "---"}</p>
          </div>
        </div>

        {/* Priority & Desc */}
        <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                <select 
                    className="w-full p-3 border border-slate-200 rounded-lg"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                </select>
            </div>
        </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea 
                rows="4"
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition shadow-lg hover:shadow-xl"
          >
            <Save size={18} />
            Submit Request
          </button>
        </div>

      </form>
    </div>
  );
};

export default RequestForm;