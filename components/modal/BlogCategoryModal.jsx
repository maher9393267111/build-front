import { useForm } from 'react-hook-form';
import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const BlogCategoryModal = ({ initialData, onClose, onSubmit, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData || { name: '', description: '', status: 'active' }
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    reset(initialData || { name: '', description: '', status: 'active' });
  }, [initialData, reset]);

  const submitHandler = (data) => {
    if (initialData) {
      onSubmit({ ...data, id: initialData.id });
    } else {
      onSubmit(data);
    }
  };

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-white p-8 rounded-2xl shadow-3xl w-full max-w-lg border-t-8 border-primary-500">
                {/* Close Button */}
                <button
                  type="button"
                  className="absolute top-4 right-4 bg-primary-50 hover:bg-primary-100 text-primary-600 hover:text-primary-700 rounded-full w-10 h-10 flex items-center justify-center shadow transition-all"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <span className="text-2xl font-bold">&times;</span>
                </button>
                <Dialog.Title className="text-3xl font-extrabold mb-6 text-primary-700 text-center tracking-tight">
                  {initialData ? 'Edit' : 'Add'} Blog Category
                </Dialog.Title>
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Name</label>
                    <input
                      className={`w-full rounded-lg border-2 ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-primary-200 focus:border-primary-500'} focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none`}
                      {...register('name', { required: 'Category name is required' })}
                      placeholder="Enter category name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                      className="w-full h-24 rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      {...register('description')}
                      placeholder="Short description"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Status</label>
                    <select
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      {...register('status')}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="rounded-lg px-5 py-2 font-semibold bg-primary-100 text-primary-700 hover:bg-primary-200 transition-all"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg px-5 py-2 font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-all shadow"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BlogCategoryModal;