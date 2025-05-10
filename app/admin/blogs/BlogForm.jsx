'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'react-query';
import { getBlogCategories, createBlog, updateBlog } from '@services/api';
import 'react-quill/dist/quill.snow.css';
import http from '@services/api/http';
import { toast } from 'react-toastify';
import { XMarkIcon, PhotoIcon, SparklesIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import MediaUpload from '@components/ui/MediaUpload';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import Textinput from '@components/ui/TextinputBlog';
import Textarea from '@components/ui/TextareaBlog';
import Select from '@components/ui/SelectBlog';
import BlogSeoDashboard from '@components/SEO/Blog/BlogSeoDashboard';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Custom CSS styles for the sticky header
const stickyToolbarStyles = `
  .quill-container {
    position: relative;
  }
  .quill-container .ql-toolbar {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  .ql-container {
    border-bottom-left-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }
  /* Prevent empty anchor scrolling */
  .ql-editor h1[id=""], .ql-editor h2[id=""], .ql-editor h3[id=""], 
  .ql-editor h4[id=""], .ql-editor h5[id=""], .ql-editor h6[id=""] {
    scroll-margin-top: 80px;
  }
  
  /* Disable default header anchor behavior */
  .ql-editor h1, .ql-editor h2, .ql-editor h3, 
  .ql-editor h4, .ql-editor h5, .ql-editor h6 {
    scroll-behavior: auto !important;
  }
  
  /* Override Quill's default scrolling behavior for pickers */
  .ql-picker.ql-expanded .ql-picker-options {
    position: absolute !important;
    top: 100% !important;
    z-index: 50 !important;
  }
`;

// Quill modules configuration (standard, no custom handlers here)
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
  const [uploadStates, setUploadStates] = useState({});
  const [activeTab, setActiveTab] = useState('main'); // 'main', 'seo', or 'preview'
  
  // Content generation states
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [contentType, setContentType] = useState('full'); // 'full', 'intro', 'section', 'conclusion'
  const [showContentModal, setShowContentModal] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [generationTone, setGenerationTone] = useState('professional');
  
  const quillRef = useRef(null);
  const quillEditorRef = useRef(null);
  
  console.log('initialDataXXX', initialData)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm({
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
      robots: 'index, follow',
    },
  });

  // Format blog data for SEO analysis
  const getBlogDataForSeo = () => {
    const values = getValues();
 

    return {
      title: values.title || '',
      metaTitle: values.metaTitle || values.title || '',
      description: values.metaDescription || values.excerpt || '',
      slug: values.slug || '',
      metaKeywords: values.metaKeywords || '',
      robots: values.robots || 'index, follow',
      ogImage: ogImage,
      contentType: 'blog',
      category: values.categoryId, // Keep categoryId if needed elsewhere
      categoryName: values.category?.name, // Add category name here
    };
  };

  // Handle SEO suggestions
  const handleSeoSuggestions = (seoData) => {
    if (!seoData) return;
    
    // Handle applied suggestions
    if (seoData.applySuggestion) {
      // Prevent any form submission
      if (seoData.preventDefault) {
        seoData.preventDefault();
      }
      
      const { type, value } = seoData;
      
      // Apply the suggestion based on type
      switch(type) {
        case 'title':
          setValue('metaTitle', value);
          toast.success('Title suggestion applied successfully');
          break;
        case 'metaDescription':
          setValue('metaDescription', value);
          toast.success('Meta description suggestion applied successfully');
          break;
        case 'keywords':
          setValue('metaKeywords', value);
          toast.success('Keywords applied successfully');
          break;
        default:
          break;
      }
      return;
    }
    
    // Update form with SEO suggestions
    const updates = {};
    
    if (seoData.analysis?.titleSuggestion && !getValues('metaTitle')) {
      updates.metaTitle = seoData.analysis.titleSuggestion;
    }
    
    if (seoData.analysis?.metaDescriptionSuggestions?.[0] && !getValues('metaDescription')) {
      updates.metaDescription = seoData.analysis.metaDescriptionSuggestions[0];
    }
    
    if (seoData.analysis?.recommendedKeywords?.length > 0 && !getValues('metaKeywords')) {
      updates.metaKeywords = seoData.analysis.recommendedKeywords.join(', ');
    }
    
    if (Object.keys(updates).length > 0) {
      // Update form values
      Object.entries(updates).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  };

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

  useEffect(() => {
    // Handle clicking on toolbar buttons to prevent unwanted scrolling
    const handleToolbarClick = (e) => {
      if (e.target.closest('.ql-toolbar')) {
        // Prevent default behavior for toolbar items
        setTimeout(() => {
          // Remove any empty hash from URL to prevent scrolling
          if (window.location.hash === '#') {
            history.pushState('', document.title, window.location.pathname + window.location.search);
          }
        }, 10);
      }
    };
    
    document.addEventListener('click', handleToolbarClick);
    
    return () => {
      document.removeEventListener('click', handleToolbarClick);
    };
  }, []);

  // This useCallback will contain the logic to fix the scroll issue
  const setupQuillEventHandlers = useCallback((quill) => {
    if (!quill) {
      console.warn("Quill instance not provided to setupQuillEventHandlers");
      return;
    }

    const toolbar = quill.getModule('toolbar');
    if (!toolbar || !toolbar.container) {
      console.warn("Quill toolbar or its container not found.");
      return;
    }
    
    // Monkey patch Quill's functionality to prevent scroll jumps
    // This is a direct intervention to stop the scrolling behavior
    const originalSetSelection = quill.setSelection;
    quill.setSelection = function() {
      // Save scroll position
      const scrollTop = quill.scrollingContainer?.scrollTop || 0;
      
      // Call original method
      const result = originalSetSelection.apply(this, arguments);
      
      // Restore scroll position
      if (quill.scrollingContainer) {
        quill.scrollingContainer.scrollTop = scrollTop;
      }
      
      return result;
    };
    
    // Store scroll position and selection for all toolbar interactions
    const toolbarContainer = toolbar.container;
    let lastScrollPosition = 0;
    let lastSelection = null;
    let isPickerAction = false;
    
    // Special handler for pickers (font size, headers, etc.)
    const handlePickerOpen = () => {
      if (quill.scrollingContainer) {
        lastScrollPosition = quill.scrollingContainer.scrollTop;
        lastSelection = quill.getSelection();
        isPickerAction = true;
      }
    };
    
    const handlePickerSelect = () => {
      if (!isPickerAction) return;
      
      // Use RAF to ensure this happens after Quill processes the change
      requestAnimationFrame(() => {
        if (quill.scrollingContainer) {
          quill.scrollingContainer.scrollTop = lastScrollPosition;
          
          // Re-focus and restore selection
          quill.focus();
          if (lastSelection) {
            quill.setSelection(lastSelection.index, lastSelection.length, 'silent');
          }
        }
        isPickerAction = false;
      });
    };
    
    // Capture all picker interactions
    toolbarContainer.querySelectorAll('.ql-picker').forEach(picker => {
      // Capture when a picker is opened
      picker.addEventListener('mousedown', handlePickerOpen, true);
      
      // Capture when an option is selected
      picker.querySelectorAll('.ql-picker-item').forEach(item => {
        item.addEventListener('click', handlePickerSelect, true);
      });
      
      // Also handle direct label clicks (like headings that apply on click)
      picker.querySelector('.ql-picker-label')?.addEventListener('click', handlePickerSelect, true);
    });
    
    // Handle direct selections for toolbar buttons (bold, italic, etc.)
    toolbarContainer.querySelectorAll('button:not(.ql-picker-label)').forEach(button => {
      button.addEventListener('mousedown', () => {
        if (quill.scrollingContainer) {
          lastScrollPosition = quill.scrollingContainer.scrollTop;
        }
      }, true);
      
      button.addEventListener('click', () => {
        // Restore scroll position after click
        requestAnimationFrame(() => {
          if (quill.scrollingContainer) {
            quill.scrollingContainer.scrollTop = lastScrollPosition;
            quill.focus();
          }
        });
      }, true);
    });
    
    // Prevent scroll position loss when formatting is applied
    quill.on('editor-change', function() {
      // Remove empty hash from URL to prevent scrolling
      if (window.location.hash === '#') {
        history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    });
    
    // Override Quill's built-in scrolling for header anchors
    const originalHistory = window.history.pushState;
    window.history.pushState = function() {
      // Check if it's a link to an anchor
      if (arguments[2] && arguments[2].includes('#')) {
        // Prevent automatic scrolling to the anchor
        arguments[2] = window.location.pathname + window.location.search;
      }
      return originalHistory.apply(this, arguments);
    };
    
    // Observe for any href/anchor changes in the document
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
          // If an ID was added to a header, prevent automatic scrolling
          if (mutation.target.tagName && /^H[1-6]$/.test(mutation.target.tagName)) {
            const scrollPos = quill.scrollingContainer?.scrollTop || 0;
            setTimeout(() => {
              if (quill.scrollingContainer) {
                quill.scrollingContainer.scrollTop = scrollPos;
              }
            }, 0);
          }
        }
      });
    });
    
    // Start observing the editor for ID attribute changes
    observer.observe(quill.root, {
      attributes: true,
      subtree: true,
      attributeFilter: ['id']
    });
    
    // Store the observer in the ref for cleanup
    quill.mutationObserver = observer;

  }, []); // No dependencies needed

  // Effect to set up handlers once the Quill instance is available
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      if (editor && editor !== quillEditorRef.current) {
        quillEditorRef.current = editor;
        setupQuillEventHandlers(editor);
      }
    }
    
    return () => {
      if (quillEditorRef.current) {
        const quill = quillEditorRef.current;
        // Clean up the mutation observer
        if (quill.mutationObserver) {
          quill.mutationObserver.disconnect();
        }
        
        // Restore original history.pushState if we modified it
        if (window.history._originalPushState) {
          window.history.pushState = window.history._originalPushState;
        }
      }
    };
  }, [setupQuillEventHandlers]);

  // Update the handleContentChange to ensure it doesn't cause scroll jumps
  const handleContentChange = (value) => {
    const editor = quillEditorRef.current;
    const scrollTop = editor?.scrollingContainer?.scrollTop || 0;
    const selection = editor?.getSelection() || null;
    
    setContent(value);
    
    // Restore position after state update
    if (editor && editor.scrollingContainer) {
      requestAnimationFrame(() => {
        editor.scrollingContainer.scrollTop = scrollTop;
        if (selection) {
          editor.setSelection(selection.index, selection.length, 'silent');
        }
      });
    }
  };

  // AI Content Generation functions
  const generateBlogContent = async () => {
    setIsGeneratingContent(true);
    
    try {
      const formValues = getValues();
      
      const payload = {
        title: formValues.title,
        description: formValues.excerpt || formValues.metaDescription,
        keywords: formValues.metaKeywords,
        category: categories?.find(c => c.id.toString() === formValues.categoryId)?.name,
        contentType: contentType,
        tone: generationTone,
        customPrompt: generationPrompt || undefined,
        existingContent: content || undefined,
      };
      
      // Make API call to generate content
      const { data } = await http.post('/generate-blog-content', payload);
      
      if (data && data.generatedContent) {
        setGeneratedContent(data.generatedContent);
        setShowContentModal(true);
      } else {
        throw new Error('No content generated');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setSavingStatus(`Error generating content: ${error.message}`);
    } finally {
      setIsGeneratingContent(false);
    }
  };
  
  const applyGeneratedContent = () => {
    if (!generatedContent) return;
    
    // Apply based on content type
    if (contentType === 'full') {
      setContent(generatedContent);
    } else if (contentType === 'intro') {
      setContent(generatedContent + content);
    } else if (contentType === 'conclusion') {
      setContent(content + generatedContent);
    } else if (contentType === 'section') {
      // Insert at cursor position or append if not possible
      setContent(content + "\n\n" + generatedContent);
    }
    
    setShowContentModal(false);
    setGeneratedContent(null);
  };

  const handleFeaturedImageUpload = async (e, identifier) => {
    if (!identifier) return;
    const uploadKey = `featured-image`;

    // Handle media library selection
    if (e.mediaLibraryFile) {
      const mediaFile = e.mediaLibraryFile;
      setFeaturedImage({
        _id: mediaFile._id,
        url: mediaFile.url,
        fromMediaLibrary: true,
        mediaId: mediaFile.mediaId,
      });
      setValue('featuredImage', {
        _id: mediaFile._id,
        url: mediaFile.url,
        fromMediaLibrary: true,
        mediaId: mediaFile.mediaId,
      });
      return;
    }

    const file = e.target?.files?.[0];
    if (!file) return;

    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: true, error: null },
    }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('addToMediaLibrary', 'true');
    formData.append('setAsInUse', 'true');

    try {
      const { data } = await http.post('/uploadfile', formData);
      const imageObj = {
        _id: data._id,
        url: data.url,
        fromMediaLibrary: data.fromMediaLibrary || false,
        mediaId: data.mediaId,
      };
      setFeaturedImage(imageObj);
      setValue('featuredImage', imageObj);
      setUploadStates((prev) => ({
        ...prev,
        [uploadKey]: { loading: false, error: null },
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage =
        error.response?.data?.error || 'Failed to upload image.';
      setUploadStates((prev) => ({
        ...prev,
        [uploadKey]: { loading: false, error: errorMessage },
      }));
    }
  };

  const handleRemoveFeaturedImage = async (identifier, isFromLibrary = false) => {
    const uploadKey = `featured-image`;
    
    if (featuredImage && featuredImage._id && !isFromLibrary && !featuredImage.fromMediaLibrary) {
      try {
        await http.delete(`/deletefile?fileName=${featuredImage._id}`);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
    
    setFeaturedImage(null);
    setValue('featuredImage', null);
    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: false, error: null },
    }));
  };

  const handleOgImageUpload = async (e, identifier) => {
    if (!identifier) return;
    const uploadKey = `og-image`;

    // Handle media library selection
    if (e.mediaLibraryFile) {
      const mediaFile = e.mediaLibraryFile;
      setOgImage({
        _id: mediaFile._id,
        url: mediaFile.url,
        fromMediaLibrary: true,
        mediaId: mediaFile.mediaId,
      });
      setValue('ogImage', {
        _id: mediaFile._id,
        url: mediaFile.url,
        fromMediaLibrary: true,
        mediaId: mediaFile.mediaId,
      });
      return;
    }

    const file = e.target?.files?.[0];
    if (!file) return;

    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: true, error: null },
    }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('addToMediaLibrary', 'true');
    formData.append('setAsInUse', 'true');

    try {
      const { data } = await http.post('/uploadfile', formData);
      const imageObj = {
        _id: data._id,
        url: data.url,
        fromMediaLibrary: data.fromMediaLibrary || false,
        mediaId: data.mediaId,
      };
      setOgImage(imageObj);
      setValue('ogImage', imageObj);
      setUploadStates((prev) => ({
        ...prev,
        [uploadKey]: { loading: false, error: null },
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage =
        error.response?.data?.error || 'Failed to upload image.';
      setUploadStates((prev) => ({
        ...prev,
        [uploadKey]: { loading: false, error: errorMessage },
      }));
    }
  };

  const handleRemoveOgImage = async (identifier, isFromLibrary = false) => {
    const uploadKey = `og-image`;
    
    if (ogImage && ogImage._id && !isFromLibrary && !ogImage.fromMediaLibrary) {
      try {
        await http.delete(`/deletefile?fileName=${ogImage._id}`);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
    
    setOgImage(null);
    setValue('ogImage', null);
    setUploadStates((prev) => ({
      ...prev,
      [uploadKey]: { loading: false, error: null },
    }));
  };

  const onSubmit = (data) => {
    if (!content) {
      setSavingStatus('Content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setSavingStatus('Saving...');

    // Create a slug from the title if it doesn't exist
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }

    // Combine form data with content
    const blogData = {
      ...data,
      content,
    };

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, ...blogData });
    } else {
      createMutation.mutate(blogData);
    }
  };

  // Strip HTML tags from content for plain text analysis
  const getPlainTextContent = () => {
    if (!content) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    return tempDiv.textContent || '';
  };

  useEffect(() => {
    // Prevent hash-based scrolling
    const handleHashChange = () => {
      if (window.location.hash === '#') {
        setTimeout(() => {
          history.pushState('', document.title, window.location.pathname + window.location.search);
        }, 0);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial cleanup of any empty hash
    if (window.location.hash === '#') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="flex flex-col space-y-6">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-3 px-6 font-medium text-sm focus:outline-none ${
            activeTab === 'main'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('main')}
        >
          Blog Content
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm focus:outline-none ${
            activeTab === 'seo'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('seo')}
        >
          SEO & Optimization
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm focus:outline-none ${
            activeTab === 'preview'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {activeTab === 'main' && (
          <div className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-xl rounded-xl">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Blog Information</h2>
                
                {/* Title */}
                <div className="mb-6">
                  <Textinput
                    label="Title"
                    name="title"
                    placeholder="Enter blog title"
                    required
                    error={errors.title?.message}
                    {...register('title', { required: 'Title is required' })}
                  />
                </div>

                {/* Category */}
                <div className="mb-6">
                  <Select
                    label="Category"
                    name="categoryId"
                    required
                    error={errors.categoryId?.message}
                    {...register('categoryId', { required: 'Category is required' })}
                  >
                    <option value="">Select a category</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Excerpt/Summary */}
                <div className="mb-6">
                  <Textarea
                    label="Excerpt/Summary"
                    name="excerpt"
                    placeholder="Brief summary of the blog (optional)"
                    rows={3}
                    helperText="If left empty, an excerpt will be generated from the beginning of your content."
                    {...register('excerpt')}
                  />
                </div>

                {/* Featured Image */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Image
                  </label>
                  <MediaUpload
                    file={featuredImage}
                    onDrop={(e) => handleFeaturedImageUpload(e, 'featuredImage')}
                    onRemove={() => handleRemoveFeaturedImage('featuredImage', featuredImage?.fromMediaLibrary)}
                    loading={uploadStates['featured-image']?.loading}
                    error={uploadStates['featured-image']?.error}
                    identifier='featuredImage'
                    helperText="Featured image for your blog post"
                  />
                </div>

                {/* AI Content Generation Card */}
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <SparklesIcon className="h-6 w-6 text-indigo-600 mr-2" />
                      <h3 className="text-md font-semibold text-indigo-800">AI Content Generation</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content Type
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={contentType}
                          onChange={(e) => setContentType(e.target.value)}
                        >
                          <option value="full">Full Blog Post</option>
                          <option value="intro">Introduction</option>
                          <option value="section">Blog Section</option>
                          <option value="conclusion">Conclusion</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Writing Tone
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={generationTone}
                          onChange={(e) => setGenerationTone(e.target.value)}
                        >
                          <option value="professional">Professional</option>
                          <option value="conversational">Conversational</option>
                          <option value="authoritative">Authoritative</option>
                          <option value="friendly">Friendly</option>
                          <option value="educational">Educational</option>
                        </select>
                      </div>
                      
                      <div className="flex items-end">
                        <Button
                          text={isGeneratingContent ? "Generating..." : "Generate Content"}
                          className="btn-primary bg-gradient-to-r from-indigo-500 to-purple-600 w-full"
                          icon="Sparkles"
                          onClick={generateBlogContent}
                          disabled={isGeneratingContent || !watch('title')}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Prompt (Optional)
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Add specific instructions for the AI content generation"
                        rows={2}
                        value={generationPrompt}
                        onChange={(e) => setGenerationPrompt(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Rich Text Editor */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <style jsx>{stickyToolbarStyles}</style>
                  <div
                    className={`custom-quill quill-container${
                      !content && savingStatus.includes('Content cannot be empty')
                        ? ' border-2 border-red-300'
                        : ''
                    }`}
                  >
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={content}
                      onChange={handleContentChange}
                      modules={quillModules}
                      className="min-h-[400px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                          e.preventDefault(); 
                        }
                      }}
                      scrollingContainer="self"
                      preserveWhitespace={true}
                    />
                  </div>
                  {!content && savingStatus.includes('Content cannot be empty') && (
                    <p className="mt-1 text-sm text-red-600">Content is required</p>
                  )}
                </div>

                {/* Status */}
                <div className="mb-6">
                  <Select
                    label="Status"
                    name="status"
                    {...register('status')}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </Select>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-xl rounded-xl mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">SEO Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Textinput
                    label="Meta Title"
                    name="metaTitle"
                    placeholder="Meta title for SEO (defaults to blog title if empty)"
                    helperText="Recommended length: 50-60 characters"
                    {...register('metaTitle')}
                  />
                  
                  <Textinput
                    label="Canonical URL"
                    name="canonicalUrl"
                    placeholder="https://example.com/blog/canonical-url"
                    helperText="Optional: Use this to specify the preferred URL for SEO"
                    {...register('canonicalUrl')}
                  />
                </div>
                
                <div className="mb-6">
                  <Textarea
                    label="Meta Description"
                    name="metaDescription"
                    placeholder="Meta description for SEO (defaults to excerpt if empty)"
                    rows={3}
                    helperText="Recommended length: 150-160 characters"
                    {...register('metaDescription')}
                  />
                </div>
                
                <div className="mb-6">
                  <Textinput
                    label="Meta Keywords"
                    name="metaKeywords"
                    placeholder="Comma-separated keywords"
                    {...register('metaKeywords')}
                  />
                </div>
                
                <div className="mb-6">
                  <Select
                    label="Robots Meta Tag"
                    name="robots"
                    {...register('robots')}
                  >
                    <option value="index, follow">index, follow</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </Select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Open Graph Image
                  </label>
                  <p className="mb-2 text-xs text-gray-500">
                    This image will be used when sharing on social media. If not provided, featured image will be used.
                  </p>
                  <MediaUpload
                    file={ogImage}
                    onDrop={(e) => handleOgImageUpload(e, 'ogImage')}
                    onRemove={() => handleRemoveOgImage('ogImage', ogImage?.fromMediaLibrary)}
                    loading={uploadStates['og-image']?.loading}
                    error={uploadStates['og-image']?.error}
                    identifier='ogImage'
                    helperText="Recommended size: 1200x630px"
                  />
                </div>
              </div>
            </Card>
            
            {/* SEO Analysis Dashboard */}
            <BlogSeoDashboard
              pageData={getBlogDataForSeo()}
              content={getPlainTextContent()}
              onUpdateSuggestions={handleSeoSuggestions}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-xl rounded-xl">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Blog Preview</h2>
                
                <div className="border rounded-lg overflow-hidden">
                  {featuredImage && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={featuredImage.url} 
                        alt={watch('title') || 'Blog featured image'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {watch('title') || 'Blog Title'}
                    </h1>
                    
                    <div className="text-sm text-gray-500 mb-4">
                      Category: {categories?.find(c => c.id.toString() === watch('categoryId'))?.name || initialData?.category?.name}
                      {' · '}
                      Status: <span className={`${watch('status') === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                        {watch('status') === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    
                    <div className="text-gray-700 mb-4">
                      {watch('excerpt') || 'No excerpt provided'}
                    </div>
                    
                    <div className="prose max-w-none border-t pt-4 mt-4">
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Status message */}
        {savingStatus && (
          <div
            className={`mb-6 p-3 rounded ${
              savingStatus.includes('Error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {savingStatus}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-md rounded-b-lg">
          <Button
            text='Cancel'
            className='btn-outline-dark'
            onClick={() => router.push('/admin/blogs')}
            type='button'
          />
          <Button
            text={isSubmitting ? 'Saving...' : initialData ? 'Update Blog' : 'Create Blog'}
            className='btn-primary'
            disabled={isSubmitting}
            type='submit'
            icon={initialData ? 'Check' : 'Plus'}
            isLoading={isSubmitting}
          />
        </div>
      </form>

      {/* AI Content Generation Modal */}
      {showContentModal && generatedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-gray-100 animate-fadeIn">
            <div className="p-4 border-b bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-xl flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                AI Generated Content
              </h3>
              <button 
                onClick={() => setShowContentModal(false)}
                className="text-white hover:text-gray-200 bg-white bg-opacity-20 rounded-full p-1"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-h-[50vh] overflow-auto">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: generatedContent }}></div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  text="Discard"
                  className="btn-outline-gray"
                  onClick={() => setShowContentModal(false)}
                />
                <Button
                  text="Apply Content"
                  className="btn-primary bg-gradient-to-r from-indigo-500 to-purple-600"
                  icon="CheckCircle"
                  onClick={applyGeneratedContent}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogForm;