'use client';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'react-query';
import { getBlogCategories, createBlog, updateBlog } from '@services/api';
import 'react-quill/dist/quill.snow.css';
import http from '@services/api/http';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Quill modules configuration
const quillModules = {
  toolbar: [
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image', 'video', 'formula'],
    ['clean']
  ]
};

function FileUpload({ file, onDrop, onRemove, loading, error, maxSize }) {
  const [isDragging, setIsDragging] = useState(false);
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
      onDrop({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleInputChange = (e) => {
    onDrop(e);
  };

  const handleBoxClick = () => {
    if (!loading) fileInputRef.current.click();
  };

  const getFileSize = (size) => {
    if (!size) return '';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={loading}
      />
      {!file ? (
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors min-h-[120px] cursor-pointer
            ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white'}
            ${error ? 'border-red-400 bg-red-50' : ''}
            ${loading ? 'opacity-50 pointer-events-none' : ''}
          `}
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-gray-500 text-sm">
            Drag & drop image or <span className="text-primary-500 font-semibold">click to upload</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Max {getFileSize(maxSize)}. Only images allowed.
          </p>
        </div>
      ) : (
        <div className="flex items-center border rounded-lg p-3 bg-gray-50 relative">
          <div className="w-20 h-20 rounded overflow-hidden flex items-center justify-center bg-gray-100 mr-4">
            <img
              src={file.url}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-700 truncate">
              {file.name || 'Image uploaded'}
            </div>
            <div className="text-xs text-gray-400">
              {getFileSize(file.size)}
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="ml-2 p-2 rounded-full hover:bg-red-100 text-red-600 transition"
            aria-label="Remove"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

const BlogForm = ({ initialData = null }) => {
  const router = useRouter();
  const [content, setContent] = useState(initialData?.content || '');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || null);
  const [ogImage, setOgImage] = useState(initialData?.ogImage || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingStatus, setSavingStatus] = useState('');
  const [showSeo, setShowSeo] = useState(false);
  const fileInputRef = useRef(null);
  const ogImageInputRef = useRef(null);
  
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
    defaultValues: initialData || {
      title: '',
      excerpt: '',
      categoryId: '',
      status: 'draft',
      // SEO fields
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      canonicalUrl: '',
      robots: 'index, follow'
    }
  });

  // Get blog categories
  const { data: categories, isLoading: loadingCategories } = useQuery('blogCategories', getBlogCategories);

  // Set up mutations
  const createMutation = useMutation(createBlog, {
    onSuccess: (data) => {
      setIsSubmitting(false);
      setSavingStatus('Blog post saved successfully!');
      router.push('/admin/blogs');
    },
    onError: (error) => {
      setIsSubmitting(false);
      setSavingStatus(`Error: ${error.message}`);
    }
  });

  const updateMutation = useMutation(updateBlog, {
    onSuccess: (data) => {
      setIsSubmitting(false);
      setSavingStatus('Blog post updated successfully!');
      router.push('/admin/blogs');
    },
    onError: (error) => {
      setIsSubmitting(false);
      setSavingStatus(`Error: ${error.message}`);
    }
  });

  useEffect(() => {
    // Reset form when initialData changes
    if (initialData) {
      reset(initialData);
      setContent(initialData.content || '');
      setFeaturedImage(initialData.featuredImage || null);
      setOgImage(initialData.ogImage || null);
    }
  }, [initialData, reset]);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      http.post('/uploadfile', formData)
        .then(({ data }) => {
          const imageObj = { _id: data._id, url: data.url };
          setFeaturedImage(imageObj);
          setValue('featuredImage', imageObj);
        })
        .catch(error => {
          console.error('Upload failed:', error);
        });
    }
  };

  const handleRemoveFile = () => {
    if (featuredImage && featuredImage._id) {
      http.delete(`/deletefile?fileName=${featuredImage._id}`)
        .then(() => {
          setFeaturedImage(null);
          setValue('featuredImage', null);
        })
        .catch(error => {
          console.error('Delete failed:', error);
        });
    }
  };

  const handleOgImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      http.post('/uploadfile', formData)
        .then(({ data }) => {
          const imageObj = { _id: data._id, url: data.url };
          setOgImage(imageObj);
          setValue('ogImage', imageObj);
        })
        .catch(error => {
          console.error('Upload failed:', error);
        });
    }
  };

  const handleRemoveOgImage = () => {
    if (ogImage && ogImage._id) {
      http.delete(`/deletefile?fileName=${ogImage._id}`)
        .then(() => {
          setOgImage(null);
          setValue('ogImage', null);
        })
        .catch(error => {
          console.error('Delete failed:', error);
        });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const onSubmit = (data) => {
    if (!content) {
      setSavingStatus('Content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setSavingStatus('Saving...');

    // Combine form data with content
    const blogData = {
      ...data,
      content
    };

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, ...blogData });
    } else {
      createMutation.mutate(blogData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
          
          {/* Title */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Title *</label>
            <input
              type="text"
              className={`w-full rounded-lg border-2 ${errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none`}
              placeholder="Enter blog title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Category *</label>
            <select
              className={`w-full rounded-lg border-2 ${errors.categoryId ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none`}
              {...register('categoryId', { required: 'Category is required' })}
            >
              <option value="">Select a category</option>
              {categories?.map(category => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Excerpt/Summary */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Excerpt/Summary</label>
            <textarea
              className="w-full h-24 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
              placeholder="Brief summary of the blog (optional)"
              {...register('excerpt')}
            />
            <p className="mt-1 text-xs text-gray-500">
              If left empty, an excerpt will be generated from the beginning of your content.
            </p>
          </div>

          {/* Featured Image */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Featured Image</label>
            <FileUpload
              file={featuredImage}
              onDrop={handleFileChange}
              onRemove={handleRemoveFile}
              loading={false}
              error={false}
              maxSize={5 * 1024 * 1024}
            />
            <input type="hidden" {...register('featuredImage')} />
          </div>

          {/* Rich Text Editor */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Content *</label>
            <div className={`custom-quill${!content && savingStatus.includes('Content cannot be empty') ? ' error' : ''}`}>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={handleContentChange}
                modules={quillModules}
                className="min-h-[300px]"
              />
            </div>
            {!content && savingStatus.includes('Content cannot be empty') && (
              <p className="mt-1 text-sm text-red-600">Content is required</p>
            )}
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700">Status</label>
            <select
              className="w-full rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
              {...register('status')}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* SEO Information Section */}
        <div className="mb-8 border-t pt-8">
          <button 
            type="button" 
            onClick={() => setShowSeo(!showSeo)}
            className="flex items-center text-gray-700 font-bold text-xl mb-4"
          >
            <span>SEO Settings</span>
            <svg 
              className={`w-5 h-5 ml-2 transition-transform ${showSeo ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showSeo && (
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              {/* Meta Title */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Meta Title</label>
                <input
                  type="text"
                  className="w-full rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                  placeholder="Meta title for SEO (defaults to blog title if empty)"
                  {...register('metaTitle')}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Recommended length: 50-60 characters
                </p>
              </div>
              
              {/* Meta Description */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Meta Description</label>
                <textarea
                  className="w-full h-24 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                  placeholder="Meta description for SEO (defaults to excerpt if empty)"
                  {...register('metaDescription')}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Recommended length: 150-160 characters
                </p>
              </div>
              
              {/* Meta Keywords */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Meta Keywords</label>
                <input
                  type="text"
                  className="w-full rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                  placeholder="Comma-separated keywords"
                  {...register('metaKeywords')}
                />
              </div>
              
              {/* Canonical URL */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Canonical URL</label>
                <input
                  type="text"
                  className="w-full rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                  placeholder="https://example.com/blog/canonical-url"
                  {...register('canonicalUrl')}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional: Use this to specify the preferred URL for SEO
                </p>
              </div>
              
              {/* Robots */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Robots Meta Tag</label>
                <select
                  className="w-full rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                  {...register('robots')}
                >
                  <option value="index, follow">index, follow</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="index, nofollow">index, nofollow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </select>
              </div>
              
              {/* OG Image */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Open Graph Image</label>
                <p className="mb-2 text-xs text-gray-500">
                  This image will be used when sharing on social media. If not provided, featured image will be used.
                </p>
                <FileUpload
                  file={ogImage}
                  onDrop={handleOgImageChange}
                  onRemove={handleRemoveOgImage}
                  loading={false}
                  error={false}
                  maxSize={5 * 1024 * 1024}
                />
                <input type="hidden" {...register('ogImage')} />
              </div>
            </div>
          )}
        </div>

        {/* Status message */}
        {savingStatus && (
          <div className={`mb-6 p-3 rounded ${savingStatus.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {savingStatus}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg px-5 py-2 font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            onClick={() => router.push('/admin/blogs')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg px-5 py-2 font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-all shadow"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Blog' : 'Create Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;