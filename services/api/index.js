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





