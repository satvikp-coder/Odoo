import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wrench, Calendar, PlusCircle, BarChart3, LogOut } from 'lucide-react'; // Removed UserCircle as we use Emojis now

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load User from LocalStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Maintenance Board', icon: <LayoutDashboard size={20} /> },
    { path: '/equipment', label: 'Equipment & Assets', icon: <Wrench size={20} /> },
    { path: '/calendar', label: 'Schedule', icon: <Calendar size={20} /> },
  ];

  return (
    <nav className="w-64 bg-slate-900 min-h-screen text-white flex flex-col fixed left-0 top-0 z-50">
      
      {/* Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8 text-purple-400 px-2">GearGuard ⚙️</h1>
        
        {/* Navigation Links */}
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-purple-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <Link 
            to="/analytics" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === '/analytics' 
                ? 'bg-purple-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 size={20} />
            <span className="font-medium">Reports</span>
          </Link>
        </div>
      </div>

      {/* Spacer to push content to bottom */}
      <div className="flex-1"></div>

      {/* --- BOTTOM SECTION --- */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        
        {/* 'New Request' Button (Preserved) */}
        <Link 
          to="/create" 
          className="mb-6 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-bold transition shadow-lg shadow-purple-900/20"
        >
          <PlusCircle size={20} />
          New Request
        </Link>

        {/* User Profile Section */}
        {user ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              
              {/* Dynamic Avatar Circle (Emoji Logic) */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 ${
                user.role === 'Technician' ? 'bg-blue-900/50' : 'bg-purple-900/50'
              }`}>
                <span className="text-xl">
                  {user.role === 'Technician' ? '👨🏻‍🔧' : '👩🏻‍💼'}
                </span>
              </div>

              {/* Name & Role Badge */}
              <div>
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                   user.role === 'Technician' ? 'bg-blue-600' : 'bg-purple-600'
                }`}>
                  {user.role ? user.role.toUpperCase() : 'USER'}
                </span>
              </div>
            </div>

            {/* Sign Out Button (Styled + Functional) */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium w-full pl-1"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        ) : (
          // Fallback if no user is logged in
          <Link to="/login" className="text-slate-400 text-sm hover:text-white block text-center">
            Login Required
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Navbar;