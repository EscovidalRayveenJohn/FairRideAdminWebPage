import React, { useState } from 'react';

// Import Components
import Sidebar from './components/Sidebar';

// Import Pages
import Dashboard from './pages/Dashboard';
import ReportManagement from './pages/ReportManagement';
import FareMatrixManagement from './pages/FareMatrixManagement';
import UserManagement from './pages/UserManagement';

function App() {
  const [section, setSection] = useState('dashboard');

  const sections = {
    dashboard: { 
      label: 'Dashboard', 
      component: <Dashboard />, 
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> 
    },
    reports: { 
      label: 'Report Management', 
      component: <ReportManagement />, 
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> 
    },
    fareMatrix: { 
      label: 'Fare Matrix Mgt.', 
      component: <FareMatrixManagement />, 
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg> 
    },
    users: { 
      label: 'User Account Mgt.', 
      component: <UserManagement />, 
      icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> 
    },
  };

  return (
    <div className="bg-gray-100 font-sans">
      <div className="flex h-screen bg-gray-200">
        <Sidebar activeSection={section} setSection={setSection} sections={sections} />
        
        <div className="flex-1 flex flex-col ml-64">
          <header className="h-20 bg-white shadow-md flex items-center justify-between px-8">
            <h2 className="text-2xl font-bold text-gray-800">{sections[section].label}</h2>
            <div className="flex items-center">
              <span className="text-gray-600 mr-4">Administrator</span>
              <img className="h-10 w-10 rounded-full object-cover" src="https://placehold.co/100x100/16a34a/ffffff?text=A" alt="Admin avatar" />
            </div>
          </header>
          <main className="flex-1 p-8 overflow-y-auto">
            {sections[section].component}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
