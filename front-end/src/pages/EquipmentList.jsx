import React from 'react';
import { Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const equipmentData = [
  { id: 1, name: "CNC Machine", serial: "CNC-001", team: "Mechanics", activeReqs: 3 },
  { id: 2, name: "Printer 01", serial: "PRT-X99", team: "IT Support", activeReqs: 0 },
  { id: 3, name: "Generator X", serial: "GEN-500", team: "Electricians", activeReqs: 1 },
];

const EquipmentList = () => {
  const navigate = useNavigate(); // 2. Initialize the hook

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
                <td className="p-4 font-medium text-slate-800">{eq.name}</td>
                <td className="p-4 text-slate-500">{eq.serial}</td>
                <td className="p-4">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                    {eq.team}
                  </span>
                </td>
                <td className="p-4">
                  {/* 3. Added onClick handler to navigate with filter */}
                  <button 
                    onClick={() => navigate(`/?filter=${eq.name}`)}
                    className="flex items-center gap-2 border border-slate-300 px-3 py-1.5 rounded-lg hover:border-purple-500 hover:text-purple-600 transition group bg-white"
                  >
                    <Wrench size={14} />
                    <span className="text-sm font-medium">Maintenance</span>
                    {eq.activeReqs > 0 && (
                      <span className="bg-purple-100 text-purple-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {eq.activeReqs}
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