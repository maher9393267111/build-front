import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';

const DropDown = ({ dropdownOption, onChange }) => {
    const [selectedFilter, setSelectedFilter] = useState(dropdownOption[0]);

    const handleSelect = (option) => {
        setSelectedFilter(option);
        if (onChange) onChange(option.name);
    };

    return (
        <Menu as="div" className="relative inline-block text-left w-full">
            <div>
                <Menu.Button className="h-full inline-flex justify-between w-full px-4 py-2.5 text-sm font-medium text-pgray-500 bg-gray-50/50 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 border border-gray-200 rounded-lg">
                    <span>Sort by: {selectedFilter.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 -mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute z-10 right-0 w-full mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                        {dropdownOption?.map((option, i) => (
                            <Menu.Item key={i}>
                                {({ active }) => (
                                    <button
                                        onClick={() => handleSelect(option)}
                                        className={`${active ? 'bg-primary-500 text-white' : 'text-pgray-500'} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                    >
                                        {option.name}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default DropDown;