import React from 'react';

const Sidebar = ({ activeSection, setSection, sections, handleLogout }) => {
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-green-700 text-white flex flex-col z-10">
      <div className="flex items-center justify-center h-20 border-b border-green-800">
         <img src="/fairride-logo.png" alt="FairRide Logo" className="w-10 h-10 mr-2 bg-white p-1 rounded-full"/>
        <h1 className="text-xl font-bold">FairRide Admin</h1>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {Object.keys(sections).map(key => (
          <a
            key={key}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSection(key);
            }}
            className={`flex items-center py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-green-600 ${
              activeSection === key ? 'bg-green-800' : ''
            }`}
          >
            {React.cloneElement(sections[key].icon, {
              className: `w-6 h-6 mr-3 ${
                activeSection === key ? 'text-white' : 'text-green-200'
              }`,
            })}
            <span>{sections[key].label}</span>
          </a>
        ))}
      </nav>
      {/* --- LOGOUT BUTTON ADDED HERE --- */}
      <div className="p-4 mt-auto border-t border-green-800">
          <a href="#" onClick={handleLogout} className="flex items-center text-green-200 hover:text-white">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span>Logout</span>
          </a>
      </div>
    </div>
  );
};

export default Sidebar;
