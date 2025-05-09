'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/navigation';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Table from '@components/ui/Table';
import Icon from '@components/ui/Icon';
import { toast } from 'react-toastify';
import { getAllForms, deleteForm, getFormById } from '@services/api';
import PaginationDynamic from '@components/elements/PaginationDynamic';
import ConfirmationModal from '@components/modal/ConfirmationModal';
import DynamicForm from '@components/DynamicForm';
import Modal from '@components/ui/Modal';
import PreviewForm from './PreviewForm';

const AdminFormsMain = ({ initialForms, initialTotalPages, initialCurrentPage }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formToDeleteId, setFormToDeleteId] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewForm, setPreviewForm] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const { data: formsData, isLoading, isError } = useQuery(
    ['adminForms', currentPage],
    () => getAllForms({ page: currentPage, limit: 10 }),
    {
      initialData: { forms: initialForms, totalPages: initialTotalPages },
      keepPreviousData: true,
    }
  );

  const deleteMutation = useMutation(deleteForm, {
    onSuccess: () => {
      toast.success('Form deleted successfully');
      queryClient.invalidateQueries(['adminForms', currentPage]);
      closeModal();
    },
    onError: (error) => {
      console.error('Error deleting form:', error);
      toast.error('Failed to delete form');
      closeModal();
    },
  });

  const handleEdit = (id) => {
    router.push(`/admin/forms/edit/${id}`);
  };

  const handleViewSubmissions = (id) => {
    router.push(`/admin/form-submissions/${id}`);
  };

  const handleDelete = (id) => {
    setFormToDeleteId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (formToDeleteId) {
      deleteMutation.mutate(formToDeleteId);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormToDeleteId(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreview = async (id) => {
    setIsLoadingPreview(true);
    try {
      const formData = await getFormById(id);
      setPreviewForm(formData);
      setIsPreviewModalOpen(true);
    } catch (error) {
      console.error('Error loading form preview:', error);
      toast.error('Failed to load form preview');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewForm(null);
  };

  const columns = [
    {
      Header: 'Title',
      accessor: 'title',
    },
    {
      Header: 'Slug',
      accessor: 'slug',
    },
    {
      Header: 'Fields',
      accessor: '_count.fields',
      Cell: ({ value }) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {value} {value === 1 ? 'field' : 'fields'}
        </span>
      ),
    },
    {
      Header: 'Submissions',
      accessor: '_count.submissions',
      Cell: ({ value }) => (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          {value} {value === 1 ? 'submission' : 'submissions'}
        </span>
      ),
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <span className={`badge ${value === 'published' ? 'bg-green-500 text-white' : '!bg-amber-500 text-white'} px-2 py-1 rounded-full text-xs`}>
          {value}
        </span>
      ),
    },
    {
      Header: 'Created',
      accessor: 'createdAt',
      Cell: ({ value }) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      },
    },
    {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({ row }) => (
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button
            className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100"
            type="button"
            onClick={() => handleEdit(row.id)}
          >
            <Icon icon="PencilSquare" className="h-5 w-5" />
          </button>
          <button
            className="p-2 bg-indigo-50 text-indigo-500 rounded-lg hover:bg-indigo-100"
            type="button"
            onClick={() => handlePreview(row.id)}
          >
            <Icon icon="Eye" className="h-5 w-5" />
          </button>


          
          <button
            className="p-2 bg-green-50 text-green-500 rounded-lg hover:bg-green-100"
            type="button"
            onClick={() => handleViewSubmissions(row.id)}
          >
            <Icon icon="ClipboardDocumentCheck" className="h-5 w-5" />
          </button>
          <button
            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
            type="button"
            onClick={() => handleDelete(row.id)}
          >
            <Icon icon="Trash" className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  const forms = formsData?.forms || [];
  const totalPages = formsData?.totalPages || 0;

  if (isError) {
    toast.error('Failed to load forms');
  }

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h4 className="card-title">Forms</h4>
          <Button
            text="Create New Form"
            icon="Plus"
            className="btn-dark"
            onClick={() => router.push('/admin/forms/new')}
          />
        </div>
        <div className="overflow-x-auto">
          {isLoading && !formsData ? (
            <div className="flex justify-center items-center h-20">
              <div className="loader animate-spin border-4 border-t-4 rounded-full h-8 w-8 border-primary-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              <Table columns={columns} data={forms} />
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <PaginationDynamic
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <ConfirmationModal
        open={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Delete Form"
        description="Are you sure you want to delete this form? All fields and submissions will be permanently removed. This action cannot be undone."
        confirmText="Delete"
        loading={deleteMutation.isLoading}
        danger={true}
      />

      <Modal
        title={previewForm?.title || 'Form Preview'}
        open={isPreviewModalOpen}
        onClose={closePreviewModal}
        size="xl"
      >
        <div className="p-4">
          {isLoadingPreview ? (
            <div className="flex justify-center items-center h-40">
              <div className="loader animate-spin border-4 border-t-4 rounded-full h-8 w-8 border-primary-500 border-t-transparent"></div>
            </div>
          ) : previewForm ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">{previewForm.title}</h2>
              <PreviewForm formData={previewForm} />
              <div className="mt-4 text-sm text-gray-500 italic">
                This is a preview. Form submissions in preview mode are not saved.
              </div>
            </div>
          ) : (
            <p>No form data available</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AdminFormsMain; 