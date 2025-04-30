'use client';
import { formatDate } from '@utils/dateUtils';
import Link from 'next/link';

const BlogDetails = ({ blog, relatedBlogs, error }) => {
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
        <div className="container">
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
            <div className="pt-48 pb-48 mb-12 bg-cover bg-no-repeat bg-center rounded-xl wow animate__animate animate__fadeInU" 
                 style={{ backgroundImage: `url("${blog.featuredImage?.url}")` }}>
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="ql-container">
            <div 
              className="ql-editor blog-content mb-6 leading-loose text-pgray-400"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {relatedBlogs?.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map(relatedBlog => (
                  <div key={relatedBlog.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                    {relatedBlog.featuredImage && (
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={relatedBlog.featuredImage} 
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
          
          <div className="transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center mt-12">
            <Link href="/blog" className="px-4 py-2 mt-2 text-pgray-600 transition-colors duration-200 transform border border-pgray-100 rounded-lg hover:bg-primary-50/50 focus:outline-none">
              ← Back to All Articles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;