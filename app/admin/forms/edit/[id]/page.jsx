'use client';
import React from 'react';
import FormForm from '../../FormForm';
import Card from '@components/ui/Card';

const EditForm = ({ params }) => {
  const { id } = params;

  return (
    <div>
      <Card title="Edit Form" className="mb-6">
        <p className="text-slate-500 mb-4">
          Modify this form's properties, fields, and conditional logic.
        </p>
      </Card>
      <FormForm id={parseInt(id)} />
    </div>
  );
};

export default EditForm; 