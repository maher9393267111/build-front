'use client';
import React, { useState, useEffect } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// Create a map of Heroicons for use in the component
import * as HeroIcons from '@heroicons/react/24/outline';

// Helper function to merge class names (simplified version of cn utility)
const cn = (...classes) => classes.filter(Boolean).join(' ');

const OfferNavTitles = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);
  
  // Start animation after component mounts with a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Return early if no settings or navTitles data
  if (!settings?.navTitles?.items || settings.navTitles.items.length === 0) {
    return null;
  }

  // Get the nav titles data from settings
  const { items, fontSize, textColor, iconColor } = settings.navTitles;
  
  // Create duplicate items for the display
  const displayItems = [...items, ...items];
  
  // Function to get the icon component from the string name
  const getIconComponent = (iconName) => {
    // Default to InformationCircleIcon if the icon doesn't exist
    if (!iconName || !HeroIcons[iconName]) {
      return HeroIcons.InformationCircleIcon;
    }
    return HeroIcons[iconName];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={cn(
            "relative overflow-hidden",
            "bg-gradient-to-r from-primary-800 via-primary-600 to-primary-800",
            "after:absolute after:inset-0",
            "after:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]",
            "after:from-primary-400/10 after:via-transparent after:to-transparent",
            "after:pointer-events-none"
          )}
        >
          <div className="container mx-auto px-4 py-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex-1 overflow-hidden">
                <div className="flex">
                  <motion.div
                    className="flex whitespace-nowrap"
                    animate={startAnimation ? {
                      x: ["0%", "-50%"]
                    } : {
                      x: "0%"
                    }}
                    transition={{
                      x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 20,
                        ease: "linear",
                      },
                    }}
                  >
                    {displayItems.map((item, index) => {
                      const IconComponent = getIconComponent(item?.icon);
                      return (
                        <motion.span
                          key={index}
                          className="flex items-center justify-center gap-4 group mx-6"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <motion.div
                            style={{ borderColor: iconColor || '#ffffff' }}
                            className={cn(
                              "w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0",
                              "bg-white/15 backdrop-blur-sm shadow-sm",
                              "backdrop-saturate-150"
                            )}
                            whileHover={{
                              scale: 1.1,
                              rotate: 360,
                              transition: { duration: 0.6, ease: "easeInOut" }
                            }}
                          >
                            <IconComponent
                              className="w-[18px] h-[18px] transition-transform group-hover:scale-110"
                              style={{ color: iconColor || '#ffffff' }}
                            />
                          </motion.div>
                          <span
                            className={cn(
                              fontSize || 'text-md',
                              "font-medium tracking-wide whitespace-nowrap",
                              "transition-all duration-300 group-hover:tracking-wider",
                            )}
                            style={{ color: textColor || '#ffffff' }}
                          >
                            {item?.title}
                          </span>
                        </motion.span>
                      );
                    })}
                  </motion.div>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className={cn(
                  "ml-4 hover:bg-white/20 border border-white/30 rounded-lg p-1.5",
                  "transition-all duration-300 ease-in-out",
                  "focus:outline-none focus:ring-2 focus:ring-white/30",
                )}
                style={{ color: textColor || '#ffffff' }}
                whileHover={{
                  scale: 1.05,
                  rotate: 180,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <XMarkIcon className="w-4 h-4 opacity-80" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfferNavTitles; 