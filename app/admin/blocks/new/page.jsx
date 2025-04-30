'use client';
import React from 'react';
import BlockTemplateForm from '../BlockTemplateForm';
import Card from '@components/ui/Card';

const NewBlockTemplate = () => {
  return (
    <div>
      <Card title="Create New Block Template" className="mb-6">
        <p className="text-slate-500 mb-4">
          Create a new reusable block template that can be used across multiple pages.
        </p>
      </Card>
      <BlockTemplateForm />
    </div>
  );
};

export default NewBlockTemplate; 