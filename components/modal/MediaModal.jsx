import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, FolderIcon, CloudArrowUpIcon, MagnifyingGlassIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { getMediaLibrary, uploadMediaFile } from '@services/api';
import Button from '@components/ui/Button';
import { toast } from 'react-toastify';
import Textinput from '@components/ui/Textinput';
import PaginationDynamic from '@components/elements/PaginationDynamic';

const TABS = [
  { key: 'library', label: 'Media Library' },
  { key: 'upload', label: 'Upload' }
];

const MediaModal = ({ open, onClose, onSelect, title = 'Select Media', accept = 'image/*' }) => {
  const [activeTab, setActiveTab] = useState('library');
  const [media, setMedia] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [fileName, setFileName] = useState('');

  // Fetch media from the API
  const fetchMedia = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const params = { 
        page, 
        limit: 10, 
        type: accept.startsWith('image') ? 'image' : undefined
      };
      
      if (search) {
        params.search = search;
      }
      
      const result = await getMediaLibrary(params);
      setMedia(result.media);
      setPagination({
        currentPage: result.pagination.currentPage,
        totalPages: result.pagination.totalPages,
        total: result.pagination.total
      });
    } catch (error) {
      console.error('Failed to fetch media:', error);
      toast.error('Failed to load media library');
    } finally {
      setLoading(false);
    }
  }, [accept]);

  // Initial fetch on mount
  useEffect(() => {
    if (open && activeTab === 'library') {
      fetchMedia(1, searchTerm);
    }
  }, [open, activeTab, fetchMedia, searchTerm]);

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeoutId = setTimeout(() => {
      fetchMedia(1, value);
    }, 500);
    
    setSearchTimeout(timeoutId);
  };

  // Handle file selection
  const handleSelect = () => {
    if (!selectedItem) return;
    onSelect(selectedItem);
    onClose();
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileToUpload(file);
    setFileName(file.name);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!fileToUpload) return;
    
    setUploading(true);
    try {
      // Set setAsInUse to false when uploading directly to the media library
      const result = await uploadMediaFile(fileToUpload, true, false);
      
      toast.success('File uploaded successfully');
      
      // Auto-select the uploaded file
      const uploadedItem = {
        id: result.mediaId,
        url: result.url,
        name: result.originalName || fileName,
        type: result.type,
        fromMediaLibrary: true
      };
      
      setSelectedItem(uploadedItem);
      
      // Reset upload form
      setFileToUpload(null);
      setUploadPreview(null);
      setFileName('');
      
      // Switch to library tab and refresh
      setActiveTab('library');
      fetchMedia(1, searchTerm);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchMedia(newPage, searchTerm);
  };

  // Replace the renderPagination function with this:
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;
    
    return (
      <div className="mt-4">
        <PaginationDynamic
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    );
  };

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="bg-white">
                  {/* Header */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                      {title}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                      {TABS.map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`py-3 px-4 text-sm font-medium ${
                            activeTab === tab.key
                              ? 'border-b-2 border-primary-500 text-primary-600'
                              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {tab.key === 'library' ? (
                            <FolderIcon className="h-4 w-4 inline mr-2" />
                          ) : (
                            <CloudArrowUpIcon className="h-4 w-4 inline mr-2" />
                          )}
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Content */}
                  <div className="px-4 py-4" style={{ minHeight: '400px' }}>
                    {activeTab === 'library' ? (
                      <>
                        {/* Search and filters */}
                        <div className="mb-4">
                          <div className="relative">
                            <Textinput
                              type="text"
                              className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              placeholder="Search media..."
                              value={searchTerm}
                              onChange={handleSearchChange}
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                          </div>
                        </div>

                        {/* Media grid */}
                        {loading ? (
                          <div className="flex justify-center items-center h-60">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                          </div>
                        ) : media.length === 0 ? (
                          <div className="text-center py-16">
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No media</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {searchTerm
                                ? `No results found for "${searchTerm}"`
                                : 'Get started by uploading a file.'}
                            </p>
                            <div className="mt-6">
                              <button
                                type="button"
                                onClick={() => setActiveTab('upload')}
                                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                              >
                                <CloudArrowUpIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                Upload file
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {media.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                className={`relative group cursor-pointer rounded-lg overflow-hidden border ${
                                  selectedItem?.id === item.id
                                    ? 'ring-2 ring-primary-500 border-primary-500'
                                    : 'border-gray-200 hover:border-primary-300'
                                }`}
                              >
                                {/* Media preview */}
                                <div className="aspect-square bg-gray-100 relative">
                                  {item.type === 'image' ? (
                                    <img
                                      src={item.url}
                                      alt={item.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full">
                                      <DocumentIcon className="h-12 w-12 text-gray-400" />
                                    </div>
                                  )}
                                  
                                  {selectedItem?.id === item.id && (
                                    <div className="absolute top-2 right-2">
                                      <CheckCircleIcon className="h-6 w-6 text-primary-500" />
                                    </div>
                                  )}
                                </div>
                                
                                {/* Media info */}
                                <div className="px-2 py-1 bg-white text-xs truncate">
                                  {item.name || 'Unnamed file'}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Pagination */}
                        {!loading && renderPagination()}
                      </>
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Upload file
                          </label>
                          <div className="flex flex-col space-y-2">
                            <div
                              className={`relative flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                                fileToUpload ? 'border-primary-300 bg-primary-50' : 'border-gray-300'
                              }`}
                            >
                              {uploadPreview ? (
                                <div className="text-center relative">
                                  {uploadPreview.startsWith('data:image/') ? (
                                    <img
                                      src={uploadPreview}
                                      alt="Preview"
                                      className="mx-auto h-32 object-contain"
                                    />
                                  ) : (
                                    <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                                  )}
                                  <p className="mt-2 text-sm text-gray-600">{fileName}</p>
                                </div>
                              ) : (
                                <div className="space-y-1 text-center">
                                  <CloudArrowUpIcon
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  <div className="flex text-sm text-gray-600">
                                    <label
                                      htmlFor="file-upload"
                                      className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
                                    >
                                      <span>Upload a file</span>
                                      <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        accept={accept}
                                        onChange={handleFileChange}
                                      />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {accept.includes('image')
                                      ? 'PNG, JPG, GIF up to 10MB'
                                      : 'Any file up to 10MB'}
                                  </p>
                                </div>
                              )}
                            </div>

                            {fileToUpload && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFileToUpload(null);
                                  setUploadPreview(null);
                                  setFileName('');
                                }}
                                className="text-xs text-red-600 hover:text-red-800 self-start"
                              >
                                Remove selected file
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="w-full">
                          <Button
                            text="Upload File"
                            className="btn-primary"
                            icon="CloudArrowUp"
                            isLoading={uploading}
                            disabled={!fileToUpload || uploading}
                            onClick={handleUpload}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200">
                    <Button
                      text="Select Media"
                      className="btn-primary"
                      disabled={!selectedItem}
                      onClick={handleSelect}
                    />
                    <Button
                      text="Cancel"
                      className="btn-outline-dark mr-2"
                      onClick={onClose}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MediaModal; 