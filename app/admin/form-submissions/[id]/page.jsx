'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/navigation';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Table from '@components/ui/Table';
import Icon from '@components/ui/Icon';
import { toast } from 'react-toastify';
import { getFormById, getFormSubmissions, updateFormSubmissionStatus, deleteFormSubmission } from '@services/api';
import PaginationDynamic from '@components/elements/PaginationDynamic';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const FormSubmissionsPage = ({ params }) => {
  const { id } = params;
  const formId = parseInt(id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
  const [submissionToUpdate, setSubmissionToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  const { data: form, isLoading: formLoading } = useQuery(
    ['form', formId],
    () => getFormById(formId),
    {
      onError: (error) => {
        console.error('Error fetching form:', error);
        toast.error('Failed to load form details');
        router.push('/admin/forms');
      },
    }
  );

  const { data: submissionsData, isLoading: submissionsLoading, isError } = useQuery(
    ['formSubmissions', formId, currentPage],
    () => getFormSubmissions(formId, { page: currentPage, limit: 3 }),
    {
      enabled: !!form,
      keepPreviousData: true,
      onError: (error) => {
        console.error('Error fetching submissions:', error);
        toast.error('Failed to load form submissions');
      },
    }
  );

  const updateStatusMutation = useMutation(
    ({ formId, submissionId, status }) => updateFormSubmissionStatus(formId, submissionId, status),
    {
      onSuccess: () => {
        toast.success('Submission status updated successfully');
        queryClient.invalidateQueries(['formSubmissions', formId, currentPage]);
        setStatusChangeModalOpen(false);
        setSubmissionToUpdate(null);
      },
      onError: (error) => {
        console.error('Error updating submission status:', error);
        toast.error('Failed to update submission status');
      },
    }
  );

  const deleteSubmissionMutation = useMutation(
    ({ formId, submissionId }) => deleteFormSubmission(formId, submissionId),
    {
      onSuccess: () => {
        toast.success('Submission deleted successfully');
        queryClient.invalidateQueries(['formSubmissions', formId, currentPage]);
        setDeleteConfirmModalOpen(false);
        setSubmissionToDelete(null);
      },
      onError: (error) => {
        console.error('Error deleting submission:', error);
        toast.error('Failed to delete submission');
        setDeleteConfirmModalOpen(false);
        setSubmissionToDelete(null);
      },
    }
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (submission) => {
    console.log('Submission received in handleViewDetails:', submission);
    setCurrentSubmission(submission);
    setDetailsModalOpen(true);
  };

  const handleStatusChange = (submission) => {
    setSubmissionToUpdate(submission);
    setNewStatus(submission.status);
    setStatusChangeModalOpen(true);
  };

  const handleDeleteSubmission = (submission) => {
    setSubmissionToDelete(submission);
    setDeleteConfirmModalOpen(true);
  };

  const confirmStatusChange = () => {
    if (submissionToUpdate && newStatus) {
      updateStatusMutation.mutate({
        formId,
        submissionId: submissionToUpdate.id,
        status: newStatus,
      });
    }
  };

  const confirmDeleteSubmission = () => {
    if (submissionToDelete) {
      deleteSubmissionMutation.mutate({
        formId,
        submissionId: submissionToDelete.id,
      });
    }
  };

  const getSubmissionValue = (submission, field) => {
  console.log('submission', submission)
    if (!submission || !submission.data) return null;
    
    // Try multiple ways to access the field data
    return submission.data[field.id] ||
           submission.data[field.label] ||
           submission.data[`question_${field.id}`] ||
           submission.data[field.id?.toString()] ||
           // Handle numeric keys
           (typeof field.id === 'number' && submission.data[field.id]) ||
           // Try lowercase version of label for case-insensitive matching
           (field.label && submission.data[field.label.toLowerCase()]);
  };
//   const confirmStatusChange = () => {
//     if (submissionToUpdate && newStatus) {
//       updateStatusMutation.mutate({
//         formId,
//         submissionId: submissionToUpdate.id,
//         status: newStatus,
//       });
//     }
//   };

  const renderFieldValue = (field, value) => {
    if (!value && value !== 0 && value !== false) return <span className="text-gray-400">Not provided</span>;

    switch (field.type) {
      case 'file':
        return (
          <a
            href={value?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 cursor-pointer hover:underline flex items-center"
          >
            <Icon icon="Document" className="h-4 w-4 mr-1" />
            View File {value?.name || "Attachment"}
          </a>
        );
      case 'checkbox':
        return value === true ? 'Yes' : 'No';
      case 'question':
        // Handle question fields specially
        if (typeof value === 'object' && value !== null) {
          return value.label || value.toString();
        }
        // If it's just an ID or option value
        if (field.options) {
          const option = field.options.find(opt => opt.id === parseInt(value) || opt.value === value);
          return option ? option.label : value;
        }
        return value;
      default:
        return typeof value === 'object' ? JSON.stringify(value) : value;
    }
  };

  if (formLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="loader animate-spin border-4 border-t-4 rounded-full h-12 w-12 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const columns = [
    {
      Header: 'ID',
      accessor: 'id',
      Cell: ({ value }) => <span className="font-medium">#{value}</span>,
    },
    {
      Header: 'Date',
      accessor: 'createdAt',
      Cell: ({ value }) => {
        const date = new Date(value);
        return (
          <>
            <div>{date.toLocaleDateString('en-GB')}</div>
            <div className="text-xs text-gray-500">{date.toLocaleTimeString('en-GB')}</div>
          </>
        );
      },
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => {
        let statusColor = '';
        switch (value) {
          case 'new':
            statusColor = 'bg-blue-100 text-blue-800';
            break;
          case 'processed':
            statusColor = 'bg-green-100 text-green-800';
            break;
          case 'closed':
            statusColor = 'bg-gray-100 text-gray-800';
            break;
          default:
            statusColor = 'bg-gray-100 text-gray-800';
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      },
    },
    {
      Header: 'Actions',
      accessor: (row) => row,
      Cell: ({ value: submission }) => (
        <div className="flex space-x-2">
          <button
            className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100"
            type="button"
            onClick={() => handleViewDetails(submission)}
          >
            <Icon icon="Eye" className="h-5 w-5" />
          </button>
          <button
            className="p-2 bg-amber-50 text-amber-500 rounded-lg hover:bg-amber-100"
            type="button"
            onClick={() => handleStatusChange(submission)}
          >
            <Icon icon="ArrowPathRoundedSquare" className="h-5 w-5" />
          </button>
          <button
            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
            type="button"
            onClick={() => handleDeleteSubmission(submission)}
          >
            <Icon icon="Trash" className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="card-title">{form?.title} - Submissions</h4>
            <p className="text-gray-500 text-sm mt-1">View and manage form submissions</p>
          </div>
          <Button
            text="Back to Forms"
            icon="ArrowLeft"
            className="btn-outline-primary"
            onClick={() => router.push('/admin/forms')}
          />
        </div>

        <div className="overflow-x-auto">
          {submissionsLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="loader animate-spin border-4 border-t-4 rounded-full h-8 w-8 border-primary-500 border-t-transparent"></div>
            </div>
          ) : submissionsData?.submissions?.length > 0 ? (
            <>
              <Table columns={columns} data={submissionsData.submissions} />
              {submissionsData.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <PaginationDynamic
                    currentPage={currentPage}
                    totalPages={submissionsData.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <Icon icon="InboxArrowDown" className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                This form has not received any submissions.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Submission Details Modal */}
      <Transition show={detailsModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setDetailsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 border-b pb-3"
                  >
                    Submission Details
                    <span className="ml-2 text-sm text-gray-500">
                      {currentSubmission && new Date(currentSubmission.createdAt).toLocaleString()}
                    </span>
                  </Dialog.Title>
                 

                  {currentSubmission && (
                    <div className="mt-4">
                      <div className="mb-4 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-gray-500">Status:</span>
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              currentSubmission.status === 'new'
                                ? 'bg-blue-100 text-blue-800'
                                : currentSubmission.status === 'processed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {currentSubmission.status.charAt(0).toUpperCase() +
                              currentSubmission.status.slice(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Submission #{currentSubmission.id}
                        </span>
                      </div>

                      <div className="border rounded-lg divide-y">
                        {form?.fields?.map((field) => (
                          <div key={field.id} className="grid grid-cols-3 px-4 py-3">
                            <div className="font-medium text-gray-700">
                              {field.label}
                              {field.isRequired && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </div>
                            <div className="col-span-2">
                              {renderFieldValue(
                                field, 
                                getSubmissionValue(currentSubmission, field)
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button
                      text="Close"
                      className="btn-outline-dark"
                      onClick={() => setDetailsModalOpen(false)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Status Change Modal */}
      <Transition show={statusChangeModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setStatusChangeModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Update Submission Status
                  </Dialog.Title>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="new">New</option>
                      <option value="processed">Processed</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      text="Cancel"
                      className="btn-outline-dark"
                      onClick={() => setStatusChangeModalOpen(false)}
                    />
                    <Button
                      text="Update Status"
                      className="btn-primary"
                      onClick={confirmStatusChange}
                      isLoading={updateStatusMutation.isLoading}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition show={deleteConfirmModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setDeleteConfirmModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Deletion
                  </Dialog.Title>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete submission #
                      {submissionToDelete?.id}? This action cannot be undone. Any
                      associated files will also be deleted.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      text="Cancel"
                      className="btn-outline-dark"
                      onClick={() => setDeleteConfirmModalOpen(false)}
                    />
                    <Button
                      text="Delete"
                      className="btn-danger"
                      onClick={confirmDeleteSubmission}
                      isLoading={deleteSubmissionMutation.isLoading}
                      icon="Trash"
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default FormSubmissionsPage; 