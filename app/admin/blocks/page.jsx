'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Table from '@components/ui/Table';
import { toast } from 'react-toastify';
import { getBlockTemplates, deleteBlockTemplate } from '@services/api';
import Icon from '@components/ui/Icon';
import ConfirmationModal from '@components/modal/ConfirmationModal';

const AdminBlockTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await getBlockTemplates();
      setTemplates(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading block templates:', error);
      toast.error('Failed to load block templates');
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/blocks/edit/${id}`);
  };

  const openDeleteConfirm = (template) => {
    setTemplateToDelete(template);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;
    
    try {
      await deleteBlockTemplate(templateToDelete.id);
      toast.success('Block template deleted successfully');
      loadTemplates();
      setConfirmOpen(false);
      setTemplateToDelete(null);
    } catch (error) {
      console.error('Error deleting block template:', error);
      toast.error('Failed to delete block template');
    }
  };

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Type',
      accessor: 'type',
      Cell: ({ value }) => (
        <span className="capitalize">{value}</span>
      )
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      Header: 'Created',
      accessor: 'createdAt',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A',
    },
    {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({ value, row }) => (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <button
            className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100"
            type="button"
            onClick={() => handleEdit(value)}
          >
            <Icon icon="PencilSquare" className="h-5 w-5" />
          </button>
          <button
            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
            type="button"
            onClick={() => openDeleteConfirm(row)}
          >
            <Icon icon="Trash" className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-medium">Block Templates</h4>
          <Button
            text="Add New Template"
            icon="Plus"
            className="btn-dark"
            onClick={() => router.push('/admin/blocks/new')}
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-20">
              <div className="loader animate-spin border-4 border-t-4 rounded-full h-8 w-8 border-primary-500 border-t-transparent"></div>
            </div>
          ) : (
            <Table columns={columns} data={templates || []} />
          )}
        </div>
      </Card>

      <ConfirmationModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setTemplateToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Block Template"
        description={`Are you sure you want to delete "${templateToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminBlockTemplates; 