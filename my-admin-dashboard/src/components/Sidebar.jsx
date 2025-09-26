import React from 'react';

const Sidebar = ({ activeSection, setSection, sections, handleLogout }) => {
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white flex flex-col z-10">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
         <img src="/fairride-logo.png" alt="FairRide Logo" className="w-12 h-12 mr-3 bg-white p-1 rounded-full object-contain"/>
        <h1 className="text-xl font-bold tracking-wider">FairRide Koronadal</h1>
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
            className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200  ${
              activeSection === key ? 'bg-green-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {React.cloneElement(sections[key].icon, {
              className: "w-6 h-6 mr-4",
            })}
            <span className="font-medium">{sections[key].label}</span>
          </a>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t border-gray-700">
          <a href="#" onClick={handleLogout} className="flex items-center py-3 px-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white">
              <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span className="font-medium">Logout</span>
          </a>
      </div>
    </div>
  );
};

export default Sidebar;

