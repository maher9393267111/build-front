import http from './http';
import axios from 'axios';



// ... existing code ...
export const register = async (payload) => {
    const { data } = await http.post(`/auth/register`, payload);
    return data;
  };



  export const login = async (payload) => {
    const { data } = await http.post(`/auth/login`, payload);
    return data;
  };

// Pages API endpoints
export const getAllPages = async (params) => {
  const { data } = await http.get('/pages', { params });
  return data;
};

export const getPageById = async (id , token) => {
  const { data } = await http.get(`/pages/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};

export const getPageBySlug = async (slug) => {
  const { data } = await http.get(`/pages/by-slug/${slug}`);
  return data;
};

export const getPublishedPages = async () => {
  const { data } = await http.get('/pages/published-navigation');
  return data;
};

export const getMainPage = async () => {
  const { data } = await http.get('/pages/main');
  return data;
};

export const createPage = async (pageData) => {
  const { data } = await http.post('/pages', pageData);
  return data;
};

export const updatePage = async (id, pageData) => {
  const { data } = await http.put(`/pages/${id}`, pageData);
  return data;
};

export const deletePage = async (id) => {
  const { data } = await http.delete(`/pages/${id}`);
  return data;
};

// Forms API endpoints
export const getAllForms = async (params) => {
  const { data } = await http.get('/forms', { params });
  return data;
};

export const getFormById = async (id, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await http.get(`/forms/${id}`, { headers });
  return data;
};

export const getFormBySlug = async (slug) => {
  const { data } = await http.get(`/forms/by-slug/${slug}`);
  return data;
};

export const getPublishedForms = async () => {
  const { data } = await http.get('/forms/published');
  return data;
};

export const createForm = async (formData) => {
  const { data } = await http.post('/forms', formData);
  return data;
};

export const updateForm = async (id, formData) => {
  const { data } = await http.put(`/forms/${id}`, formData);
  return data;
};

export const deleteForm = async (id) => {
  const { data } = await http.delete(`/forms/${id}`);
  return data;
};

export const submitForm = async (formId, formData) => {
  const { data } = await http.post(`/forms/${formId}/submit`, formData);
  return data;
};

export const getFormSubmissions = async (formId, params) => {
  const { data } = await http.get(`/forms/${formId}/submissions`, { params });
  return data;
};

export const getFormSubmission = async (formId, submissionId) => {
  const { data } = await http.get(`/forms/${formId}/submissions/${submissionId}`);
  return data;
};

export const updateFormSubmissionStatus = async (formId, submissionId, status) => {
  const { data } = await http.put(`/forms/${formId}/submissions/${submissionId}/status`, { status });
  return data;
};

// Blocks API endpoints
export const getAllBlocks = async (params) => {
  const { data } = await http.get('/blocks', { params });
  return data;
};

export const getBlockById = async (id) => {
  const { data } = await http.get(`/blocks/${id}`);
  return data;
};

export const createBlock = async (blockData) => {
  const { data } = await http.post('/blocks', blockData);
  return data;
};

export const updateBlock = async (id, blockData) => {
  const { data } = await http.put(`/blocks/${id}`, blockData);
  return data;
};

export const deleteBlock = async (id) => {
  const { data } = await http.delete(`/blocks/${id}`);
  return data;
};

// Block Templates API endpoints
export const getBlockTemplates = async (params) => {
  const { data } = await http.get('/block-templates', { params });
  return data;
};

export const createBlockTemplate = async (templateData) => {
  const { data } = await http.post('/block-templates', templateData);
  return data;
};

export const updateBlockTemplate = async (id, templateData) => {
  const { data } = await http.put(`/block-templates/${id}`, templateData);
  return data;
};

export const deleteBlockTemplate = async (id) => {
  const { data } = await http.delete(`/block-templates/${id}`);
  return data;
};

// Media Library API endpoints
export const getAllMedia = async (params) => {
  const { data } = await http.get('/media', { params });
  return data;
};

export const getMediaById = async (id) => {
  const { data } = await http.get(`/media/${id}`);
  return data.media;
};

export const createMedia = async (mediaData) => {
  const { data } = await http.post('/media', mediaData);
  return data.media;
};

export const updateMedia = async (id, mediaData) => {
  const { data } = await http.put(`/media/${id}`, mediaData);
  return data.media;
};

export const deleteMedia = async (id, force = false) => {
  const { data } = await http.delete(`/media/${id}${force ? '?force=true' : ''}`);
  return data;
};

export const bulkDeleteMedia = async (ids) => {
  const { data } = await http.post('/media/bulk-delete', { ids });
  return data;
};

export const registerUploadedFile = async (fileData) => {
  const { data } = await http.post('/media/register-upload', fileData);
  return data;
};

export const getMediaLibrary = async (params) => {
  const { data } = await http.get('/media-library', { params });
  return data;
};

export const uploadMediaFile = async (file, addToMediaLibrary = true, setAsInUse = true) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('addToMediaLibrary', addToMediaLibrary.toString());
  formData.append('setAsInUse', setAsInUse.toString());
  
  const { data } = await http.post('/uploadfile', formData);
  return data;
};

export const deleteFile = async (fileName, skipMediaCheck = false) => {
  const { data } = await http.delete(`/deletefile?fileName=${fileName}&skipMediaCheck=${skipMediaCheck}`);
  return data;
};

export const deleteFileNormal = async (fileName) => {
  const { data } = await http.delete(`/deletefile-normal?fileName=${fileName}`);
  return data;
};




// --------
// Blog Category APIs
export const getBlogCategories = async () => {
  const { data } = await http.get('/blog-categories');
  return data.categories;
};

export const createBlogCategory = async (payload) => {
  const { data } = await http.post('/blog-categories', payload);
  return data.category;
};

export const updateBlogCategory = async ({ id, ...payload }) => {
  const { data } = await http.put(`/blog-categories/${id}`, payload);
  return data.category;
};

export const deleteBlogCategory = async (id) => {
  const { data } = await http.delete(`/blog-categories/${id}`);
  return data;
};

// Blog APIs - Public
export const getBlogs = async (params = {}) => {
  const { data } = await http.get('/blogs', { params });
  return data;
};

export const getBlogBySlug = async (slug) => {
  const { data } = await http.get(`/blogs/${slug}`);
  return data.blog;
};

export const getRelatedBlogs = async (params) => {
  const { data } = await http.get('/blogs/related', { params });
  return data.blogs;
};

// Blog APIs - Admin
export const getAdminBlogs = async (params = {}) => {
  const { data } = await http.get('/admin/blogs', { params });
  return data;
};

export const createBlog = async (payload) => {
  const { data } = await http.post('/blogs', payload);
  return data.blog;
};

export const updateBlog = async ({ id, ...payload }) => {
  const { data } = await http.put(`/blogs/${id}`, payload);
  return data.blog;
};

export const deleteBlog = async (id) => {
  const { data } = await http.delete(`/blogs/${id}`);
  return data;
};


// Add this function
export const getBlogById = async (id) => {
  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    throw new Error('Invalid blog ID');
  }
  
  // First get the blog to get its slug
  const { data } = await http.get(`/admin/blogs/${numId}`);
  return data.blog;
};


//   -----------Faq api-----------
// FAQ APIs

// Sitemap API
export const getSitemapData = async () => {
    console.log("Fetching sitemap data from API...");
    const { data } = await http.get('/sitemap-data');
    console.log("Received sitemap data:", data);
    return data; 
  };

// SEO Analysis API
export const analyzeSEO = async (pageData, content) => {
  const { data } = await http.post('/analyze', { pageData, content });
  return data;
};

// Blog SEO Analysis API
export const analyzeBlogSEO = async (blogData, content, requestContentSuggestions = false) => {
  const { data } = await http.post('/analyze-blog', { 
    blogData, 
    content,
    requestContentSuggestions
  });
  return data;
};

export const suggestKeywords = async (params) => {
  // Expect params to include title, description, industry, and metaKeywords
  // Can also include contentType for more specific suggestions (e.g., 'article', 'product')
  const { data } = await http.post('/suggest-keywords', params);
  return data;
};

// Blog Content Suggestions API
export const getBlogContentSuggestions = async (blogData, content) => {
  const { data } = await http.post('/blog-content-suggestions', { 
    blogData, 
    content 
  });
  return data;
};

// Site Settings API endpoints
export const getSiteSettings = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const { data } = await http.get('/site-settings', {
      signal: controller.signal,
      timeout: 5000
    });
    
    clearTimeout(timeoutId);
    return data.settings || {};
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return {};
  }
};

export const updateSiteSettings = async (settingsData) => {
  try {
    const { data } = await http.put('/site-settings', settingsData);
    return data;
  } catch (error) {
    console.error("Failed to update site settings:", error);
    throw error;
  }
};


export const deleteFormSubmission = async (formId, submissionId) => {
  const { data } = await http.delete(`/forms/${formId}/submissions/${submissionId}`);
  return data;
};





// Add these new API service functions

// Get recent blog posts
export const getRecentPosts = async (limit = 3) => {
  const { data } = await http.get('/blogs/recent', { params: { limit } });
  return data.posts;
};

// Get categories with post counts
export const getCategoriesWithCounts = async () => {
  const { data } = await http.get('/blogs/categories');
  return data.categories;
};

// Get next and previous blog posts
export const getNextPreviousBlog = async (id) => {
  const { data } = await http.get(`/blogs/${id}/next-previous`);
  return {
    next: data.next,
    previous: data.previous
  };
};

// Site SEO Analysis API
export const analyzeSiteSEO = async (siteData, pageData) => {
  const { data } = await http.post('/analyze-site', { siteData, pageData });
  return data;
};


// ... existing code ...

// Add note to a submission
export const addNoteToSubmission = async (formId, submissionId, content) => {
  const { data } = await http.post(`/forms/${formId}/submissions/${submissionId}/notes`, { content });
  return data;
};

// Delete note from a submission
export const deleteNoteFromSubmission = async (formId, submissionId, noteId) => {
  const { data } = await http.delete(`/forms/${formId}/submissions/${submissionId}/notes/${noteId}`);
  return data;
};

// Analytics API Endpoints
export const trackPageView = async (path) => {
  try {
    // This is a fire-and-forget request, we don't necessarily need the response
    // unless we want to log success/failure client-side.
    await http.post('/analytics/track-view', { path });
  } catch (error) {
    // Silently fail or log to console, as this shouldn't break user experience.
    console.error('Failed to track page view:', error);
  }
};

// export const getAnalyticsDashboardStats = async () => {
//   const { data } = await http.get('/analytics/dashboard-stats');
//   return data;
// };
export const getAnalyticsDashboardStats = async (params) => {
  const { data } = await http.get('/analytics/dashboard-stats', { params });
  return data;
};
// ... existing code ...

// Add this new function
export const getFormSubmissionStats = async (params) => {
  const { data } = await http.get('/analytics/form-submission-stats', { params });
  return data;
};

// Add this new function at the end of your API services file
export const getPageActivityStats = async (params) => {
  const { data } = await http.get('/analytics/page-activity-stats', { params });
  return data;
};

// Add this new function
export const trackPageActivity = async (activityData) => {
  // activityData should contain pageId (optional), pageName, action
  try {
    await http.post('/analytics/track-page-activity', activityData);
  } catch (error) {
    console.error('Failed to track page activity:', error);
    // Decide if you want to re-throw or handle silently
  }
};



// Global Stats API Endpoints
export const getGlobalStats = async () => {
  const { data } = await http.get('/analytics/global-stats');
  return data;
};


// ----------

export const resetFormSubmissions = async () => {
  const { data } = await http.post('/analytics/reset-form-submissions');
  return data;
};

// Reset page activities - clears all page activity logs
export const resetPageActivities = async () => {
  const { data } = await http.post('/analytics/reset-page-activities');
  return data;
};

// Reset specific form submissions by form ID
export const resetFormSubmissionsByFormId = async (formId) => {
  const { data } = await http.post(`/analytics/reset-form-submissions/${formId}`);
  return data;
};