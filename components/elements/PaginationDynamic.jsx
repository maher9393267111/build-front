import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const PaginationDynamic = ({ currentPage, totalPages, onPageChange }) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            // Show all pages if not too many
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always include first and last page
            pageNumbers.push(1);
            
            // Determine the range to show around current page
            if (currentPage <= 3) {
                // Near the start
                for (let i = 2; i <= 4; i++) {
                    if (i < totalPages) pageNumbers.push(i);
                }
                pageNumbers.push('...');
            } else if (currentPage >= totalPages - 2) {
                // Near the end
                pageNumbers.push('...');
                for (let i = totalPages - 3; i < totalPages; i++) {
                    if (i > 1) pageNumbers.push(i);
                }
            } else {
                // Middle area
                pageNumbers.push('...');
                pageNumbers.push(currentPage - 1);
                pageNumbers.push(currentPage);
                pageNumbers.push(currentPage + 1);
                pageNumbers.push('...');
            }
            
            // Add last page if not already added
            if (totalPages > 1) pageNumbers.push(totalPages);
        }
        
        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();
    
    return (
        <div className="flex items-center justify-center space-x-1">
            {/* Previous button */}
            <button
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                    currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
                <ChevronLeftIcon className="h-5 w-5" />
            </button>
            
            {/* Page numbers */}
            {pageNumbers.map((pageNumber, index) => (
                <React.Fragment key={index}>
                    {pageNumber === '...' ? (
                        <span className="px-3 py-2">...</span>
                    ) : (
                        <button
                            onClick={() => pageNumber !== currentPage && onPageChange(pageNumber)}
                            className={`px-3 py-1 rounded-md ${
                                pageNumber === currentPage
                                    ? 'bg-primary-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {pageNumber}
                        </button>
                    )}
                </React.Fragment>
            ))}
            
            {/* Next button */}
            <button
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                    currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
                <ChevronRightIcon className="h-5 w-5" />
            </button>
        </div>
    );
};

export default PaginationDynamic;