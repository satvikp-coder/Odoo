import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Loader } from 'lucide-react';

const CalendarView = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/requests')
      .then(res => res.json())
      .then(data => {
        const preventiveJobs = data.filter(req => 
          req.type === 'Preventive' && 
          req.scheduled_date
        );
        setEvents(preventiveJobs);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load calendar events", err);
        setLoading(false);
      });
  }, []);

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
    setCurrentDate(new Date(newDate));
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handleDateClick = (day) => {
    // Format: YYYY-MM-DD
    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    navigate(`/create?date=${dateStr}&type=preventive`);
  };

  if (loading) return <div className="p-10 flex gap-2 items-center text-slate-500"><Loader className="animate-spin"/> Loading Schedule...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Preventive Schedule</h2>
        <div className="flex items-center gap-4">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-200 rounded-full">
            <ChevronLeft />
          </button>
          <span className="text-xl font-medium w-40 text-center">{monthName} {year}</span>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-200 rounded-full">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-7 gap-4 text-center mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="font-bold text-slate-400 uppercase text-sm">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Empty slots for start of month */}
          {[...Array(new Date(year, currentDate.getMonth(), 1).getDay())].map((_, i) => (
            <div key={`empty-${i}`} className="h-32 bg-slate-50 rounded-lg"></div>
          ))}

          {/* Actual Days */}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            
            // Construct YYYY-MM-DD string to match the Backend 'DATEONLY' format
            const dateKey = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Filter events that match this exact date
            const dayEvents = events.filter(e => e.scheduled_date === dateKey);
            
            return (
              <div 
                key={day} 
                onClick={() => handleDateClick(day)}
                className="h-32 border border-slate-100 rounded-lg p-2 hover:border-purple-500 hover:shadow-md transition cursor-pointer relative group overflow-y-auto"
              >
                <span className={`font-bold ${dayEvents.length > 0 ? 'text-purple-600' : 'text-slate-700'}`}>
                  {day}
                </span>
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-purple-600">
                  <Plus size={16} />
                </div>

                <div className="mt-2 space-y-1">
                  {dayEvents.map(ev => (
                    <div key={ev.id} className="bg-purple-100 text-purple-700 text-xs p-1 rounded font-medium truncate" title={ev.subject}>
                      {ev.subject}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
