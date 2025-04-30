'use client';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import BlogGrid1 from '@components/elements/blog/BlogGrid1';
import Pagination from '@components/elements/PaginationDynamic';
import Filter1 from '@components/filter/FilterDynamic';
import Layout from '@components/layout/landing/Layout';
import NewsletterSection1 from '@components/sections/newsletter/Newsletter1';
import { getBlogs, getBlogCategories } from '@services/api';

const Blog = () => {
    const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('newest');
    const limit = 3; // Items per page

    // Map sort options to API sort values
    const sortMap = {
        'Name Asc': 'title',
        'Name Desc': 'title_desc',
        'Newest': 'newest',
        'Oldest': 'oldest',
        'Popular': 'popular'
    };

    // Query blogs with pagination and filters
    const { data: blogsData, isLoading } = useQuery(
        ['blogs', currentPage, searchTerm, selectedCategory, sortOption],
        () => getBlogs({
            page: currentPage,
            limit,
            search: searchTerm,
            category: selectedCategory,
            sort: sortMap[sortOption] || 'newest'
        }),
        { keepPreviousData: true }
    );

    // Get categories for filter
    const { data: categories } = useQuery('blogCategories', getBlogCategories);

    // Handle filter change
    const handleFilterChange = (value) => {
        setSortOption(value);
        setCurrentPage(1);
    };

    // Handle category selection
    const handleCategoryChange = (slug) => {
        setSelectedCategory(slug);
        setCurrentPage(1);
    };

    // Handle search
    const handleSearch = (term) => {
        console.log(term);
        setSearchTerm(term);
        setCurrentPage(1);
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <Layout
            headerStyle={1}
                breadcrumbTitle={"Our Blog"}
                breadcrumbSubTitle={"Explore our latest articles and updates"}
                breadcrumbAlign={"center"}
                headerBg={"transparent"}
            >
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
                <NewsletterSection1 />
            </Layout>
        </>
    );
};

export default Blog;


// import BlogGrid1 from '@components/elements/blog/BlogGrid1'
// import Pagination from '@components/elements/Pagination'
// import Filter1 from '@components/filter/Filter1'
// import Layout from '@components/layout/landing/Layout'
// import NewsletterSection1 from '@components/sections/newsletter/Newsletter1'
// import data from "@data/blog.json"
// export const metadata = {
//     title: 'Prexjob | Job Board Nextjs Tailwindcss Listing Directory Template',
// }
// const Blog = () => {
//     return (
//         <>
//             <Layout
//                 breadcrumbTitle={"Our Blog"}
//                 breadcrumbSubTitle={"Work for the best companies in the world"}
//                 breadcrumbAlign={"center"}
//                 headerBg={"transparent"}
//             >
//                 <div className="section-padding">
//                     <div className="container">
//                         <Filter1 content="Blog" />
//                         <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-12">
//                             {data.slice(0, 6).map((item, i) => (
//                                 <BlogGrid1 item={item} key={i} />
//                             ))}
//                         </div>
//                         <Pagination />
//                     </div>
//                 </div>
//                 <NewsletterSection1 />
//             </Layout>
//         </>
//     )
// }

// export default Blog