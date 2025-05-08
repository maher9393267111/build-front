'use client';
import React from 'react';
import FormForm from '../FormForm';
import Card from '@components/ui/Card';

const NewForm = () => {
  return (
    <div>
      <Card title="Create New Form" className="mb-6">
        <p className="text-slate-500 mb-4">
          Create a dynamic form with customizable fields, conditional logic, and file uploads.
        </p>
      </Card>
      <FormForm />
    </div>
  );
};

export default NewForm; 