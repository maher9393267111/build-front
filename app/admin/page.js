export const revalidate = 0; 
// Make page server component (no 'use client' directive)
import { getAnalyticsDashboardStats, getFormSubmissionStats, getPageActivityStats, getGlobalStats } from '@services/api';
import DashboardMain from './DashboardMain';

export default async function Dashboard() {
    // Fetch initial data server-side
    // const [
    //     // analyticsStats, formStats, pageActivityStats,
    //      globalStats] = await Promise.all([
    //     // getAnalyticsDashboardStats({ period: 'weekly' }),
    //     // getFormSubmissionStats({ page: 1, limit: 3 }),
    //     // getPageActivityStats({ page: 1, limit: 3 }),
    //     getGlobalStats()
    // ]);
    const globalStats = await getGlobalStats();

    // console.log('Execute fetching data', pageActivityStats, globalStats);
    
    return (
        <DashboardMain 
            // initialAnalyticsStats={analyticsStats}
            // initialFormStats={formStats}
            // initialPageActivityStats={pageActivityStats}
             initialGlobalStats={globalStats}
        />
    );
}
