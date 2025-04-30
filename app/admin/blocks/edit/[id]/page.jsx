'use client';
import React from 'react';
import BlockTemplateForm from '../../BlockTemplateForm';
import Card from '@components/ui/Card';

const EditBlockTemplate = ({ params }) => {
  const { id } = params;

  return (
    <div>
      <Card title="Edit Block Template" className="mb-6">
        <p className="text-slate-500 mb-4">
          Modify this block template's properties and content structure.
        </p>
      </Card>
      <BlockTemplateForm id={parseInt(id)} />
    </div>
  );
};

export default EditBlockTemplate; 