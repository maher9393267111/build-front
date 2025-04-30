'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory
} from '@services/api';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import BlogCategoryModal from '@components/modal/BlogCategoryModal';
import ConfirmationModal from '@components/modal/ConfirmationModal';

const BlogCategories = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { data: categories, isLoading } = useQuery('blogCategories', getBlogCategories);

  const addMutation = useMutation(createBlogCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogCategories');
      setModalOpen(false);
    }
  });

  const updateMutation = useMutation(updateBlogCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogCategories');
      setModalOpen(false);
      setEditCategory(null);
    }
  });

  const deleteMutation = useMutation(deleteBlogCategory, {
    onSuccess: () => queryClient.invalidateQueries('blogCategories')
  });

  const handleEdit = (category) => {
    setEditCategory(category);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditCategory(null);
    setModalOpen(true);
  };

  const handleDelete = (cat) => {
    setCategoryToDelete(cat);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.id);
      setConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 px-6 py-4 rounded-lg shadow bg-gradient-to-r from-primary-700 to-primary-500">
        <h2 className="text-xl font-bold text-white drop-shadow">Blog Categories</h2>
        <button
          className="px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-800 text-white font-semibold rounded shadow-lg hover:from-primary-700 hover:to-primary-900 transition"
          onClick={handleAdd}
        >
          + Add Category
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-primary-700 to-primary-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Blog Count</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : categories?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No categories found</td>
              </tr>
            ) : (
              categories?.map((cat, idx) => (
                <tr
                  key={cat.id}
                  className={idx % 2 === 0 ? "bg-gray-50 hover:bg-blue-50 transition" : "bg-white hover:bg-blue-50 transition"}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{cat.name}</td>
                  <td className="px-6 py-4">{cat.slug}</td>
                  <td className="px-6 py-4">{cat.description || '-'}</td>
                  <td className="px-6 py-4">{cat.blogCount || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                      ${cat.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow transition focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      onClick={() => handleEdit(cat)}
                      title="Edit"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow transition focus:outline-none focus:ring-2 focus:ring-red-300"
                      onClick={() => handleDelete(cat)}
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Responsive hint for mobile */}
      <div className="sm:hidden text-xs text-gray-500 mt-2">Scroll right to see more &rarr;</div>
      
      {modalOpen && (
        <BlogCategoryModal
          initialData={editCategory}
          onClose={() => { setModalOpen(false); setEditCategory(null); }}
          onSubmit={editCategory ? updateMutation.mutate : addMutation.mutate}
          loading={addMutation.isLoading || updateMutation.isLoading}
        />
      )}
      
      {confirmOpen && (
        <ConfirmationModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Category"
          description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
          loading={deleteMutation.isLoading}
        />
      )}
    </>
  );
};

export default BlogCategories;