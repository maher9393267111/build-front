"use client";

import React from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Icon from '@components/ui/Icon';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function PageContent({ pageData }) {
  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600">The page you are looking for does not exist or has been moved.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {pageData.blocks && pageData.blocks.length > 0 ? (
        <div className="page-content">
          {pageData.blocks
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((block, index) => (
              <div key={index} id={`block-${index}`} className="block-content">
                {renderBlock(block, index)}
              </div>
            ))}
        </div>
      ) : (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">{pageData.title}</h1>
          <p className="text-gray-600">This page has no content blocks yet.</p>
        </div>
      )}
    </div>
  );
}

// Render individual blocks based on type
function renderBlock(block, blockIndex) {
  switch (block.type) {
    case "hero":
      return (
        <div
          className="relative bg-gray-100 h-96 md:h-[28rem] overflow-hidden flex items-center"
          style={{
            backgroundColor: block.content?.backgroundColor || "#f3f4f6",
          }}
        >
          {block.content?.imageUrl?.url && (
            <img
              src={block.content.imageUrl.url}
              alt="Hero Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div
            className={`relative z-10 container mx-auto px-4 ${
              block.content?.textDirection === "center"
                ? "text-center"
                : block.content?.textDirection === "right"
                ? "text-right ml-auto"
                : ""
            }`}
          >
            <div className="max-w-lg bg-whie/80 backdrop-blur-sm p-6 rounded-lg shadow-lg"
            
            style={{
              backgroundColor: block.content?.backgroundColor || "#f3f4f6",
            }}
            >
              <h1 
                className="text-3xl font-bold mb-4"
                style={{
                  color: block.content?.textColor || "#000000",
                }}
              >
                {block.content?.heading || "Hero Heading"}
              </h1>
              <p 
                className="text-lg mb-6"
                style={{
                  color: block.content?.textColor || "#000000",
                }}
              >
                {block.content?.subheading ||
                  "Hero subheading text goes here"}
              </p>
              {block.content?.buttonText && (
                <button 
                  className="hover:opacity-90 px-6 py-2 rounded-md transition-colors"
                  style={{
                    backgroundColor: block.content?.buttonBgColor || "#3b82f6",
                    color: block.content?.buttonTextColor || "#ffffff",
                  }}
                  onClick={() => {
                    if (block.content?.buttonLink) {
                      window.location.href = block.content.buttonLink;
                    }
                  }}
                >
                  {block.content.buttonText}
                </button>
              )}
            </div>
          </div>
        </div>
      );

    case "features":
      return (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {block.content?.sectionTitle || "Features"}
              </h2>
              {block.content?.sectionSubtitle && (
                <p className="text-lg text-gray-600 mx-auto max-w-2xl">
                  {block.content.sectionSubtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(block.content?.features || []).map((feature, i) => (
                <div
                  key={i}
                  className="group p-8 rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                      <Icon
                        icon={feature.icon || "CheckCircle"}
                        className="h-7 w-7 transform group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors">
                      {feature.title || `Feature ${i + 1}`}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description || "Feature description text"}
                    </p>
                    {feature.link && (
                      <div className="mt-5">
                        <a href={feature.link} className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 group-hover:translate-x-1 transition-transform">
                          Learn more
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "cta":
      return (
        <div
          className={`py-16 ${
            block.content?.bgStyle === "color"
              ? "bg-blue-600"
              : "bg-gray-800 bg-opacity-80"
          }`}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {block.content?.heading || "Call to Action"}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {block.content?.description ||
                "Call to action description text"}
            </p>
            {block.content?.buttonText && (
              <button className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors">
                {block.content.buttonText}
              </button>
            )}
          </div>
        </div>
      );

    case "testimonials":
      const testimonialSwiperOptions = {
        modules: [Navigation, Pagination],
        slidesPerView: 1,
        spaceBetween: 30,
        loop: (block.content?.testimonials || []).length > 1,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: `.testimonial-pagination-${blockIndex}`,
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: `.testimonial-next-${blockIndex}`,
          prevEl: `.testimonial-prev-${blockIndex}`,
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: (block.content?.testimonials || []).length > 2 ? 3 : (block.content?.testimonials || []).length || 1,
            spaceBetween: 30,
          },
        },
      };

      return (
        <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {block.content?.sectionTitle || "Testimonials"}
              </h2>
              {block.content?.sectionSubtitle && (
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {block.content.sectionSubtitle}
                </p>
              )}
            </div>
            <div className="relative px-12">
              <Swiper {...testimonialSwiperOptions} className="pb-12">
                {(block.content?.testimonials || []).map((testimonial, i) => (
                  <SwiperSlide key={i} className="h-full mb-5">
                    <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col relative">
                      <div className="absolute top-6 right-8 text-5xl text-primary-200 font-serif z-0 opacity-70">"</div>
                      <div className="relative z-10">
                        {testimonial.rating && (
                          <div className="flex mb-4">
                            {[...Array(5)].map((_, index) => (
                              <svg key={index} className={`w-5 h-5 ${index < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-gray-700 mb-6 italic text-lg leading-relaxed flex-grow relative z-10">
                          {testimonial.quote || "Testimonial quote"}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center">
                          {testimonial.avatar ? (
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.authorName || "Client"} 
                              className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary-100"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4 text-primary-500">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {testimonial.authorName || "Client Name"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {testimonial.authorTitle || "Position, Company"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {(block.content?.testimonials || []).length > 1 && (
                <>
                  <button
                    className={`testimonial-prev-${blockIndex} absolute top-1/2 left-0 transform -translate-y-1/2 z-10 cursor-pointer w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-primary-600 hover:text-primary-700 hover:shadow-lg transition-all border border-gray-100`}
                    aria-label="Previous testimonial"
                  >
                    <Icon icon="ChevronLeft" className="h-5 w-5" />
                  </button>
                  <button
                    className={`testimonial-next-${blockIndex} absolute top-1/2 right-0 transform -translate-y-1/2 z-10 cursor-pointer w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-primary-600 hover:text-primary-700 hover:shadow-lg transition-all border border-gray-100`}
                    aria-label="Next testimonial"
                  >
                    <Icon icon="ChevronRight" className="h-5 w-5" />
                  </button>
                </>
              )}
              {(block.content?.testimonials || []).length > 1 && (
                <div className={`testimonial-pagination-${blockIndex} flex justify-center space-x-2 mt-6 [&>.swiper-pagination-bullet]:w-2.5 [&>.swiper-pagination-bullet]:h-2.5 [&>.swiper-pagination-bullet]:bg-primary-300 [&>.swiper-pagination-bullet-active]:bg-primary-500`} />
              )}
            </div>
          </div>
        </div>
      );

    case "content":
      return (
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            {block.content?.sectionTitle && (
              <h2 className="text-3xl font-bold text-center mb-8">
                {block.content.sectionTitle}
              </h2>
            )}
            <div
              className="prose lg:prose-xl mx-auto"
              dangerouslySetInnerHTML={{
                __html:
                  block.content?.html ||
                  "<p>Your content will appear here.</p>",
              }}
            />
          </div>
        </div>
      );

    case "faq":
      const faqs = block.content?.faqs || [];
      const categories = [
        ...new Set(faqs.map((f) => f.category || "Uncategorized")),
      ];

      return (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {block.content?.sectionTitle || "Frequently Asked Questions"}
              </h2>
              {block.content?.sectionSubtitle && (
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {block.content.sectionSubtitle}
                </p>
              )}
            </div>
            <div className="max-w-3xl mx-auto space-y-10">
              {categories.map((category, catIndex) => (
                <div key={catIndex}>
                  <h3 className="text-2xl font-semibold mb-6 border-b pb-2 text-gray-900">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {faqs
                      .filter((f) => (f.category || "Uncategorized") === category)
                      .map((faq, i) => (
                        <Disclosure as="div" key={i} className="mb-4">
                          {({ open }) => (
                            <>
                              <Disclosure.Button 
                                className="flex w-full justify-between rounded-lg bg-white px-5 py-4 text-left text-lg font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75 border border-gray-200"
                              >
                                <span>{faq.question || `Question ${i + 1}`}</span>
                                <Icon
                                  icon="ChevronDown"
                                  className={`${
                                    open ? 'rotate-180 transform' : ''
                                  } h-5 w-5 text-primary-500 transition-transform duration-200`}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="px-5 pt-4 pb-6 text-base text-gray-600 bg-white border-l border-r border-b rounded-b-lg">
                                <div className="prose max-w-none">
                                  {faq.answer || "Answer to the question"}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "slider":
      const sliderPreviewOptions = {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          dynamicBullets: true,
          el: '.slider-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.slider-next',
          prevEl: '.slider-prev',
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3, 
            spaceBetween: 30,
          },
        }
      };

      return (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {block.content?.sectionTitle && (
              <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {block.content.sectionTitle}
                </h2>
                {block.content?.sectionSubtitle && (
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {block.content.sectionSubtitle}
                  </p>
                )}
              </div>
            )}
            <div className="relative px-12">
              <Swiper {...sliderPreviewOptions} className="pb-12">
                {(block.content?.slides || []).map((slide, i) => (
                  <SwiperSlide key={i} className="h-full mb-5">
                    <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col bg-white border border-gray-100 group">
                      <div className="relative overflow-hidden h-64">
                        {slide.imageUrl?.url ? (
                          <img
                            src={slide.imageUrl.url}
                            alt={slide.altText || `Slide ${i + 1}`}
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 flex flex-col items-center">
                              <Icon icon="Photo" className="h-10 w-10 mb-2" />
                              No image
                            </span>
                          </div>
                        )}
                        {slide.badge && (
                          <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {slide.badge}
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        {slide.title && (
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors">
                            {slide.title}
                          </h3>
                        )}
                        {slide.caption && (
                          <p className="text-gray-600 flex-grow">
                            {slide.caption}
                          </p>
                        )}
                        {slide.link && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <a 
                              href={slide.link} 
                              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                            >
                              Learn more
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button 
                className="slider-prev absolute top-1/2 left-0 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-primary-600 hover:text-primary-700 hover:shadow-lg transition-all" 
                aria-label="Previous slide"
              >
                <Icon icon="ChevronLeft" className="h-5 w-5" />
              </button>
              <button 
                className="slider-next absolute top-1/2 right-0 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-primary-600 hover:text-primary-700 hover:shadow-lg transition-all" 
                aria-label="Next slide"
              >
                <Icon icon="ChevronRight" className="h-5 w-5" />
              </button>
              <div className="slider-pagination text-center mt-8"></div>
            </div>
          </div>
        </div>
      );

    case "products":
      return (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {block.content?.sectionTitle || "Products"}
              </h2>
              {block.content?.sectionSubtitle && (
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {block.content.sectionSubtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {(block.content?.products || []).map((product, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 flex flex-col h-full"
                >
                  <div className="relative">
                    <a href={product.link || "#product"} className="block relative overflow-hidden h-64 bg-gray-100">
                      {product.imageUrl?.url ? (
                        <img
                          src={product.imageUrl.url}
                          alt={product.title || `Product ${i + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 flex flex-col items-center">
                            <Icon icon="ShoppingBag" className="h-12 w-12 mb-2" />
                            Product image
                          </span>
                        </div>
                      )}
                      {product.badge && (
                        <div className="absolute top-4 left-4 bg-primary-500 text-white text-sm font-medium py-1 px-3 rounded-full z-10">
                          {product.badge}
                        </div>
                      )}
                    </a>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {product.title || `Product ${i + 1}`}
                    </h3>
                    
                    {product.description && (
                      <div
                        className="text-gray-600 mb-4 flex-grow"
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      />
                    )}
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        {product.price && (
                          <span className="text-lg font-bold text-gray-900">
                            {product.price}€
                          </span>
                        )}
                        
                        <a 
                          href={product.link || "#product"} 
                          className="inline-flex items-center justify-center px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 font-medium"
                        >
                          <span>View Details</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {block.content?.showViewAllButton && (
              <div className="text-center mt-12">
                <a 
                  href={block.content?.viewAllLink || "#all-products"} 
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-3 md:px-8 transition-colors"
                >
                  {block.content?.viewAllText || "View All Products"}
                </a>
              </div>
            )}
          </div>
        </div>
      );

    case "blocktextimage":
      return (
        <div 
          className="py-16 relative" 
          style={{ 
            backgroundColor: block.content?.backgroundColor || "#f8f9fa" 
          }}
        >
          {block.content?.hasPattern && (
            <div className="absolute inset-0 opacity-10 overflow-hidden">
              <div className="absolute -right-60 -top-40">
                <div className="w-96 h-96 rounded-full bg-primary-500 opacity-20"></div>
              </div>
              <div className="absolute -left-20 -bottom-40">
                <div className="w-72 h-72 rounded-full bg-primary-500 opacity-30"></div>
              </div>
            </div>
          )}
          <div className="container mx-auto px-4 relative z-10">
            <div className={`flex flex-col ${block.content?.imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"} -mx-4 items-center gap-10`}>
              <div className="px-4 w-full md:w-1/2 mb-10 md:mb-0">
                {block.content?.subTitle && (
                  <div className="text-primary-600 font-semibold text-sm mb-2 uppercase tracking-wider">
                    {block.content.subTitle}
                  </div>
                )}
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  {block.content?.mainTitle || "Main Title"}
                </h2>
                <div 
                  className="prose prose-lg max-w-none mb-8 text-gray-600" 
                  dangerouslySetInnerHTML={{
                    __html: block.content?.mainDescription || "<p>Your description will appear here.</p>"
                  }}
                />
                
                {(block.content?.features || []).length > 0 && (
                  <div className="mb-8 space-y-4">
                    {(block.content?.features || []).map((feature, i) => (
                      <div key={i} className="flex group">
                        <div className="mr-4 text-primary-500 flex-shrink-0 mt-1">
                          <Icon icon={feature.icon || "CheckCircle"} className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4">
                  {block.content?.buttonText && (
                    <button 
                      className="px-6 py-3 rounded-lg inline-block font-medium shadow hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2" 
                      style={{
                        backgroundColor: block.content?.buttonBgColor || "#dd3333",
                        color: block.content?.buttonTextColor || "#ffffff",
                        boxShadow: "0 4px 6px rgba(221, 51, 51, 0.25)"
                      }}
                    >
                      {block.content.buttonText}
                    </button>
                  )}
                  
                  {block.content?.secondaryButtonText && (
                    <button 
                      className="px-6 py-3 rounded-lg inline-block font-medium border-2 hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" 
                      style={{
                        borderColor: block.content?.buttonBgColor || "#dd3333",
                        color: block.content?.buttonBgColor || "#dd3333",
                      }}
                    >
                      {block.content.secondaryButtonText}
                    </button>
                  )}
                </div>
                
                {block.content?.customHtml && (
                  <div 
                    className="mt-8"
                    dangerouslySetInnerHTML={{
                      __html: block.content.customHtml
                    }}
                  />
                )}
              </div>
              <div className="px-4 w-full md:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl blur opacity-20"></div>
                  <div className="relative rounded-xl overflow-hidden transition-transform duration-300 transform hover:scale-[1.02]">
                    {block.content?.imageUrl?.url ? (
                      <img
                        src={block.content.imageUrl.url}
                        alt={block.content?.mainTitle || "Image"}
                        className="w-full h-auto rounded-xl shadow-lg"
                      />
                    ) : (
                      <div className="bg-gray-100 rounded-xl flex items-center justify-center h-80 border-2 border-dashed border-gray-300">
                        <span className="text-gray-500 flex flex-col items-center">
                          <Icon icon="Photo" className="h-12 w-12 mb-2 text-gray-400" />
                          No image uploaded
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "about":
      return (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row -mx-4 items-center gap-10">
              <div className="px-4 w-full md:w-1/2 mb-10 md:mb-0 relative">
                {block.content?.imageUrl?.url ? (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                    <div className="relative">
                      <img
                        src={block.content.imageUrl.url}
                        alt={block.content?.title || "About Image"}
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                      {block.content?.yearsDescription && (
                        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                          <div className="flex items-center">
                            {block.content?.icon && (
                              <div className="mr-3">
                                <Icon icon={block.content.icon || "CheckCircle"} className="h-6 w-6 text-primary-500" />
                              </div>
                            )}
                            <span className="font-bold text-gray-800">{block.content.yearsDescription}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 group hover:bg-gray-200 transition-colors duration-300">
                    <span className="text-gray-500 flex flex-col items-center">
                      <Icon icon="Photo" className="h-12 w-12 mb-2 text-gray-400" />
                      No image uploaded
                    </span>
                  </div>
                )}
              </div>
              <div className="px-4 w-full md:w-1/2">
                {block.content?.subTitle && (
                  <div className="mb-2 text-primary-500 font-medium uppercase tracking-wider">
                    {block.content.subTitle}
                  </div>
                )}
                <h2 className="text-3xl font-bold mb-6 leading-tight">
                  {block.content?.title || "We Care About After Care."}
                </h2>
                <div 
                  className="prose prose-lg max-w-none mb-8 text-gray-600" 
                  dangerouslySetInnerHTML={{
                    __html: block.content?.description || "<p>Your description will appear here.</p>"
                  }}
                />
                
                {(block.content?.features || []).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {(block.content?.features || []).map((feature, i) => (
                      <div key={i} className="flex group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                        <div className="mr-4 text-primary-500 flex-shrink-0 mt-1">
                          <Icon icon={feature.icon || "CheckCircle"} className="h-6 w-6 transform group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 text-gray-800">{feature.title || `Feature ${i + 1}`}</h3>
                          <p className="text-gray-600">{feature.description || "Feature description"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {(block.content?.listItems || []).length > 0 && (
                  <ul className="list-none pl-0 space-y-3 text-gray-700 mb-8">
                    {(block.content?.listItems || []).map((item, i) => (
                      <li key={i} className="flex items-start group">
                        <div className="mr-3 text-primary-500 pt-1 flex-shrink-0">
                          <Icon icon="CheckCircle" className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{item.text || `Item ${i + 1}`}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {block.content?.buttonText && (
                  <button 
                    className="px-8 py-3 rounded-full inline-block font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" 
                    style={{
                      backgroundColor: block.content?.buttonBgColor || "#dd3333",
                      color: block.content?.buttonTextColor || "#ffffff"
                    }}
                  >
                    {block.content.buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );

    case "video":
      return (
        <div className="py-16 bg-white relative overflow-hidden">
          {block.content?.hasPattern && (
            <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
              <div className="absolute -right-40 -top-40 w-80 h-80 rounded-full bg-primary-200"></div>
              <div className="absolute -left-20 -bottom-40 w-64 h-64 rounded-full bg-primary-200"></div>
            </div>
          )}
          <div className="container mx-auto px-4 relative z-10">
            {block.content?.title && (
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {block.content.title}
                </h2>
                {block.content?.subtitle && (
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {block.content.subtitle}
                  </p>
                )}
              </div>
            )}
            <div className={`flex flex-col ${block.content?.videoPosition === "left" ? "md:flex-row-reverse" : "md:flex-row"} -mx-4 items-center gap-12`}>
              <div className="px-4 w-full md:w-1/2 mb-10 md:mb-0">
                {block.content?.eyebrow && (
                  <div className="text-primary-600 font-semibold text-sm mb-3 uppercase tracking-wider">
                    {block.content.eyebrow}
                  </div>
                )}
                <div className="h-full">
                  <div 
                    className="prose prose-lg max-w-none mb-8 text-gray-600" 
                    dangerouslySetInnerHTML={{
                      __html: block.content?.description || "<p>Your description will appear here.</p>"
                    }}
                  />
                  
                  {(block.content?.listItems || []).length > 0 && (
                    <ul className="list-none pl-0 space-y-4 text-gray-700 mb-8">
                      {(block.content?.listItems || []).map((item, i) => (
                        <li key={i} className="flex items-start group">
                          <div className="mr-3 text-primary-500 pt-1 flex-shrink-0">
                            <Icon icon="CheckCircle" className="h-5 w-5 transform group-hover:scale-110 transition-transform" />
                          </div>
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{item.text || `Item ${i + 1}`}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mt-8">
                    {block.content?.buttonText && (
                      <button 
                        className="px-6 py-3 rounded-lg inline-block font-medium shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" 
                        style={{
                          backgroundColor: block.content?.buttonBgColor || "#dd3333",
                          color: block.content?.buttonTextColor || "#ffffff"
                        }}
                      >
                        <span className="flex items-center">
                          {block.content?.buttonIcon && (
                            <Icon icon={block.content.buttonIcon} className="mr-2 h-5 w-5" />
                          )}
                          {block.content.buttonText}
                        </span>
                      </button>
                    )}
                    
                    {block.content?.secondaryButtonText && (
                      <button 
                        className="px-6 py-3 rounded-lg inline-block font-medium border-2 hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" 
                        style={{
                          borderColor: block.content?.buttonBgColor || "#dd3333",
                          color: block.content?.buttonBgColor || "#dd3333",
                        }}
                      >
                        {block.content.secondaryButtonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 w-full md:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl blur opacity-20"></div>
                  <div className="relative rounded-xl overflow-hidden transition-transform duration-300 transform hover:scale-[1.01]">
                    {block.content?.videoUrl ? (
                      <div className="rounded-xl overflow-hidden shadow-xl" style={{ height: "400px", minHeight: "350px" }}>
                        <iframe 
                          src={block.content.videoUrl} 
                          title={block.content?.title || "Video"} 
                          width="100%"
                          height="100%"
                          style={{ display: "block", width: "100%", height: "100%" }}
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 transition-colors hover:bg-gray-200" style={{ height: "400px", minHeight: "350px" }}>
                        <span className="text-gray-500 flex flex-col items-center">
                          <Icon icon="Video" className="h-16 w-16 mb-4 text-gray-400" />
                          <span className="text-center max-w-xs px-4">
                            No video URL provided.<br/>Add a YouTube or Vimeo URL.
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                  {block.content?.videoBadge && (
                    <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                      {block.content.videoBadge}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="p-6 border rounded bg-gray-50">
          <p className="text-gray-500">
            Content for this block type ({block.type}) is not available
          </p>
        </div>
      );
  }
} 