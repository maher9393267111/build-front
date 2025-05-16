'use client'
import PageActivityCharts from '@components/dashboard/PageActivityCharts';
import FormSubmissionCharts from '@components/dashboard/FormSubmissionCharts';
import ViewsAnalytics from '@components/dashboard/ViewsAnalytics';
import GlobalStatsCharts from '@components/dashboard/GlobalStatsCharts';
import { Tab } from '@headlessui/react';
import { useState } from 'react';

function DashboardMain({ 
    // initialAnalyticsStats, 
    // initialFormStats, initialPageActivityStats, 
    
    initialGlobalStats


}) {
    const [selectedTab, setSelectedTab] = useState(0);
    
    const tabs = [
        { label: 'Global', component: GlobalStatsCharts, initialData: initialGlobalStats },
        { label: 'Page Views', component: ViewsAnalytics, 
            // initialData: initialAnalyticsStats 
        },
        { label: 'Page Activity', component: PageActivityCharts, 
            // initialData: initialPageActivityStats 
        },
        { label: 'Form Submissions', component: FormSubmissionCharts, 
            // initialData: initialFormStats
         },
    ];
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
                
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
                                <Component initialData={tab.initialData || null} />
                            </Tab.Panel>
                        );
                    })}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}

export default DashboardMain;
