"use client";

import { Dialog, Transition, Tab, Disclosure } from "@headlessui/react";

import Icon from "@components/ui/Icon";


import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import React, { useState, useCallback } from "react";

import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';



const BlockPreview = (block) => {

switch (block.type) {
  case "hero":
      return (
        <div
        className="relative mb-10 bg-gray-100  min-h-[75vh] overflow-hidden flex items-center"

          // className="relative mb-10 bg-gray-100 h-96 md:!min-h-96 md:h-[90vh] overflow-hidden flex items-center"
          style={{
            backgroundColor: block.content?.backgroundColor || "#f3f4f6",
            backgroundImage: block.content?.imageUrl?.url ? `url(${block.content.imageUrl.url})` : 'none',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <div
            className={`relative z-10 container mx-auto px-4 ${
              block.content?.textDirection === "center"
                ? "text-center"
                : block.content?.textDirection === "right"
                ? "text-right ml-auto"
                : ""
            }`}
          >
            <div className="max-w-full sm:max-w-lg bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg overflow-hidden"
              style={{
                backgroundColor: block.content?.backgroundColor || "#f3f4f6",
              }}
            >
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 break-words"
                style={{
                  color: block.content?.textColor || "#000000",
                }}
              >
                {block.content?.heading || "Hero Heading"}
              </h1>
              <p
                className="text-sm sm:text-base md:text-lg mb-3 sm:mb-6 break-words"
                style={{
                  color: block.content?.textColor || "#000000",
                }}
              >
                {block.content?.subheading || "Hero subheading text goes here"}
              </p>
              {block.content?.buttonText && (
                <button
                  className="text-sm sm:text-base hover:opacity-90 px-4 sm:px-6 py-1.5 sm:py-2 rounded-md transition-colors"
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
        <div className="max-w-3xl mx-auto text-center mb-10 relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block pb-4">
              {block.content?.sectionTitle || "Features"}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-primary-500 rounded-full"></span>
            </h2>
            {block.content?.sectionSubtitle && (
              <p className="text-gray-600 max-w-2xl mx-auto mt-2">
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
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="px-10 py-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                {block.content?.heading || "Call to Action"}
              </h2>
              <p className="text-lg text-gray-200 leading-relaxed mb-8 max-w-3xl mx-auto">
                {block.content?.description ||
                  "Call to action description text"}
              </p>
              {block.content?.buttonText && (
                <button className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  {block.content.buttonText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    case "testimonials":
      const testimonialSwiperOptions = {
        modules: [Navigation, Pagination, Autoplay],
        slidesPerView: 1,
        spaceBetween: 30,
        loop: (block.content?.testimonials || []).length > 1,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          dynamicBullets: true,
          el: `.testimonial-pagination-${block.blockIndex}`,
          clickable: true,
        },
        navigation: {
          nextEl: `.testimonial-next-${block.blockIndex}`,
          prevEl: `.testimonial-prev-${block.blockIndex}`,
        },
      };

      return (
        <div className="section-padding relative mb-10 testimonial2 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="justify-center text-3xl md:text-4xl 2xl:text-5xl font-semibold text-white">
                {block.content?.sectionTitle || "Why Our Clients Admire Us"}
              </h2>
              {block.content?.sectionSubtitle && (
                <p className="font-light text-gray-400 mt-2">
                  {block.content.sectionSubtitle}
                </p>
              )}
            </div>

            <div className="mt-10">
              <Swiper {...testimonialSwiperOptions} className="relative max-w-2xl mx-auto">
                {(block.content?.testimonials || []).map((testimonial, i) => (
                  <SwiperSlide key={i} className="h-full mb-5">
                    <div className="p-8 bg-gray-800 rounded-xl shadow-lg h-full flex flex-col relative text-center">
                      {testimonial.rating && (
                        <div className="flex justify-center mb-4">
                          {[...Array(5)].map((_, index) => (
                            <svg key={index} className={`w-5 h-5 ${index < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}

                      <p className="text-gray-300 mb-6 italic text-lg leading-relaxed flex-grow relative z-10">
                        {testimonial.quote || "Testimonial quote"}
                      </p>

                      <div className="mt-auto pt-4 flex items-center justify-center">
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.authorName || "Client"}
                            className="w-16 h-16 rounded-full object-cover mr-4 bg-primary-300/10 p-1 border border-gray-700"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-primary-300/10 flex items-center justify-center mr-4 text-primary-500 border border-gray-700">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <div className="text-left">
                          <p className="font-medium text-white">
                            {testimonial.authorName || "Client Name"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {testimonial.authorTitle || "Position, Company"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                <div className="absolute bottom-3 right-28 flex z-10">
                  <div className={`testimonial-prev-${block.blockIndex} cursor-pointer`}>
                    <div className="bg-primary-600 text-white h-12 w-12 flex items-center justify-center relative rounded-tl-lg rounded-bl-lg">
                      <Icon icon="ChevronLeft" />
                      <span className="border-r border-pgray-400 h-5 absolute right-0"></span>
                    </div>
                  </div>
                  <div className={`testimonial-next-${block.blockIndex} cursor-pointer`}>
                    <div className="bg-primary-600 text-white h-12 w-12 flex items-center justify-center rounded-tr-lg rounded-br-lg">
                      <Icon icon="ChevronRight" />
                    </div>
                  </div>
                </div>
              </Swiper>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-full absolute left-[25%] top-[15%] bg-primary-300/[0.1] p-3 border border-pgray-700">
              <Icon icon="Person" className="h-10 w-10 text-gray-400" />
            </div>
            <div className="rounded-full absolute left-[10%] top-[40%] bg-primary-300/[0.1] p-3 border border-pgray-700">
              <Icon icon="Person" className="h-10 w-10 text-gray-400" />
            </div>
            <div className="rounded-full absolute left-[17%] bottom-[15%] bg-primary-300/[0.1] p-3 border border-pgray-700">
              <Icon icon="Person" className="h-10 w-10 text-gray-400" />
            </div>
            <div className="rounded-full absolute right-[20%] top-[15%] bg-primary-300/[0.1] p-3 border border-pgray-700">
              <Icon icon="Person" className="h-10 w-10 text-gray-400" />
            </div>
            <div className="rounded-full absolute right-[5%] bottom-[50%] bg-primary-300/[0.1] p-3 border border-pgray-700">
              <Icon icon="Person" className="h-10 w-10 text-gray-400" />
            </div>
            <div className="rounded-full absolute right-[10%] bottom-[15%] bg-primary-300/[0.1] p-3 border border-pgray-700">
              <Icon icon="Person" className="h-10 w-10 text-gray-400" />
            </div>
          </div>
        </div>
      );

      case "content":
        return (
          <div className="section-padding">
            <div className="container mx-auto px-4">
              <div className="px-10 p-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl">
                <div className="max-w-4xl mx-auto text-center">
                  {block.content?.sectionTitle && (
                    <h2 className='text-3xl md:text-4xl font-bold mb-6 text-white'>
                      {block.content.sectionTitle}
                    </h2>
                  )}
                  <div
                    className="text-gray-200 leading-relaxed[&>p]:mb-4"
                    dangerouslySetInnerHTML={{
                      __html:
                        block.content?.html ||
                        "<p class='text-gray-400 italic'>Your content will appear here.</p>",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

  
        case "faq":
          const allFaqs = block.content?.faqs || [];
          const categorizedFaqs = allFaqs.filter(f => f.category);
          const uncategorizedFaqs = allFaqs.filter(f => !f.category);
          const categories = [
            ...new Set(categorizedFaqs.map((f) => f.category)),
          ];
      
          return (
            <div className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-10 relative">
                  <h2 className="text-3xl md:text-4xl font-bold  relative inline-block pb-4">
                    {block.content?.sectionTitle || "Frequently Asked Questions"}
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-primary-500 rounded-full"></span>
                  </h2>
                  {block.content?.sectionSubtitle && (
                    <p className="text-gray-600 max-w-2xl mx-auto mt-2">
                      {block.content.sectionSubtitle}
                    </p>
                  )}
                </div>
                <div className="max-w-3xl mx-auto space-y-12">
                  {categories.map((category, catIndex) => (
                    <div key={`cat-${catIndex}`}>
                      <h3 className="text-2xl font-semibold mb-6 pb-3 text-gray-900 relative border-b border-gray-200">
                        {category}
                        <span className="absolute bottom-[-1px] left-0 w-1/3 max-w-[100px] h-[2px] bg-primary-500"></span>
                      </h3>
                      <div className="space-y-4">
                        {categorizedFaqs
                          .filter((f) => f.category === category)
                          .map((faq, i) => (
                            <Disclosure as="div" key={`cat-faq-${i}`} className="mb-4">
                              {({ open }) => (
                                <>
                                  <Disclosure.Button
                                    className="flex w-full justify-between rounded-lg bg-white px-5 py-4 text-left text-lg font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75 border border-gray-200 transition-colors duration-150"
                                  >
                                    <span>{faq.question || `Question ${i + 1}`}</span>
                                    <Icon
                                      icon="ChevronDown"
                                      className={`${
                                        open ? 'rotate-180 transform' : ''
                                      } h-5 w-5 text-primary-500 transition-transform duration-200`}
                                    />
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="px-5 pt-4 pb-6 text-base text-gray-600 bg-white border-l border-r border-b border-gray-200 rounded-b-lg">
                                    <div className="prose max-w-none text-gray-700">
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
    
                  {uncategorizedFaqs.length > 0 && (
                    <div className="space-y-4 mt-12">
                      {uncategorizedFaqs.map((faq, i) => (
                        <Disclosure as="div" key={`uncat-faq-${i}`} className="mb-4">
                          {({ open }) => (
                            <>
                              <Disclosure.Button
                                className="flex w-full justify-between rounded-lg bg-white px-5 py-4 text-left text-lg font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75 border border-gray-200 transition-colors duration-150"
                              >
                                <span>{faq.question || `Question ${i + 1}`}</span>
                                <Icon
                                  icon="ChevronDown"
                                  className={`${
                                    open ? 'rotate-180 transform' : ''
                                  } h-5 w-5 text-primary-500 transition-transform duration-200`}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="px-5 pt-4 pb-6 text-base text-gray-600 bg-white border-l border-r border-b border-gray-200 rounded-b-lg">
                                <div className="prose max-w-none text-gray-700">
                                  {faq.answer || "Answer to the question"}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
      

    case "slider": {
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
        },
        observer: true,
        observeParents: true,
      };

      return (
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10 relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block pb-4">
              {block.content?.sectionTitle || "Slider"}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-primary-500 rounded-full"></span>
            </h2>
            {block.content?.sectionSubtitle && (
              <p className="text-gray-600 max-w-2xl mx-auto mt-2">
                {block.content.sectionSubtitle}
              </p>
            )}
          </div>
            <div className="relative px-12">
              <Swiper {...sliderPreviewOptions} className="pb-12">
                {(block.content?.slides || []).map((slide, i) => (
                  <SwiperSlide key={i} className="h-full mb-5">
                    <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col bg-white border border-gray-100 group">
                      <div className="relative overflow-hidden h-64">
                        {slide.imageUrl?.url ? (
                          <img
                          //lazy load
                          loading="lazy"
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
              <div className="absolute bottom-3 right-28 flex z-10 wow animate__animated animate__fadeInUp">
                <div className="slider-prev cursor-pointer">
                  <div className="bg-primary-600 text-white h-12 w-12 flex items-center justify-center relative rounded-tl-lg rounded-bl-lg">
                    <Icon icon="ChevronLeft" />
                    <span className="border-r border-pgray-400 h-5 absolute right-0"></span>
                  </div>
                </div>
                <div className="slider-next cursor-pointer">
                  <div className="bg-primary-600 text-white h-12 w-12 flex items-center justify-center rounded-tr-lg rounded-br-lg">
                    <Icon icon="ChevronRight" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

  case "products":
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block pb-4">
              {block.content?.sectionTitle || "Frequently Asked Questions"}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-primary-500 rounded-full"></span>
            </h2>
            {block.content?.sectionSubtitle && (
              <p className="text-gray-600 max-w-2xl mx-auto mt-2">
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
                  <a href={product.link || "#product"} className="block relative overflow-hidden h- bg-gra-100">
                  {product.imageUrl?.url ? (
                    <img
                      src={product.imageUrl.url}
                      alt={product.title || `Product ${i + 1}`}
                      title={product.title || `Product ${i + 1}`}
                      className="block mx-auto w-[200px] h-[200px] object-contain transition-all duration-300 mb-"
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
        className="py-16 relative container mx-auto px-4" 
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
        <section className="py-12 md:py-16 lg:py-24 overflow-x-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-0 lg:gap-7 items-center">
              <div className="col-1 lg:col-span-3 mb-12 lg:mb-0">
                <div className="wow animate__fadeInRight animated relative mr-10">
                  {block.content?.imageUrl?.url ? (
                    <img 
                      src={block.content.imageUrl.url} 
                      alt={block.content?.title || "About Image"} 
                      className="jump relative mx-auto rounded-xl w-full z-10 bg-pgray-100" 
                    />
                  ) : (
                    <div className="jump relative mx-auto rounded-xl w-full z-10 bg-gray-100 h-80 flex items-center justify-center">
                      <Icon icon="Photo" className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <img className="absolute top-0 left-0 w-40 -ml-12 -mt-12 pr-svg" src="/images/about/blob-tear.svg" alt="" />
                  <img className="absolute bottom-0 right-0 w-40 -mr-12 -mb-12 pr-svg" src="/images/about/blob-tear.svg" alt="" />
                </div>
              </div>
              <div className="col-span-4">
                <div className="mb-12">
                  {block.content?.subTitle && (
                    <div className="text-primary-500 font-medium uppercase tracking-wider mb-2 wow animate__animated animate__fadeInUp">
                      {block.content.subTitle}
                    </div>
                  )}
                  <h2 className="text-4xl mt-3 mb-4 font-semibold wow animate__animated animate__fadeInUp">
                    {block.content?.title || "Why Choose Us?"}
                  </h2>
                  <div 
                    className="mb-6 leading-loose text-pgray-400 wow animate__animated animate__fadeInUp"
                    dangerouslySetInnerHTML={{
                      __html: block.content?.description || "<p>Your description will appear here.</p>"
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {(block.content?.features || []).map((feature, i) => (
                    <div key={i} className="group wow animate__animated animate__fadeInUp">
                      <div className="bg-primary-50/50 py-7 px-7 rounded-xl group-hover:bg-primary-500 transition duration-200 ease-out hover:ease-in">
                        <div className="text-primary-500 rounded group-hover:text-white text-3xl mb-5">
                          <Icon icon={feature.icon || "CheckCircle"} className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold group-hover:text-white">{feature.title || `Feature ${i + 1}`}</h3>
                        <div>
                          <p className="text-pgray-400 leading-loose group-hover:text-pgray-300">{feature.description || "Feature description"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {(block.content?.listItems || []).length > 0 && (
                  <ul className="list-none pl-0 space-y-3 text-gray-700 mt-8">
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
                  <div className="mt-8">
                    <button
                      className="px-8 py-3 rounded-full inline-block font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      style={{
                        backgroundColor: block.content?.buttonBgColor || "#dd3333",
                        color: block.content?.buttonTextColor || "#ffffff"
                      }}
                    >
                      {block.content.buttonText}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
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
        <div className="max-w-3xl mx-auto text-center mb-10 relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block pb-4">
              {block.content?.title || "Video"}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-primary-500 rounded-full"></span>
            </h2>
            {/* {block.content?.description && (
              <p className="text-gray-600 max-w-2xl mx-auto mt-2">
                {block.content.description}
              </p>
            )} */}
          </div>
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

  case "partners":
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10 relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block pb-4">
              {block.content?.sectionTitle || "Our Partners"}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-primary-500 rounded-full"></span>
            </h2>
            {block.content?.sectionDescription && (
              <p className="text-gray-600 max-w-2xl mx-auto mt-2">
                {block.content.sectionDescription}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
            {(block.content?.partners || []).map((partner, i) => (
              <div key={i} className="flex items-center justify-center p-4 hover:scale-110 transition-transform duration-300">
                {partner.url ? (
                  <a 
                    href={partner.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    {partner.imageUrl?.url ? (
                      <img
                        src={partner.imageUrl.url}
                        alt={partner.name || `Partner ${i + 1}`}
                        className="w-full h-auto max-h-16 object-contain mx-auto grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-100 flex items-center justify-center rounded">
                        <span className="text-gray-400">Logo</span>
                      </div>
                    )}
                  </a>
                ) : (
                  <div className="block w-full h-full">
                    {partner.imageUrl?.url ? (
                      <img
                        src={partner.imageUrl.url}
                        alt={partner.name || `Partner ${i + 1}`}
                        className="w-full h-auto max-h-16 object-contain mx-auto grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-100 flex items-center justify-center rounded">
                        <span className="text-gray-400">Logo</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {block.content?.coloredSectionText && (
            <div 
              className="py-6 px-6 rounded-lg text-center mt-8"
              style={{
                backgroundColor: block.content?.coloredSectionBg || "#f3f4f6",
                color: block.content?.coloredSectionTextColor || "#000000"
              }}
            >
              <p className="inline text-lg">
                {block.content.coloredSectionText}
                {block.content?.coloredSectionLinkText && (
                  <>
                    {" "}
                    <a 
                      href={block.content?.coloredSectionLinkUrl || "#"} 
                      className="font-medium hover:underline inline-flex items-center ml-1"
                      style={{
                        color: block.content?.coloredSectionTextColor || "#000000"
                      }}
                    >
                      {block.content.coloredSectionLinkText}
                      <svg 
                        className="ml-1 h-5 w-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M14 5l7 7m0 0l-7 7m7-7H3" 
                        />
                      </svg>
                    </a>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    );

  case "form":
    return (
      <div className={`py-16 ${block.content?.showBackground ? 'bg-gray-50' : 'bg-white'}`}
        style={{
          backgroundColor: block.content?.showBackground ? block.content?.backgroundColor || "#f3f4f6" : undefined
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block pb-4">
              {block.content?.sectionTitle || "Form"}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-primary-500 rounded-full"></span>
            </h2>
            
            {block.content?.description && (
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                {block.content.description}
              </p>
            )}
          </div>
          
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden p-6 border border-gray-100">
            <div className="text-center p-6 bg-gray-50 border border-dashed border-gray-300 rounded-lg mb-4">
              <Icon icon="ClipboardDocumentList" className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 font-medium">
                {block.content?.formId 
                  ? `Selected Form ID: ${block.content.formId}` 
                  : "Please select a form to display"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                (The actual form will display here on the published page)
              </p>
            </div>
            
            <div className="flex justify-center">
              <button
                className="px-6 py-2 rounded-lg font-medium shadow-sm"
                style={{
                  backgroundColor: block.content?.buttonColor || "#2563eb",
                  color: "#ffffff"
                }}
              >
                {block.content?.buttonText || "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  case "gallery":
    return <GalleryBlockPreview block={block} />;

  default:
    return (
      <div className="p-6 border rounded bg-gray-50">
        <p className="text-gray-500">
          Content for this block type ({block.type}) is not available
        </p>
      </div>
    );
}
  };

// Create a separate component for Gallery
const GalleryBlockPreview = ({ block }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  
  const galleryImages = (block.content?.galleryImages || []).filter(img => img.imageUrl?.url);
  const imagesUrls = galleryImages.map(img => img.imageUrl.url);
  
  const openLightbox = useCallback((index) => {
    setPhotoIndex(index);
    setIsLightboxOpen(true);
  }, []);
  
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Icon icon="Photo" className="h-6 w-6 text-primary-600" />
                {block.content?.sectionTitle || "Photos"} 
                {block.content?.totalCountText && (
                  <span className="text-sm font-normal text-slate-500 ml-2">
                    {block.content.totalCountText}
                  </span>
                )}
              </h2>
              
              <button
                onClick={() => openLightbox(0)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1.5 transition-colors duration-200"
              >
                <span className="hidden sm:inline">{block.content?.viewAllText || "View all photos"}</span>
                <span className="sm:hidden">View all</span>
                <Icon icon="ChevronRight" className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <div className="grid grid-cols-12 gap-2 md:gap-3">
                {/* Main Feature Photo */}
                {galleryImages.length > 0 && (
                  <div 
                    className="col-span-12 md:col-span-6 rounded-xl overflow-hidden h-64 md:h-80 relative group cursor-pointer"
                    onClick={() => openLightbox(0)}
                  >
                    <img
                      src={galleryImages[0].imageUrl.url}
                      alt={galleryImages[0].altText || "Featured gallery photo"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white font-medium">{galleryImages[0].caption || ""}</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm text-xs font-medium text-slate-800 flex items-center gap-1.5">
                        <Icon icon="Eye" className="w-3.5 h-3.5 text-primary-600" />
                        View
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Right Column Smaller Photos */}
                <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-2 md:gap-3">
                  {/* Show up to 4 additional images in the grid */}
                  {galleryImages.slice(1, 5).map((image, index) => (
                    <div 
                      key={index}
                      className="rounded-xl overflow-hidden h-32 md:h-[158px] relative group cursor-pointer"
                      onClick={() => openLightbox(index + 1)}
                    >
                      <img
                        src={image.imageUrl.url}
                        alt={image.altText || `Gallery photo ${index + 2}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <span className="text-white text-sm">{image.caption}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Show +X more overlay on the last visible image if there are more images */}
                      {index === 3 && galleryImages.length > 5 && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
                          <span className="text-white text-2xl font-bold mb-1">+{galleryImages.length - 5}</span>
                          <button 
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 transition-colors duration-300 rounded-lg text-white text-sm font-medium backdrop-blur-sm"
                          >
                            View all photos
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Add placeholder blocks if fewer than 4 additional images */}
                  {Array.from({ length: Math.max(0, 4 - (galleryImages.slice(1).length)) }).map((_, index) => (
                    <div key={`placeholder-${index}`} className="rounded-xl overflow-hidden h-32 md:h-[158px] bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 flex flex-col items-center">
                        <Icon icon="Photo" className="h-8 w-8 mb-1" />
                        <span className="text-xs">Add image</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lightbox implementation - Uncommented */}
        {isLightboxOpen && imagesUrls.length > 0 && (
          <Lightbox
            mainSrc={imagesUrls[photoIndex]}
            nextSrc={imagesUrls[(photoIndex + 1) % imagesUrls.length]}
            prevSrc={imagesUrls[(photoIndex + imagesUrls.length - 1) % imagesUrls.length]}
            onCloseRequest={() => setIsLightboxOpen(false)}
            onMovePrevRequest={() => setPhotoIndex((photoIndex + imagesUrls.length - 1) % imagesUrls.length)}
            onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % imagesUrls.length)}
            imageCaption={galleryImages[photoIndex]?.caption || ""}
          />
        )}
      </div>
    </div>
  );
};

export default BlockPreview;
 