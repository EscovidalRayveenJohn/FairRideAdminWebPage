import React from 'react';

const FareMatrixManagement = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-xl text-gray-800">Fare Matrix Management</h3>
            <button className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Add New Rate</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-3 text-sm font-semibold text-gray-600">Zone/Route</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Regular Fare</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Student/Senior Fare</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {/* Sample Data */}
                    <tr>
                        <td className="p-3 text-sm text-gray-700">Zone 1 (Poblacion)</td>
                        <td className="p-3 text-sm text-gray-700">₱15.00</td>
                        <td className="p-3 text-sm text-gray-700">₱12.00</td>
                        <td className="p-3 space-x-2">
                            <button className="text-blue-500 hover:underline">Edit</button>
                            <button className="text-red-500 hover:underline">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td className="p-3 text-sm text-gray-700">Zone 2 (Barangays near Poblacion)</td>
                        <td className="p-3 text-sm text-gray-700">₱20.00</td>
                        <td className="p-3 text-sm text-gray-700">₱17.00</td>
                        <td className="p-3 space-x-2">
                            <button className="text-blue-500 hover:underline">Edit</button>
                            <button className="text-red-500 hover:underline">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

export default FareMatrixManagement;
