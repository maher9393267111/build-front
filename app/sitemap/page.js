// 'use server';

import * as api from '@/services/api';
import AdminSitemapMain from './AdminSitemapMain';

export const metadata = {
  title: 'Sitemap',
  
};

export default async function AdminSitemapPage() {
  let siteStructure = [];
  let error = null;

  try {
    const sitemapData = await api.getSitemapData();
    
    const pages = sitemapData.pages || [];
    const blogs = sitemapData.blogs || [];

    siteStructure = [
      {
        title: 'Static Pages',
        icon: 'FaHome',
        childIcon: 'FaAngleRight',
        links: [
          { url: '/contact', label: 'Contact', icon: 'FaPhoneAlt' },
          // { url: '/faqs', label: 'FAQs', icon: 'FaQuestionCircle' },
        ],
      },
      {
        title: 'Content Pages',
        icon: 'FaRegFileAlt',
        childIcon: 'FaFileAlt',
        links: [
          ...pages.map((page) => ({
            url: `${page.isMainPage ? '/' : `/${page.slug}`}`,
            label: page.isMainPage ? 'Home' : (page.title || page.slug),
            icon: page.isMainPage ? 'FaHome' : undefined,
            isChild: true,
          })),
        ],
      },
      {
        title: 'Blogs',
        icon: 'FaBlog',
        childIcon: 'FaNewspaper',
        links: [
          { url: '/blog', label: 'All Blogs' },
          ...blogs.map((blog) => ({
            url: `/blog/${blog.slug}`,
            label: blog.title || blog.slug,
            isChild: true,
          })),
        ],
      },
    ];
  } catch (err) {
    console.error('Error fetching sitemap data for admin page:', err);
    error = err instanceof Error ? err.message : 'An unknown error occurred';
  }

  return <AdminSitemapMain siteStructure={siteStructure} error={error} />;
} 