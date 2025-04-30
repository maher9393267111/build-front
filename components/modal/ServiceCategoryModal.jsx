import { useForm } from 'react-hook-form';
import React from 'react';
import {
  BoltIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon,
  WrenchIcon,
  Cog6ToothIcon,
  FireIcon,
  HomeModernIcon,
  // Add more as needed
} from '@heroicons/react/24/outline';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { Fragment } from 'react';

const ICON_OPTIONS = [
  { name: 'Electrician', value: 'BoltIcon', icon: BoltIcon },
  { name: 'Light Bulb', value: 'LightBulbIcon', icon: LightBulbIcon },
  { name: 'Wrench & Screwdriver', value: 'WrenchScrewdriverIcon', icon: WrenchScrewdriverIcon },
  { name: 'Wrench', value: 'WrenchIcon', icon: WrenchIcon },
  { name: 'Boiler/Heating', value: 'FireIcon', icon: FireIcon },
  { name: 'Plumber', value: 'Cog6ToothIcon', icon: Cog6ToothIcon },
  { name: 'Home/General', value: 'HomeModernIcon', icon: HomeModernIcon },
  // Add more icons as needed for your services
];

const ServiceCategoryModal = ({ initialData, onClose, onSubmit, loading }) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: initialData || { name: '', description: '', icon: '' }
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    reset(initialData || { name: '', description: '', icon: '' });
  }, [initialData, reset]);

  const submitHandler = (data) => {
    if (initialData) {
      onSubmit({ ...data, id: initialData.id });
    } else {
      onSubmit(data);
    }
  };

  // For Listbox (icon picker)
  const selectedIcon = ICON_OPTIONS.find(opt => opt.value === watch('icon')) || ICON_OPTIONS[0];

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
                  {initialData ? 'Edit' : 'Add'} Service Category
                </Dialog.Title>
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Name</label>
                    <input
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      {...register('name', { required: true })}
                      placeholder="Enter category name"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
                    <input
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      {...register('description')}
                      placeholder="Short description"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Icon</label>
                    <Listbox value={selectedIcon} onChange={opt => setValue('icon', opt.value)}>
                      <div className="relative">
                        <Listbox.Button className="w-full flex items-center gap-2 rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 px-3 py-2 transition-all">
                          <selectedIcon.icon className="h-6 w-6 text-primary-600" />
                          <span>{selectedIcon.name}</span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute mt-1 w-full bg-white shadow-lg rounded-lg z-10 max-h-48 overflow-y-auto">
                            {ICON_OPTIONS.map(opt => (
                              <Listbox.Option
                                key={opt.value}
                                value={opt}
                                className={({ active }) =>
                                  `flex items-center gap-2 px-4 py-2 cursor-pointer ${active ? 'bg-primary-100' : ''}`
                                }
                              >
                                <opt.icon className="h-5 w-5 text-primary-600" />
                                <span>{opt.name}</span>
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                    <input
                      className="mt-2 w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      {...register('icon')}
                      placeholder="Or enter icon name (e.g. BoltIcon)"
                    />
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

export default ServiceCategoryModal;