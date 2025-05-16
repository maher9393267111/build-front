'use client'
import PageActivityCharts from '@components/dashboard/PageActivityCharts';
import FormSubmissionCharts from '@components/dashboard/FormSubmissionCharts';
import ViewsAnalytics from '@components/dashboard/ViewsAnalytics';
import GlobalStatsCharts from '@components/dashboard/GlobalStatsCharts';
import { Tab } from '@headlessui/react';
import { useState } from 'react';

function DashboardMain({ initialAnalyticsStats, initialFormStats, initialPageActivityStats, initialGlobalStats }) {
    const [selectedTab, setSelectedTab] = useState(0);
    
    const tabs = [
        { label: 'Global', component: GlobalStatsCharts, initialData: initialGlobalStats },
        { label: 'Page Views', component: ViewsAnalytics, initialData: initialAnalyticsStats },
        { label: 'Page Activity', component: PageActivityCharts, initialData: initialPageActivityStats },
        { label: 'Form Submissions', component: FormSubmissionCharts, initialData: initialFormStats },
    ];
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
                {/* <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div> */}
            </div>
            
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            className={({ selected }) =>
                                `w-full rounded-lg py-2.5 px-3 text-sm font-medium leading-5 flex items-center justify-center transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-primary-500 ${
                                    selected 
                                        ? 'bg-white text-primary-600 shadow' 
                                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                }`
                            }
                        >
                            {tab.label}
                        </Tab>
                    ))}
                </Tab.List>
                
                <Tab.Panels>
                    {tabs.map((tab, index) => {
                        const Component = tab.component;
                        return (
                            <Tab.Panel key={index}>
                                <Component initialData={tab.initialData} />
                            </Tab.Panel>
                        );
                    })}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}

export default DashboardMain;
// 'use client'
// import { useState } from 'react';
// import Card from '@components/ui/Card';
// import LineChart from '@components/dashboard/LineChart';
// import PageActivityCharts from '@components/dashboard/PageActivityCharts';
// import TopPagesBarChart from '@components/dashboard/TopPagesBarChart';
// import FormSubmissionCharts from '@components/dashboard/FormSubmissionCharts';
// import { Tab } from '@headlessui/react';
// import { useQuery } from 'react-query';
// import { getAnalyticsDashboardStats } from '@services/api';
// import ViewsAnalytics from '@components/dashboard/ViewsAnalytics';

// function DashboardMain({ initialAnalyticsStats, initialFormStats, initialPageActivityStats }) {
//     const [selectedTab, setSelectedTab] = useState(0);
    
//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-5">Analytics Dashboard</h2>
            
//             <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
//                 <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/10 p-1 mb-6">
//                     <Tab className={({ selected }) =>
//                         `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
//                         ${selected 
//                             ? 'bg-white text-blue-700 shadow'
//                             : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
//                         }`
//                     }>
//                         Page Views
//                     </Tab>
//                     <Tab className={({ selected }) =>
//                         `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
//                         ${selected 
//                             ? 'bg-white text-blue-700 shadow'
//                             : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
//                         }`
//                     }>
//                         Page Activity
//                     </Tab>
//                     <Tab className={({ selected }) =>
//                         `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
//                         ${selected 
//                             ? 'bg-white text-blue-700 shadow'
//                             : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
//                         }`
//                     }>
//                         Form Submissions
//                     </Tab>
//                 </Tab.List>
                
//                 <Tab.Panels>
//                     <Tab.Panel>
//                         <ViewsAnalytics initialData={initialAnalyticsStats} />
//                     </Tab.Panel>
                    
//                     <Tab.Panel>
//                         <PageActivityCharts initialData={initialPageActivityStats} />
//                     </Tab.Panel>
                    
//                     <Tab.Panel>
//                         <FormSubmissionCharts initialData={initialFormStats} />
//                     </Tab.Panel>
//                 </Tab.Panels>
//             </Tab.Group>
//         </div>
//     );
// }

// // Separate component for Views Analytics
// function ViewsAnalytics({ initialData }) {
//     const { data: stats, isLoading } = useQuery(
//         'analyticsStats', 
//         getAnalyticsDashboardStats,
//         {
//             initialData: initialData && Object.keys(initialData).length > 0 ? initialData : undefined,
//             refetchOnWindowFocus: false
//         }
//     );
    
//     // Data for the Page Views Trend Line Chart
//     const lineChartDataForTrend = {
//         labels: stats?.dailyTrend?.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
//         datasets: [
//             {
//                 label: 'Page Views',
//                 data: stats?.dailyTrend?.map(d => d.count) || [],
//                 borderColor: 'rgb(75, 192, 192)',
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 tension: 0.1,
//                 fill: true,
//             },
//         ],
//     };

//     // Options for the Page Views Trend Line Chart
//     const trendChartOptions = {
//         plugins: {
//             legend: {
//                 display: true,
//             },
//             title: {
//                 display: false,
//             }
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 title: {
//                     display: true,
//                     text: 'Number of Views'
//                 }
//             },
//             x: {
//                 title: {
//                     display: true,
//                     text: 'Date (Last 7 Days)'
//                 }
//             }
//         }
//     };
    
//     // Top pages list component
//     const TopPagesCard = ({ data, isLoading }) => {
//         if (isLoading) return <p>Loading top pages list...</p>;
//         if (!data || data.length === 0) return <p>No page view data yet for list.</p>;

//         return (
//             <Card title="Most Visited Pages (List)">
//                 <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
//                     {data.map((page, index) => (
//                         <li key={index} className="py-3 flex justify-between items-center">
//                             <span className="text-sm font-medium text-gray-700 truncate" title={page.path}>
//                                 {page.path.length > 30 ? `${page.path.substring(0, 27)}...` : page.path}
//                             </span>
//                             <span className="text-sm text-gray-500">{page.views} views</span>
//                         </li>
//                     ))}
//                 </ul>
//             </Card>
//         );
//     };
    
//     return (
//         <div className="space-y-6">
//             {/* Main Content Grid */}
//             <div className="grid lg:grid-cols-1 xxl:grid-cols-6 gap-5">
//                 <div className='lg:col-span-4'>
//                     <LineChart 
//                         chartData={lineChartDataForTrend} 
//                         chartOptions={trendChartOptions}
//                         title="Page Views Trend (Last 7 Days)"
//                         isLoading={isLoading}
//                     />
//                 </div>
//                 <div className='lg:col-span-2 space-y-5'>
//                     <TopPagesCard data={stats?.topPages} isLoading={isLoading} />
//                     <TopPagesBarChart data={stats?.topPages} isLoading={isLoading} title="Most Visited Pages (Chart)" />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default DashboardMain;