

import React, { useState, useEffect } from 'react';

const TableOfContents = ({ items }) => {
  const [activeId, setActiveId] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  // Function to truncate text to first 6-7 words
  const truncateText = (text, wordCount = 6) => {
    const words = text.split(' ');
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(' ') + '...';
  };

  // Get visible items (either all or just first 5)
  const visibleItems = showAllItems 
    ? items 
    : items.slice(0, 5);

  // Check which section is currently in view
  useEffect(() => {
    if (!items || items.length === 0) return;

    const observerOptions = {
      rootMargin: '-80px 0px -20% 0px',
      threshold: 0
    };

    const handleObserver = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, observerOptions);
    
    // Observe all heading elements
    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  const handleScroll = (e, id) => {
    e.preventDefault();
    
    setTimeout(() => {
      const element = document.getElementById(id);
      
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
        
        setActiveId(id);
      }
    }, 100);
  };

  if (!items || items.length === 0) return null;

  return (
    <>
      {/* Mobile View - Sticky bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-30">
        <div 
          className="flex items-center justify-between p-3 border-t border-gray-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="font-medium text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Table of Contents
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
        
        <div className={`overflow-hidden transition-all duration-300 bg-white ${isExpanded ? 'max-h-64' : 'max-h-0'}`}>
          <ul className="p-4 overflow-y-auto max-h-64 divide-y divide-gray-100">
            {visibleItems.map(item => (
              <li key={item.id} className="py-2">
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleScroll(e, item.id)}
                  className={`
                    block pl-${item.level * 2} transition-colors duration-150
                    ${activeId === item.id ? 'text-primary-600 font-medium' : 'text-gray-600'}
                  `}
                >
                  {truncateText(item.text)}
                </a>
              </li>
            ))}
          </ul>
          
          {items.length > 5 && (
            <div className="px-4 pb-3">
              <button 
                onClick={() => setShowAllItems(!showAllItems)}
                className="w-full py-2 px-3 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center shadow-sm"
              >
                <span>{showAllItems ? 'Show Less' : 'Show More'}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ml-1.5 transition-transform ${showAllItems ? 'transform rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop View - Sidebar */}
      <div className="hidden lg:block sticky top-24 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-primary-50 p-4 border-b border-primary-100">
          <h3 className="text-lg font-semibold text-primary-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            In this article
          </h3>
        </div>
        <div className="p-4">
          <ul className="space-y-2 text-sm max-h-[calc(100vh-12rem)] overflow-y-auto">
            {visibleItems.map(item => (
              <li 
                key={item.id} 
                className={`
                  ${item.level === 1 ? 'mb-2' : ''}
                  ${item.level === 2 ? 'ml-3' : ''}
                  ${item.level === 3 ? 'ml-6' : ''}
                `}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleScroll(e, item.id)}
                  className={`
                    flex items-center py-1 transition-colors duration-150 rounded px-2 hover:bg-primary-50
                    ${activeId === item.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600'}
                  `}
                >
                  {activeId === item.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  <span className={activeId === item.id ? 'border-b border-primary-300' : ''}>
                    {truncateText(item.text)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          
          {items.length > 5 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button 
                onClick={() => setShowAllItems(!showAllItems)}
                className="w-full py-2 px-3 text-sm font-medium bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-md hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center justify-center shadow-sm group"
              >
                {showAllItems ? (
                  <>
                    <span>Show Less</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Show All {items.length} Topics</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TableOfContents;