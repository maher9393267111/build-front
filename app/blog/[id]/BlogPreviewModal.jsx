'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { formatDate } from '@utils/dateUtils';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

const BlogPreviewModal = ({ isOpen, closeModal, blog }) => {
  if (!blog) return null;









  console.log('BlogPreviewModal: Rendering/Updating. isOpen:', isOpen, 'Blog Title:', blog?.title);
  if (isOpen && blog?.content) {
      // console.log('BlogPreviewModal: Current blog content for preview (first 200 chars):', blog.content.substring(0, 200) + "...");
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="flex min-h-full items-center justify-center p-4 text-lef">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform rounded-2xl bg-white shadow-2xl transition-all overflow-y-auto max-h-[calc(100vh-2rem)]">
                {/* Modal Header with Close Button */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={closeModal}
                    className="inline-flex items-center justify-center rounded-full bg-black bg-opacity-50 p-3 text-white transition-all duration-200 hover:bg-opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Featured Image */}
                {blog.featuredImage && (
                  <div className="relative h-80 md:h-96 overflow-hidden">
                    <img
                      src={blog.featuredImage.url}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className="px-6 py-8 md:px-8 md:py-10">
                  {/* Category and Date */}
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="inline-block rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary-600">
                      {blog.category.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                    {blog.title}
                  </h2>

                  {/* View Count */}
                  <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-primary-500" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                      />
                    </svg>
                    <span>{blog.viewCount} views</span>
                  </div>

                  {/* Content Preview - Updated */}
                  <div
                    className="log-content l-editor mb-8 mx-h-[250px] overflow-y-auto text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />

                  {/* Call to Action Buttons */}
                  <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                    <Link
                      href={`/blog/${blog.slug}`}
                      onClick={() => {
                        console.log('BlogPreviewModal: "Read Full Article" link clicked. Closing modal.');
                        closeModal();
                      }}
                      className="flex-1 rounded-lg bg-primary-600 px-6 py-3 text-center font-semibold text-white transition-all duration-200 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Read Full Article
                    </Link>
                    <button
                      onClick={() => {
                        console.log('BlogPreviewModal: "Continue Browsing" button clicked. Closing modal.');
                        closeModal();
                      }}
                      className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Continue Browsing
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BlogPreviewModal;