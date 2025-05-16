'use client';
import { useState } from 'react';
import Card from '@components/ui/Card';
import LineChart from '@components/dashboard/LineChart';
import TopPagesBarChart from '@components/dashboard/TopPagesBarChart';
import { Tab } from '@headlessui/react';
import { useQuery } from 'react-query';
import { getAnalyticsDashboardStats } from '@services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Using different Heroicons that definitely exist
import { 
    ChevronUpIcon as ArrowUpIcon, 
    ChevronDownIcon as ArrowDownIcon,
    EyeIcon,
    ClockIcon,
    UsersIcon as UserGroupIcon,
    ArrowTrendingUpIcon as TrendingUpIcon
} from '@heroicons/react/24/outline';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function ViewsAnalytics({ initialData }) {
    const [selectedPeriod, setSelectedPeriod] = useState('weekly');
    
    const periods = [
        { key: 'weekly', label: 'Weekly', description: 'Last 12 weeks' },
        { key: 'monthly', label: 'Monthly', description: 'Last 12 months' },
        { key: 'yearly', label: 'Yearly', description: 'Last 5 years' },
    ];

    const { data: stats, isLoading, error } = useQuery(
        ['analyticsStats', selectedPeriod], 
        () => getAnalyticsDashboardStats({ period: selectedPeriod }),
        {
            initialData: selectedPeriod === 'weekly' && initialData && Object.keys(initialData).length > 0 ? initialData : undefined,
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        }
    );

    // Data for the main trend line chart
    const trendChartData = {
        labels: stats?.periodTrend?.map(d => d.label) || [],
        datasets: [
            {
                label: `Views per ${selectedPeriod.slice(0, -2)}`,
                data: stats?.periodTrend?.map(d => d.count) || [],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const trendChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                title: {
                    display: true,
                    text: 'Number of Views',
                    color: '#6b7280',
                }
            },
            x: {
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: `Time Period (${selectedPeriod})`,
                    color: '#6b7280',
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        elements: {
            point: {
                backgroundColor: '#3b82f6',
                borderColor: '#ffffff',
                borderWidth: 2,
            },
            line: {
                tension: 0.4
            }
        }
    };

    // Hourly distribution chart (only for weekly/daily view)
    const hourlyChartData = {
        labels: Array.from({ length: 24 }, (_, i) => 
            i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`
        ),
        datasets: [
            {
                label: 'Views by Hour',
                data: stats?.hourlyDistribution?.map(h => h.views) || [],
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const hourlyChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                title: {
                    display: true,
                    text: 'Views',
                    color: '#6b7280',
                }
            },
            x: {
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Hour of Day',
                    color: '#6b7280',
                }
            }
        }
    };

    // Stats widgets data
    const statsWidgets = [
        {
            title: 'Total Views',
            value: stats?.totalViews || 0,
            icon: EyeIcon,
            color: 'blue',
            description: 'All time'
        },
        {
            title: 'Today\'s Views',
            value: stats?.todayViews || 0,
            icon: ClockIcon,
            color: 'green',
            description: 'Last 24 hours'
        },
        {
            title: `${stats?.periodLabel || 'Weekly'} Views`,
            value: stats?.currentPeriodViews || 0,
            icon: TrendingUpIcon,
            color: 'purple',
            description: `Current ${selectedPeriod.slice(0, -2)}`,
            growth: stats?.growthPercentage || 0,
            previousValue: stats?.previousPeriodViews || 0
        },
        {
            title: 'Avg Views',
            value: stats?.avgViewsPerPeriod || 0,
            icon: UserGroupIcon,
            color: 'orange',
            description: `Per ${selectedPeriod.slice(0, -2)}`
        }
    ];

    // Period tabs
    const PeriodTabs = () => (
        <Tab.Group selectedIndex={periods.findIndex(p => p.key === selectedPeriod)} onChange={(index) => setSelectedPeriod(periods[index].key)}>
            <div className="relative overflow-hidden">
                <Tab.List className="flex overflow-x-auto scrollbar-hide p-1 space-x-1 bg-gray-100 rounded-lg mb-6 no-scrollbar">
                    {periods.map((period) => (
                        <Tab
                            key={period.key}
                            className={({ selected }) =>
                                `flex-shrink-0 min-w-[70px] md:min-w-0 whitespace-nowrap py-2.5 px-3 text-sm leading-5 font-medium rounded-lg flex items-center justify-center transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-primary-500 ${
                                    selected 
                                        ? 'bg-white text-primary-600 shadow' 
                                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                }`
                            }
                             aria-label={period.label}
                        >
                             <div className="flex flex-col items-center">
                                <span className="font-semibold">{period.label}</span>
                                <span className="text-xs opacity-75">{period.description}</span>
                            </div>
                        </Tab>
                    ))}
                </Tab.List>
                <div className="absolute -bottom-1 left-0 w-full h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>
        </Tab.Group>
    );

    // Stats widget component
    const StatsWidget = ({ title, value, icon: Icon, color, description, growth, previousValue }) => {
        const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600',
        };

        return (
            <Card className="overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
                            <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">{description}</p>
                            {/* {growth !== undefined && (
                                <div className="flex items-center mt-2">
                                    {growth >= 0 ? (
                                        <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                                    ) : (
                                        <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                                    )}
                                    <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {Math.abs(growth)}%
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">
                                        vs {previousValue.toLocaleString()} previous
                                    </span>
                                </div>
                            )} */}
                        </div>
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center`}>
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    // Top pages list component
    const TopPagesList = ({ data, isLoading }) => {
        if (isLoading) return <div className="animate-pulse">Loading top pages...</div>;
        if (!data || data.length === 0) return <p>No page view data available.</p>;

        return (
            <Card title="Most Visited Pages" className="h-full">
                <div className="p-6">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {data.map((page, index) => (
                            <div key={index} className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs" title={page.path}>
                                            {page.path.length > 30 ? `${page.path.substring(0, 27)}...` : page.path}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900">{page.views.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">views</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        );
    };

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 mb-4">Error loading analytics</p>
                <p className="text-gray-600">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Period Selection */}
            <PeriodTabs />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsWidgets.map((widget, index) => (
                    <StatsWidget key={index} {...widget} />
                ))}
            </div>

            {/* Main Trend Chart */}
            <Card title={`Page Views Trend - ${stats?.periodLabel || 'Weekly'}`} className="col-span-full">
                <div className="p-6" style={{ height: '400px' }}>
                    <LineChart 
                        chartData={trendChartData} 
                        chartOptions={trendChartOptions}
                        isLoading={isLoading}
                    />
                </div>
            </Card>

            {/* Secondary Charts and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Pages List */}
                <div>
                    <TopPagesList data={stats?.topPages} isLoading={isLoading} />
                </div>

                {/* Top Pages Bar Chart */}
                <div>
                    <TopPagesBarChart 
                        data={stats?.topPages} 
                        isLoading={isLoading} 
                        title="Top Pages (Chart)"
                    />
                </div>

                {/* Hourly Distribution (only show for recent periods) */}
                {selectedPeriod === 'weekly' && (
                    <div>
                        <Card title="Today's Hourly Distribution" className="h-full">
                            <div className="p-6" style={{ height: '300px' }}>
                                <Bar data={hourlyChartData} options={hourlyChartOptions} />
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Quick Stats" className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Unique Visitors</span>
                            <span className="font-semibold">{stats?.uniqueVisitorsApprox?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Top Page Views</span>
                            <span className="font-semibold">{stats?.topPages?.[0]?.views || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Avg Views per Page</span>
                            <span className="font-semibold">
                                {stats?.topPages?.length > 0 
                                    ? Math.round(stats.currentPeriodViews / stats.topPages.length) 
                                    : 0}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default ViewsAnalytics;