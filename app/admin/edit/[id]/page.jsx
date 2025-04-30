'use client';
import React from 'react';
import PageForm from '../../pages/PageForm';
import Card from '@components/ui/Card';

const EditPage = ({ params }) => {
  const { id } = params;

  return (
    <div>
      <Card title="Edit Page" className="mb-6">
        <p className="text-slate-500 mb-4">
          Edit the page content, SEO settings, and blocks.
        </p>
      </Card>
      <PageForm id={parseInt(id)} />
    </div>
  );
};

export default EditPage; 