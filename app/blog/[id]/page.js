'use server';
import { cookies } from 'next/headers';
import { getBlogById, getRelatedBlogs } from '@services/api';
import Layout from '@components/layout/landing/Layout';
import BlogDetails from './BlogDetailsMain';

export default async function BlogPage({ params }) {
  const { id } = params;
  let blog = null;
  let relatedBlogs = [];

  try {
    blog = await getBlogById(id);
    if (blog?.id && blog?.categoryId) {
      relatedBlogs = await getRelatedBlogs({ id: blog.id, categoryId: blog.categoryId });
    }
  } catch (error) {
    console.error('Failed to fetch blog:', error);
  }

  return (
    <Layout headerStyle={1}>
      <BlogDetails blog={blog} relatedBlogs={relatedBlogs} error={!blog ? 'Blog not found' : null} />
    </Layout>
  );
}

// 'use client';
// import { useParams } from 'next/navigation';
// import { useQuery } from 'react-query';
// import Layout from '@components/layout/landing/Layout';
// import Link from 'next/link';
// import { getBlogById, getRelatedBlogs } from '@services/api';
// import { formatDate } from '@utils/dateUtils';
// import 'react-quill/dist/quill.core.css';

// const BlogDetails = () => {
//     const params = useParams();
//     const { id } = params;

//     if (!id) {
//         return (
//             <Layout headerStyle={2}>
//                 <section className="pb-20 pt-20">
//                     <div className="container">
//                         <div className="flex justify-center">
//                             <p className="text-lg">Loading blog...</p>
//                         </div>
//                     </div>
//                 </section>
//             </Layout>
//         );
//     }

//     const { data: blog, isLoading, error } = useQuery(
//         ['blog', id], 
//         () => getBlogById(id), 
//         { enabled: !!id }
//     );

//     console.log(blog ,'blog' );

//     const { data: relatedBlogs } = useQuery(
//         ['relatedBlogs', blog?.id, blog?.categoryId],
//         () => getRelatedBlogs({ id: blog.id, categoryId: blog.categoryId }),
//         { enabled: !!blog?.id && !!blog?.categoryId }
//     );

//     if (isLoading) return (
//         <Layout headerStyle={1}>
//             <section className="pb-20 pt-20">
//                 <div className="container">
//                     <div className="flex justify-center">
//                         <p className="text-lg">Loading...</p>
//                     </div>
//                 </div>
//             </section>
//         </Layout>
//     );

//     if (error || !blog) return (
//         <Layout headerStyle={1}>
//             <section className="pb-20 pt-20">
//                 <div className="container">
//                     <div className="max-w-3xl mx-auto bg-red-50 text-red-700 p-8 rounded-lg">
//                         <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
//                         <p>{error?.message || "The article you're looking for doesn't exist."}</p>
//                         <Link href="/blog" className="mt-4 inline-block bg-primary-500 text-white px-4 py-2 rounded-lg">
//                             Return to Blog
//                         </Link>
//                     </div>
//                 </div>
//             </section>
//         </Layout>
//     );

//     return (
//         <>
//             <Layout headerStyle={1}>
//                 <section className="pb-20">
//                     <div className="pt-20 pb-8 mb-4 bg-cover bg-no-repeat">
//                         <div className="container">
//                             <div className="max-w-3xl mx-auto">
//                                 <div className="text-center mb-6 wow animate__animated animate__fadeInUp">
//                                     <span className="text-base md:text-lg">
//                                         <Link className="text-pgray-200 hover:underline" href={`/blog?category=${blog.category.slug}`}>
//                                             <span className="inline-block py-1 px-3 text-xs font-semibold bg-primary-100 text-primary-600 rounded-xl mr-3">
//                                                 {blog.category.name}
//                                             </span>
//                                         </Link>
//                                         <span className="text-pgray-500 text-sm">
//                                             {formatDate(blog.publishedAt || blog.createdAt)}
//                                         </span>
//                                     </span>
//                                     <h2 className="text-4xl md:text-5xl mt-4 font-bold">{blog.title}</h2>
//                                 </div>
//                                 <div className="flex justify-center mb-8 wow animate__animated animate__fadeInUp">
//                                     <div className="flex items-center gap-2 text-sm text-gray-500">
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                         </svg>
//                                         <span>{blog.viewCount} views</span>
//                                     </div>
//                                 </div>
//                             </div>
//                             {blog.featuredImage && (
//                                 <div className="pt-48 pb-48 mb-12 bg-cover bg-no-repeat bg-center rounded-xl wow animate__animated animate__fadeInUp" 
//                                      style={{ backgroundImage: `url("${blog.featuredImage?.url}")` }}>
//                                     <div className="max-w-2xl mx-auto">
//                                         <div className="text-center mb-6" />
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <div className="container">
//                         <div className="max-w-3xl mx-auto">
//                             {/* Blog content using Quill styles */}
//                             <div className="ql-container">
//                                 <div 
//                                     className="ql-editor blog-content mb-6 leading-loose text-pgray-400"
//                                     dangerouslySetInnerHTML={{ __html: blog.content }}
//                                 />
//                             </div>

//                             {/* Related posts section */}
//                             {relatedBlogs?.length > 0 && (
//                                 <div className="mt-12 pt-8 border-t border-gray-200">
//                                     <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                         {relatedBlogs.map(relatedBlog => (
//                                             <div key={relatedBlog.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
//                                                 {relatedBlog.featuredImage && (
//                                                     <div className="h-40 overflow-hidden">
//                                                         <img 
//                                                             src={relatedBlog.featuredImage} 
//                                                             alt={relatedBlog.title} 
//                                                             className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//                                                         />
//                                                     </div>
//                                                 )}
//                                                 <div className="p-4">
//                                                     <div className="text-xs text-gray-500 mb-1">
//                                                         {formatDate(relatedBlog.publishedAt || relatedBlog.createdAt)}
//                                                     </div>
//                                                     <h4 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-500 transition-colors">
//                                                         <Link href={`/blog/${relatedBlog.slug}`}>
//                                                             {relatedBlog.title}
//                                                         </Link>
//                                                     </h4>
//                                                     <Link 
//                                                         href={`/blog/${relatedBlog.slug}`}
//                                                         className="text-sm text-primary-500 hover:text-primary-600"
//                                                     >
//                                                         Read More →
//                                                     </Link>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
                            
//                             <div className="transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center mt-12">
//                                 <Link href="/blog" className="px-4 py-2 mt-2 text-pgray-600 transition-colors duration-200 transform border border-pgray-100 rounded-lg hover:bg-primary-50/50 focus:outline-none">
//                                     ← Back to All Articles
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </Layout>
//         </>
//     );
// };

// export default BlogDetails;
