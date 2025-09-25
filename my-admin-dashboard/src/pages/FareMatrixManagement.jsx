import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const FareMatrixManagement = () => {
    const [fareMatrix, setFareMatrix] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newFare, setNewFare] = useState({ zoneName: '', regularFare: '', studentCollegeFare: '', studentHighSchoolFare: '', studentElemFare: '', kindergartenFare: '', pwdFare: '' });
    const [editingId, setEditingId] = useState(null);
    const [currentEdit, setCurrentEdit] = useState(null);

    const fareMatrixCollectionRef = collection(db, 'fareMatrix');

    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = onSnapshot(fareMatrixCollectionRef, (snapshot) => {
            const fares = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setFareMatrix(fares);
            setIsLoading(false);
        });
        return () => unsubscribe();
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
        setNewFare({ zoneName: '', regularFare: '', studentCollegeFare: '', studentHighSchoolFare: '', studentElemFare: '', kindergartenFare: '', pwdFare: '' });
        setIsAdding(false);
    };
    
    const handleUpdateFare = async (id) => {
        const fareDoc = doc(db, "fareMatrix", id);
        const updatedFare = { ...currentEdit };
        delete updatedFare.id; // Don't save the ID field back to the document
        await updateDoc(fareDoc, updatedFare);
        setEditingId(null);
        setCurrentEdit(null);
    };

    const handleDeleteFare = async (id) => {
        if (window.confirm("Are you sure you want to delete this fare rule?")) {
            const fareDoc = doc(db, "fareMatrix", id);
            await deleteDoc(fareDoc);
        }
    };

    const startEdit = (fare) => {
        setEditingId(fare.id);
        setCurrentEdit({ ...fare });
    };

    const renderFareCell = (fare, field) => (
        <td className="p-4 text-sm text-gray-600">
            ₱{fare[field]?.toFixed(2)}
        </td>
    );

    const renderInputCell = (field, placeholder) => (
        <td className="p-2">
            <input 
                type="number"
                value={currentEdit[field]}
                placeholder={placeholder}
                onChange={(e) => setCurrentEdit({...currentEdit, [field]: Number(e.target.value)})}
                className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500"
            />
        </td>
    );

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-xl text-gray-800">Fare Matrix Management</h3>
                <button 
                    onClick={() => setIsAdding(!isAdding)} 
                    className="bg-green-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                    {isAdding ? 'Cancel' : 'Add New Rate'}
                </button>
            </div>

            {isAdding && (
                <div className="p-4 border rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50">
                    <h4 className="font-bold text-lg col-span-full mb-2">Add New Fare Rule</h4>
                    <div className="col-span-full">
                        <input type="text" placeholder="Zone/Route Name" value={newFare.zoneName} onChange={(e) => setNewFare({...newFare, zoneName: e.target.value})} className="w-full p-3 border rounded-lg" />
                    </div>
                    {Object.entries({ regularFare: "Regular", studentCollegeFare: "College", studentHighSchoolFare: "High School", studentElemFare: "Elementary", kindergartenFare: "Kindergarten", pwdFare: "PWD/Senior" }).map(([key, placeholder]) => (
                         <input key={key} type="number" placeholder={`${placeholder} Fare`} value={newFare[key]} onChange={(e) => setNewFare({...newFare, [key]: e.target.value})} className="w-full p-3 border rounded-lg" />
                    ))}
                    <div className="flex gap-2 col-span-full">
                        <button onClick={handleAddFare} className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 font-semibold">Save</button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-gray-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-500">Reference Point</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">Regular</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">College</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">High School</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">Elementary</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">Kinder</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">PWD/Senior</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan="8" className="text-center p-10">Loading fare matrix...</td></tr>
                        ) : (
                            fareMatrix.map((fare) => (
                                <tr key={fare.id} className="hover:bg-gray-50">
                                    {editingId === fare.id ? (
                                        <>
                                            <td className="p-2">
                                                <input value={currentEdit.zoneName} onChange={(e) => setCurrentEdit({...currentEdit, zoneName: e.target.value})} className="w-full p-2 border rounded-lg bg-gray-50" />
                                            </td>
                                            {renderInputCell('regularFare', 'Regular')}
                                            {renderInputCell('studentCollegeFare', 'College')}
                                            {renderInputCell('studentHighSchoolFare', 'High School')}
                                            {renderInputCell('studentElemFare', 'Elementary')}
                                            {renderInputCell('kindergartenFare', 'Kinder')}
                                            {renderInputCell('pwdFare', 'PWD/Senior')}
                                            <td className="p-4 space-x-3">
                                                <button onClick={() => handleUpdateFare(fare.id)} className="text-green-600 font-semibold">Save</button>
                                                <button onClick={() => setEditingId(null)} className="text-gray-500 font-semibold">Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="p-4 text-sm text-gray-800 font-medium">{fare.zoneName}</td>
                                            {renderFareCell(fare, 'regularFare')}
                                            {renderFareCell(fare, 'studentCollegeFare')}
                                            {renderFareCell(fare, 'studentHighSchoolFare')}
                                            {renderFareCell(fare, 'studentElemFare')}
                                            {renderFareCell(fare, 'kindergartenFare')}
                                            {renderFareCell(fare, 'pwdFare')}
                                            <td className="p-4 space-x-4">
                                                <button onClick={() => startEdit(fare)} className="text-blue-600 font-semibold hover:text-blue-800">Edit</button>
                                                <button onClick={() => handleDeleteFare(fare.id)} className="text-red-600 font-semibold hover:text-red-800">Delete</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FareMatrixManagement;
