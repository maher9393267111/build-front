//no cache


import * as api from '../services/api'; // Adjust path as necessary

const BASE_URL = 'https://letsbuildsw.co.uk'; // <<<--- CHANGE THIS TO YOUR ACTUAL DOMAIN

export default async function sitemap() {
  console.log("Generating sitemap...");
  try {
    // Fetch dynamic data (published pages and blogs)
    const sitemapData = await api.getSitemapData();
    console.log("Sitemap data fetched:", sitemapData);

    const pages = sitemapData.pages || [];
    const blogs = sitemapData.blogs || [];

    const currentDate = new Date().toISOString();

    // --- Static Pages --- 
    // Only truly static pages, not the dynamic main page
    const staticUrls = [
      {
        url: `${BASE_URL}/contact`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/blog`,
        lastModified: currentDate, 
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/privacy-policy`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      },

      {
        url: `${BASE_URL}/terms-conditions`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      },

      {
        url: `${BASE_URL}/cookie-policy`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      // Add other static pages like /about, /services etc.
    ];
    console.log("Generated static URLs:", staticUrls);


    // --- Dynamic Page URLs --- 
    // Main page (homepage) is included here as a dynamic page with isMainPage=true
    const pageUrls = pages.map((page) => {
      let lastMod = currentDate;
      try {
        lastMod = page.updatedAt ? new Date(page.updatedAt).toISOString() : currentDate;
      } catch (e) {
        console.error('Invalid date for page:', page.slug, page.updatedAt);
      }
      
      // For main page, set highest priority
      const priority = page.isMainPage ? 1 : 0.8;
      
      return {
        url: `${BASE_URL}${page.isMainPage ? '' : `/${page.slug}`}`, // Fix URL for main page
        lastModified: lastMod,
        changeFrequency: page.isMainPage ? 'daily' : 'weekly', // Main page changes more frequently
        priority,
      };
    });
    console.log("Generated dynamic page URLs:", pageUrls);

    // --- Dynamic Blog URLs ---
    const blogUrls = blogs.map((blog) => {
        let lastMod = currentDate;
        try {
          lastMod = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : currentDate;
        } catch (e) { 
          console.error('Invalid date for blog:', blog.slug, blog.updatedAt);
        }
      return {
        url: `${BASE_URL}/blog/${blog.slug}`,
        lastModified: lastMod,
        changeFrequency: 'weekly',
        priority: 0.7,
      };
    });
    console.log("Generated dynamic blog URLs:", blogUrls);


    const allUrls = [...staticUrls, ...pageUrls, ...blogUrls];
    console.log(`Total URLs generated: ${allUrls.length}`);
    return allUrls;

  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback to at least the homepage if generation fails
    return [
      {
        url: BASE_URL,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
} 