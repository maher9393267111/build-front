/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        screens: {
            xs: "480px",
            sm: "575px",
            md: "767px",
            lg: "991px",
            xl: "1199px",
            xxl: "1400px",
            // 'xs': {'max': '1535px'},
            // 'sm': {'max': '576px'},
            // 'md': {'max': '768px'},
            // 'lg': {'max': '992px'},
            // 'xl': {'max': '1200px'},
            // 'xxl': {'max': '1400px'},
        },

        // fontFamily: {
        //     heading: ["Poppins, sans-serif"],
        //     body: ["Poppins, sans-serif"]
        // },

        extend: {
            colors: {
                "dark-1": "#000000",
                "dark-2": "#222426",
                "green-1": "#28723d",
                "green-2": "#22c55e",
                "white-1": "#FDFDFD",
                "white-2": "#DCDCDC",
                "white-3": "#eef0f1",
                "white-4": "#f8f8f8",	
                "gray-1": "#45484a",
                "gray-2": "#18191B",
                "gray-3": "#222426",
                "gray-4": "#404c4c",
                "red-1": "#B6061D",
                white: "#ffffff",
                body: "#1e293b",
                "gray-100": "#f3f4f6",
                "gray-200": "#e5e7eb",
                "gray-300": "#d1d5db",
                "gray-400": "#9ca3af",
                "gray-500": "#6b7280",
                "gray-600": "#4b5563",
                "gray-700": "#374151",
                "gray-800": "#1f2937",
                "gray-900": "#111827",

                'primary': {
                    // '50': '#eff6ff',
                    // '100': '#dbeafe',
                    // '200': '#bfdbfe',
                    // '300': '#93c5fd',
                    // '400': '#60a5fa',
                    // '500': '#3b82f6',
                    // '600': '#2563eb',
                    // '700': '#1d4ed8',
                    // '800': '#1e40af',
                    // '900': '#1e3a8a',
                    // '950': '#172554',
                    '50': 'color-mix(in srgb, var(--primary-color) 5%, white)',
                    '100': 'color-mix(in srgb, var(--primary-color) 10%, white)',
                    '200': 'color-mix(in srgb, var(--primary-color) 20%, white)',
                    '300': 'color-mix(in srgb, var(--primary-color) 30%, white)',
                    '400': 'color-mix(in srgb, var(--primary-color) 40%, white)',
                    '500': 'var(--primary-color)',
                    '600': 'color-mix(in srgb, var(--primary-color) 80%, black)',
                    '700': 'color-mix(in srgb, var(--primary-color) 70%, black)',
                    '800': 'color-mix(in srgb, var(--primary-color) 60%, black)',
                    '900': 'color-mix(in srgb, var(--primary-color) 50%, black)',
                    '950': 'color-mix(in srgb, var(--primary-color) 40%, black)',
                },

                "pgray-50": "#f8fafc",
                "pgray-100": "#f1f5f9",
                "pgray-200": "#e2e8f0",
                "pgray-300": "#cbd5e1",
                "pgray-400": "#94a3b8",
                "pgray-500": "#64748b",
                "pgray-600": "#475569",
                "pgray-700": "#334155",
                "pgray-800": "#1e293b",
                "pgray-900": "#0f172a"
            },
            boxShadow: {
                sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                DEFAULT: "0px 2px 4px rgba(148, 163, 184, 0.05), 0px 6px 24px rgba(235, 238, 251, 0.4)",
                md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
                inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
                none: "none"
            },
            fontSize: {
                xs: ".75rem",
                sm: ".875rem",
                tiny: ".875rem",
                base: "1rem",
                lg: "1.125rem",
                xl: "1.25rem",
                "2xl": "1.5rem",
                "3xl": "1.875rem",
                "4xl": ["2.25rem", "3.2rem"],
                "5xl": ["3rem", "4rem"],
                "6xl": ["4rem", "1rem"],
                "7xl": ["5rem", "1rem"]
            }
        },

    },

    plugins: []
}
