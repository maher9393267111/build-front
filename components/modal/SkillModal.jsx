import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const SkillModal = ({ initialData, onClose, onSubmit, loading, categories = [] }) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategoryId(initialData.categoryId || '');
    } else {
      // Reset form for adding
      setTitle('');
      setCategoryId('');
    }
    setError(''); // Clear error when modal opens or data changes
  }, [initialData, categories]); // Depend on categories in case they load after modal opens

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!title.trim()) {
      setError('Skill title is required.');
      return;
    }
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    const payload = {
      title: title.trim(),
      categoryId: parseInt(categoryId, 10), // Ensure categoryId is a number
    };

    if (initialData?.id) {
      // Add id for update mutation
      onSubmit({ id: initialData.id, ...payload });
    } else {
      // Submit for create mutation
      onSubmit(payload);
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
              <Dialog.Panel className="relative bg-white p-8 rounded-2xl shadow-3xl w-full max-w-lg border-t-8 border-primary-500 animate-fadeIn">
                {/* Close Button */}
                <button
                  type="button"
                  className="absolute top-4 right-4 bg-primary-50 hover:bg-primary-100 text-primary-600 hover:text-primary-700 rounded-full w-10 h-10 flex items-center justify-center shadow transition-all"
                  onClick={onClose}
                  aria-label="Close"
                  disabled={loading}
                >
                  <span className="text-2xl font-bold">&times;</span>
                </button>
                <Dialog.Title className="text-3xl font-extrabold mb-6 text-primary-700 text-center tracking-tight">
                  {initialData ? 'Edit Skill' : 'Add New Skill'}
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  <div className="mb-5">
                    <label htmlFor="skillTitle" className="block mb-2 text-sm font-semibold text-gray-700">
                      Skill Title
                    </label>
                    <input
                      type="text"
                      id="skillTitle"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      placeholder="e.g., Boiler Repair"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="category" className="block mb-2 text-sm font-semibold text-gray-700">
                      Service Category
                    </label>
                    <select
                      id="category"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none bg-white"
                      required
                      disabled={loading || categories.length === 0}
                    >
                      <option value="" disabled>
                        {categories.length === 0 ? 'Loading categories...' : '-- Select Category --'}
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="rounded-lg px-5 py-2 font-semibold bg-primary-100 text-primary-700 hover:bg-primary-200 transition-all"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg px-5 py-2 font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-all shadow"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : (initialData ? 'Update Skill' : 'Add Skill')}
                    </button>
                  </div>
                </form>
                <style jsx>{`
                  .animate-fadeIn {
                    animation: fadeIn 0.3s ease;
                  }
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px);}
                    to { opacity: 1; transform: translateY(0);}
                  }
                `}</style>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SkillModal;