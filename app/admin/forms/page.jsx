import { cookies } from 'next/headers';
import { getAllForms } from '@services/api';
import AdminFormsMain from './AdminFormsMain';

export const metadata = {
  title: 'Admin - Forms Management',
};

export default async function AdminFormsPage() {
  let initialForms = [];
  let initialTotalPages = 0;
  const initialCurrentPage = 1;

  try {
    // Fetch initial data (page 1, limit 10) on the server
    const response = await getAllForms({
      page: initialCurrentPage,
      limit: 10,
    });
    initialForms = response.forms;
    initialTotalPages = response.totalPages;
  } catch (error) {
    console.error('Error loading initial forms:', error);
  }

  // Render the client component with initial data
  return (
    <AdminFormsMain
      initialForms={initialForms}
      initialTotalPages={initialTotalPages}
      initialCurrentPage={initialCurrentPage}
    />
  );
} 