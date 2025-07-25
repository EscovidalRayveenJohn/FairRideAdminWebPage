import React from 'react';

const ReportManagement = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="font-semibold text-xl text-gray-800 mb-4">Report Management</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-3 text-sm font-semibold text-gray-600">Case ID</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Complainant</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Incident Type</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Date</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {/* Sample Data */}
                    <tr>
                        <td className="p-3 text-sm text-gray-700">FR-0312</td>
                        <td className="p-3 text-sm text-gray-700">Juan Dela Cruz</td>
                        <td className="p-3 text-sm text-gray-700">Overcharging</td>
                        <td className="p-3 text-sm text-gray-700">2025-07-22</td>
                        <td className="p-3"><span className="text-xs font-semibold bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full">Pending</span></td>
                        <td className="p-3"><button className="text-blue-500 hover:underline">View Details</button></td>
                    </tr>
                     <tr>
                        <td className="p-3 text-sm text-gray-700">FR-0310</td>
                        <td className="p-3 text-sm text-gray-700">Lita Mercado</td>
                        <td className="p-3 text-sm text-gray-700">Unsafe Driving</td>
                        <td className="p-3 text-sm text-gray-700">2025-07-20</td>
                        <td className="p-3"><span className="text-xs font-semibold bg-green-100 text-green-800 py-1 px-2 rounded-full">Resolved</span></td>
                        <td className="p-3"><button className="text-blue-500 hover:underline">View Details</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

export default ReportManagement;
