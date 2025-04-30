"use client";
import { useState, useCallback, useRef, Fragment, useEffect } from "react";
import { Tab, Dialog, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MapPinIcon,
  InformationCircleIcon,
  PhoneIcon,
  ShareIcon,
  UserIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  PhotoIcon,
  CheckBadgeIcon,
  StarIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/style.css";

const tabs = [
  { name: "Overview", icon: UserIcon, id: "overview" },
  { name: "Services", icon: BuildingOfficeIcon, id: "services" },
  { name: "Reviews", icon: StarIcon, id: "reviews" },
  { name: "Photos", icon: PhotoIcon, id: "photos" },
  { name: "Company info & Accreditations", icon: DocumentTextIcon, id: "company-info" },
];

// Dummy review data (replace with actual data fetching later)
const allReviewsData = [
  {
    rating: 0,
    title: "Made an appointment then didn't show up",
    date: "15 May 2024",
    content:
      "Made an appointment to quote for a bathroom. They didn't show up . No call or contact. Having said that not sure why an air conditioning company wants to quote for a bathroom.",
    location: "CF14",
    verified: true,
  },
  {
    rating: 10,
    title: "Air Conditioning",
    date: "11 May 2024",
    content:
      "Starting from the initial visit to quote for the work and understand our needs, the communication was very good. On installation day the guys were very polite, tidy and kept us well informed. The air conditioning was installed quicker than we expected and we would highly recommend them and will use them again when required.",
    location: "BS24",
    verified: true,
  },
  {
    rating: 10,
    title: "Relocation of Heat pump for Air Con unit",
    date: "29 August 2023",
    content:
      "Mo and the team were really good, and professional, and knew exactly what to do. Job completed quickly and very tidy. Many thanks",
    location: "BS16",
    verified: true,
  },
  {
    rating: 10,
    title: "Amazing work",
    date: "01 August 2023",
    content:
      "I had a fantastic experience with the gas engineer who came and installed the cooker for me. He was incredible prompt and efficient, offering same day service that I truly appreciated. I was pleasantly surprised by his reasonable and affordable fee, especially considering the high-quality service he provided. 100% recommend??",
    location: "CF5",
    verified: true,
  },
  {
    rating: 10,
    title: "Installing split Air Con for two rooms",
    date: "22 July 2023",
    content:
      "Installling air conditioning in your home can be a challenge, which we found with another company previously. Let's Heat had great reviews on Checkatrade, so a good starting point. Mo and his Let's Heat Team were a revelation. On time, courteous, and the installation was very professionally completed. Mo uses the best top quality brand, and they took great care to minimise the appearance, both externally and internally. The install really looks as good as possible. I would recommend Mo and Let's Heat without hesitation.",
    location: "CF11",
    verified: true,
  },
  {
    rating: 10,
    title: "Air conditioning installation",
    date: "16 June 2023",
    content:
      "Absolutely brilliant job done by the lads. No fuss and pleasant chaps. Highly recommend",
    location: "BS10",
    verified: true,
  },
];

// Enhanced Reviews Popup Component
function ReviewsPopup({ isOpen, onClose, reviews }) {
  const [sortBy, setSortBy] = useState("most-recent");
  const [dateRange, setDateRange] = useState("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(null);

  if (!isOpen) return null;

  const filteredReviews = reviews;

  const handleResetFilters = () => {
    setSortBy("most-recent");
    setDateRange("all");
    if (isMobileFilterOpen) {
      setIsMobileFilterOpen(false);
    }
  };

  const handleShowReviews = () => {
    if (isMobileFilterOpen) {
      setIsMobileFilterOpen(false);
    }
  };

  const renderRatingStars = (rating) => {
    const starCount = 5;
    const filledStars = Math.round((rating / 10) * starCount);
    
    return (
      <div className="flex items-center">
        {[...Array(starCount)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${
              i < filledStars 
                ? "text-amber-400 fill-amber-400" 
                : "text-gray-300 fill-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const FilterSidebarContent = (
    <div className="flex flex-col h-full">
      <div className="space-y-6 flex-grow">
        {/* Sort Options */}
        <div className="mb-6">
          <h3 className="font-semibold text-neutral-800 mb-4 text-sm uppercase flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-primary-600" />
            Sort by
          </h3>
          <div className="space-y-3">
            {[
              { value: "most-recent", label: "Most recent" },
              { value: "highest-rated", label: "Highest rated" },
              { value: "lowest-rated", label: "Lowest rated" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer text-sm hover:bg-primary-50 rounded-md p-2 transition-colors duration-200"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={sortBy === option.value}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`h-5 w-5 rounded-full border ${
                    sortBy === option.value
                      ? "border-primary-600 bg-primary-600"
                      : "border-gray-300 bg-white"
                  } flex items-center justify-center transition-colors duration-200`}>
                    {sortBy === option.value && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <span className={sortBy === option.value ? "text-primary-600 font-medium" : "text-neutral-700"}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range Options */}
        <div>
          <h3 className="font-semibold text-neutral-800 mb-4 text-sm uppercase flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5 text-primary-600" />
            Date range
          </h3>
          <div className="space-y-3">
            {[
              { value: "all", label: "All reviews" },
              { value: "30d", label: "Last 30 days" },
              { value: "3m", label: "Last 3 months" },
              { value: "6m", label: "Last 6 months" },
              { value: "12m", label: "Last 12 months" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer text-sm hover:bg-primary-50 rounded-md p-2 transition-colors duration-200"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="dateRange"
                    value={option.value}
                    checked={dateRange === option.value}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`h-5 w-5 rounded-full border ${
                    dateRange === option.value
                      ? "border-primary-600 bg-primary-600"
                      : "border-gray-300 bg-white"
                  } flex items-center justify-center transition-colors duration-200`}>
                    {dateRange === option.value && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <span className={dateRange === option.value ? "text-primary-600 font-medium" : "text-neutral-700"}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto pt-6 border-t bg-gray-50 md:bg-transparent md:relative md:border-none rounded-lg -mx-6 px-6 pb-6">
        <button
          type="button"
          onClick={handleShowReviews}
          className="w-full justify-center flex items-center rounded-md font-semibold border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-all duration-200 text-white bg-primary-600 border-primary-600 fill-white hover:bg-primary-700 hover:border-primary-700 py-2.5 px-4 text-sm shadow-sm hover:shadow disabled:bg-neutral-400 disabled:shadow-none"
        >
          Show reviews
        </button>
        <button
          type="button"
          onClick={handleResetFilters}
          className="mt-3 w-full justify-center flex items-center rounded-md font-semibold border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-all duration-200 text-primary-600 bg-white border-primary-600 fill-primary-600 hover:bg-primary-50 py-2.5 px-4 text-sm disabled:bg-neutral-400 disabled:text-neutral-600 disabled:border-neutral-400"
        >
          Reset filters
        </button>
      </div>
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          onClose();
          setIsMobileFilterOpen(false);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-0 md:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="bg-white md:rounded-2xl shadow-2xl max-w-5xl w-full h-full md:h-auto md:max-h-[90vh] flex flex-col overflow-hidden transform transition-all text-left">
                <div className="flex justify-between items-center p-5 md:px-8 border-b sticky top-0 bg-gradient-to-r from-primary-50 to-white z-10 shadow-sm">
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="md:hidden text-primary-600 hover:text-primary-800 transition-all duration-200 p-2 -ml-1 rounded-full hover:bg-primary-100"
                    aria-label="Open filters"
                  >
                    <FunnelIcon className="h-6 w-6" />
                  </button>
                  
                  <div className="w-6 h-6 md:hidden" />
                  
                  <Dialog.Title
                    as="h2"
                    className="text-lg md:text-xl font-bold text-neutral-900 text-center flex-grow flex items-center justify-center gap-2"
                  >
                    <StarIcon className="h-6 w-6 text-amber-500" />
                    Reviews for Lets Heat
                  </Dialog.Title>
                  
                  <div className="w-6 h-6 hidden md:block" />
                  
                  <button
                    onClick={onClose}
                    className="text-neutral-500 hover:text-neutral-800 transition-all duration-200 p-2 -mr-1 rounded-full hover:bg-neutral-100"
                    aria-label="Close reviews popup"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                  <aside className="hidden md:block w-72 border-r overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white flex-shrink-0">
                    {FilterSidebarContent}
                  </aside>

                  <main className="flex-1 overflow-y-auto p-5 md:p-8 bg-gradient-to-b from-gray-50 to-white">
                    <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-primary-100">
                      <div className="flex items-center gap-3 text-primary-800">
                        <div className="bg-primary-600 text-white text-2xl font-bold h-12 w-12 rounded-full flex items-center justify-center">
                          8
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            {renderRatingStars(8)}
                            <span className="text-sm text-primary-600 ml-1">({reviews.length})</span>
                          </div>
                          <span className="text-xs text-primary-700">Average customer rating</span>
                        </div>
                      </div>
                    </div>
                    
                    <ul className="space-y-5">
                      {filteredReviews.length > 0 ? (
                        filteredReviews.map((review, index) => (
                          <li
                            key={index}
                            className="bg-white rounded-xl flex flex-col p-5 gap-3 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
                            onMouseEnter={() => setHoveredRating(index)}
                            onMouseLeave={() => setHoveredRating(null)}
                          >
                            <section className="flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`font-bold flex items-center justify-center rounded-full min-w-[40px] h-10 w-10 shrink-0 text-base ${
                                      review.rating >= 7
                                        ? "bg-primary-100 text-primary-800"
                                        : review.rating >= 4
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {review.rating}
                                  </span>
                                  <div className="flex flex-col">
                                    {renderRatingStars(review.rating)}
                                    <p className="text-neutral-500 text-xs">
                                      {review.date}
                                    </p>
                                  </div>
                                </div>
                                
                                {review.verified && (
                                  <span className="font-medium flex items-center gap-1.5 text-primary-700 text-xs bg-primary-50 px-2 py-1 rounded-full">
                                    <CheckBadgeIcon className="h-4 w-4" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              
                              <h3 className="text-neutral-800 text-lg font-semibold mt-1">
                                {review.title}
                              </h3>
                            </section>

                            <div className="flex flex-col gap-2">
                              <div className="text-neutral-700 leading-relaxed">
                                {review.content}
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                              <span className="inline-flex items-center gap-1.5 text-neutral-500 text-xs bg-neutral-50 px-2 py-1 rounded-full">
                                <MapPinIcon className="h-3.5 w-3.5" />
                                {review.location}
                              </span>
                              
                              <div className="flex gap-2">
                                <button className="text-primary-600 text-sm hover:underline transition-colors duration-200 flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                  </svg>
                                  Helpful
                                </button>
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center bg-white rounded-xl p-8 text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h9a2 2 0 002-2V6a2 2 0 00-2-2h-9M12 20H3a2 2 0 01-2-2V6a2 2 0 012-2h9" />
                          </svg>
                          <p className="text-neutral-500 text-lg font-medium">
                            No reviews match your filters
                          </p>
                          <p className="text-neutral-400 mt-1">
                            Try adjusting your filter settings to see more reviews
                          </p>
                          <button
                            onClick={handleResetFilters}
                            className="mt-4 inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 text-sm"
                          >
                            Reset all filters
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7.805v2.202a1 1 0 01-1.758.653L1.91 8.385a1 1 0 010-1.271l2.331-2.274A1 1 0 015 4.51V3a1 1 0 011-1zm6 8a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </ul>
                    
                    {filteredReviews.length > 0 && (
                      <div className="flex justify-center mt-8">
                        <nav className="flex items-center gap-1">
                          <button className="h-10 w-10 rounded-md flex items-center justify-center border border-neutral-300 bg-white text-neutral-700 hover:bg-primary-50 transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button className="h-10 w-10 rounded-md flex items-center justify-center border-primary-600 bg-primary-600 text-white font-semibold">
                            1
                          </button>
                          <button className="h-10 w-10 rounded-md flex items-center justify-center border border-neutral-300 bg-white text-neutral-700 hover:bg-primary-50 transition-colors duration-200">
                            2
                          </button>
                          <button className="h-10 w-10 rounded-md flex items-center justify-center border border-neutral-300 bg-white text-neutral-700 hover:bg-primary-50 transition-colors duration-200">
                            3
                          </button>
                          <span className="h-10 px-2 flex items-center justify-center text-neutral-500">...</span>
                          <button className="h-10 w-10 rounded-md flex items-center justify-center border border-neutral-300 bg-white text-neutral-700 hover:bg-primary-50 transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    )}
                  </main>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        <Transition show={isMobileFilterOpen} as={Fragment}>
          <Dialog
            as="div"
            className="md:hidden fixed inset-0 z-[60]"
            onClose={setIsMobileFilterOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-200 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="fixed inset-y-0 left-0 z-[70] bg-white w-full max-w-xs flex flex-col shadow-xl rounded-r-2xl">
                <div className="flex justify-between items-center p-5 border-b flex-shrink-0 bg-gradient-to-r from-primary-50 to-white">
                  <Dialog.Title as="h3" className="text-lg font-bold flex items-center gap-2">
                    <FunnelIcon className="h-5 w-5 text-primary-600" />
                    Filter Reviews
                  </Dialog.Title>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-neutral-500 hover:text-neutral-800 transition-all duration-200 p-2 -mr-1 rounded-full hover:bg-neutral-100"
                    aria-label="Close filters"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="overflow-y-auto px-6 py-6 flex-1 flex flex-col">
                  {FilterSidebarContent}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </Dialog>
        </Transition>
      </Dialog>
    </Transition>
  );
}

export default function ServiceProviderProfile() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [isServiceExpanded, setIsServiceExpanded] = useState(true);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [isReviewsPopupOpen, setIsReviewsPopupOpen] = useState(false);
  const [showStickyButtons, setShowStickyButtons] = useState(false);

  const sectionRefs = useRef({});
  tabs.forEach((tab) => {
    if (tab.id !== 'accreditations') {
    sectionRefs.current[tab.id] = useRef(null);
    }
  });

  const headerRef = useRef(null);
  const tabListRef = useRef(null);

  const images = [
    "https://lh3.googleusercontent.com/Kuth9xQudG4NxZboyYTO0cp9WJQXqnsEeatr0GmRqDOCZEdUearsOCs7v11RCZRHFcVIWeGz16t9nA911J9lgLJ4Wgl1yR7EzLZtWEWTH0Tl-uFy4ivpMJAU_uSKkec=w1024-nu-rw-e365",
    "https://lh3.googleusercontent.com/azSS91Q9N3LX3hrpoZ-jj4KXPeM0qvImyHx-hpLNuA0-0UTfMjC2py2WiqtVR-9QFlhEtvP41Fepz-b6jpMcjzVf0asT6O2IoNv5IDtX_FEhZfGZsKVX8FvDSSpg4A=w1024-nu-rw-e365",
    "https://lh3.googleusercontent.com/3kA96Dwly-kZvn2Yc0bVuokifu_iBuYLUsO35DdbuJ8Bz55aPOASBuTAIimd-CEje-CjaNdaXp8pE_0ksb2YvfO_jxZbifIVVP6leD-mI_cu7tBXkWiCzHL_NgHzsQ=w1024-nu-rw-e365",
    "https://lh3.googleusercontent.com/5nvEQbZNyY7uxlz2naVljVxSjyxmRXCTnrww_jKP6h9kxbdorIkEgUTus2eelvFGvUQUEjEOM-zRLiyGUXZQ75jVZUwHCdJTHorKlHE7OcWbnf3N0a22N7kOmDakGw=w1024-nu-rw-e365",
    "https://lh3.googleusercontent.com/viT9MxeCAUhewSpbb1qVHEdwsshcfWDjj6WIscKeDPlCdm-mBOhN9XIyyMqrN29Ze6RZ-i2oxnryfen4SnoknLfVOQUZq9e9QqmsrcZYXJR_5W6LrB3ykS5lIU2Y6A=w1024-nu-rw-e365",
  ];

  const openLightbox = useCallback((index) => {
    setPhotoIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const openReviewsPopup = () => setIsReviewsPopupOpen(true);
  const closeReviewsPopup = () => setIsReviewsPopupOpen(false);

  const thumbnailsRef = useRef(null);

  useEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 60;
    const observerOptions = {
      root: null,
      rootMargin: `-${headerHeight}px 0px -${
        window.innerHeight - headerHeight - 100
      }px 0px`,
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    Object.keys(sectionRefs.current).forEach((tabId) => {
        if (tabId !== 'accreditations' && sectionRefs.current[tabId]?.current) {
            observer.observe(sectionRefs.current[tabId].current);
      }
    });

    return () => {
      Object.keys(sectionRefs.current).forEach((tabId) => {
          if (tabId !== 'accreditations' && sectionRefs.current[tabId]?.current) {
             observer.unobserve(sectionRefs.current[tabId].current);
        }
      });
      observer.disconnect();
    };
  }, [tabs]);

  useEffect(() => {
    const handleScroll = () => {
      const servicesSection = sectionRefs.current["services"]?.current;
      if (servicesSection) {
        const servicesSectionTop = servicesSection.getBoundingClientRect().top;
        const headerHeight = headerRef.current?.offsetHeight || 0;
        setShowStickyButtons(servicesSectionTop <= headerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const element = sectionRefs.current[tabId]?.current;
    const headerHeight = headerRef.current?.offsetHeight || 0;

    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - 10;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Function to scroll selected tab into view when tabs change
  const scrollSelectedTabIntoView = useCallback((index) => {
    if (tabListRef.current) {
      const tabElement = tabListRef.current.children[index];
      if (tabElement) {
        const tabList = tabListRef.current;
        const tabOffset = tabElement.offsetLeft;
        const tabWidth = tabElement.offsetWidth;
        const listScrollLeft = tabList.scrollLeft;
        const listWidth = tabList.offsetWidth;

        if (
          tabOffset < listScrollLeft ||
          tabOffset + tabWidth > listScrollLeft + listWidth
        ) {
          tabList.scrollTo({
            left: tabOffset - (listWidth - tabWidth) / 2,
            behavior: "smooth",
          });
        }
      }
    }
  }, []);

  // Convert activeTab to index for HeadlessUI
  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);

  // Handle tab change from HeadlessUI
  const handleTabChange = (index) => {
    const tabId = tabs[index].id;
    handleTabClick(tabId);
    scrollSelectedTabIntoView(index);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-[15px] md:pb-[15px]">
      {/* Banner Section */}
      <section className="relative lg:mt-8 mt-4">
        <div className="container mx-auto">
          <div className="profile-banner relative text-transparent rounded-xl overflow-hidden shadow-lg">
            <div className="relative shrink-0">
              <img
                src="https://lh3.googleusercontent.com/PVuZYP01KSJqSKJFPCD80d8OBAKFC7tSR0N-ecSoOBFGVX20biEv3swjpx-iRLW4-w2sRe-d8cjG9FLeU_B6kEHOrNKRLef7_zlsl01XpaXJIIEuxsC_Ryab4UDf=w1024-nu-rw-e365"
                className="h-64 md:h-80 w-full object-cover rounded-xl shadow transition-all duration-500 hover:scale-105"
                alt="Company banner"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section with Profile */}
      <section
        id="overview"
        ref={sectionRefs.current["overview"]}
        className="relative -mt-20 z-10 container mx-auto px-4"
      >
        <div className="bg-white rounded-xl shadow-xl border border-slate-100 relative"> {/* Removed overflow-hidden */}
          <div className="p-6 md:p-8">
            {/* Profile Image Wrapper - Moved and positioned absolutely */}
            <div className="absolute top-0 left-6 md:left-8 transform translate-x-[20%] -translate-y-1/2 z-10">
              <div className="relative">
                <img
                  alt="Lets Heat profile"
                  width="110"
                  height="110"
                  className="rounded-full border-4 border-white shadow-lg object-cover bg-white"
                  src="https://lh3.googleusercontent.com/HDTECijs8t7hybZ6xmyZA2MWM7JQniH1vbdD83_vO8ydK83kaNrI7jkFby8T3BAMB-pkIq5QysWdEdlV8YebVygtkzVbneKRi9AkCjfcLn06hyhkk_8APd2v1oih=w1024-nu-rw-e365"
                />
                <span className="absolute bottom-1 right-1 bg-primary-500 rounded-full p-1 border-2 border-white">
                  <CheckBadgeIcon className="h-4 w-4 text-white" />
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Side - Profile Info (Text Only) */}
              <div className="flex-1"> {/* Removed inner flex container for image */}
                {/* Text content - Added padding top for small screens and padding left for medium+ */}
                <div className="flex flex-col pt-8 md:pt-12 md:pl-[0px] ">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Lets Heat</h1>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg border border-primary-100">
                      <div className="flex items-center gap-1">
                        <span className="text-primary-600 font-bold text-2xl">8</span>
                        <span className="text-primary-600 font-medium">/10</span>
                      </div>
                      <div className="flex flex-col ml-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`h-4 w-4 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}`} 
                            />
                          ))}
                        </div>
                        <span className="text-primary-600 text-xs">
                          <button className="hover:underline" onClick={openReviewsPopup}>
                            44 reviews
                          </button>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary-100 p-1.5">
                        <MapPinIcon className="h-4 w-4 text-primary-600" />
                      </span>
                      <span className="text-slate-700">Cardiff</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <span className="inline-flex items-center justify-center rounded-full bg-primary-100 p-1.5">
                        <svg
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 18 18"
                          width="16"
                          height="16"
                          className="text-primary-600"
                        >
                          <path
                            fill="currentColor"
                            d="M18 .763a7.436 7.436 0 0 0-1.662.083 2.87 2.87 0 0 0-1.107.443 13.292 13.292 0 0 0-1.593 1.481c-.443.485-.775.831-1.661 1.967l-2.27 2.977C8.791 8.96 8.293 9.54 8.168 9.54c-.235 0-.374-.318-.498-.927l-.139-.651c-.18-.97-.734-.748-1.204-.554-.623.25-1.011.886-.928 1.55 0 .18 0 .098.083.804 0 .055.18 1.246.25 1.592.055.277.138.554.276.817a1.385 1.385 0 0 0 .443.54c.208.138.443.208.693.235.733.083 1.246-.193 2.021-1.107z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M6.37 17.254c-2.078 0-3.67-.61-4.75-1.814C.554 14.207 0 12.463 0 10.206 0 7.88.568 6.107 1.69 4.86c1.135-1.246 2.768-1.869 4.9-1.869 1.44 0 2.742.277 3.905.817L9.028 5.872a6.23 6.23 0 0 0-2.451-.443c-2.382 0-3.572 1.592-3.572 4.75 0 1.536.29 2.7.886 3.46.595.79 1.454 1.178 2.603 1.178a7.43 7.43 0 0 0 3.683-.97v2.548a5.965 5.965 0 0 1-1.662.665c-.72.138-1.44.194-2.16.194z"
                          ></path>
                        </svg>
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary-50 text-primary-700 font-medium">
                        Checkatrade member since <span className="font-bold">2023</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Contact Buttons */}
              <div className="flex flex-col md:w-auto gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => setShowPhone((prev) => !prev)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-white transition-all duration-300"
                >
                  <PhoneIcon className="h-5 w-5" />
                  {showPhone ? "07458 177554" : "Show phone number"}
                </button>
                
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
                    fill="currentColor"
                  >
                    <path d="M3 13.19c0 .25.26.43.49.33l13.4-5.36c.15-.06.15-.27 0-.33L3.49 2.48c-.23-.1-.49.07-.49.33V6.1c0 .36.27.67.63.71L13.22 8 3.63 9.19c-.36.05-.63.35-.63.71v3.29z"></path>
                  </svg>
                  Request a quote
                </a>
                
                <button
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-300"
                >
                  <ShareIcon className="h-5 w-5" />
                  Share profile
                </button>
              </div>
            </div>
            
            {/* Insurance Info Banner - Enhanced Responsiveness & Style */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-amber-50 border-amber-200 border rounded-lg p-3 sm:p-4 mt-6 shadow-sm">
              <div className="flex-shrink-0 mb-2 sm:mb-0"> {/* Added margin-bottom for stacked layout */}
                <InformationCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" /> {/* Slightly smaller icon on mobile */}
              </div>
              <div className="flex-grow">
                <p className="font-medium text-amber-800 text-sm sm:text-base">Public liability insurance is unverified</p>
                <p className="text-amber-700 text-xs sm:text-sm mt-0.5">Insurance verification helps protect you when hiring tradespeople</p>
              </div>
              <button className="self-start sm:self-center flex-shrink-0 text-xs sm:text-sm text-primary-600 font-medium hover:text-primary-800 hover:underline transition-colors duration-200 mt-1 sm:mt-0 px-2 py-1 rounded hover:bg-primary-50"> {/* Added padding/hover for touch */}
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div ref={headerRef} className="sticky top-0 z-40 py-2 bg-slate-50 mt-6">
        <div className="container mx-auto">
          <Tab.Group selectedIndex={activeTabIndex} onChange={handleTabChange}>
            <Tab.List
              ref={tabListRef}
              className="flex overflow-x-auto scrollbar-none bg-white rounded-xl border border-slate-200 p-1 shadow-sm"
              style={{
                WebkitOverflowScrolling: "touch",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  className={({ selected }) => `
                    flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 relative flex-shrink-0 outline-none whitespace-nowrap rounded-lg
                    ${
                      selected
                        ? "text-white bg-primary-600 shadow-sm"
                        : "text-slate-700 hover:bg-primary-50 hover:text-primary-600"
                    }
                  `}
                >
                  <tab.icon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        {/* Services Tab */}
        <section
          id="services"
          ref={sectionRefs.current["services"]}
          className="mb-8 scroll-mt-20"
        >
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-8">
                <BuildingOfficeIcon className="h-7 w-7 text-primary-600" />
                Our Services
              </h2>
              
              <div className="space-y-5">
                {/* Central Heating Services - Enhanced Responsiveness */}
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg group">
                  <button
                    aria-expanded={isServiceExpanded}
                    onClick={() => setIsServiceExpanded(!isServiceExpanded)}
                    // Adjusted padding for smaller screens
                    className="flex w-full text-left items-center justify-between px-4 py-3 sm:p-5 bg-gradient-to-r from-primary-50 to-white group-hover:from-primary-100 group-hover:to-primary-50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 min-w-0"> {/* Added min-w-0 to prevent overflow */}
                      <span className="bg-primary-100 p-2 sm:p-2.5 rounded-lg text-primary-700 border border-primary-200 shadow-sm group-hover:bg-primary-200 transition-all duration-300 flex-shrink-0">
                        {/* SVG Icon remains unchanged */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                        </svg>
                      </span>
                      <div className="flex-grow min-w-0"> {/* Added min-w-0 */}
                        {/* Adjusted font sizes for responsiveness */}
                        <h3 className="text-base sm:text-lg font-semibold text-slate-800 truncate">Central Heating</h3>
                        <p className="text-xs sm:text-sm text-slate-500 truncate">Boilers, installations & repairs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2"> {/* Added margin-left */}
                      <span className="bg-primary-600/10 text-primary-700 text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full whitespace-nowrap">14 services</span>
                      <span className="bg-white h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center border border-slate-200 shadow transition-all duration-300 transform group-hover:border-primary-300">
                        {isServiceExpanded ? (
                          <ChevronUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 transition-transform duration-300" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 transition-transform duration-300" />
                        )}
                      </span>
                    </div>
                  </button>

                  {isServiceExpanded && (
                    // Adjusted padding for smaller screens
                    <div className="p-4 sm:p-6 border-t border-slate-200 bg-white transition-all duration-300">
                      {/* Grid layout automatically stacks on mobile due to `md:grid-cols-2` */}
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-4">
                        {[
                          "Air Source Heat Pump Installation - ASHP",
                          "Air Source Heat Pump Servicing / Repair - ASHP",
                          "Emergency Central Heating Repair",
                          "Gas Boiler Installation",
                          "Gas Boiler Servicing / Repair",
                          "Gas Central Heating Servicing / Repair",
                          "Gas Cooker Installation",
                          "Gas Safety Checks - CP12",
                          "Ground Source Heat Pump Installation - GSHP",
                          "Ground Source Heat Pump Servicing / Repair - GSHP",
                          "LPG Boiler Installation",
                          "LPG Central Heating Installation",
                          "LPG Central Heating Servicing / Repair",
                          "Smart Thermostats",
                        ].map((service, index) => (
                          <li key={index} className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                            <span className="flex-shrink-0 inline-flex items-center justify-center rounded-full bg-primary-100 p-1 sm:p-1.5 shadow-sm border border-primary-200">
                              <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600" />
                            </span>
                            {/* Adjusted text size for list items */}
                            <span className="text-slate-700 text-sm">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Air Conditioning Services - Added for better UI */}
                {/* <div className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg group">
                  <button
                    className="flex w-full text-left items-center justify-between p-5 bg-gradient-to-r from-primary-50 to-white group-hover:from-primary-100 group-hover:to-primary-50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-primary-100 p-2.5 rounded-lg text-primary-700 border border-primary-200 shadow-sm group-hover:bg-primary-200 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M4.5 9.75a6 6 0 1111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">Air Conditioning</h3>
                        <p className="text-slate-500 text-sm">Installation, maintenance & repair</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-primary-600/10 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">8 services</span>
                      <span className="bg-white h-8 w-8 rounded-full flex items-center justify-center border border-slate-200 shadow transition-all duration-300 transform group-hover:border-primary-300">
                        <ChevronDownIcon className="h-5 w-5 text-primary-600 transition-transform duration-300" />
                      </span>
                    </div>
                  </button>
                </div> */}
                
                {/* Plumbing Services - Added for better UI */}
                {/* <div className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg group">
                  <button
                    className="flex w-full text-left items-center justify-between p-5 bg-gradient-to-r from-primary-50 to-white group-hover:from-primary-100 group-hover:to-primary-50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-primary-100 p-2.5 rounded-lg text-primary-700 border border-primary-200 shadow-sm group-hover:bg-primary-200 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                          <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                          <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
                        </svg>
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">Plumbing</h3>
                        <p className="text-slate-500 text-sm">Repairs, installations & maintenance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-primary-600/10 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">6 services</span>
                      <span className="bg-white h-8 w-8 rounded-full flex items-center justify-center border border-slate-200 shadow transition-all duration-300 transform group-hover:border-primary-300">
                        <ChevronDownIcon className="h-5 w-5 text-primary-600 transition-transform duration-300" />
                      </span>
                    </div>
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Tab */}
        <section
          id="reviews"
          ref={sectionRefs.current["reviews"]}
          className="mb-8 scroll-mt-20"
        >
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <StarIcon className="h-7 w-7 text-amber-500" />
                  Customer Reviews
                </h2>
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Write a review
                </a>
              </div>

              {/* Rating Overview - Enhanced Responsiveness */}
              <div className="bg-gradient-to-br from-primary-50 via-white to-primary-50 border border-primary-100 rounded-xl mb-8 shadow-sm overflow-hidden">
                <div className="p-1 bg-primary-600/5">
                  {/* Adjusted padding for smaller screens */}
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    {/* Adjusted gap for smaller screens */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                      {/* Left Side - Overall Rating */}
                      {/* Adjusted padding and text sizes for smaller screens */}
                      <div className="md:col-span-4 bg-gradient-to-br from-primary-50 to-white p-4 sm:p-6 rounded-xl border border-primary-100 shadow-sm text-center">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-4xl sm:text-5xl font-bold text-primary-600">8</span>
                            <div className="flex flex-col items-start">
                              <span className="text-slate-500 text-sm font-medium">/10</span>
                              <div className="flex mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    // Adjusted star size slightly for smaller screens
                                    className={`h-4 w-4 sm:h-5 sm:w-5 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-slate-600 text-xs sm:text-sm mt-1 sm:mt-2">
                            Based on <span className="font-semibold text-primary-700">44</span> verified reviews
                          </div>
                          {/* Adjusted badge padding and text size */}
                          <span className="mt-3 inline-flex items-center gap-1 text-primary-700 text-xs font-medium bg-primary-50 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-primary-100">
                            <CheckBadgeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            Top rated on Checkatrade
                          </span>
                        </div>
                      </div>
                      
                      {/* Right Side - Rating Metrics */}
                      {/* Adjusted spacing and element sizes within metric rows */}
                      <div className="md:col-span-8 space-y-3 sm:space-y-4">
                        {/* Quality of work */}
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-slate-100 hover:shadow-md transition-all duration-200">
                          <div className="p-2 sm:p-3 bg-amber-50 rounded-full border border-amber-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20" height="20" // Slightly smaller base size
                              viewBox="0 0 20 16"
                              className="fill-amber-600"
                              // Removed fixed width/height, let parent control
                            >
                              <path d="m8.22 8.79.68-2.18-1.78-1.34H9.3l.7-2.23.68 2.23h2.19L11.1 6.61l.66 2.18L10 7.44 8.22 8.79zM10 1.51C6.42 1.51 3.51 4.42 3.51 8s2.91 6.49 6.49 6.49 6.49-2.91 6.49-6.49S13.58 1.51 10 1.51zM2 8c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8-8-3.58-8-8z"></path>
                            </svg>
                          </div>
                          <div className="flex-grow min-w-0"> {/* Added min-w-0 */}
                            <div className="flex justify-between items-baseline mb-1">
                              <p className="font-medium text-slate-800 text-sm sm:text-base truncate">Quality of work</p>
                              <span className="text-xs sm:text-sm text-slate-600 whitespace-nowrap">Excellent</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 sm:h-2.5">
                              <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 sm:h-2.5 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                          </div>
                          {/* Adjusted score box */}
                          <div className="bg-amber-100 text-amber-800 font-bold text-base sm:text-xl px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg border border-amber-200 shadow-sm flex-shrink-0">10</div>
                        </div>
                        
                        {/* Reliability */}
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-slate-100 hover:shadow-md transition-all duration-200">
                          <div className="p-2 sm:p-3 bg-primary-50 rounded-full border border-primary-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20" height="20" // Slightly smaller base size
                              viewBox="0 0 20 16"
                              className="fill-primary-600"
                            >
                              <path d="M15.24 9.82V4.67l-3.69-2.58-3.68 2.58v2.02h-.86V4.25L11.56 1l4.55 3.25v5.57h-.87zm-3.31-4.44h.62v-.62h-.62v.62zm-1.37 0h.62v-.62h-.62v.62zm1.37 1.37h.62v-.62h-.62v.62zm-1.37 0h.62v-.62h-.62v.62zm-4.13 5.82 5.22 1.53 4.18-1.3c-.01-.22-.08-.39-.22-.51a.75.75 0 0 0-.5-.18h-3.42a4.5 4.5 0 0 1-.66-.04 2.8 2.8 0 0 1-.62-.15l-1.57-.49.28-.87 1.5.53c.17.06.36.1.57.13.21.02.47.03.78.03h.47c0-.23-.06-.41-.18-.57-.12-.15-.27-.26-.45-.33L7.94 8.9c-.02 0-.03-.01-.04-.01H6.43v3.68zm-3.22 1.84V8.02h4.64c.07 0 .13.01.19.02.06.02.12.03.18.05l3.86 1.43c.34.12.63.34.87.63.24.3.36.66.36 1.08h1.8c.5 0 .9.17 1.22.51.31.34.47.76.47 1.25v.44L11.71 15l-5.28-1.53v.93H3.21zm.86-.86h1.49V8.89H4.07v4.66z"></path>
                            </svg>
                          </div>
                          <div className="flex-grow min-w-0"> {/* Added min-w-0 */}
                            <div className="flex justify-between items-baseline mb-1">
                              <p className="font-medium text-slate-800 text-sm sm:text-base truncate">Reliability</p>
                              <span className="text-xs sm:text-sm text-slate-600 whitespace-nowrap">Excellent</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 sm:h-2.5">
                              <div className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 sm:h-2.5 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                          </div>
                          {/* Adjusted score box */}
                          <div className="bg-primary-100 text-primary-800 font-bold text-base sm:text-xl px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg border border-primary-200 shadow-sm flex-shrink-0">10</div>
                        </div>
                        
                        {/* Timeliness */}
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-slate-100 hover:shadow-md transition-all duration-200">
                          <div className="p-2 sm:p-3 bg-blue-50 rounded-full border border-blue-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                          </div>
                          <div className="flex-grow min-w-0"> {/* Added min-w-0 */}
                            <div className="flex justify-between items-baseline mb-1">
                              <p className="font-medium text-slate-800 text-sm sm:text-base truncate">Timeliness</p>
                              <span className="text-xs sm:text-sm text-slate-600 whitespace-nowrap">Excellent</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 sm:h-2.5">
                              <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 sm:h-2.5 rounded-full" style={{ width: '95%' }}></div>
                            </div>
                          </div>
                          {/* Adjusted score box */}
                          <div className="bg-blue-100 text-blue-800 font-bold text-base sm:text-xl px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg border border-blue-200 shadow-sm flex-shrink-0">9.5</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div>
                {/* Enhanced Responsive Header for Recent Reviews */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6">
                  {/* Adjusted title size */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 whitespace-nowrap"> {/* Added whitespace-nowrap */}
                    Recent Reviews <span className="text-sm font-medium text-slate-500 ml-1">({allReviewsData.length})</span>
                  </h3>
                  {/* Adjusted button container */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0"> {/* Increased gap slightly, added shrink */}
                    <button
                      onClick={openReviewsPopup} // Link filter button to popup open
                      className="flex items-center gap-1 sm:gap-1.5 text-primary-600 hover:text-primary-800 text-xs sm:text-sm font-medium p-1.5 sm:p-0 rounded-md hover:bg-primary-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                      </svg>
                      <span className="hidden sm:inline">Sort by</span> {/* Hide text on xs screens */}
                    </button>
                    <button
                      onClick={openReviewsPopup} // Link filter button to popup open
                      className="flex items-center gap-1 sm:gap-1.5 text-primary-600 hover:text-primary-800 text-xs sm:text-sm font-medium p-1.5 sm:p-0 rounded-md hover:bg-primary-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                      </svg>
                      <span className="hidden sm:inline">Filter</span> {/* Hide text on xs screens */}
                    </button>
                  </div>
                </div>
                
                {/* Adjusted grid gap for responsiveness */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {allReviewsData.slice(0, 3).map((review, index) => (
                    <div 
                      key={index} 
                      // Adjusted padding for review cards
                      className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:shadow-lg transition-all duration-300 hover:border-primary-200 group relative overflow-hidden flex flex-col" // Added flex flex-col
                    >
                      <div className="flex-grow"> {/* Wrap main content to allow footer push */}
                        <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-primary-50 rounded-bl-3xl -mt-6 sm:-mt-8 -mr-6 sm:-mr-8 group-hover:bg-primary-100 transition-colors duration-300 opacity-75 sm:opacity-100"></div> {/* Adjusted size/position/opacity */}
                        
                        <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10"> {/* Added z-index */}
                          <div className="flex items-center gap-2">
                            <span 
                              // Adjusted rating box size/padding/font
                              className={`font-bold text-xs sm:text-sm px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-lg flex items-center justify-center min-w-[36px] sm:min-w-10 ${
                                review.rating >= 7
                                  ? "bg-primary-100 text-primary-800 border border-primary-200"
                                  : review.rating >= 4
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              {review.rating}
                              <span className="text-xs font-normal ml-0.5 hidden sm:inline">/10</span> {/* Hide /10 on small */}
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon 
                                  key={i} 
                                  // Adjusted star size
                                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                                    i < Math.ceil(review.rating/2) 
                                      ? "text-amber-400 fill-amber-400" 
                                      : "text-gray-200 fill-gray-200"
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          
                          {review.verified && (
                            // Adjusted verified badge
                            <span className="flex items-center gap-1 text-primary-700 text-xs font-medium bg-primary-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border border-primary-100 relative z-10">
                              <CheckBadgeIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              <span className="hidden sm:inline">Verified</span> {/* Hide text on xs */}
                            </span>
                          )}
                        </div>
                        
                        {/* Adjusted title size */}
                        <h4 className="font-semibold text-slate-800 mb-2 sm:mb-3 text-base sm:text-lg">{review.title}</h4>
                        {/* Adjusted content size and line clamp */}
                        <p className="text-slate-600 line-clamp-4 sm:line-clamp-3 mb-3 sm:mb-4 leading-relaxed text-sm">{review.content}</p>
                      </div> {/* End flex-grow */}
                      
                      {/* Footer pushed down */}
                      <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100"> {/* Added mt-auto */}
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 flex items-center gap-1 sm:gap-1.5 mb-1">
                            <MapPinIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            {review.location}
                          </span>
                          <span className="text-xs text-slate-500">{review.date}</span>
                        </div>
                        
                        {/* Adjusted Helpful button */}
                        <button className="text-xs text-primary-600 hover:text-primary-800 hover:underline flex items-center gap-0.5 sm:gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-primary-50 rounded-full transition-colors duration-200 hover:bg-primary-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                          <span className="hidden sm:inline">Helpful</span> {/* Hide text on xs */}
                        </button>
                      </div>
                    </div>
                  ))}
                  </div>
                
                <div className="flex justify-center mt-10">
                  <button
                    onClick={openReviewsPopup}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-br from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    See all {allReviewsData.length} reviews
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Photos Tab */}
        <section
          id="photos"
          ref={sectionRefs.current["photos"]}
          className="mb-8 scroll-mt-20"
        >
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <PhotoIcon className="h-6 w-6 text-primary-600" />
                  Photos <span className="text-sm font-normal text-slate-500 ml-2">(132 total)</span>
              </h2>
              
                <button
                    onClick={() => openLightbox(0)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1.5 transition-colors duration-200"
                >
                  <span className="hidden sm:inline">View all photos</span>
                  <span className="sm:hidden">View all</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
                </button>
      </div>

              <div className="relative">
                {/* Gallery Grid */}
                <div className="grid grid-cols-12 gap-2 md:gap-3">
                  {/* Main Feature Photo */}
                  <div 
                    className="col-span-12 md:col-span-6 rounded-xl overflow-hidden h-64 md:h-80 relative group cursor-pointer"
                    onClick={() => openLightbox(0)}
                  >
                    <img
                      src={images[0]}
                      alt="Featured project photo"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white font-medium">Air conditioning installation</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm text-xs font-medium text-slate-800 flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-primary-600">
                          <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                          <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        View
                      </span>
                    </div>
                  </div>
                  
                  {/* Right Column Smaller Photos */}
                  <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-2 md:gap-3">
                    {/* Top Row */}
                    <div 
                      className="rounded-xl overflow-hidden h-32 md:h-[158px] relative group cursor-pointer"
                      onClick={() => openLightbox(1)}
                    >
                      <img
                        src={images[1]}
                        alt="Project photo"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div 
                      className="rounded-xl overflow-hidden h-32 md:h-[158px] relative group cursor-pointer"
                      onClick={() => openLightbox(2)}
                    >
                      <img
                        src={images[2]}
                        alt="Project photo"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Bottom Row */}
                    <div 
                      className="rounded-xl overflow-hidden h-32 md:h-[158px] relative group cursor-pointer"
                      onClick={() => openLightbox(3)}
                    >
                      <img
                        src={images[3]}
                        alt="Project photo"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div 
                      className="rounded-xl overflow-hidden h-32 md:h-[158px] relative group cursor-pointer"
                      onClick={() => openLightbox(4)}
                    >
                      <img
                        src={images[4]}
                        alt="Project photo"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
                        <span className="text-white text-2xl font-bold mb-1">+128</span>
                        <button 
                          className="px-3 py-1.5 bg-white/20 hover:bg-white/30 transition-colors duration-300 rounded-lg text-white text-sm font-medium backdrop-blur-sm"
                          onClick={() => openLightbox(4)}
                        >
                          View all photos
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Category Pills - Optional */}
                <div className="flex flex-wrap gap-2 mt-5">
                  <button className="px-3.5 py-1.5 bg-primary-600 text-white rounded-full text-sm font-medium">
                    All Photos (132)
                  </button>
                  <button className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full text-sm font-medium transition-colors duration-200">
                    Installations (68)
                  </button>
                  <button className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full text-sm font-medium transition-colors duration-200">
                    Air Conditioning (42)
                  </button>
                  <button className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full text-sm font-medium transition-colors duration-200">
                    Heating (22)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Info & Accreditations Tab */}
        <section
          id="company-info"
          ref={sectionRefs.current["company-info"]}
          className="mb-8 scroll-mt-20"
        >
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 md:p-6 lg:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6 md:mb-8">
                <DocumentTextIcon className="h-5 w-5 md:h-6 md:w-6 text-primary-600" />
                Company Information & Accreditations
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
                {/* Company Information - Enhanced styling */}
                <div className="lg:col-span-7 space-y-6 md:space-y-8">
                  <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-primary-50 via-white to-primary-50 border border-primary-100 shadow-md">
                    <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-primary-100 opacity-50 rounded-bl-full -mt-8 -mr-8"></div>
                    <div className="relative p-4 md:p-6 z-10">
                      <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 md:mb-5 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v-4H7v4h8z" clipRule="evenodd" />
                          <path d="M7 2h6v4H7V2z" />
                        </svg>
                        Company Details
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
                        <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 flex items-start gap-3 transform transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                          <div className="bg-primary-100 p-1.5 md:p-2 rounded-full text-primary-700">
                            <UserIcon className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                          <div>
                            <p className="text-xs md:text-sm font-medium text-slate-500 mb-0.5 md:mb-1">Owner</p>
                            <p className="font-semibold text-slate-800 text-sm md:text-base">Customer Services</p>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 flex items-start gap-3 transform transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                          <div className="bg-primary-100 p-1.5 md:p-2 rounded-full text-primary-700">
                            <BuildingOfficeIcon className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                          <div>
                            <p className="text-xs md:text-sm font-medium text-slate-500 mb-0.5 md:mb-1">Company Type</p>
                            <p className="font-semibold text-slate-800 text-sm md:text-base">Ltd Company <span className="text-slate-500 font-normal text-xs">(2 years on Checkatrade)</span></p>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 flex items-start gap-3 transform transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                          <div className="bg-primary-100 p-1.5 md:p-2 rounded-full text-primary-700">
                            <DocumentTextIcon className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                          <div>
                            <p className="text-xs md:text-sm font-medium text-slate-500 mb-0.5 md:mb-1">VAT Registered</p>
                            <p className="font-semibold text-slate-800 text-sm md:text-base">Yes: <span className="font-mono text-slate-600 tracking-wide text-xs md:text-sm">366940857</span></p>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 flex items-start gap-3 transform transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                          <div className="bg-emerald-100 p-1.5 md:p-2 rounded-full text-emerald-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs md:text-sm font-medium text-slate-500 mb-0.5 md:mb-1">Verified Business</p>
                            <p className="font-semibold text-emerald-600 text-sm md:text-base">Quality Assured</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-6 bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-slate-100">
                        <h4 className="text-xs md:text-sm font-semibold text-slate-700 mb-2 md:mb-3">Business Features</h4>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                          {["Domestic Work", "Commercial Work", "Free Estimates", "Cards Accepted", "Insurance Work", "24 Hour Call-out"].map((tag, index) => (
                            <span key={index} className="px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-primary-50 to-white text-primary-700 text-xs font-medium rounded-full border border-primary-100 shadow-sm flex items-center gap-1"> 
                              <CheckIcon className="h-2.5 w-2.5 md:h-3 md:w-3" />
                              <span className="truncate">{tag}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-md overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                    <div className="p-4 md:p-6">
                      <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 md:mb-5 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        About Lets Heat
                      </h3>
                      
                      <div className="prose prose-sm md:prose-base text-slate-700 max-w-none prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-li:my-1 md:prose-li:my-1.5 leading-relaxed bg-gradient-to-br from-white to-primary-50 p-3 md:p-5 rounded-lg md:rounded-xl border border-primary-50"> 
                <p>
                  Let's Heat are an established family run business covering
                  Cardiff, Bristol & the surrounding areas.
                </p>
                <p>
                  We directly employ our own specialist tradesmen, to ensure the
                  high standards we set are matched on every installation.
                </p>
                <p>
                  We offer Air Conditioning, Boilers, Heat Pump, Central Heating
                  and complete bathroom and wetroom renovation service, taking
                  care of everything from start to finish.
                </p>
                <p>
                  We are Worcester accredited installers and in so can offer a
                  massive boiler warranty of up to 12 years.
                </p>
                
                <div className="not-prose bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-slate-100 mt-4 md:mt-5">
                  <h4 className="font-bold text-primary-800 mb-2 md:mb-3 text-sm md:text-base">Our Services Include:</h4>
                  <ul className="space-y-1.5 md:space-y-2"> 
                    {[
                      "Full bathroom and kitchen installations (Bathrooms, Wetrooms, Kitchens)",
                      "Full Central Heating Installations (Boiler Replacements, Central heating installations, Power Flushing, Under floor Heating)",
                      "Certificates & Servicing (Homeowner/Landlord Gas Safety Certificates, Boiler Servicing, Boiler Repair)",
                      "Plumbing Repairs (toilet repairs, tap replacements, shower replacements, leaking pipework etc.)",
                      "Unvented Cylinder Replacements",
                      "Air conditioning installation and maintenance (Daikin, Mitsubishi, Toshiba, Fujitsu)"
                    ].map((service, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs md:text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-primary-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-700">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-4 md:mt-5 not-prose">
                  <span className="text-slate-700 font-medium">Get a fixed price quote now:</span>
                  <a
                    href="http://www.letsheat.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 md:px-4 py-1.5 md:py-2 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors flex items-center justify-center sm:justify-start gap-1.5 w-full sm:w-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    Visit our website
                  </a>
                </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accreditations - Enhanced styling for mobile */}
                <div className="lg:col-span-5 space-y-4 md:space-y-6 mt-4 lg:mt-0">
                  <div className="bg-gradient-to-br from-primary-50 via-white to-primary-50 rounded-xl md:rounded-2xl border border-primary-100 shadow-md overflow-hidden">
                    <div className="bg-primary-600 py-3 md:py-4 px-4 md:px-6">
                      <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                        <CheckBadgeIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        Accreditations & Awards
                      </h3>
                    </div>
                    
                    <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                      <p className="text-slate-600 text-xs md:text-sm italic border-l-4 border-primary-200 pl-2 md:pl-3 py-1">Verified credentials that demonstrate our professional standards and commitment to quality.</p>
                      
                      <div className="grid grid-cols-1 gap-3 md:gap-4">
                        {/* F Gas Register Accreditation - Mobile responsive */}
                        <div className="group relative bg-white rounded-lg md:rounded-xl border border-slate-200 hover:border-primary-300 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden transform hover:-translate-y-1">
                          <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-bl from-primary-100 to-transparent rounded-bl-3xl opacity-80"></div>
                          <div className="p-3 md:p-5 flex gap-3 md:gap-4 items-center relative z-10">
                            <div className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0 bg-white rounded-lg md:rounded-xl p-1.5 md:p-2 flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-primary-200 transition-colors duration-300">
                              <img
                                alt="F Gas Register.com"
                                loading="lazy"
                                className="object-contain h-full w-full"
                                src="https://storage.googleapis.com/frontend-prod-37565-accred-images/Accred160_F-GAS-NEW.gif"
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                                <a
                                  className="text-primary-700 font-bold text-base md:text-lg hover:underline cursor-pointer truncate"
                                  target="_blank"
                                  rel="nofollow noreferrer"
                                  href="https://fgasregister.com/"
                                >
                                  F Gas Register.com
                                </a>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                              </div>
                              <p className="text-slate-600 text-xs md:text-sm leading-snug mb-2 md:mb-3 line-clamp-3 md:line-clamp-none">
                                Certified for handling F-Gas refrigerants in accordance with EU regulations. This ensures safe and legal refrigerant handling.
                              </p>
                              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                <span className="inline-flex items-center gap-1 md:gap-1.5 text-white text-xs font-medium bg-primary-600 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full shadow-sm">
                                  <CheckBadgeIcon className="h-3 w-3 md:h-4 md:w-4" />
                                  Verified
                                </span>
                                <span className="text-xs text-slate-500">Renewed annually</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Gas Safe Register - Mobile responsive */}
                        <div className="group relative bg-white rounded-lg md:rounded-xl border border-slate-200 hover:border-primary-300 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden transform hover:-translate-y-1">
                          <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-bl from-primary-100 to-transparent rounded-bl-3xl opacity-80"></div>
                          <div className="p-3 md:p-5 flex gap-3 md:gap-4 items-center relative z-10">
                            <div className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0 bg-white rounded-lg md:rounded-xl p-1.5 md:p-2 flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-primary-200 transition-colors duration-300">
                              <img
                                alt="Gas Safe Register"
                                loading="lazy"
                                className="object-contain h-full w-full"
                                src="https://storage.googleapis.com/frontend-prod-37565-accred-images/Accred11_Gas-Safe-Register.gif"
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                                <a
                                  className="text-primary-700 font-bold text-base md:text-lg hover:underline cursor-pointer truncate"
                                  target="_blank"
                                  rel="nofollow noreferrer"
                                  href="https://www.gassaferegister.co.uk/find-an-engineer/#checkabusiness"
                                >
                                  Gas Safe Register
                                </a>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                              </div>
                              <p className="text-slate-600 text-xs md:text-sm leading-snug mb-2 md:mb-3 line-clamp-3 md:line-clamp-none">
                                Registered with Gas Safe, the UK's official gas registration body for safe and compliant gas work.
                              </p>
                              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                <span className="inline-flex items-center gap-1 md:gap-1.5 text-white text-xs font-medium bg-primary-600 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full shadow-sm">
                                  <CheckBadgeIcon className="h-3 w-3 md:h-4 md:w-4" />
                                  Verified
                                </span>
                                <span className="text-xs text-slate-500">Legal requirement</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Worcester Bosch - Mobile responsive */}
                        <div className="group relative bg-white rounded-lg md:rounded-xl border border-slate-200 hover:border-primary-300 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden transform hover:-translate-y-1">
                          <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-bl from-primary-100 to-transparent rounded-bl-3xl opacity-80"></div>
                          <div className="p-3 md:p-5 flex gap-3 md:gap-4 items-center relative z-10">
                            <div className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0 bg-white rounded-lg md:rounded-xl p-1.5 md:p-2 flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-primary-200 transition-colors duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                                <a
                                  className="text-primary-700 font-bold text-base md:text-lg hover:underline cursor-pointer truncate"
                                  target="_blank"
                                  rel="nofollow noreferrer"
                                  href="#"
                                >
                                  Demo accreditation
                                </a>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                              </div>
                              <p className="text-slate-600 text-xs md:text-sm leading-snug mb-2 md:mb-3 line-clamp-3 md:line-clamp-none">
                                Demo accreditation for Worcester Bosch
                              </p>
                              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                <span className="inline-flex items-center gap-1 md:gap-1.5 text-white text-xs font-medium bg-emerald-600 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full shadow-sm">
                                  <CheckBadgeIcon className="h-3 w-3 md:h-4 md:w-4" />
                                  Premium Partner
                                </span>
                                <span className="text-xs text-slate-500">12-year warranty</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 md:mt-4 flex justify-center">
                        <a href="#" className="flex items-center justify-center gap-1 md:gap-1.5 text-primary-600 font-medium text-xs md:text-sm hover:text-primary-800 transition-colors">
                          <span>View all accreditations</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-md">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="bg-white/20 rounded-full p-2 md:p-3 backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold">Quality Guaranteed</h3>
                    </div>
                    <p className="text-white/90 text-sm md:text-base mb-4 md:mb-5">
                      We take pride in our accreditations which demonstrate our commitment to quality, safety, and professional standards.
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4">
                      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                        <div className="h-6 w-6 md:h-8 md:w-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-base">1</div>
                        <p className="font-medium text-sm md:text-base">Fully qualified technicians</p>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                        <div className="h-6 w-6 md:h-8 md:w-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-base">2</div>
                        <p className="font-medium text-sm md:text-base">Manufacturer-backed warranties</p>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="h-6 w-6 md:h-8 md:w-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-base">3</div>
                        <p className="font-medium text-sm md:text-base">Compliant with all regulations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Buttons */}
      <div
        className={`sticky bottom-0 border-t border-slate-300 w-full bg-white z-20 transition-opacity duration-300 ${
          showStickyButtons ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 md:w-auto w-full">
              <img
                alt="Lets Heat profile"
                width="50" 
                height="50"
                className="rounded-full border-2 border-white shadow-sm hidden md:block"
                src="https://lh3.googleusercontent.com/HDTECijs8t7hybZ6xmyZA2MWM7JQniH1vbdD83_vO8ydK83kaNrI7jkFby8T3BAMB-pkIq5QysWdEdlV8YebVygtkzVbneKRi9AkCjfcLn06hyhkk_8APd2v1oih=w1024-nu-rw-e365"
              />
              <h2 className="text-lg font-semibold text-slate-800 hidden md:block">Lets Heat</h2>
            </div>
            
            <div className="flex md:gap-3 gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowPhone((prev) => !prev)}
                className="flex items-center justify-center gap-1 px-4 py-2 bg-white border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-white transition-all duration-200 md:w-auto w-1/2"
              >
                <PhoneIcon className="h-5 w-5" />
                <span className="md:block hidden">{showPhone ? "07458 177554" : "Show phone"}</span>
                <span className="block md:hidden">Call</span>
              </button>
              
              <a
                href="#"
                className="flex items-center justify-center gap-1 px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm md:w-auto w-1/2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M3 13.19c0 .25.26.43.49.33l13.4-5.36c.15-.06.15-.27 0-.33L3.49 2.48c-.23-.1-.49.07-.49.33V6.1c0 .36.27.67.63.71L13.22 8 3.63 9.19c-.36.05-.63.35-.63.71v3.29z"></path>
                </svg>
                <span>Request a quote</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {isLightboxOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setIsLightboxOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % images.length)
          }
          toolbarButtons={[
            <button
              key="thumbnails"
              type="button"
              className="text-white text-sm hover:text-gray-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (thumbnailsRef.current) {
                  thumbnailsRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                  });
                }
              }}
            >
              {`${photoIndex + 1} / ${images.length}`}
            </button>,
          ]}
          imageTitle={
            <div className="flex flex-col items-start gap-1">
              <h1 className="font-bold text-white text-xl">Lets Heat</h1>
              <span className="font-normal text-xs text-white/90">
                Photo {photoIndex + 1} of {images.length}
              </span>
            </div>
          }
          reactModalStyle={{
            overlay: {
              zIndex: 1050,
            },
          }}
        />
      )}

      {/* Reviews Popup */}
      <ReviewsPopup
        isOpen={isReviewsPopupOpen}
        onClose={closeReviewsPopup}
        reviews={allReviewsData}
      />
    </div>
  );
}