import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const usersCollectionRef = collection(db, 'users');
        const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
            setIsLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleToggleStatus = async (user) => {
        const userDocRef = doc(db, 'users', user.id);
        // Default to 'Active' if status is not set
        const newStatus = (user.status || 'Active') === 'Active' ? 'Deactivated' : 'Active';
        try {
            await updateDoc(userDocRef, { status: newStatus });
            // The UI will update automatically thanks to the onSnapshot listener
        } catch (error) {
            console.error("Error updating user status: ", error);
        }
    };

    const renderStatusBadge = (status) => {
        const currentStatus = status || 'Active';
        if (currentStatus === 'Deactivated') {
            return <span className="text-xs font-semibold bg-red-100 text-red-800 py-1 px-2 rounded-full">Deactivated</span>;
        }
        return <span className="text-xs font-semibold bg-green-100 text-green-800 py-1 px-2 rounded-full">Active</span>;
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading users...</div>;
    }

    return (
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
                        {users.map((user) => {
                            const currentStatus = user.status || 'Active';
                            return (
                                <tr key={user.id}>
                                    <td className="p-3 text-sm text-gray-700 font-mono">{user.uid || user.id}</td>
                                    <td className="p-3 text-sm text-gray-700">{user.name || 'N/A'}</td>
                                    <td className="p-3 text-sm text-gray-700">{user.email || 'N/A'}</td>
                                    <td className="p-3 text-sm text-gray-700">{user.userType || 'N/A'}</td>
                                    <td className="p-3">{renderStatusBadge(currentStatus)}</td>
                                    <td className="p-3">
                                        <button 
                                            onClick={() => handleToggleStatus(user)} 
                                            className={`font-semibold hover:underline ${currentStatus === 'Active' ? 'text-red-500' : 'text-green-500'}`}
                                        >
                                            {currentStatus === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;

