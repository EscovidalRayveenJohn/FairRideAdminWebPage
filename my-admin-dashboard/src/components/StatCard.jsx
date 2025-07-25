import React from 'react';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-3xl font-bold ${color === 'red' ? 'text-red-600' : 'text-gray-800'}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
            {React.cloneElement(icon, { className: `w-6 h-6 text-${color}-500` })}
        </div>
    </div>
);

export default StatCard;
