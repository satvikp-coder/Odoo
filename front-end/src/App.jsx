import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// --- Imports ---
import Navbar from './components/layout/Navbar'; 
import KanbanBoard from './pages/KanbanBoard';
import EquipmentList from './pages/EquipmentList';
import RequestForm from './pages/RequestForm';
import CalendarView from './pages/CalendarView'; 
import Login from './pages/Login'; 
import AnalyticsDashboard from './pages/AnalyticsDashboard'; 
import Signup from './Signup';
// REMOVED: import AssigneeCard from './components/AssigneeCard'; 

// --- Layout Component ---
const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        
        {/* REMOVED: The <AssigneeCard /> block is gone from here. */}

        {/* This loads your pages (Kanban, Equipment, etc.) directly */}
        <Outlet />
      </main>
    </div>
  );
};

// --- Main App Component ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<KanbanBoard />} />
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/create" element={<RequestForm />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
