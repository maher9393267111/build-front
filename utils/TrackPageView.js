'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@services/api';

let lastTrackedPath = '';

const TrackPageViews = () => {
    const pathname = usePathname();
    

    useEffect(() => {
        // Avoid tracking the same path multiple times if useEffect runs again for other reasons
        // and also avoid tracking on initial server render if pathname is null.
        if (pathname && pathname !== lastTrackedPath) {
            trackPageView(pathname);
            lastTrackedPath = pathname;
        }
    }, [pathname]);

    return null; // This component doesn't render anything
};



export default TrackPageViews;