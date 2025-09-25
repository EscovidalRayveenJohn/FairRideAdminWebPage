import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import StatCard from '../components/StatCard.jsx';
import { db } from '../firebaseConfig.js';
import { collection, onSnapshot } from 'firebase/firestore';

Chart.register(...registerables);

const Dashboard = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null); 

    const [userCount, setUserCount] = useState(0);
    const [reportStats, setReportStats] = useState({ total: 0, resolved: 0, pending: 0 });
    const [weeklyReportData, setWeeklyReportData] = useState(new Array(7).fill(0));

    useEffect(() => {
        const usersCollectionRef = collection(db, 'users');
        const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
            setUserCount(snapshot.size);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const reportsCollectionRef = collection(db, 'reports');
        const unsubscribe = onSnapshot(reportsCollectionRef, (snapshot) => {
            let resolvedCount = 0;
            let pendingCount = 0;
            const weekData = new Array(7).fill(0);
            const today = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);

            snapshot.docs.forEach(doc => {
                const report = doc.data();
                if (report.status === 'Resolved') {
                    resolvedCount++;
                } else {
                    pendingCount++;
                }

                const reportDate = report.timestamp?.toDate();
                if (reportDate && reportDate >= oneWeekAgo) {
                    const dayOfWeek = reportDate.getDay();
                    weekData[dayOfWeek]++;
                }
            });

            setReportStats({
                total: snapshot.size,
                resolved: resolvedCount,
                pending: pendingCount
            });
            setWeeklyReportData(weekData);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    datasets: [{
                        label: 'Reports',
                        data: weeklyReportData,
                        backgroundColor: 'rgba(22, 163, 74, 0.2)',
                        borderColor: 'rgba(22, 163, 74, 1)',
                        borderWidth: 2,
                        borderRadius: 8,
                        hoverBackgroundColor: 'rgba(22, 163, 74, 0.4)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { 
                        y: { 
                            beginAtZero: true, 
                            ticks: { 
                                stepSize: 1,
                                color: '#6b7280'
                            },
                            grid: {
                                color: '#e5e7eb'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#6b7280'
                            },
                             grid: {
                                display: false
                            }
                        }
                    },
                    plugins: { 
                        legend: { 
                            display: true,
                            position: 'top',
                            labels: {
                                color: '#374151'
                            }
                        },
                        tooltip: {
                            backgroundColor: '#1f2937',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            boxPadding: 8,
                            cornerRadius: 8
                        }
                    }
                }
            });
        }
    }, [weeklyReportData]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={userCount} color="blue" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="Total Reports" value={reportStats.total} color="green" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
                <StatCard title="Resolved" value={reportStats.resolved} color="purple" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Pending Reports" value={reportStats.pending} color="red" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-4">Reports Overview (Last 7 Days)</h3>
                <div className="relative h-96"><canvas ref={chartRef}></canvas></div>
            </div>
        </div>
    );
};

export default Dashboard;
