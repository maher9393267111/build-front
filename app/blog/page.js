//no cache
export const revalidate = 0;

import { getBlogs, getBlogCategories, getSiteSettings } from '@services/api';
import Layout from '@components/layout/landing/Layout';
import BlogGridMain from './BlogGridMain';

// Generate metadata dynamically from settings
export async function generateMetadata() {
    try {
        const settings = await getSiteSettings();

        return {
            title: settings?.blogMetaTitle || 'Blog - Latest Articles and Updates',
            description: settings?.blogMetaDescription || 'Explore our latest articles, news, and insights',
            keywords: settings?.blogMetaKeywords
                ? settings.blogMetaKeywords.split(',').map(k => k.trim())
                : ['blog', 'articles', 'news', 'updates'],
            openGraph: {
                title: settings?.blogMetaTitle || 'Blog - Latest Articles and Updates',
                description: settings?.blogMetaDescription || 'Explore our latest articles, news, and insights',
                ...(settings?.ogImage?.url && {
                    images: [{ url: settings.ogImage.url }]
                }),
            },
        };
    } catch (error) {
        console.error('Failed to fetch blog SEO settings:', error);
        return {
            title: 'Blog - Latest Articles and Updates',
            description: 'Explore our latest articles, news, and insights',
            keywords: ['blog', 'articles', 'news', 'updates'],
        };
    }
}

export default async function BlogPage() {
    // Fetch initial data server-side
    const [blogsData, categories, settings] = await Promise.all([
        getBlogs({ page: 1, limit: 6, sort: 'newest' }),
        getBlogCategories(),
        getSiteSettings()
    ]);
    
    // Get hero title and image from settings
    const heroTitle = "Our Blog";
    const heroSubTitle = settings?.blogSection?.heroTitle || "Explore our latest articles and updates";
    const heroImage = settings?.blogSection?.heroImage?.url || null;

    return (
        <Layout
            headerStyle={1}
            breadcrumbTitle={heroTitle}
            breadcrumbSubTitle={heroSubTitle}
            breadcrumbAlign={"center"}
            breadcrumbImage={heroImage}
            headerBg={"transparent"}
        >
            <BlogGridMain 
                initialData={blogsData} 
                categories={categories} 
            />
        </Layout>
    );
}




// 'use client';
// import { useState, useEffect } from 'react';
// import { useQuery } from 'react-query';
// import { useSearchParams } from 'next/navigation';
// import BlogGrid1 from '@components/elements/blog/BlogGrid1';
// import Pagination from '@components/elements/PaginationDynamic';
// import Filter1 from '@components/filter/FilterDynamic';
// import Layout from '@components/layout/landing/Layout';
// import NewsletterSection1 from '@components/sections/newsletter/Newsletter1';
// import { getBlogs, getBlogCategories } from '@services/api';

// const Blog = () => {
//     const searchParams = useSearchParams();
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [sortOption, setSortOption] = useState('newest');
//     const limit = 3; // Items per page

//     // Initialize category from URL parameters when component mounts
//     useEffect(() => {
//         const categoryFromUrl = searchParams.get('category');
//         if (categoryFromUrl) {
//             setSelectedCategory(categoryFromUrl);
//         }
//     }, [searchParams]);

//     // Map sort options to API sort values
//     const sortMap = {
//         'Name Asc': 'title',
//         'Name Desc': 'title_desc',
//         'Newest': 'newest',
//         'Oldest': 'oldest',
//         'Popular': 'popular'
//     };

//     // Query blogs with pagination and filters
//     const { data: blogsData, isLoading } = useQuery(
//         ['blogs', currentPage, searchTerm, selectedCategory, sortOption],
//         () => getBlogs({
//             page: currentPage,
//             limit,
//             search: searchTerm,
//             category: selectedCategory,
//             sort: sortMap[sortOption] || 'newest'
//         }),
//         { keepPreviousData: true }
//     );

//     // Get categories for filter
//     const { data: categories } = useQuery('blogCategories', getBlogCategories);

//     // Handle filter change
//     const handleFilterChange = (value) => {
//         setSortOption(value);
//         setCurrentPage(1);
//     };

//     // Handle category selection
//     const handleCategoryChange = (slug) => {
//         // Update URL without full page reload
//         const url = new URL(window.location);
//         if (slug) {
//             url.searchParams.set('category', slug);
//         } else {
//             url.searchParams.delete('category');
//         }
//         window.history.pushState({}, '', url);
        
//         setSelectedCategory(slug);
//         setCurrentPage(1);
//     };

//     // Handle search
//     const handleSearch = (term) => {
//         setSearchTerm(term);
//         setCurrentPage(1);
//     };

//     // Handle pagination
//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//     };

//     return (
//         <>
//             <Layout
//                 headerStyle={1}
//                 breadcrumbTitle={"Our Blog"}
//                 breadcrumbSubTitle={"Explore our latest articles and updates"}
//                 breadcrumbAlign={"center"}
//                 headerBg={"transparent"}
//             >
//                 <div className="section-padding">
//                     <div className="container">
//                         <Filter1 
//                             content="Blog" 
//                             total={blogsData?.pagination?.total || 0}
//                             onSortChange={handleFilterChange}
//                             onCategoryChange={handleCategoryChange}
//                             onSearch={handleSearch}
//                             categories={categories || []}
//                             selectedCategory={selectedCategory}
//                             searchTerm={searchTerm}
//                             setSearchTerm={setSearchTerm}
//                         />
                        
//                         {isLoading ? (
//                             <div className="flex justify-center items-center h-80">
//                                 <div className="text-lg font-medium text-gray-600">Loading articles...</div>
//                             </div>
//                         ) : blogsData?.blogs?.length === 0 ? (
//                             <div className="bg-yellow-50 text-yellow-700 p-8 rounded-lg text-center my-8">
//                                 <h3 className="font-semibold text-lg mb-2">No articles found</h3>
//                                 <p>Try adjusting your search criteria</p>
//                             </div>
//                         ) : (
//                             <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-12">
//                                 {blogsData?.blogs?.map((blog) => (
//                                     <BlogGrid1 item={blog} key={blog.id} />
//                                 ))}
//                             </div>
//                         )}
                        
//                         {blogsData?.pagination && blogsData.pagination.totalPages > 1 && (
//                             <Pagination 
//                                 currentPage={currentPage} 
//                                 totalPages={blogsData.pagination.totalPages}
//                                 onPageChange={handlePageChange}
//                             />
//                         )}
//                     </div>
//                 </div>
//                 <NewsletterSection1 />
//             </Layout>
//         </>
//     );
// };

// export default Blog;

