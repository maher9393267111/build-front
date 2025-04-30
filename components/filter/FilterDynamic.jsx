
'use client'

import { useState } from 'react';
import DropDown from '@components/elements/DropDownDynamic';

const sortBy = [
    { name: 'Newest' },
    { name: 'Oldest' },
    { name: 'Popular' },
    { name: 'Name Asc' },
    { name: 'Name Desc' },
];

const Filter1 = ({
    content,
    total,
    onSortChange,
    onCategoryChange,
    onSearch,
    categories = [],
    selectedCategory,
    searchTerm,
    setSearchTerm,
}) => {
    const handleSortChange = (value) => {
        if (onSortChange) onSortChange(value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(searchTerm);
    };

    return (
        <>
            <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-5 justify-between items-start md:items-center">
                    <h4 className="text-pgray-500">
                        Showing {total} {content}{total !== 1 ? 's' : ''}
                    </h4>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Search */}
                        <form onSubmit={handleSearchSubmit} className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pr-10 py-2 pl-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-primary-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                        
                        {/* Sort Options */}
                        <div className="w-full sm:w-48">
                            <DropDown 
                                dropdownOption={sortBy} 
                                onChange={handleSortChange}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Categories */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        <button
                            onClick={() => onCategoryChange('')}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                selectedCategory === '' 
                                ? 'bg-primary-500 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => onCategoryChange(category.slug)}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                    selectedCategory === category.slug 
                                    ? 'bg-primary-500 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category.name} ({category.blogCount || 0})
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Filter1;