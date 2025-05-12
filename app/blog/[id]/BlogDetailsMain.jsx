'use client';
import { formatDate } from '@utils/dateUtils';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import TableOfContents from './TableOfContents';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'next-share';

// Helper function to generate URL-friendly slugs for IDs
const slugify = (text) => {
  if (!text) return 'untitled-section';
  const slug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars (keeps letters, numbers, underscore, hyphen)
    .replace(/--+/g, '-'); // Replace multiple - with single -
  return slug || 'section'; // Fallback if slug becomes empty
};

const BlogDetails = ({ blog, relatedBlogs, recentPosts = [], categories = [], navigation = { next: null, previous: null }, error }) => {
  const [tocItems, setTocItems] = useState([]);
  const [processedContent, setProcessedContent] = useState('');
  const contentRef = useRef(null);

  // Process blog content to add IDs to headings and extract TOC items
  useEffect(() => {
    if (blog?.content) {
      // Create a temporary DOM parser to handle the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(blog.content, 'text/html');
      const headings = doc.querySelectorAll('h1, h2, h3');
      const collectedTocItems = [];
      
      console.log(`BlogDetailsMain: Found ${headings.length} headings in blog content.`);
      
      headings.forEach((heading, index) => {
        const text = heading.textContent?.trim();
        if (text) {
          const idSuffix = slugify(text);
          const uniqueId = `toc-${idSuffix}-${index}`;
          
          // Add the ID to the heading element
          heading.id = uniqueId;
          console.log(`BlogDetailsMain: Assigned ID '${uniqueId}' to heading: "${text}"`);
          
          collectedTocItems.push({
            id: uniqueId,
            text: text,
            level: parseInt(heading.tagName.substring(1)), // H1 -> 1, H2 -> 2, etc.
          });
        }
      });
      
      // Update TOC items state
      console.log('BlogDetailsMain: Collected TOC Items:', collectedTocItems);
      setTocItems(collectedTocItems);
      
      // Get the processed HTML content with IDs added to headings
      setProcessedContent(doc.body.innerHTML);
    } else {
      // Reset state if no content
      setTocItems([]);
      setProcessedContent('');
    }
  }, [blog?.id, blog?.content]);

  // Create a full URL for sharing
  const blogUrl = `https://letsbuildsw.co.uk/blog/${blog?.slug}`;

  if (error) {
    return (
      <section className="pb-20 pt-20">
        <div className="container">
          <div className="max-w-3xl mx-auto bg-red-50 text-red-700 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
            <p>{error}</p>
            <Link href="/blog" className="mt-4 inline-block bg-primary-500 text-white px-4 py-2 rounded-lg">
              Return to Blog
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="pb-20 pt-20">
        <div className="container">
          <div className="flex justify-center">
            <p className="text-lg">Loading blog...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20">
      <div className="pt-20 pb-8 mb-4 bg-cover bg-no-repeat">
        <div className="containe mx-auto px-4  w-[97%]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-base md:text-lg">
                <Link className="text-pgray-200 hover:underline" href={`/blog?category=${blog.category.slug}`}>
                  <span className="inline-block py-1 px-3 text-xs font-semibold bg-primary-100 text-primary-600 rounded-xl mr-3">
                    {blog.category.name}
                  </span>
                </Link>
                <span className="text-pgray-500 text-sm">
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </span>
              </span>
              <h2 className="text-4xl md:text-5xl mt-4 font-bold">{blog.title}</h2>
            </div>
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{blog.viewCount} views</span>
              </div>
            </div>
          </div>
          {blog.featuredImage && (
            <div className="pt-48 pb-48 mb-12 bg-cover bg-no-repeat bg-center rounded-xl " 
                 style={{ backgroundImage: `url("${blog.featuredImage?.url}")` }}>
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="containe mx-auto px-4 w-[97%]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar for Table of Contents (Desktop only) */}
          {tocItems.length > 0 && (
            <div className="lg:col-span-4">
              <TableOfContents items={tocItems} />
            </div>
          )}
          
          {/* Main Content Column */}
          <div className={tocItems.length > 0 ? "lg:col-span-7" : "lg:col-span-12"}>
            <div className="ql-container" ref={contentRef}>
              <div 
                className="ql-editor blog-content mb-6 leading-loose text-pgay-40"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>
            
            {/* Post Tags */}
            <div className="flex flex-wrap justify-between items-center mt-8 pb-8 border-b border-gray-200">
              <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                <span className="font-semibold text-gray-800">Tags:</span>
                <Link href={`/blog?category=${blog.category.slug}`} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition">
                  {blog.category.name}
                </Link>
              </div>
              
              {/* Social Share */}
              <div className="flex gap-3">
                <FacebookShareButton url={blogUrl} quote={blog?.title}>
                  <div className="w-9 h-9 flex items-center justify-center text-white transition-all duration-300">
                    <FacebookIcon size={24} round={true} />
                  </div>
                </FacebookShareButton>
                
                <TwitterShareButton url={blogUrl} title={blog?.title}>
                  <div className="w-9 h-9 flex items-center justify-center text-white transition-all duration-300">
                    <TwitterIcon size={24} round={true} />
                  </div>
                </TwitterShareButton>
                
                <LinkedinShareButton url={blogUrl} title={blog?.title}>
                  <div className="w-9 h-9 flex items-center justify-center text-white transition-all duration-300">
                    <LinkedinIcon size={24} round={true} />
                  </div>
                </LinkedinShareButton>
                
                <WhatsappShareButton url={blogUrl} title={blog?.title}>
                  <div className="w-9 h-9 flex items-center justify-center text-white transition-all duration-300">
                    <WhatsappIcon size={24} round={true} />
                  </div>
                </WhatsappShareButton>
              </div>
            </div>
            
            {/* Next/Previous Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
              {navigation.previous && (
                <Link href={`/blog/${navigation.previous.slug}`} 
                      className="group flex flex-col p-4 border border-gray-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </span>
                  <span className="font-medium text-gray-900 group-hover:text-primary-600 line-clamp-1">{navigation.previous.title}</span>
                </Link>
              )}
              
              {navigation.next && (
                <Link href={`/blog/${navigation.next.slug}`} 
                      className="group flex flex-col items-end p-4 border border-gray-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span className="font-medium text-gray-900 group-hover:text-primary-600 line-clamp-1">{navigation.next.title}</span>
                </Link>
              )}
            </div>

         
            {relatedBlogs?.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedBlogs.map(relatedBlog => (
                    <div key={relatedBlog.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                      {relatedBlog.featuredImage && (
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={relatedBlog.featuredImage?.url} 
                            alt={relatedBlog.title} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="text-xs text-gray-500 mb-1">
                          {formatDate(relatedBlog.publishedAt || relatedBlog.createdAt)}
                        </div>
                        <h4 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-500 transition-colors">
                          <Link href={`/blog/${relatedBlog.slug}`}>
                            {relatedBlog.title}
                          </Link>
                        </h4>
                        <Link 
                          href={`/blog/${relatedBlog.slug}`}
                          className="text-sm text-primary-500 hover:text-primary-600"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar Column (Search, Recent Posts, Categories, Tags) */}
        
        </div>
        
        <div className="transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center mt-12">
          <Link href="/blog" className="px-4 py-2 mt-2 text-pgray-600 transition-colors duration-200 transform border border-pgray-100 rounded-lg hover:bg-primary-50/50 focus:outline-none">
            ← Back to All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;