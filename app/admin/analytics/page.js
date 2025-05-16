'use client'
import { useState } from 'react';
import Card from '@components/ui/Card';
import LineChart from '@components/dashboard/LineChart';
import PageActivityCharts from '@components/dashboard/PageActivityCharts';
import TopPagesBarChart from '@components/dashboard/TopPagesBarChart';
import FormSubmissionCharts from '@components/dashboard/FormSubmissionCharts';
import { Tab } from '@headlessui/react';
// import WidgetStats from '@components/dashboard/WidgetStats';
import { getAnalyticsDashboardStats } from '@services/api';
import { useQuery } from 'react-query';

function Analytics() {
    const [selectedTab, setSelectedTab] = useState(0);
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Analytics Dashboard</h2>
            
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/10 p-1 mb-6">
                    <Tab className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                        ${selected 
                            ? 'bg-white text-blue-700 shadow'
                            : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                        }`
                    }>
                        Page Views
                    </Tab>
                    <Tab className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                        ${selected 
                            ? 'bg-white text-blue-700 shadow'
                            : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                        }`
                    }>
                        Page Activity
                    </Tab>
                    <Tab className={({ selected }) =>
                        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
                        ${selected 
                            ? 'bg-white text-blue-700 shadow'
                            : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                        }`
                    }>
                        Form Submissions
                    </Tab>
                </Tab.List>
                
                <Tab.Panels>
                    <Tab.Panel>
                        {/* Page Views Analytics */}
                        <ViewsAnalytics />
                    </Tab.Panel>
                    
                    <Tab.Panel>
                        {/* Page Activity Analytics */}
                        <PageActivityCharts />
                    </Tab.Panel>
                    
                    <Tab.Panel>
                        {/* Form Submission Analytics */}
                        <FormSubmissionCharts />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}

// A simple component to display top pages as a list
const TopPagesCard = ({ data, isLoading }) => {
    if (isLoading) return <p>Loading top pages list...</p>;
    if (!data || data.length === 0) return <p>No page view data yet for list.</p>;

    return (
        <Card title="Most Visited Pages (List)">
            <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {data.map((page, index) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 truncate" title={page.path}>
                            {page.path.length > 30 ? `${page.path.substring(0, 27)}...` : page.path}
                        </span>
                        <span className="text-sm text-gray-500">{page.views} views</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

// Separate component for Views Analytics
function ViewsAnalytics() {
    const { data: stats, isLoading, error } = useQuery(
        'analyticsStats', 
        getAnalyticsDashboardStats
    );
    
    const widgetData = isLoading ? [] : [
        { title: "Total Site Views", value: stats?.totalViews ?? 0, icon: "Eye" },
        { title: "Views Today", value: stats?.todayViews ?? 0, icon: "Calendar" },
    ];

    // Data for the Page Views Trend Line Chart
    const lineChartDataForTrend = {
        labels: stats?.dailyTrend?.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
        datasets: [
            {
                label: 'Page Views',
                data: stats?.dailyTrend?.map(d => d.count) || [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                fill: true,
            },
        ],
    };

    // Options for the Page Views Trend Line Chart
    const trendChartOptions = {
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Views'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date (Last 7 Days)'
                }
            }
        }
    };
    
    return (
        <div className="space-y-6">
            {error && <p className="text-red-500">{error instanceof Error ? error.message : 'Failed to load analytics statistics'}</p>}
            
            {/* Stats Widgets */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
                {isLoading && [1,2].map(i => <Card key={i}><p>Loading stats...</p></Card>)}
                {!isLoading && widgetData.map((widget, index) => (
                    <WidgetStats 
                        key={index} 
                        title={widget.title} 
                        value={widget.value}
                        icon={widget.icon}
                    />
                ))}
            </div>
             */}
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-1 xxl:grid-cols-6 gap-5">
                <div className='lg:col-span-4'>
                    <LineChart 
                        chartData={lineChartDataForTrend} 
                        chartOptions={trendChartOptions}
                        title="Page Views Trend (Last 7 Days)"
                        isLoading={isLoading}
                    />
                </div>
                <div className='lg:col-span-2 space-y-5'>
                    <TopPagesCard data={stats?.topPages} isLoading={isLoading} />
                    <TopPagesBarChart data={stats?.topPages} isLoading={isLoading} title="Most Visited Pages (Chart)" />
                </div>
            </div>
        </div>
    );
}

export default Analytics; 