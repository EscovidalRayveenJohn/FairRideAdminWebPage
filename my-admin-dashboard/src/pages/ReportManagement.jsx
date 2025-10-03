import React, { useState, useEffect } from 'react';
import { db } from '/src/firebaseConfig.js';
import { collection, onSnapshot, doc, getDocs, updateDoc, query, where, orderBy } from 'firebase/firestore';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
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
            const q = query(usersRef, where("name", "==", userName));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
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
            setSelectedReport(null);
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

    const renderEvidence = (photo) => {
        if (photo && photo.startsWith('data:image')) {
            return (
                 <img src={photo} alt="Evidence" className="mt-2 rounded-lg max-w-full h-auto shadow-md" />
            );
        }
        if (photo && (photo.startsWith('http') || photo.startsWith('https'))) {
            return (
                <a href={photo} target="_blank" rel="noopener noreferrer">
                    <img src={photo} alt="Evidence" className="mt-2 rounded-lg max-w-full h-auto shadow-md" />
                </a>
            );
        }
        return <p className="text-gray-600">{photo || 'None'}</p>;
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading reports...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-semibold text-xl text-gray-800 mb-4">Report Management</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-gray-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-500">Case ID</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">Report</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">Date</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-700 font-mono">{report.id.substring(0, 6)}...</td>
                                <td className="p-4 text-sm text-gray-700">{report.type}</td>
                                <td className="p-4 text-sm text-gray-700">{report.timestamp?.toDate().toLocaleString()}</td>
                                <td className="p-4">{renderStatusBadge(report.status)}</td>
                                <td className="p-4">
                                    <button onClick={() => handleViewDetails(report)} className="text-blue-600 hover:underline font-semibold">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-20 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b">
                            <h4 className="font-bold text-lg text-gray-800">Report Details</h4>
                            <button onClick={() => setSelectedReport(null)} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
                        </div>
                        <div className="space-y-4">
                            <div><strong>Case ID:</strong> <span className="font-mono text-gray-700">{selectedReport.id}</span></div>
                            <div><strong>Complainant:</strong> <span className="text-gray-700">{selectedReport.userName || 'Anonymous'}</span></div>
                            <div><strong>Complainant Email:</strong> <span className="text-gray-700">{complainantEmail}</span></div>
                            <div><strong>Date:</strong> <span className="text-gray-700">{selectedReport.timestamp?.toDate().toLocaleString()}</span></div>
                            <div><strong>Status:</strong> {renderStatusBadge(selectedReport.status)}</div>
                            <div><strong>Report:</strong> <span className="text-gray-700">{selectedReport.type}</span></div>
                            <div><strong>MTOP:</strong> <span className="text-gray-700">{selectedReport.mtopNumber || 'N/A'}</span></div>
                            <div>
                                <p><strong>Description:</strong></p>
                                <p className="p-2 bg-gray-100 rounded mt-1 text-gray-700">{selectedReport.description}</p>
                            </div>
                             <div>
                               <p><strong>Evidence:</strong></p>
                                {renderEvidence(selectedReport.photo)}
                            </div>
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

                            {/* Trip History Section */}
                            {selectedReport.trip && (
                                <div className="border-t pt-4 mt-4">
                                    <h5 className="font-bold text-md mb-2 text-gray-800">Associated Trip Details</h5>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Destination:</strong> {selectedReport.trip.destinationInput || 'N/A'}</p>
                                        <p><strong>Distance:</strong> {selectedReport.trip.distance} km</p>
                                        <p><strong>Final Fare:</strong> ₱{selectedReport.trip.finalFare}</p>
                                        <p><strong>Trip Time:</strong> {new Date(selectedReport.trip.timestamp).toLocaleString()}</p>
                                        {selectedReport.trip.start && selectedReport.trip.end &&
                                            <p><strong>Route:</strong> 
                                                <a href={`https://www.google.com/maps/dir/?api=1&origin=${selectedReport.trip.start.latitude},${selectedReport.trip.start.longitude}&destination=${selectedReport.trip.end.latitude},${selectedReport.trip.end.longitude}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-2">
                                                    View Full Route on Map
                                                </a>
                                            </p>
                                        }
                                    </div>
                                </div>
                            )}

                            <div className="border-t pt-4 flex justify-end space-x-2 mt-6">
                                <button onClick={() => handleStatusChange('Pending')} className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 font-semibold transition-colors">Mark as Pending</button>
                                <button onClick={() => handleStatusChange('Resolved')} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 font-semibold transition-colors">Mark as Resolved</button>
                                <button onClick={() => setSelectedReport(null)} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 font-semibold transition-colors">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportManagement;

