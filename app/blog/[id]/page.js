'use server';
import { cookies } from 'next/headers';
import { getBlogBySlug, getRelatedBlogs, getRecentPosts, getCategoriesWithCounts, getNextPreviousBlog } from '@services/api';
import Layout from '@components/layout/landing/Layout';
import BlogDetails from './BlogDetailsMain';
import { generateBlogMetadata } from './BlogSeo';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { id } = params;
  let blog = null;

  try {
    blog = await getBlogBySlug(id);
  } catch (error) {
    console.error('Failed to fetch blog for metadata:', error);
  }

  return blog ? generateBlogMetadata(blog) : {
    title: 'Blog Post Not Found',
    description: 'The requested blog post could not be found.'
  };
}

export default async function BlogPage({ params }) {
  const { id } = params;
  let blog = null;
  let relatedBlogs = [];
  let recentPosts = [];
  let categories = [];
  let navigation = { next: null, previous: null };

  try {
    blog = await getBlogBySlug(id);
    
    if (blog?.id && blog?.categoryId) {
      // Fetch all data in parallel for better performance
      const [relatedData, recentData, categoriesData, navigationData] = await Promise.all([
        getRelatedBlogs({ id: blog.id, categoryId: blog.categoryId }),
        getRecentPosts(3),
        getCategoriesWithCounts(),
        getNextPreviousBlog(blog.id)
      ]);
      
      relatedBlogs = relatedData;
      recentPosts = recentData;
      categories = categoriesData;
      navigation = navigationData;
    }
  } catch (error) {
    console.error('Failed to fetch blog data:', error);
  }

  return (
    <Layout headerStyle={1}>
      <BlogDetails 
        blog={blog} 
        relatedBlogs={relatedBlogs} 
        recentPosts={recentPosts}
        categories={categories}
        navigation={navigation}
        error={!blog ? 'Blog not found' : null} 
      />
    </Layout>
  );
}
