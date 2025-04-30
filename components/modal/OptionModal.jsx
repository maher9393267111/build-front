import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { getSubCategories } from '@services/api';

export default function OptionModal({ onClose, onSubmit, questionId, loading, categoryId, option }) {
  const [formData, setFormData] = React.useState({
    optionText: option?.optionText || '',
    description: option?.description || '',
    orderIndex: option?.orderIndex || 0,
    subCategoryId: option?.subCategory?.id || option?.subCategoryId || null
  });
  
  const [error, setError] = React.useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // Load subcategories
  useEffect(() => {
    const loadSubCategories = async () => {
      if (!categoryId) return;
      
      setIsLoading(true);
      try {
        const subcats = await getSubCategories({ categoryId });
        setSubCategories(subcats);
        
        // Find the subcategory if editing an option with a subcategory
        if (option?.subCategory?.id || option?.subCategoryId) {
          const subCatId = option.subCategory?.id || option.subCategoryId;
          const found = subcats.find(sc => sc.id === parseInt(subCatId));
          console.log("🔶️🔶️🔶️FOUND🔶️🔶️🔶️", found)
          if (found) {
            setSelectedSubCategory(found);
          }
        }
      } catch (error) {
        console.error('Error loading subcategories:', error);
        setError('Failed to load subcategories');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSubCategories();
  }, [categoryId, option]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'subCategoryId' && value) {
      const selected = subCategories.find(sc => sc.id === parseInt(value));
      setSelectedSubCategory(selected || null);
    } else if (name === 'subCategoryId' && !value) {
      setSelectedSubCategory(null);
    }
    
    setFormData({
      ...formData,
      [name]: name === 'orderIndex' || name === 'subCategoryId' ? 
        value ? parseInt(value) : null : 
        value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!formData.optionText.trim() && !formData.subCategoryId) {
      setError('Either option text or subcategory selection is required.');
      return;
    }
    onSubmit({
      ...formData,
      questionId
    });
    onClose();
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
                  {option ? 'Edit Option' : 'Add Option'}
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Option Text</label>
                    <input
                      type="text"
                      name="optionText"
                      value={formData.optionText}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      placeholder="Enter option text"
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Link to Subcategory</label>
                    <select
                      name="subCategoryId"
                      value={formData.subCategoryId || ''}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      disabled={loading || isLoading}
                    >
                      <option value="">-- Select a Subcategory --</option>
                      {subCategories.map(subcat => (
                        <option key={subcat.id} value={subcat.id}>
                          {subcat.name}
                        </option>
                      ))}
                    </select>
                    {isLoading && <p className="text-sm text-gray-500 mt-1">Loading subcategories...</p>}
                    
                    {/* Show selected subcategory info when available */}
                    {selectedSubCategory && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="font-medium text-blue-700">{selectedSubCategory.name}</p>
                        {selectedSubCategory.description && (
                          <p className="text-sm text-blue-600 mt-1">{selectedSubCategory.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Description (Optional)</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      rows="3"
                      placeholder="Short description"
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Order Index</label>
                    <input
                      type="number"
                      name="orderIndex"
                      value={formData.orderIndex}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      min="0"
                      disabled={loading}
                    />
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
                      {option ? 'Update Option' : 'Add Option'}
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
}

// import React from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment } from 'react';

// export default function OptionModal({ onClose, onSubmit, questionId, loading }) {
//   const [formData, setFormData] = React.useState({
//     optionText: '',
//     description: '',
//     orderIndex: 0
//   });

//   const [error, setError] = React.useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === 'orderIndex' ? parseInt(value) : value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError('');
//     if (!formData.optionText.trim()) {
//       setError('Option text is required.');
//       return;
//     }
//     onSubmit(formData);
//   };

//   return (
//     <Transition appear show as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-200"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-150"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-200"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-150"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="relative bg-white p-8 rounded-2xl shadow-3xl w-full max-w-lg border-t-8 border-primary-500 animate-fadeIn">
//                 {/* Close Button */}
//                 <button
//                   type="button"
//                   className="absolute top-4 right-4 bg-primary-50 hover:bg-primary-100 text-primary-600 hover:text-primary-700 rounded-full w-10 h-10 flex items-center justify-center shadow transition-all"
//                   onClick={onClose}
//                   aria-label="Close"
//                   disabled={loading}
//                 >
//                   <span className="text-2xl font-bold">&times;</span>
//                 </button>
//                 <Dialog.Title className="text-3xl font-extrabold mb-6 text-primary-700 text-center tracking-tight">
//                   Add Option
//                 </Dialog.Title>
//                 <form onSubmit={handleSubmit}>
//                   {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//                   <div className="mb-5">
//                     <label className="block mb-2 text-sm font-semibold text-gray-700">Option Text</label>
//                     <input
//                       type="text"
//                       name="optionText"
//                       value={formData.optionText}
//                       onChange={handleChange}
//                       className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
//                       required
//                       placeholder="Enter option text"
//                       disabled={loading}
//                     />
//                   </div>
//                   <div className="mb-5">
//                     <label className="block mb-2 text-sm font-semibold text-gray-700">Description (Optional)</label>
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleChange}
//                       className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
//                       rows="3"
//                       placeholder="Short description"
//                       disabled={loading}
//                     />
//                   </div>
//                   <div className="mb-6">
//                     <label className="block mb-2 text-sm font-semibold text-gray-700">Order Index</label>
//                     <input
//                       type="number"
//                       name="orderIndex"
//                       value={formData.orderIndex}
//                       onChange={handleChange}
//                       className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
//                       min="0"
//                       disabled={loading}
//                     />
//                   </div>
//                   <div className="flex justify-end gap-3">
//                     <button
//                       type="button"
//                       className="rounded-lg px-5 py-2 font-semibold bg-primary-100 text-primary-700 hover:bg-primary-200 transition-all"
//                       onClick={onClose}
//                       disabled={loading}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="rounded-lg px-5 py-2 font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-all shadow"
//                       disabled={loading}
//                     >
//                       Add Option
//                     </button>
//                   </div>
//                 </form>
//                 <style jsx>{`
//                   .animate-fadeIn {
//                     animation: fadeIn 0.3s ease;
//                   }
//                   @keyframes fadeIn {
//                     from { opacity: 0; transform: translateY(20px);}
//                     to { opacity: 1; transform: translateY(0);}
//                   }
//                 `}</style>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// } 