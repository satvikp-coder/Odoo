import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const CalendarView = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  // MOCK DATA: Only Preventive requests should show here [cite: 62]
  const events = [
    { id: 1, date: 20, title: "Generator Checkup", type: "preventive" },
    { id: 2, date: 25, title: "Filter Change", type: "preventive" },
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const handleDateClick = (day) => {
    // Requirement: Click a date to schedule a new request [cite: 63]
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    navigate(`/create?date=${dateStr}&type=preventive`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800">Preventive Schedule</h2>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-200 rounded-full"><ChevronLeft /></button>
          <span className="text-xl font-medium w-32 text-center">{monthName}</span>
          <button className="p-2 hover:bg-slate-200 rounded-full"><ChevronRight /></button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-7 gap-4 text-center mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="font-bold text-slate-400 uppercase text-sm">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Empty slots for start of month (Simplified for hackathon) */}
          {[...Array(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay())].map((_, i) => (
            <div key={`empty-${i}`} className="h-32 bg-slate-50 rounded-lg"></div>
          ))}

          {/* Actual Days */}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const dayEvents = events.filter(e => e.date === day);
            
            return (
              <div 
                key={day} 
                onClick={() => handleDateClick(day)}
                className="h-32 border border-slate-100 rounded-lg p-2 hover:border-purple-500 hover:shadow-md transition cursor-pointer relative group"
              >
                <span className="font-bold text-slate-700">{day}</span>
                
                {/* Plus icon on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-purple-600">
                  <Plus size={16} />
                </div>

                <div className="mt-2 space-y-1">
                  {dayEvents.map(ev => (
                    <div key={ev.id} className="bg-purple-100 text-purple-700 text-xs p-1 rounded font-medium truncate">
                      {ev.title}
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