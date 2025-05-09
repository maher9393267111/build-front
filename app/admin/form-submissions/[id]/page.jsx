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
import { Listbox } from '@headlessui/react';

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

  console.log('submissionsData', submissionsData)

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
        if (value === true) return 'Yes';
        if (value === false) return 'No';
        // Handle string values for checkboxes
        return value;
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
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-0 text-left align-middle shadow-xl transition-all">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                    <Dialog.Title as="h3" className="text-lg font-semibold text-white">
                      Submission Details
                      {/* {currentSubmission && (
                        <div className="text-sm text-white/80 mt-1 flex items-center">
                          <Icon icon="Calendar" className="h-4 w-4 mr-1" />
                          {new Date(currentSubmission.createdAt).toLocaleString()}
                        </div>
                      )} */}
                    </Dialog.Title>
                  </div>

                  {currentSubmission && (
                    <div className="px-6 py-5">
                      <div className="mb-5 flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span
                            className={`ml-2 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
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
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-lg font-medium text-gray-700">
                          <Icon icon="Hashtag" className="h-3.5 w-3.5 inline mr-1" />
                          Submission {currentSubmission.id}
                        </span>
                      </div>

                      <div className="border rounded-xl overflow-hidden shadow-sm">
                        {form?.fields?.map((field, index) => (
                          <div 
                            key={field.id} 
                            className={`grid grid-cols-3 px-5 py-4 ${
                              index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                            }`}
                          >
                            <div className="font-medium text-gray-700 flex items-center">
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

                  <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
                    <Button
                      text="Close"
                      icon="XMark"
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
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-0 text-left align-middle shadow-xl transition-all">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                    <Dialog.Title as="h3" className="text-lg font-semibold text-white flex items-center">
                      <Icon icon="ArrowPathRoundedSquare" className="h-5 w-5 mr-2" />
                      Update Submission Status
                    </Dialog.Title>
                  </div>

                  <div className="px-6 py-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Status
                    </label>
                    <Listbox value={newStatus} onChange={setNewStatus}>
                      {({ open }) => (
                        <div className="relative">
                          <Listbox.Button className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white pr-10 text-left transition-all flex justify-between items-center">
                            <span className="block truncate">
                              {newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
                            </span>
                            <Icon icon="ChevronUpDown" className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </Listbox.Button>
                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                              {[
                                { value: 'new', label: 'New' },
                                { value: 'processed', label: 'Processed' },
                                { value: 'closed', label: 'Closed' },
                              ].map((statusOption) => (
                                <Listbox.Option
                                  key={statusOption.value}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                                    }`
                                  }
                                  value={statusOption.value}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected ? 'font-medium' : 'font-normal'
                                        }`}
                                      >
                                        {statusOption.label}
                                      </span>
                                      {selected ? (
                                        <span
                                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                            active ? 'text-primary-600' : 'text-primary-600'
                                          }`}
                                        >
                                          <Icon icon="Check" className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      )}
                    </Listbox>
                    <div className="mt-4 flex flex-col space-y-2">
                      <div className={`p-3 rounded-lg border ${newStatus === 'new' ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${newStatus === 'new' ? 'bg-blue-500' : 'bg-gray-300'} mr-2`}></div>
                          <span className={`text-sm font-medium ${newStatus === 'new' ? 'text-blue-700' : 'text-gray-500'}`}>New</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-5">Newly received submissions requiring review</p>
                      </div>
                      <div className={`p-3 rounded-lg border ${newStatus === 'processed' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${newStatus === 'processed' ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                          <span className={`text-sm font-medium ${newStatus === 'processed' ? 'text-green-700' : 'text-gray-500'}`}>Processed</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-5">Submissions that have been reviewed and processed</p>
                      </div>
                      <div className={`p-3 rounded-lg border ${newStatus === 'closed' ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${newStatus === 'closed' ? 'bg-gray-500' : 'bg-gray-300'} mr-2`}></div>
                          <span className={`text-sm font-medium ${newStatus === 'closed' ? 'text-gray-700' : 'text-gray-500'}`}>Closed</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-5">Completed submissions requiring no further action</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-4 flex justify-end border-t space-x-3">
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
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-0 text-left align-middle shadow-xl transition-all">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                    <Dialog.Title as="h3" className="text-lg font-semibold text-white flex items-center">
                      <Icon icon="ExclamationTriangle" className="h-5 w-5 mr-2" />
                      Confirm Deletion
                    </Dialog.Title>
                  </div>

                  <div className="px-6 py-5">
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Icon icon="ExclamationCircle" className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Warning: This action cannot be undone
                          </h3>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">
                      Are you sure you want to delete submission 
                      <span className="font-semibold"> #{submissionToDelete?.id}</span>?
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Any associated files will also be permanently deleted.
                    </p>
                  </div>

                  <div className="bg-gray-50 px-6 py-4 flex justify-end border-t space-x-3">
                    <Button
                      text="Cancel"
                      className="btn-outline-dark"
                      onClick={() => setDeleteConfirmModalOpen(false)}
                    />
                    <Button
                      text="Delete Permanently"
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