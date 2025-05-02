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
