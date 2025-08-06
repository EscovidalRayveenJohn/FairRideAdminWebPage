import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import StatCard from '../components/StatCard';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

Chart.register(...registerables);

const Dashboard = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null); // To hold the chart instance

    // State for real-time stats
    const [userCount, setUserCount] = useState(0);
    const [reportStats, setReportStats] = useState({ total: 0, resolved: 0, pending: 0 });
    const [weeklyReportData, setWeeklyReportData] = useState(new Array(7).fill(0));

    // Listen for real-time updates to the 'users' collection
    useEffect(() => {
        const usersCollectionRef = collection(db, 'users');
        const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
            setUserCount(snapshot.size); // .size gives the total number of documents
        });
        return () => unsubscribe(); // Cleanup listener on component unmount
    }, []);

    // Listen for real-time updates to the 'reports' collection
    useEffect(() => {
        const reportsCollectionRef = collection(db, 'reports');
        const unsubscribe = onSnapshot(reportsCollectionRef, (snapshot) => {
            let resolvedCount = 0;
            let pendingCount = 0;
            const weekData = new Array(7).fill(0); // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
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

                // Chart data calculation
                const reportDate = report.timestamp?.toDate();
                if (reportDate && reportDate >= oneWeekAgo) {
                    const dayOfWeek = reportDate.getDay(); // Sunday = 0, Monday = 1, etc.
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

    // Effect to create and update the chart
    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy(); // Destroy old chart before creating new one
            }
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    datasets: [{
                        label: '# of Reports',
                        data: weeklyReportData, // Use real-time data
                        backgroundColor: 'rgba(22, 163, 74, 0.7)',
                        borderColor: 'rgba(22, 163, 74, 1)',
                        borderWidth: 1,
                        borderRadius: 5,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                    plugins: { legend: { display: false } }
                }
            });
        }
    }, [weeklyReportData]); // Re-run this effect when weeklyReportData changes

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={userCount} color="blue" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <StatCard title="Total Reports" value={reportStats.total} color="green" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
                <StatCard title="Resolved" value={reportStats.resolved} color="purple" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Pending Reports" value={reportStats.pending} color="red" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} />
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-800">Reports Overview (Last 7 Days)</h3>
                <div className="h-96"><canvas ref={chartRef}></canvas></div>
            </div>
        </div>
    );
};

export default Dashboard;
