import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig.js';
import { collection, onSnapshot, doc, getDocs, updateDoc, query, where, orderBy } from 'firebase/firestore';

const ReportManagement = () => {
    const [reports, setReports]       = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [complainantEmail, setComplainantEmail] = useState('');

    useEffect(() => {
        const reportsCollectionRef = collection(db, 'reports');
        const q = query(reportsCollectionRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reportsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReports(reportsData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const fetchComplainantEmail = async (userName) => {
        if (!userName || userName === 'Anonymous') {
            setComplainantEmail('N/A');
            return;
        }
        setComplainantEmail('Loading...');
        try {
            const usersRef = collection(db, "users");
            // Query to find a user whose 'name' field matches the 'userName' from the report
            const q = query(usersRef, where("name", "==", userName));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                // Assuming usernames are unique, take the first result
                const userDoc = querySnapshot.docs[0].data();
                setComplainantEmail(userDoc.email || 'Not found');
            } else {
                setComplainantEmail('User not found');
            }
        } catch (error) {
            console.error("Error fetching complainant email:", error);
            setComplainantEmail('Error fetching email');
        }
    };

    const handleViewDetails = (report) => {
        setSelectedReport(report);
        fetchComplainantEmail(report.userName);
    };

    const handleStatusChange = async (newStatus) => {
        if (!selectedReport) return;
        const reportDocRef = doc(db, 'reports', selectedReport.id);
        try {
            await updateDoc(reportDocRef, { status: newStatus });
            setSelectedReport(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };
    
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'Resolved':
                return <span className="text-xs font-semibold bg-green-100 text-green-800 py-1 px-2 rounded-full">{status}</span>;
            case 'Pending':
            default:
                return <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full">{status || 'Pending'}</span>;
        }
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading reports...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-xl text-gray-800 mb-4">Report Management</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-sm font-semibold text-gray-600">Case ID</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">Report</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">Date</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {reports.map((report) => (
                            <tr key={report.id}>
                                <td className="p-3 text-sm text-gray-700 font-mono">{report.id.substring(0, 6)}...</td>
                                <td className="p-3 text-sm text-gray-700">{report.type}</td>
                                <td className="p-3 text-sm text-gray-700">{report.timestamp?.toDate().toLocaleString()}</td>
                                <td className="p-3">{renderStatusBadge(report.status)}</td>
                                <td className="p-3">
                                    <button onClick={() => handleViewDetails(report)} className="text-blue-500 hover:underline">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-lg">Report Details</h4>
                            <button onClick={() => setSelectedReport(null)} className="text-gray-500 hover:text-gray-800">&times;</button>
                        </div>
                        <div className="space-y-4">
                            <p><strong>Case ID:</strong> {selectedReport.id}</p>
                            <p><strong>Complainant:</strong> {selectedReport.userName || 'Anonymous'}</p>
                            <p><strong>Complainant Email:</strong> {complainantEmail}</p>
                            <p><strong>Date:</strong> {selectedReport.timestamp?.toDate().toLocaleString()}</p>
                            <p><strong>Status:</strong> {renderStatusBadge(selectedReport.status)}</p>
                            <p><strong>Report:</strong> {selectedReport.type}</p>
                            <p><strong>MTOP:</strong> {selectedReport.mtopNumber || 'N/A'}</p>
                            <p><strong>Description:</strong></p>
                            <p className="p-2 bg-gray-100 rounded">{selectedReport.description}</p>
                            <p><strong>Evidence:</strong> {selectedReport.evidence || 'None'}</p>
                            {selectedReport.location && (
                                <div>
                                    <strong>Location:</strong>
                                    <a 
                                        href={`https://www.google.com/maps?q=${selectedReport.location.latitude},${selectedReport.location.longitude}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-500 hover:underline ml-2"
                                    >
                                        View on Google Maps
                                    </a>
                                </div>
                            )}

                            <div className="border-t pt-4 flex justify-end space-x-2">
                                <button onClick={() => handleStatusChange('Pending')} className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">Mark as Pending</button>
                                <button onClick={() => handleStatusChange('Resolved')} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Mark as Resolved</button>
                                <button onClick={() => setSelectedReport(null)} className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportManagement;
