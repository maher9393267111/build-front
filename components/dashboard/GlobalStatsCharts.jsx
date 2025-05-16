'use client';
import { useState } from 'react';
import Card from '@components/ui/Card';
import LineChart from '@components/dashboard/LineChart';
import { getGlobalStats } from '@services/api';
import { useQuery } from 'react-query';
import { 
    Chart as ChartJS, 
    ArcElement, 
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip, 
    Legend 
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
    DocumentTextIcon, 
    ChatBubbleBottomCenterTextIcon as BlogIcon,
    CalendarIcon,
    CheckCircleIcon,
    PencilSquareIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const GlobalStatsCharts = ({ initialData }) => {
    const { data: stats, isLoading, error, isFetching } = useQuery(
        ['globalStats'],
        () => getGlobalStats(),
        {
            initialData: initialData && Object.keys(initialData).length > 0 ? initialData : undefined,
            refetchOnWindowFocus: false,
        }
    );

    if (isLoading && !stats) return <div className="text-center py-10">Loading global statistics...</div>;
    if (error) return <div className="text-red-500">Error loading global statistics: {error.message}</div>;

    // Prepare data for pages status chart
    const pagesStatusData = {
        labels: ['Published', 'Draft'],
        datasets: [
            {
                data: [stats?.pages?.published || 0, stats?.pages?.draft || 0],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',  // green for published
                    'rgba(249, 115, 22, 0.8)', // orange for draft
                ],
                borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(249, 115, 22)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Prepare data for blogs status chart
    const blogsStatusData = {
        labels: ['Published', 'Draft'],
        datasets: [
            {
                data: [stats?.blogs?.published || 0, stats?.blogs?.draft || 0],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',  // blue for published
                    'rgba(168, 85, 247, 0.8)',  // purple for draft
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(168, 85, 247)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Prepare data for monthly growth chart
    const monthlyGrowthData = {
        labels: stats?.monthlyGrowth?.map(m => m.label) || [],
        datasets: [
            {
                label: 'Pages Created',
                data: stats?.monthlyGrowth?.map(m => m.pages) || [],
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
            },
            {
                label: 'Blogs Created',
                data: stats?.monthlyGrowth?.map(m => m.blogs) || [],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
        cutout: '60%',
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Content Creation Trend (Last 6 Months)'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number Created'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            }
        }
    };

    const StatCard = ({ title, value, description, icon: Icon, iconColor, change, changeType }) => {
        const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600',
            red: 'from-red-500 to-red-600',
        };

        return (
            <Card className="overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
                            <p className="text-3xl font-bold text-gray-900">{value}</p>
                            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
                            {change !== undefined && (
                                <div className="flex items-center mt-2">
                                    <span className={`text-sm font-medium ${
                                        changeType === 'increase' ? 'text-green-600' : 
                                        changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                                    }`}>
                                        {changeType === 'increase' ? '+' : changeType === 'decrease' ? '-' : ''}{change}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">this month</span>
                                </div>
                            )}
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
            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Pages"
                    value={stats?.pages?.total || 0}
                    description={`${stats?.pages?.published || 0} published, ${stats?.pages?.draft || 0} drafts`}
                    icon={DocumentTextIcon}
                    iconColor="blue"
                    change={stats?.pages?.thisMonth || 0}
                    changeType="increase"
                />
                <StatCard
                    title="Total Blogs"
                    value={stats?.blogs?.total || 0}
                    description={`${stats?.blogs?.published || 0} published, ${stats?.blogs?.draft || 0} drafts`}
                    icon={BlogIcon}
                    iconColor="green"
                    change={stats?.blogs?.thisMonth || 0}
                    changeType="increase"
                />
                <StatCard
                    title="This Month"
                    value={(stats?.pages?.thisMonth || 0) + (stats?.blogs?.thisMonth || 0)}
                    description="Total content created"
                    icon={CalendarIcon}
                    iconColor="purple"
                />
                <StatCard
                    title="Published Rate"
                    value={`${
                        stats?.pages?.total + stats?.blogs?.total > 0
                            ? Math.round(((stats?.pages?.published + stats?.blogs?.published) / (stats?.pages?.total + stats?.blogs?.total)) * 100)
                            : 0
                    }%`}
                    description="Overall publish rate"
                    icon={CheckCircleIcon}
                    iconColor="orange"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pages Status Distribution */}
                <div>
                    <Card title="Pages Status Distribution">
                        <div className="p-4" style={{ height: '300px' }}>
                            {stats?.pages?.total > 0 ? (
                                <Doughnut data={pagesStatusData} options={chartOptions} />
                            ) : (
                                <p className="text-center py-10">No pages created yet.</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Blogs Status Distribution */}
                <div>
                    <Card title="Blogs Status Distribution">
                        <div className="p-4" style={{ height: '300px' }}>
                            {stats?.blogs?.total > 0 ? (
                                <Doughnut data={blogsStatusData} options={chartOptions} />
                            ) : (
                                <p className="text-center py-10">No blogs created yet.</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Content Overview */}
                <div>
                    <Card title="Content Overview">
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Content</span>
                                <span className="font-semibold text-2xl">
                                    {(stats?.pages?.total || 0) + (stats?.blogs?.total || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Published Content</span>
                                <span className="font-semibold text-green-600">
                                    {(stats?.pages?.published || 0) + (stats?.blogs?.published || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Draft Content</span>
                                <span className="font-semibold text-orange-600">
                                    {(stats?.pages?.draft || 0) + (stats?.blogs?.draft || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Pages vs Blogs Ratio</span>
                                <span className="font-semibold">
                                    {stats?.pages?.total || 0} : {stats?.blogs?.total || 0}
                                </span>
                            </div>
                            {/* <div className="flex justify-between items-center">
                                <span className="text-gray-600">Avg. per Month</span>
                                <span className="font-semibold">
                                    {stats?.avgContentPerMonth || 0}
                                </span>
                            </div> */}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Monthly Growth Chart */}
            <Card title="Content Creation Trend">
                <div className="p-4" style={{ height: '400px' }}>
                    {stats?.monthlyGrowth && stats.monthlyGrowth.length > 0 ? (
                        <Bar data={monthlyGrowthData} options={barChartOptions} />
                    ) : (
                        <p className="text-center py-10">No monthly growth data available.</p>
                    )}
                </div>
            </Card>

            {/* Recent Activity Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Recent Pages">
                    {stats?.recentPages && stats.recentPages.length > 0 ? (
                        <div className="p-6">
                            <div className="space-y-3">
                                {stats.recentPages.map((page, index) => (
                                    <div key={page.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{page.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(page.createdAt).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric',
                                                    year: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            page.status === 'published' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-orange-100 text-orange-800'
                                        }`}>
                                            {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-center py-6">No recent pages.</p>
                    )}
                </Card>

                <Card title="Recent Blogs">
                    {stats?.recentBlogs && stats.recentBlogs.length > 0 ? (
                        <div className="p-6">
                            <div className="space-y-3">
                                {stats.recentBlogs.map((blog, index) => (
                                    <div key={blog.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{blog.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric',
                                                    year: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            blog.status === 'published' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-orange-100 text-orange-800'
                                        }`}>
                                            {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-center py-6">No recent blogs.</p>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default GlobalStatsCharts;