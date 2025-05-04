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