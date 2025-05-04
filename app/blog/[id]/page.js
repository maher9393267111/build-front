'use server';
import { cookies } from 'next/headers';
import { getBlogBySlug, getRelatedBlogs } from '@services/api';
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

  try {
    blog = await getBlogBySlug(id);
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
