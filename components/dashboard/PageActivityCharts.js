'use client'
import { useState } from 'react';
import LineChart from './LineChart';
import Card from '@components/ui/Card';
import http from '@services/api/http';
import { CheckCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import PaginationDynamic from '@components/elements/PaginationDynamic';
import { useQuery } from 'react-query';

const fetchPageActivityStats = async ({ queryKey }) => {
    const [_key, page, limit] = queryKey;
    const { data } = await http.get('/analytics/page-activity-stats', {
        params: {
            page: page,
            limit: limit
        }
    });
    return data;
};

const PageActivityCharts = ({ initialData }) => {
    const [recentActivitiesPage, setRecentActivitiesPage] = useState(1);
    const recentActivitiesLimit = 3;

    const { 
        data: stats, 
        isLoading, 
        error, 
        isFetching 
    } = useQuery(
        ['pageActivityStats', recentActivitiesPage, recentActivitiesLimit],
        fetchPageActivityStats,
        {
            initialData: initialData && Object.keys(initialData).length > 0 ? initialData : undefined,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        }
    );

    const handleRecentActivitiesPageChange = (page) => {
        setRecentActivitiesPage(page);
    };

    const activityChartData = {
        labels: stats?.dailyTrend?.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
        datasets: [
            {
                label: 'Created',
                data: stats?.dailyTrend.map(item => item.created) || [],
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
                tension: 0.3
            },
            {
                label: 'Updated',
                data: stats?.dailyTrend.map(item => item.updated) || [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.3
            },
            {
                label: 'Deleted',
                data: stats?.dailyTrend.map(item => item.deleted) || [],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                tension: 0.3
            }
        ]
    };

    const activityChartOptions = {
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Page Activity (Last 30 Days)'
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Activities'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date (Last 30 Days)'
                },
                ticks: {
                    maxTicksLimit: 15
                }
            }
        }
    };

    const StatCard = ({ title, value, icon: Icon, iconColor }) => {
        const colorClasses = {
            green: 'from-green-500 to-green-600',
            blue: 'from-blue-500 to-blue-600',
            red: 'from-red-500 to-red-600',
        };

        return (
            <Card className="overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
                            <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">Total activities</p>
                        </div>
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${colorClasses[iconColor]} flex items-center justify-center`}>
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {/* Activity Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Pages Created"
                    value={stats?.activityStats.created || 0}
                    icon={CheckCircleIcon}
                    iconColor="green"
                />
                <StatCard 
                    title="Pages Updated"
                    value={stats?.activityStats.updated || 0}
                    icon={PencilSquareIcon}
                    iconColor="blue"
                />
                <StatCard 
                    title="Pages Deleted"
                    value={stats?.activityStats.deleted || 0}
                    icon={TrashIcon}
                    iconColor="red"
                />
            </div>

            {/* Activity Line Chart */}
            <LineChart 
                chartData={activityChartData} 
                chartOptions={activityChartOptions}
                title="Page Activity Trends"
                isLoading={isLoading && !stats}
            />

            {/* Recent Activities Table */}
            <Card title="Recent Page Activities">
                {isFetching && !stats?.recentActivities?.data?.length ? (
                    <p className="text-center py-4">Loading recent activities...</p>
                ) : error ? (
                    <p className="text-center text-red-500 py-4">{error.message || 'Failed to load recent activities'}</p>
                ) : stats?.recentActivities?.data?.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th> */}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats.recentActivities.data.map((activity, index) => (
                                        <tr key={activity.id || index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.pageName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    activity.action === 'created' ? 'bg-green-100 text-green-800' :
                                                    activity.action === 'updated' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                                                </span>
                                            </td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {activity.user?.name || 'Anonymous'}
                                            </td> */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(activity.timestamp).toLocaleDateString('en-CA')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {stats.recentActivities.totalPages > 1 && (
                            <div className="flex justify-center mt-6">
                                <PaginationDynamic
                                    currentPage={stats.recentActivities.currentPage}
                                    totalPages={stats.recentActivities.totalPages}
                                    onPageChange={handleRecentActivitiesPageChange}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center py-4">No recent activities found.</p>
                )}
            </Card>
        </div>
    );
};

export default PageActivityCharts; 