'use client';
import React from 'react';
import PageForm from '../PageForm';
import Card from '@components/ui/Card';

const NewPage = () => {
  return (
    <div>
      <Card title="Create New Page" className="mb-6">
        <p className="text-slate-500 mb-4">
          Create a new dynamic page with customizable blocks and content.
        </p>
      </Card>
      <PageForm />
    </div>
  );
};

export default NewPage; 