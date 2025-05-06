'use client';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import BlogForm from '../../BlogForm';
import { getBlogById } from '@services/api';

const EditBlogPage = () => {
  const params = useParams();
  const id = params.id;

  const { data: blog, isLoading, error } = useQuery(['blog', id], () => getBlogById(id), {
    enabled: !!id
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-6 py-4 rounded-lg shadow bg-gradient-to-r from-primary-700 to-primary-500">
        <h2 className="text-xl font-bold text-white drop-shadow">Edit Blog Post</h2>
      </div>
      <BlogForm initialData={blog} />
      {/* {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-gray-700">Loading blog data...</div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Error loading blog data: {error.message}
        </div>
      ) : blog ? (
        <BlogForm initialData={blog} />
      ) : (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">
          Blog not found
        </div>
      )} */}
    </div>
  );
};

export default EditBlogPage;