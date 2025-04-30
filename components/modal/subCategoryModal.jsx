import { useForm, useFieldArray } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { getSubCategories } from '@services/api';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

const SubCategoryModal = ({ initialData, onClose, onSubmit, loading, categoryId }) => {
  const { register, handleSubmit, reset, control, watch } = useForm({
    // Default values will be set via reset in useEffect
  });

  console.log(initialData ,'initialData');
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subcategories"
  });
  
  const [parentOptions, setParentOptions] = useState([{ id: null, name: '-- None (Top Level) --' }]); // Initialize with None option
  const [isLoading, setIsLoading] = useState(false);

  // Combined Effect for Loading Parent Options and Resetting Form
  useEffect(() => {
    const loadParentOptionsAndReset = async () => {
      if (!categoryId) {
        // If no categoryId, reset to a default blank state and keep only "None" option
        setParentOptions([{ id: null, name: '-- None (Top Level) --' }]);
        reset({ subcategories: [{ name: '', description: '', categoryId: null, parentSubCategoryId: '' }] });
        return;
      }

      setIsLoading(true);
      let loadedOptions = [];
      try {
        const skipId = initialData?.id || null;
        const subcats = await getSubCategories({ categoryId });
        const filtered = subcats.filter(subcat => subcat.id !== skipId);
        
        loadedOptions = [
          { id: null, name: '-- None (Top Level) --' }, // Keep null ID here
          ...filtered
        ];
        setParentOptions(loadedOptions);
      } catch (error) {
        console.error('Error loading parent subcategories:', error);
        // Keep the 'None' option even if loading fails
        setParentOptions([{ id: null, name: '-- None (Top Level) --' }]);
      } finally {
        setIsLoading(false);

        // Reset form AFTER options are set
        if (initialData) {
          reset({
            subcategories: [{
              ...initialData,
              // Ensure parentSubCategoryId is a string (' ' for null) for the select input
              parentSubCategoryId: initialData.parentSubCategoryId === null ? '' : String(initialData.parentSubCategoryId),
              categoryId: initialData.categoryId || categoryId
            }]
          });
        } else {
          // For new subcategory, default parent is 'None' (represented by '')
          reset({ 
            subcategories: [{ 
              name: '', 
              description: '', 
              categoryId, 
              parentSubCategoryId: '' // Default to empty string for 'None'
            }]
          });
        }
      }
    };
    
    loadParentOptionsAndReset();
    
  }, [categoryId, initialData, reset]); // Dependencies trigger the effect

  const submitHandler = (data) => {
     // Convert parentSubCategoryId back to null if it's an empty string before submitting
     const subcategoriesToSubmit = data.subcategories.map(sub => ({
        ...sub,
        parentSubCategoryId: sub.parentSubCategoryId === '' ? null : Number(sub.parentSubCategoryId) // Convert back to null or number
     }));

    if (initialData) {
      // Single update
      onSubmit({ ...subcategoriesToSubmit[0], id: initialData.id });
    } else {
      // Batch create
      onSubmit(subcategoriesToSubmit);
    }
  };

  const addSubcategory = () => {
    append({ name: '', description: '', categoryId, parentSubCategoryId: null });
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
                  {initialData ? 'Edit' : 'Add'} Subcategory
                </Dialog.Title>
                <form onSubmit={handleSubmit(submitHandler)} className="max-h-[60vh] overflow-y-auto pr-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="mb-6 p-4 border border-gray-200 rounded-lg relative">
                      {!initialData && fields.length > 1 && (
                        <button 
                          type="button" 
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          onClick={() => remove(index)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                      
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Name</label>
                        <input
                          className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                          {...register(`subcategories.${index}.name`, { required: true })}
                          placeholder="Enter subcategory name"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
                        <input
                          className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                          {...register(`subcategories.${index}.description`)}
                          placeholder="Short description"
                        />
                      </div>
                      
                      <div className="mb-2">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Parent Subcategory</label>
                        <select
                          className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                          // Register without valueAsNumber, default value will be matched as string
                          {...register(`subcategories.${index}.parentSubCategoryId`)} 
                          disabled={isLoading}
                        >
                          {parentOptions.map(option => (
                            // Use empty string ('') for null ID value, stringified ID otherwise
                            <option key={option.id ?? 'null-key'} value={option.id === null ? '' : String(option.id)}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                        {isLoading && <p className="text-sm text-gray-500 mt-1">Loading options...</p>}
                      </div>
                      
                      <input type="hidden" {...register(`subcategories.${index}.categoryId`)} value={categoryId} />
                    </div>
                  ))}
                  
                  {!initialData && (
                    <button
                      type="button"
                      className="w-full mb-5 py-2 border-2 border-dashed border-primary-300 rounded-lg text-primary-600 hover:bg-primary-50 transition flex items-center justify-center gap-2"
                      onClick={addSubcategory}
                    >
                      <PlusIcon className="h-5 w-5" />
                      Add Another Subcategory
                    </button>
                  )}
                  
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

export default SubCategoryModal;