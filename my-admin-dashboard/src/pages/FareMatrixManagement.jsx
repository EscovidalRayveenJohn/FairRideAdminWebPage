import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const FareMatrixManagement = () => {
    const [fareMatrix, setFareMatrix] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newFare, setNewFare] = useState({ zoneName: '', regularFare: 0, studentCollegeFare: 0, studentHighSchoolFare: 0, studentElemFare: 0, kindergartenFare: 0, pwdFare: 0 });
    const [editingId, setEditingId] = useState(null);
    const [currentEdit, setCurrentEdit] = useState(null);

    const fareMatrixCollectionRef = collection(db, 'fareMatrix');

    const getFareMatrix = async () => {
        setIsLoading(true);
        const data = await getDocs(fareMatrixCollectionRef);
        setFareMatrix(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setIsLoading(false);
    };

    useEffect(() => {
        getFareMatrix();
    }, []);

    const handleAddFare = async () => {
        await addDoc(fareMatrixCollectionRef, {
            zoneName: newFare.zoneName,
            regularFare: Number(newFare.regularFare),
            studentCollegeFare: Number(newFare.studentCollegeFare),
            studentHighSchoolFare: Number(newFare.studentHighSchoolFare),
            studentElemFare: Number(newFare.studentElemFare),
            kindergartenFare: Number(newFare.kindergartenFare),
            pwdFare: Number(newFare.pwdFare)
        });
        setNewFare({ zoneName: '', regularFare: 0, studentCollegeFare: 0, studentHighSchoolFare: 0, studentElemFare: 0, kindergartenFare: 0, pwdFare: 0 });
        setIsAdding(false);
        getFareMatrix();
    };
    
    const handleUpdateFare = async (id) => {
        const fareDoc = doc(db, "fareMatrix", id);
        await updateDoc(fareDoc, {
            zoneName: currentEdit.zoneName,
            regularFare: Number(currentEdit.regularFare),
            studentCollegeFare: Number(currentEdit.studentCollegeFare),
            studentHighSchoolFare: Number(currentEdit.studentHighSchoolFare),
            studentElemFare: Number(currentEdit.studentElemFare),
            kindergartenFare: Number(currentEdit.kindergartenFare),
            pwdFare: Number(currentEdit.pwdFare)
        });
        setEditingId(null);
        setCurrentEdit(null);
        getFareMatrix();
    };

    const handleDeleteFare = async (id) => {
        if (window.confirm("Are you sure you want to delete this fare rule?")) {
            const fareDoc = doc(db, "fareMatrix", id);
            await deleteDoc(fareDoc);
            getFareMatrix();
        }
    };

    const startEdit = (fare) => {
        setEditingId(fare.id);
        setCurrentEdit({ ...fare });
    };

    if (isLoading) return <div className="text-center p-10">Loading Fare Matrix...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-xl text-gray-800">Fare Matrix Management</h3>
                {!isAdding && <button onClick={() => setIsAdding(true)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Add New Rate</button>}
            </div>

            {isAdding && (
                <div className="p-4 border rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50">
                    <h4 className="font-bold col-span-full">Add New Fare Rule</h4>
                    <input type="text" placeholder="Zone/Route Name" value={newFare.zoneName} onChange={(e) => setNewFare({...newFare, zoneName: e.target.value})} className="w-full p-2 border rounded col-span-full" />
                    <input type="number" placeholder="Regular Fare" value={newFare.regularFare} onChange={(e) => setNewFare({...newFare, regularFare: e.target.value})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="College Student Fare" value={newFare.studentCollegeFare} onChange={(e) => setNewFare({...newFare, studentCollegeFare: e.target.value})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="High School Student Fare" value={newFare.studentHighSchoolFare} onChange={(e) => setNewFare({...newFare, studentHighSchoolFare: e.target.value})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Elementary Student Fare" value={newFare.studentElemFare} onChange={(e) => setNewFare({...newFare, studentElemFare: e.target.value})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Kindergarten Fare" value={newFare.kindergartenFare} onChange={(e) => setNewFare({...newFare, kindergartenFare: e.target.value})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="PWD/Senior Fare" value={newFare.pwdFare} onChange={(e) => setNewFare({...newFare, pwdFare: e.target.value})} className="w-full p-2 border rounded" />
                    <div className="flex gap-2 col-span-full">
                        <button onClick={handleAddFare} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Save</button>
                        <button onClick={() => setIsAdding(false)} className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400">Cancel</button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-sm font-semibold text-gray-600">Reference Point</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">Regular</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">College</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">High School</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">Elementary</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">Kinder</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">PWD/Senior</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {fareMatrix.map((fare) => (
                            <tr key={fare.id}>
                                {editingId === fare.id ? (
                                    <>
                                        <td className="p-2" colSpan="8">
                                            {/* Simplified Edit Form for brevity */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <input value={currentEdit.zoneName} onChange={(e) => setCurrentEdit({...currentEdit, zoneName: e.target.value})} className="w-full p-1 border rounded col-span-2" />
                                                <input type="number" value={currentEdit.regularFare} onChange={(e) => setCurrentEdit({...currentEdit, regularFare: e.target.value})} className="w-full p-1 border rounded" />
                                                <input type="number" value={currentEdit.studentCollegeFare} onChange={(e) => setCurrentEdit({...currentEdit, studentCollegeFare: e.target.value})} className="w-full p-1 border rounded" />
                                                <input type="number" value={currentEdit.studentHighSchoolFare} onChange={(e) => setCurrentEdit({...currentEdit, studentHighSchoolFare: e.target.value})} className="w-full p-1 border rounded" />
                                                <input type="number" value={currentEdit.studentElemFare} onChange={(e) => setCurrentEdit({...currentEdit, studentElemFare: e.target.value})} className="w-full p-1 border rounded" />
                                                <input type="number" value={currentEdit.kindergartenFare} onChange={(e) => setCurrentEdit({...currentEdit, kindergartenFare: e.target.value})} className="w-full p-1 border rounded" />
                                                <input type="number" value={currentEdit.pwdFare} onChange={(e) => setCurrentEdit({...currentEdit, pwdFare: e.target.value})} className="w-full p-1 border rounded" />
                                                <div className="col-span-2 space-x-2">
                                                    <button onClick={() => handleUpdateFare(fare.id)} className="text-green-500 hover:underline">Save</button>
                                                    <button onClick={() => setEditingId(null)} className="text-gray-500 hover:underline">Cancel</button>
                                                </div>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-3 text-sm text-gray-700">{fare.zoneName}</td>
                                        <td className="p-3 text-sm text-gray-700">₱{fare.regularFare?.toFixed(2)}</td>
                                        <td className="p-3 text-sm text-gray-700">₱{fare.studentCollegeFare?.toFixed(2)}</td>
                                        <td className="p-3 text-sm text-gray-700">₱{fare.studentHighSchoolFare?.toFixed(2)}</td>
                                        <td className="p-3 text-sm text-gray-700">₱{fare.studentElemFare?.toFixed(2)}</td>
                                        <td className="p-3 text-sm text-gray-700">₱{fare.kindergartenFare?.toFixed(2)}</td>
                                        <td className="p-3 text-sm text-gray-700">₱{fare.pwdFare?.toFixed(2)}</td>
                                        <td className="p-3 space-x-2">
                                            <button onClick={() => startEdit(fare)} className="text-blue-500 hover:underline">Edit</button>
                                            <button onClick={() => handleDeleteFare(fare.id)} className="text-red-500 hover:underline">Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FareMatrixManagement;
