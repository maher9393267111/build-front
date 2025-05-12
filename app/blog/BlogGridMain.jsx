'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from 'react-query';
import { getBlogs } from '@services/api';
import BlogGrid1 from '@components/elements/blog/BlogGrid1';
import Pagination from '@components/elements/PaginationDynamic';
import Filter1 from '@components/filter/FilterDynamic';
// import NewsletterSection1 from '@components/sections/newsletter/Newsletter1';

const BlogGridMain = ({ initialData, categories }) => {
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('Newest');
    const limit = 6; // Items per page

    // Initialize category from URL parameters when component mounts
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [searchParams]);

    // Map sort options to API sort values
    const sortMap = {
        'Name Asc': 'title',
        'Name Desc': 'title_desc',
        'Newest': 'newest',
        'Oldest': 'oldest',
        'Popular': 'popular'
    };

    // Fetch blogs using React Query with the same API service as page.js
    const { data: blogsData, isLoading } = useQuery(
        ['blogs', currentPage, searchTerm, selectedCategory, sortOption],
        () => getBlogs({
            page: currentPage,
            limit,
            search: searchTerm,
            category: selectedCategory,
            sort: sortMap[sortOption] || 'newest'
        }),
        {
            initialData: initialData && Object.keys(initialData).length > 0 ? initialData : undefined,
            refetchOnWindowFocus: false,
            enabled: !(currentPage === 1 && !searchTerm && !selectedCategory && sortOption === 'Newest' && initialData && Object.keys(initialData).length > 0)
        }
    );

    // Handle filter change
    const handleFilterChange = (value) => {
        setSortOption(value);
        setCurrentPage(1);
    };

    // Handle category selection
    const handleCategoryChange = (slug) => {
        // Update URL without full page reload
        const url = new URL(window.location);
        if (slug) {
            url.searchParams.set('category', slug);
        } else {
            url.searchParams.delete('category');
        }
        window.history.pushState({}, '', url);
        
        setSelectedCategory(slug);
        setCurrentPage(1);
    };

    // Handle search
    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    return (
        <>
            <div className="section-padding">
                <div className="container">
                    <Filter1 
                        content="Blog" 
                        total={blogsData?.pagination?.total || 0}
                        onSortChange={handleFilterChange}
                        onCategoryChange={handleCategoryChange}
                        onSearch={handleSearch}
                        categories={categories || []}
                        selectedCategory={selectedCategory}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    
                    {isLoading ? (
                        <div className="flex justify-center items-center h-80">
                            <div className="text-lg font-medium text-gray-600">Loading articles...</div>
                        </div>
                    ) : blogsData?.blogs?.length === 0 ? (
                        <div className="bg-yellow-50 text-yellow-700 p-8 rounded-lg text-center my-8">
                            <h3 className="font-semibold text-lg mb-2">No articles found</h3>
                            <p>Try adjusting your search criteria</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-12">
                            {blogsData?.blogs?.map((blog) => (
                                <BlogGrid1 item={blog} key={blog.id} />
                            ))}
                        </div>
                    )}
                    
                    {blogsData?.pagination && blogsData.pagination.totalPages > 1 && (
                        <Pagination 
                            currentPage={currentPage} 
                            totalPages={blogsData.pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
            {/* <NewsletterSection1 /> */}
        </>
    );
};

export default BlogGridMain;