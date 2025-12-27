import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { Lock, User, Briefcase, Users, Loader } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    role: 'Technician',
    maintenanceTeamId: 1 
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account Created! Please Login.");
        navigate('/login');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Server error. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-purple-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
            <User className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
          <p className="text-slate-500 mt-1">Join the Maintenance Team</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center gap-2 border border-red-100">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* USERNAME INPUT */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                required
                type="text" 
                placeholder="Choose a username"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                required
                type="password" 
                placeholder="Create a password"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* ROLE SELECT */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                <select 
                  className="w-full pl-10 pr-2 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Technician">Technician</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* TEAM SELECT */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Team</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 text-slate-400" size={18} />
                <select 
                  className="w-full pl-10 pr-2 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  value={formData.maintenanceTeamId}
                  onChange={(e) => setFormData({...formData, maintenanceTeamId: parseInt(e.target.value)})}
                >
                  <option value={1}>Mechanics</option>
                  <option value={2}>IT Support</option>
                  <option value={3}>Electricians</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition shadow-lg mt-6 flex justify-center items-center gap-2"
          >
            {loading ? <Loader className="animate-spin" size={20}/> : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 font-bold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;
