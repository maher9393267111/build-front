import { useState, useRef } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Button from './Button';
import MediaModal from '@components/modal/MediaModal';


const MediaUpload = ({
  file,
  onDrop,
  onRemove,
  loading,
  error,
  maxSize,
  identifier,
  label = "Image",
  helperText,
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const event = { target: { files: e.dataTransfer.files } };
      onDrop(event, identifier);
    }
  };

  const handleInputChange = (e) => {
    onDrop(e, identifier);
  };

  const handleBoxClick = () => {
    if (!loading) fileInputRef.current.click();
  };

  const getFileSize = (size) => {
    if (!size) return "";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleMediaSelect = (mediaItem) => {
    // Convert the media item to the format expected by the parent component
    const fileData = {
      _id: mediaItem.fileId,
      url: mediaItem.url,
      name: mediaItem.name || mediaItem.originalName,
      size: mediaItem.size,
      fromMediaLibrary: true,
      mediaId: mediaItem.id
    };
    
    // Call the parent component's onDrop function with a fabricated event
    const mockEvent = {
      mediaLibraryFile: fileData
    };
    
    onDrop(mockEvent, identifier);
    setIsMediaModalOpen(false);
  };

  const fileUrl = file?.url || null;
  const fileSize = file?.size || 0;
  const fileName = file?.name || "Uploaded Image";
  const isFromLibrary = file?.fromMediaLibrary || false;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-xs font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => setIsMediaModalOpen(true)}
          className="text-xs text-primary-600 hover:text-primary-800 font-medium"
        >
          Select from Media Library
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={loading}
      />
      
      {!fileUrl ? (
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors min-h-[100px] cursor-pointer
            ${
              isDragging
                ? "border-primary-500 bg-primary-50"
                : "border-gray-300 bg-white"
            }
            ${error ? "border-red-400 bg-red-50" : ""}
            ${loading ? "opacity-50 pointer-events-none" : ""}
          `}
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-gray-500 text-xs text-center">
            Drag & drop or{" "}
            <span className="text-primary-500 font-semibold">
              click to upload
            </span>
          </p>
          {maxSize && (
            <p className="text-xs text-gray-400 mt-1">
              Max {getFileSize(maxSize)}.
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center border rounded-lg p-2 bg-gray-50 relative">
          <div className="w-16 h-16 rounded overflow-hidden flex items-center justify-center bg-gray-100 mr-3">
            <img
              src={fileUrl}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-medium text-gray-700 text-sm truncate">
              {fileName}
            </div>
            {fileSize > 0 && (
              <div className="text-xs text-gray-400">
                {getFileSize(fileSize)}
              </div>
            )}
            {isFromLibrary && (
              <div className="text-xs text-primary-600">
                From Media Library
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(identifier, isFromLibrary)}
            className="ml-2 p-1.5 rounded-full hover:bg-red-100 text-red-600 transition absolute top-1 right-1"
            aria-label="Remove"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
      
      <MediaModal
        open={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
        title={`Select ${label}`}
        accept="image/*"
      />
    </div>
  );
};

export default MediaUpload; 