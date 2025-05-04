import { Metadata } from 'next';
import { absoluteUrl } from '@utils/helpers';

/**
 * Generates SEO metadata for blog pages
 */
export function generateBlogMetadata(blog) {
  if (!blog) return {};

  // Get the SEO fields or use fallbacks
  const title = blog.metaTitle || blog.title;
  const description = blog.metaDescription || blog.excerpt || `Read about ${blog.title}`;
  const keywords = blog.metaKeywords || '';
  const robotsContent = blog.robots || 'index, follow';
  
  // Determine the canonical URL
  const canonicalUrl = blog.canonicalUrl || absoluteUrl(`/blog/${blog.slug}`);
  
  // Get the OG image or fallback to featured image
  const ogImageUrl = blog.ogImage?.url || blog.featuredImage?.url || '';
  
  // Prepare icon data
  const iconUrl = ogImageUrl; // Use the determined OG/Featured image URL
  const iconsData = iconUrl ? {
      icon: [{ url: iconUrl }], // Standard favicon
      apple: [{ url: iconUrl }], // Apple touch icon
    } : undefined;
  
  // Create the metadata object
  const metadata = {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: robotsContent,
    icons: iconsData, // Add the icons property
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: ['Your Organization'],
      section: blog.category?.name || '',
      tags: keywords.split(',').map(keyword => keyword.trim()),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
  
  // Add OG image if available
  if (ogImageUrl) {
    metadata.openGraph.images = [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: title,
      }
    ];
    
    metadata.twitter.images = [ogImageUrl];
  }
  
  // Add structured data if available
  if (blog.structuredData) {
    metadata.other = {
      'script:ld+json': blog.structuredData ? JSON.stringify(blog.structuredData) : generateArticleSchema(blog)
    };
  }
  
  return metadata;
}

/**
 * Generates article schema for structured data
 */
function generateArticleSchema(blog) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://letsbuildsw.co.uk';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || '',
    image: blog.featuredImage?.url || blog.ogImage?.url || '',
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'Your Organization',
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Your Organization',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${blog.slug}`
    }
  };
}

export default generateBlogMetadata; 