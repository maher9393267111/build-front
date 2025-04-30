'use client'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Layout from '@components/layout/dashboard/Layout';
import AdminGuard from '@guards/AdminGuard';


export default function AdminLayout({ children }) {
 

    // Optionally, you can pass breadcrumbTitle as a prop or context
    return (
        <AdminGuard>
            <Layout breadcrumbTitle={"Dashboard"}>
                {children}
            </Layout>
        </AdminGuard>
    );
}