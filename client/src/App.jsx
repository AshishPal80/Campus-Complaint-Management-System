import React, { useState } from 'react';
import { StudentDashboard } from './pages/StudentDashboard';
import { StaffDashboard } from './pages/StaffDashboard';

function App() {
  const [role, setRole] = useState('staff'); // Default to staff dashboard for Member 2 testing, toggleable anytime

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans antialiased text-[#171717]">
      {role === 'staff' ? (
        <StaffDashboard onSwitchRole={setRole} />
      ) : (
        <StudentDashboard onSwitchRole={setRole} />
      )}
    </div>
  );
}

export default App;
