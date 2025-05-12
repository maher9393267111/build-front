'use client';
import { useState, useEffect, useCallback, Fragment } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAllMedia, deleteMedia, bulkDeleteMedia, uploadMediaFile } from '@services/api';
import http from '@services/api/http';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Icon from '@components/ui/Icon';
import { 
  TrashIcon, 
  PencilIcon, 
  CheckIcon, 
  CloudArrowUpIcon, 
  XMarkIcon, 
  PhotoIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ConfirmationModal from '@components/modal/ConfirmationModal';
import PaginationDynamic from '@components/elements/PaginationDynamic';
import { Dialog, Transition, Switch } from '@headlessui/react';
import Select from '@components/ui/Select';
import Textinput from '@components/ui/Textinput';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';

// Custom Headless UI Checkbox component
const HeadlessCheckbox = ({ checked, onChange, className = "" }) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`${
        checked ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-300'
      } relative inline-flex h-5 w-5 items-center justify-center rounded border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors ${className}`}
    >
      <span className="sr-only">Use setting</span>
      {checked && (
        <CheckIcon className="h-3 w-3 text-white" aria-hidden="true" />
      )}
    </Switch>
  );
};

const MediaGallery = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [page, setPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFiles, setUploadFiles] = useState([]);
  const pageSize = 10;

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Query for fetching media
  const { data, isLoading, error } = useQuery(
    ['media', page, selectedType, searchTerm],
    () => getAllMedia({ 
      page, 
      limit: pageSize, 
      type: selectedType || undefined,
      search: searchTerm || undefined
    }),
    {
      keepPreviousData: true,
    }
  );

  // Get only image items for lightbox - check different possible types
  const imageItems = data?.media?.filter(item => {
    // Check for different variations of image type
    const type = item.type?.toLowerCase();
    return type === 'image' || type === 'photo' || type === 'img' || item.url?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
  }) || [];
  
  const imageUrls = imageItems.map(item => item.url);

  console.log('ImageItems:', imageItems); // Debug log
  console.log('ImageUrls:', imageUrls); // Debug log

  // Mutations
  const deleteMutation = useMutation(
    (itemToDelete) => deleteMedia(itemToDelete.id, true),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['media']);
        toast.success('Media deleted successfully');
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      },
      onError: (error) => {
        console.error('Failed to delete media:', error);
        toast.error(error.response?.data?.message || 'Failed to delete media');
      }
    }
  );

  const bulkDeleteMutation = useMutation(
    (items) => bulkDeleteMedia(items.map(item => item.id)),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(['media']);
        toast.success(`${response.deletedIds.length} items deleted successfully`);
        setSelectedItems([]);
        setIsDeleteModalOpen(false);
      },
      onError: (error) => {
        console.error('Failed to delete selected media:', error);
        toast.error(error.response?.data?.message || 'Failed to delete selected media');
      }
    }
  );

  const uploadMutation = useMutation(
    (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('addToMediaLibrary', 'true');
      formData.append('setAsInUse', 'false');
      
      return http.post("/uploadfile", formData, {
        onUploadProgress: (progressEvent) => {
          const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`${file.name}: ${percentComplete}%`);
          // Update upload progress
          setUploadProgress(prevProgress => Math.max(prevProgress, percentComplete));
        }
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['media']);
        toast.success('Media uploaded successfully');
        setIsUploading(false);
        setUploadProgress(0);
        setUploadFiles([]);
      },
      onError: (error) => {
        console.error('Failed to upload media:', error);
        toast.error('Failed to upload media');
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  );

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || (data && newPage > data.pagination.totalPages)) return;
    setPage(newPage);
  };

  // Handle search debounce
  const [searchTimeout, setSearchTimeout] = useState(null);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    setSearchTimeout(setTimeout(() => {
      setPage(1); // Reset to first page when searching
    }, 500));
  };

  // Handle selection
  const toggleItemSelection = (item) => {
    if (selectedItems.some(selectedItem => selectedItem.id === item.id)) {
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const selectAllItems = () => {
    if (data?.media && data.media.length > 0) {
      if (selectedItems.length === data.media.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems([...data.media]);
      }
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadFiles(Array.from(files));
    setIsUploading(true);
    setUploadProgress(0);
    
    // Upload each file
    Array.from(files).forEach(file => {
      uploadMutation.mutate(file);
    });
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    setUploadFiles(Array.from(files));
    setIsUploading(true);
    setUploadProgress(0);
    
    // Upload each file
    Array.from(files).forEach(file => {
      uploadMutation.mutate(file);
    });
  };

  // Handle delete
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedItems.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete);
    } else if (selectedItems.length > 0) {
      bulkDeleteMutation.mutate(selectedItems);
    }
  };

  // Lightbox functions
  const openLightbox = useCallback((item) => {
    console.log('Opening lightbox for item:', item); // Debug log
    
    // Check for different variations of image type
    const type = item.type?.toLowerCase();
    const isImage = type === 'image' || type === 'photo' || type === 'img' || item.url?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
    
    if (!isImage) {
      console.log('Item is not an image:', item); // Debug log
      return;
    }
    
    const imageIndex = imageItems.findIndex(imgItem => imgItem.id === item.id);
    console.log('Image index found:', imageIndex); // Debug log
    
    if (imageIndex >= 0) {
      setPhotoIndex(imageIndex);
      setIsLightboxOpen(true);
      console.log('Lightbox opened with index:', imageIndex); // Debug log
    }
  }, [imageItems]);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    console.log('Lightbox closed'); // Debug log
  }, []);

  // Handle image click with proper event handling
  const handleImageClick = useCallback((item, e) => {
    // Prevent event bubbling to parent elements
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('Image clicked:', item); // Debug log
    openLightbox(item);
  }, [openLightbox]);

  // Prevent checkbox click from triggering image click
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
  };

  // Pagination component
  const renderPagination = () => {
    if (!data || data.pagination.totalPages <= 1) return null;
    
    return (
      <div className="mt-6">
        <PaginationDynamic 
          currentPage={page} 
          totalPages={data.pagination.totalPages} 
          onPageChange={handlePageChange} 
        />
      </div>
    );
  };

  // Empty state component
  const EmptyState = () => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-10 text-center border border-gray-200 shadow-sm">
      <div className="bg-white p-6 rounded-full inline-block mb-4 shadow-sm">
        <PhotoIcon className="w-16 h-16 text-primary-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Media Library Is Empty</h2>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        Upload photos, videos, and documents to build your media library.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => document.getElementById('fileInput').click()}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <CloudArrowUpIcon className="w-5 h-5" />
          Upload Media
        </button>
      </div>
    </div>
  );

  // Loading component
  const Loader = () => (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <PhotoIcon className="h-10 w-10 text-primary-600" />
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm max-w-4xl mx-auto my-8">
        <div className="flex items-center gap-3">
          <ExclamationTriangleIcon className="w-6 h-6" />
          <p>Error loading media gallery: {error.message || 'Failed to load media items'}</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="shadow-md border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
          <h4 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Icon icon="Photo" className="h-7 w-7 text-primary-500" />
            Media Gallery
          </h4>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsGridView(!isGridView)}
              className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shadow-sm"
              title={isGridView ? 'Switch to list view' : 'Switch to grid view'}
            >
              <Icon icon={isGridView ? 'Bars3' : 'Squares2X2'} className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-1 space-x-3">
            <div className="relative flex-1 max-w-md">
              <Textinput
                type="text"
                className="form-input w-full pl-11 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-300 shadow-sm transition-all"
                placeholder="Search media..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Icon
                icon="Search"
                className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
              />
            </div>
            <Select
              name="mediaType"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPage(1);
              }}
              options={[
                { value: "", label: "All types" },
                { value: "image", label: "Images" },
                { value: "video", label: "Videos" },
                { value: "document", label: "Documents" },
                { value: "audio", label: "Audio" }
              ]}
              className="min-w-[150px]"
            />
          </div>
          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDeleteClick}
              className="flex items-center px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm"
              disabled={bulkDeleteMutation.isLoading}
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete Selected ({selectedItems.length})
            </button>
          )}
        </div>

        {/* Drag and drop area */}
        <div
          className={`border-3 border-dashed rounded-xl p-8 mb-6 text-center transition-colors cursor-pointer hover:bg-gray-50 ${
            isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mx-auto bg-white p-4 rounded-full shadow-sm inline-block mb-3">
            <CloudArrowUpIcon className="h-12 w-12 text-primary-500" />
          </div>
          <p className="text-gray-700 mb-2 font-medium">
            Drag and drop media files here or <span className="text-primary-600">click to browse</span>
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG, GIF, MP4, PDF, DOCX • Max 5MB per file
          </p>
          <label className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-sm cursor-pointer">
            Browse Files
            <input
              type="file"
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.docx,.xlsx"
              multiple
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Uploading {uploadFiles.length} {uploadFiles.length === 1 ? 'file' : 'files'}...
              </span>
              <span className="text-sm text-primary-600 font-bold">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && <Loader />}

        {/* Empty state */}
        {!isLoading && data?.media && data.media.length === 0 && <EmptyState />}

        {/* Media grid */}
        {!isLoading && data?.media && data.media.length > 0 && (
          <>
            {/* Select all header */}
            <div className="flex items-center mb-4 px-2 bg-gray-50 py-3 rounded-lg">
              <div className="flex items-center">
                <HeadlessCheckbox
                  checked={data?.media?.length > 0 && selectedItems.length === data?.media?.length}
                  onChange={selectAllItems}
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {selectedItems.length === 0
                    ? 'Select all'
                    : selectedItems.length === data?.media?.length
                    ? 'Deselect all'
                    : `${selectedItems.length} selected`}
                </span>
              </div>
              <div className="ml-auto text-sm text-gray-500">
                {data?.pagination?.total} items
              </div>
            </div>

            {isGridView ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {data.media.map((item) => (
                  <div 
                    key={item.id} 
                    className={`relative group border rounded-xl overflow-hidden transition duration-300 hover:shadow-lg ${
                      selectedItems.some(selected => selected.id === item.id)
                        ? 'ring-2 ring-primary-500 border-primary-300'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="absolute top-2 left-2 z-20" onClick={handleCheckboxClick}>
                      <HeadlessCheckbox
                        checked={selectedItems.some(selected => selected.id === item.id)}
                        onChange={() => toggleItemSelection(item)}
                      />
                    </div>
                    
                    {/* Media preview */}
                    <div 
                      className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
                      onClick={(e) => handleImageClick(item, e)}
                    >
                      {item.type === 'image' ? (
                        <div className="relative w-full h-full">
                          <img
                            src={item.url}
                            alt={item.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                          />
                          {/* View overlay for images */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                              <EyeIcon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 p-4 flex flex-col items-center justify-center h-full w-full">
                          <Icon icon="Document" className="h-12 w-12 mb-2" />
                          <span className="text-xs text-center text-gray-500">{item.type}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Media info */}
                    <div className="p-3 bg-white">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {item.name || item.originalName || 'Unnamed file'}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString('en-US', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Hover actions */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity flex items-center justify-center pointer-events-none">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(item);
                          }}
                          className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-lg"
                          title="Delete item"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List view
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-12 py-3 px-6 text-left">
                        <HeadlessCheckbox
                          checked={data?.media?.length > 0 && selectedItems.length === data?.media?.length}
                          onChange={selectAllItems}
                        />
                      </th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.media.map((item) => (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-gray-50 transition-colors ${selectedItems.some(selected => selected.id === item.id) ? 'bg-primary-50' : ''}`}
                      >
                        <td className="py-4 px-6" onClick={handleCheckboxClick}>
                          <HeadlessCheckbox
                            checked={selectedItems.some(selected => selected.id === item.id)}
                            onChange={() => toggleItemSelection(item)}
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div 
                            className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer"
                            onClick={(e) => handleImageClick(item, e)}
                          >
                            {item.type === 'image' ? (
                              <div className="relative w-full h-full group">
                                <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                  <EyeIcon className="h-5 w-5 text-white" />
                                </div>
                              </div>
                            ) : (
                              <Icon icon="Document" className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 max-w-xs truncate font-medium">
                          {item.name || item.originalName || 'Unnamed file'}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 text-xs rounded-full bg-gray-100 font-medium">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString('en-US', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {item.size ? `${Math.round(item.size / 1024)} KB` : '-'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!isLoading && renderPagination()}
      </Card>

      {/* Lightbox for images */}
      {isLightboxOpen && imageUrls.length > 0 && (
        <Lightbox
          mainSrc={imageUrls[photoIndex]}
          nextSrc={imageUrls[(photoIndex + 1) % imageUrls.length]}
          prevSrc={imageUrls[(photoIndex + imageUrls.length - 1) % imageUrls.length]}
          onCloseRequest={closeLightbox}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + imageUrls.length - 1) % imageUrls.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % imageUrls.length)}
          imageCaption={imageItems[photoIndex]?.name || imageItems[photoIndex]?.originalName || ''}
          imageTitle={`${photoIndex + 1} of ${imageUrls.length}`}
        />
      )}

      {/* Delete confirmation modal - replaced with headlessUI Dialog */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-5">
                    <TrashIcon className="h-8 w-8 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="text-center">
                    <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900 mb-2">
                      {itemToDelete
                        ? 'Delete Media Item'
                        : `Delete ${selectedItems.length} Selected Items`}
                    </Dialog.Title>
                    <p className="text-gray-600 mb-6">
                      {itemToDelete
                        ? 'Are you sure you want to delete this media item? This action cannot be undone.'
                        : `Are you sure you want to delete ${selectedItems.length} selected items? This action cannot be undone.`}
                    </p>
                  </div>
                  
                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDeleteModalOpen(false);
                        setItemToDelete(null);
                      }}
                      className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmDelete}
                      disabled={deleteMutation.isLoading || bulkDeleteMutation.isLoading}
                      className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition shadow-sm font-medium"
                    >
                      {deleteMutation.isLoading || bulkDeleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                    </button>
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

export default MediaGallery;