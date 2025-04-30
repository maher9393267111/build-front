import { cookies } from 'next/headers'; // Import cookies if needed for auth in getAllPages
import { getAllPages } from '@services/api';
import AdminPagesMain from './AdminPagesMain'; // Import the new client component
// Remove client-side imports like useState, useEffect, useRouter, Card, Button, Table, Icon, react-toastify
// Keep toast import only if used for server-side errors below, otherwise remove.
// Consider removing toast here as it's mainly for client-side feedback.
import { toast } from 'react-toastify'; 

export const metadata = {
  title: 'Admin - Pages Management',
};

// Optional: Revalidate data periodically or on-demand
// export const revalidate = 10; // Revalidate every 10 seconds

// const AdminPages = () => { ... remove entire client component function
export default async function AdminPagesPage() {
  let initialPages = [];
  let initialTotalPages = 0;
  const initialCurrentPage = 1;
  // const token = cookies().get('token')?.value; // Get token if API requires it

  try {
    // Fetch initial data (page 1, limit 10) on the server
    const response = await getAllPages({
      page: initialCurrentPage,
      limit: 10,
      // token: token // Pass token if needed
    });
    initialPages = response.pages;
    initialTotalPages = response.totalPages;
  } catch (error) {
    console.error('Error loading initial pages:', error);
    // Handle error appropriately, maybe show a message or log
    // Server-side toast is tricky, logging is usually preferred.
    // toast.error('Failed to load initial pages'); // Avoid client-side libs here
  }

  // Render the client component with initial data
  return (
    <AdminPagesMain
      initialPages={initialPages}
      initialTotalPages={initialTotalPages}
      initialCurrentPage={initialCurrentPage}
    />
  );
} 