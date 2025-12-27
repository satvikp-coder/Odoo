import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle2, Loader } from 'lucide-react';

const AnalyticsDashboard = () => {
  // State for Chart Data
  const [statusData, setStatusData] = useState([]);
  const [workloadData, setWorkloadData] = useState([]);
  
  const [kpis, setKpis] = useState({ total: 0, pending: 0, completed: 0 });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/requests');
        const data = await response.json();

        const total = data.length;
        const pending = data.filter(r => ['New', 'In Progress'].includes(r.stage)).length;
        const completed = data.filter(r => r.stage === 'Repaired').length;

        setKpis({ total, pending, completed });

        const newCount = data.filter(r => r.stage === 'New').length;
        const progressCount = data.filter(r => r.stage === 'In Progress').length;
        const repairedCount = data.filter(r => r.stage === 'Repaired').length;

        setStatusData([
          { name: 'In Progress', value: progressCount, color: '#f59e0b' }, // Amber
          { name: 'New', value: newCount, color: '#ef4444' },             // Red
          { name: 'Repaired', value: repairedCount, color: '#22c55e' },    // Green
        ]);

        const teamMap = { 1: 'Mechanics', 2: 'IT Support', 3: 'Electricians' };
        
        const workload = { 'Mechanics': 0, 'IT Support': 0, 'Electricians': 0 };

        data.forEach(req => {
      
          const teamName = req.maintenance_team ? req.maintenance_team.name : teamMap[req.maintenanceTeamId];
          if (workload[teamName] !== undefined) {
            workload[teamName]++;
          }
        });

        const formattedWorkload = Object.keys(workload).map(key => ({
          name: key,
          tasks: workload[key]
        }));

        setWorkloadData(formattedWorkload);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching analytics:", error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-10 flex gap-2 items-center text-slate-500"><Loader className="animate-spin"/> Loading Analytics...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <TrendingUp className="text-purple-600" /> 
        Maintenance Analytics
      </h2>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Total Requests</p>
            <h3 className="text-3xl font-bold text-slate-800">{kpis.total}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Pending</p>
            <h3 className="text-3xl font-bold text-slate-800">{kpis.pending}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Completed</p>
            <h3 className="text-3xl font-bold text-slate-800">{kpis.completed}</h3>
          </div>
        </div>
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bar Chart Container - Increased Height to h-96 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96 flex flex-col">
          <h3 className="font-bold text-slate-700 mb-4">Workload by Team</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="tasks" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Container - Increased Height to h-96 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96 flex flex-col">
          <h3 className="font-bold text-slate-700 mb-4">Request Status</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ bottom: 20 }}>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%" 
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;
