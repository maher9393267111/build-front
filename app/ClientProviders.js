'use client'; // This component IS a client component

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from '@features/store'; // Ensure this path is correct
import { persistStore } from "redux-persist";
import { useState, useEffect } from "react";
import { setSettings } from "@features/settings/settingsSlice";

// Initialize QueryClient - do this outside the component to prevent recreation on re-renders
const queryClient = new QueryClient();

// Initialize Redux Persistor - also outside
let persistor = persistStore(store);

export default function ClientProviders({ children, initialSettings }) {
    // State to track hydration, prevents hydration mismatch errors with persisted state
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
        
        // Initialize settings in Redux store if available
        if (initialSettings) {
            store.dispatch(setSettings(initialSettings));
        }
    }, [initialSettings]);

    // Render children only after hydration to ensure persisted state is loaded
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {isHydrated ? (
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                ) : null /* Or a loading indicator */}
            </PersistGate>
        </Provider>
    );
}

// 'use client'; // This component IS a client component

// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { QueryClient, QueryClientProvider } from 'react-query';
// import { store } from '@features/store'; // Ensure this path is correct
// import { persistStore } from "redux-persist";
// import { useState, useEffect } from "react";
// import { setSettings } from "@features/settings/settingsSlice";

// // Create a client-side only QueryClient instance
// let queryClientInstance;
// if (typeof window !== 'undefined') {
//   // Only create the client instance on the client side
//   queryClientInstance = new QueryClient({
//     defaultOptions: {
//       queries: {
//         retry: 1,
//         retryDelay: (attemptIndex) => Math.min(1000 * (attemptIndex + 1), 10000),
//         staleTime: 5000,
//         cacheTime: 300000, // 5 minutes
//         refetchOnWindowFocus: false,
//         suspense: false, // Important: disable suspense mode
//         useErrorBoundary: false, // Don't use error boundaries
//       },
//     },
//   });
// }

// // Initialize Redux Persistor
// let persistor;
// if (typeof window !== 'undefined') {
//   // Only create the persistor on the client side
//   persistor = persistStore(store);
// }

// export default function ClientProviders({ children, initialSettings }) {
//     // State to track client-side hydration
//     const [mounted, setMounted] = useState(false);
    
//     // Create instance variables on the client only
//     const [clientReady, setClientReady] = useState(false);

//     useEffect(() => {
//         // Mark component as mounted on client
//         setMounted(true);
        
//         // Wait for next tick to ensure DOM is ready
//         const timer = setTimeout(() => {
//             try {
//                 // Only set settings on client-side render
//                 if (initialSettings && Object.keys(initialSettings).length > 0) {
//                     store.dispatch(setSettings(initialSettings));
//                 }
//                 setClientReady(true);
//             } catch (error) {
//                 console.error("Client initialization error:", error);
//             }
//         }, 0);
        
//         return () => clearTimeout(timer);
//     }, [initialSettings]);
    
//     // Avoid hydration mismatch by not rendering until client-side
//     // if (!mounted) {
//     //     return <div suppressHydrationWarning>Loading...</div>;
//     // }

//     // Once mounted, render the client provider tree
//     return (
//         <Provider store={store}>
//             <PersistGate loading={<div>Loading state...</div>} persistor={persistor}>
//                 {clientReady && queryClientInstance ? (
//                     <QueryClientProvider client={queryClientInstance}>
//                         {children}
//                     </QueryClientProvider>
//                 ) : (
//                     <div>Initializing application...</div>
//                 )}
//             </PersistGate>
//         </Provider>
//     );
// }