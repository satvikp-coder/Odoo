import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';

// 1. MOCK DATABASE (Simulating a backend)
const USERS_DB = [
  { username: 'admin', password: '123', name: 'Alice Manager', role: 'Manager' },
  { username: 'tech', password: '123', name: 'Bob Technician', role: 'Technician' }
];

const Login = () => {
  const navigate = useNavigate();
  
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // 2. CHECK CREDENTIALS
    const foundUser = USERS_DB.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      // 3. SUCCESS: Save user to storage
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      
      // Redirect
      navigate('/');
      window.location.reload(); // Refresh to update Sidebar
    } else {
      // 4. FAIL: Show error
      setError('Invalid Username or Password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">GearGuard ⚙️</h1>
          <p className="text-slate-500">Secure Maintenance Access</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* USERNAME INPUT */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition shadow-lg mt-4"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          <p>Demo Credentials:</p>
          <p>Manager: <b>admin / 123</b></p>
          <p>Technician: <b>tech / 123</b></p>
        </div>

      </div>
    </div>
  );
};

export default Login;