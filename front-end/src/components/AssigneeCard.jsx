// File: src/components/AssigneeCard.jsx

export default function AssigneeCard() {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm w-full max-w-sm border border-gray-200">

      {/* --- Technician Row --- */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase">Assigned Technician</p>
          <p className="text-sm font-semibold text-gray-800">John Doe</p>
        </div>
        
        {/* Technician Avatar (Emoji style) */}
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full border-2 border-white shadow-sm">
          <span className="text-2xl">👨🏻‍🔧</span>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* --- Manager Row --- */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase">Project Manager</p>
          <p className="text-sm font-semibold text-gray-800">Jane Smith</p>
        </div>

        {/* Manager Avatar (Emoji style) */}
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full border-2 border-white shadow-sm">
          <span className="text-2xl">👩🏻‍💼</span>
        </div>
      </div>

    </div>
  );
}