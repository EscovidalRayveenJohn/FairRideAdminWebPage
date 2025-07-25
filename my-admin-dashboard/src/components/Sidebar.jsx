import React from 'react';

const Sidebar = ({ activeSection, setSection, sections }) => {
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-green-700 text-white flex flex-col z-10">
      <div className="flex items-center justify-center h-20 border-b border-green-800">
        <h1 className="text-2xl font-bold">FairRide Admin</h1>
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
    </div>
  );
};

export default Sidebar;
