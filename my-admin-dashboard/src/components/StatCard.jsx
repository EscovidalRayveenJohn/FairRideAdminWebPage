import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
        green: { bg: 'bg-green-100', text: 'text-green-600' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
        red: { bg: 'bg-red-100', text: 'text-red-600' },
    };

    const selectedColor = colorClasses[color] || colorClasses.blue;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-6 hover:shadow-xl transition-shadow duration-300">
            <div className={`p-4 rounded-full ${selectedColor.bg}`}>
                {React.cloneElement(icon, { className: `w-8 h-8 ${selectedColor.text}` })}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
