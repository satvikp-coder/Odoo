import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, Loader, Calendar } from 'lucide-react';

const RequestForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const typeParam = searchParams.get('type');

  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: typeParam === 'preventive' ? 'Scheduled Maintenance' : '', 
    equipmentId: '',
    priority: 'Medium',
    description: '',
    category: '',
    team: ''
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/equipment')
      .then(res => res.json())
      .then(data => {
        setEquipmentList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load equipment", err);
        setLoading(false);
      });
  }, []);

  const handleEquipmentChange = (e) => {
    const selectedId = e.target.value;
    
    const eqDetails = equipmentList.find(item => item.id == selectedId);

    if (eqDetails) {
      const teamName = eqDetails.maintenance_team 
        ? eqDetails.maintenance_team.name 
        : (eqDetails.maintenanceTeamId === 1 ? 'Mechanics' : eqDetails.maintenanceTeamId === 2 ? 'IT Support' : 'Electricians');
      const categoryMap = { 'Mechanics': 'Heavy Machinery', 'IT Support': 'Electronics', 'Electricians': 'Power Systems' };

      setFormData(prev => ({
        ...prev,
        equipmentId: selectedId,
        team: teamName,
        category: categoryMap[teamName] || 'General Asset'
      }));
    } else {
      setFormData(prev => ({ ...prev, equipmentId: selectedId, team: '', category: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      subject: formData.title,
      type: typeParam === 'preventive' ? 'Preventive' : 'Corrective',
      equipment_id: formData.equipmentId,
      scheduled_date: dateParam ? dateParam : undefined, 
    };

    try {
      const response = await fetch('http://localhost:3000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        navigate('/');
      } else {
        alert("Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Server error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 flex gap-2 items-center text-slate-500"><Loader className="animate-spin"/> Loading Equipment List...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">New Maintenance Request</h1>
        <p className="text-slate-500">Select equipment to auto-route this ticket.</p>
        
        {/* Visual Indicator if coming from Calendar */}
        {dateParam && (
          <div className="mt-3 inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold border border-purple-200">
            <Calendar size={16} />
            Scheduled for: {dateParam}
          </div>
        )}
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

        {/* SMART DROPDOWN (Auto-Fill Trigger) */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Select Equipment</label>
          <select 
            required
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
            value={formData.equipmentId}
            onChange={handleEquipmentChange}
          >
            <option value="">-- Choose Equipment --</option>
            {equipmentList.map(eq => (
              <option key={eq.id} value={eq.id}>{eq.name}</option>
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
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {submitting ? <Loader className="animate-spin" size={18}/> : <Save size={18} />}
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default RequestForm;
