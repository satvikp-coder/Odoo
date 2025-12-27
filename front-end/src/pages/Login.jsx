import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { Lock, User, AlertCircle, Loader } from 'lucide-react'; 

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); 

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, password: password }) 
      });

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem('currentUser', JSON.stringify(data.user)); 
        navigate('/');
        window.location.reload();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Is the backend running?');
    } finally {
      setLoading(false);
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
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition shadow-lg mt-4 flex justify-center items-center gap-2"
          >
            {loading ? <Loader className="animate-spin" size={20}/> : "Sign In"}
          </button>
        </form>

        {/* 3. SIGN UP LINK */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-600 font-bold hover:underline">
            Create Account
          </Link>
        </div>

        {/* 4. UPDATED DEMO CREDS TO MATCH BACKEND SEED */}
        <div className="mt-6 text-center text-xs text-slate-400 border-t pt-4 border-slate-100">
          <p className="mb-1 font-semibold uppercase tracking-wider">Demo Credentials:</p>
          <p>Manager: <b>Mike Wrench / 1234</b></p>
          <p>Technician: <b>John Grease / 1234</b></p>
          <p>Admin: <b>Admin / 1234</b></p>
        </div>

      </div>
    </div>
  );
};

export default Login;
