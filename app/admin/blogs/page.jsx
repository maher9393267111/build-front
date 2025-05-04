'use client';
import { useState, Fragment } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Menu, Transition } from '@headlessui/react';
import {
  getAdminBlogs,
  getBlogCategories,
  deleteBlog
} from '@services/api';
import { 
  PencilSquareIcon, 
  TrashIcon, 
  EyeIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import ConfirmationModal from '@components/modal/ConfirmationModal';
import { formatDate } from '@utils/dateUtils';
import PaginationDynamic from '@components/elements/PaginationDynamic';

const STATUS_COLORS = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800'
};

const AdminBlogs = () => {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Get blogs with pagination, filtering and search
  const { 
    data: blogsData, 
    isLoading 
  } = useQuery(
    ['adminBlogs', currentPage, searchTerm, filters],
    () => getAdminBlogs({
      page: currentPage,
      limit: 5,
      search: searchTerm,
      category: filters.category,
      status: filters.status
    }),
    { keepPreviousData: true }
  );

  // Get categories for filter dropdown
  const { data: categories } = useQuery('blogCategories', getBlogCategories);

  const deleteMutation = useMutation(deleteBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminBlogs');
      setConfirmOpen(false);
      setBlogToDelete(null);
    }
  });

  const handleDelete = (blog) => {
    setBlogToDelete(blog);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (blogToDelete) {
      deleteMutation.mutate(blogToDelete.id);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleFilterChange = (e, filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: e.target.value
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({ category: '', status: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 px-6 py-4 rounded-lg shadow bg-gradient-to-r from-primary-700 to-primary-500">
        <h2 className="text-xl font-bold text-white drop-shadow">Blog Management</h2>
        <Link 
          href="/admin/blogs/new"
          className="px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-800 text-white font-semibold rounded shadow-lg hover:from-primary-700 hover:to-primary-900 transition flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Blog Post</span>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative w-full md:w-auto flex-grow md:max-w-sm">
              <input
                type="text"
                placeholder="Search blogs..."
                className="w-full pl-10 pr-10 py-2.5 border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all rounded-lg outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              )}
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </form>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Category Filter Dropdown */}
            <Menu as="div" className="relative inline-block text-left w-full sm:w-auto">
              <Menu.Button className="inline-flex justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50/50 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-opacity-75 border border-gray-200 rounded-lg">
                <FunnelIcon className="h-5 w-5 mr-2" />
                <span>Category: {filters.category ? categories?.find(c => c.id.toString() === filters.category)?.name : 'All Categories'}</span>
                <ChevronDownIcon className="h-5 w-5 ml-2 -mr-1" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute z-10 left-0 w-full mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleFilterChange({ target: { value: '' }}, 'category')}
                          className={`${
                            active ? 'bg-primary-500 text-white' : 'text-gray-700'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        >
                          All Categories
                        </button>
                      )}
                    </Menu.Item>
                    {categories?.map(category => (
                      <Menu.Item key={category.id}>
                        {({ active }) => (
                          <button
                            onClick={() => handleFilterChange({ target: { value: category.id.toString() }}, 'category')}
                            className={`${
                              active ? 'bg-primary-500 text-white' : 'text-gray-700'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          >
                            {category.name}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            
            {/* Status Filter Dropdown */}
            <Menu as="div" className="relative inline-block text-left w-full sm:w-auto">
              <Menu.Button className="inline-flex justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50/50 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-opacity-75 border border-gray-200 rounded-lg">
                <span>Status: {filters.status ? filters.status.charAt(0).toUpperCase() + filters.status.slice(1) : 'All Statuses'}</span>
                <ChevronDownIcon className="h-5 w-5 ml-2 -mr-1" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute z-10 right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleFilterChange({ target: { value: '' }}, 'status')}
                          className={`${
                            active ? 'bg-primary-500 text-white' : 'text-gray-700'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        >
                          All Statuses
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleFilterChange({ target: { value: 'published' }}, 'status')}
                          className={`${
                            active ? 'bg-primary-500 text-white' : 'text-gray-700'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        >
                          Published
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleFilterChange({ target: { value: 'draft' }}, 'status')}
                          className={`${
                            active ? 'bg-primary-500 text-white' : 'text-gray-700'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        >
                          Draft
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            
            {/* Clear filters button */}
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              title="Clear filters"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      {blogsData?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100 hover:shadow-md transition">
            <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Total Posts</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">{blogsData.stats.total}</p>
            <div className="mt-2 text-xs text-gray-400">All blog posts</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100 hover:shadow-md transition">
            <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Published</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">{blogsData.stats.published}</p>
            <div className="mt-2 text-xs text-gray-400">Live on the site</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100 hover:shadow-md transition">
            <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Drafts</h3>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{blogsData.stats.drafts}</p>
            <div className="mt-2 text-xs text-gray-400">In progress</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100 hover:shadow-md transition">
            <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Archived</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">{blogsData.stats.archived || 0}</p>
            <div className="mt-2 text-xs text-gray-400">No longer active</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100 hover:shadow-md transition">
            <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Total Views</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{blogsData.stats.totalViews}</p>
            <div className="mt-2 text-xs text-gray-400">All-time views</div>
          </div>
        </div>
      )}

      {/* Blog table */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-primary-700 to-primary-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : blogsData?.blogs?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No blogs found</td>
              </tr>
            ) : (
              blogsData?.blogs?.map((blog, idx) => (
                <tr
                  key={blog.id}
                  className={idx % 2 === 0 ? "bg-gray-50 hover:bg-blue-50 transition" : "bg-white hover:bg-blue-50 transition"}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      {blog.featuredImage && (
                        <img 
                          src={blog.featuredImage?.url} 
                          alt={blog.title} 
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                      )}
                      <div className="truncate max-w-xs">
                        <div className="font-medium text-gray-900">{blog.title}</div>
                        <div className="text-xs text-gray-500 truncate">{blog.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{blog.category.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[blog.status]}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{blog.viewCount}</td>
                  <td className="px-6 py-4">{formatDate(blog.createdAt)}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link
                      href={`/blog/${blog?.slug}`}
                      target="_blank"
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                      title="View"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`/admin/blogs/edit/${blog.id}`}
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow transition focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      title="Edit"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </Link>
                    <button
                      className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow transition focus:outline-none focus:ring-2 focus:ring-red-300"
                      onClick={() => handleDelete(blog)}
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {blogsData?.pagination && (
        <div className="mt-4 bg-white p-3 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-2 text-center">
            Showing {((blogsData.pagination.page - 1) * blogsData.pagination.limit) + 1} to {Math.min(blogsData.pagination.page * blogsData.pagination.limit, blogsData.pagination.total)} of {blogsData.pagination.total} results
          </div>
          <PaginationDynamic 
            currentPage={currentPage}
            totalPages={blogsData.pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Responsive hint for mobile */}
      <div className="sm:hidden text-xs text-gray-500 mt-2">Scroll right to see more &rarr;</div>
      
      {confirmOpen && (
        <ConfirmationModal
          open={confirmOpen}
          onClose={() => {
            setConfirmOpen(false);
            setBlogToDelete(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Blog Post"
          description={`Are you sure you want to delete "${blogToDelete?.title}"? This action cannot be undone.`}
          loading={deleteMutation.isLoading}
        />
      )}
    </>
  );
};

export default AdminBlogs;