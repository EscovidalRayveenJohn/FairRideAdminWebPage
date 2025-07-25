import React from 'react';

const UserManagement = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="font-semibold text-xl text-gray-800 mb-4">User Account Management</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-3 text-sm font-semibold text-gray-600">User ID</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Name</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Email</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">User Type</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {/* Sample Data */}
                    <tr>
                        <td className="p-3 text-sm text-gray-700">USR-001</td>
                        <td className="p-3 text-sm text-gray-700">Juan Dela Cruz</td>
                        <td className="p-3 text-sm text-gray-700">juan.cruz@email.com</td>
                        <td className="p-3 text-sm text-gray-700">Commuter</td>
                        <td className="p-3"><span className="text-xs font-semibold bg-green-100 text-green-800 py-1 px-2 rounded-full">Active</span></td>
                        <td className="p-3"><button className="text-red-500 hover:underline">Deactivate</button></td>
                    </tr>
                    <tr>
                        <td className="p-3 text-sm text-gray-700">DRV-001</td>
                        <td className="p-3 text-sm text-gray-700">Jose Rizal</td>
                        <td className="p-3 text-sm text-gray-700">jose.r@email.com</td>
                        <td className="p-3 text-sm text-gray-700">Driver</td>
                        <td className="p-3"><span className="text-xs font-semibold bg-green-100 text-green-800 py-1 px-2 rounded-full">Active</span></td>
                        <td className="p-3"><button className="text-red-500 hover:underline">Deactivate</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

export default UserManagement;
