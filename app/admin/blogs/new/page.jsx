'use client';
import BlogForm from '../BlogForm';

const NewBlogPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-6 py-4 rounded-lg shadow bg-gradient-to-r from-primary-700 to-primary-500">
        <h2 className="text-xl font-bold text-white drop-shadow">Create New Blog Post</h2>
      </div>
      <BlogForm />
    </div>
  );
};

export default NewBlogPage;