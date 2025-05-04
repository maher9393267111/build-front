import React from 'react';
// Import both outline and solid icons from the 24px set
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as SolidIcons from '@heroicons/react/24/solid';

const Button = ({ 
  text, 
  icon, 
  className = '', 
  onClick, 
  type = 'button', 
  disabled = false,
  isLoading = false
}) => {
  // Handle icon rendering - support both string names and direct component instances
  let IconComponent = null;
  
  if (icon) {
    // If icon is already a React element, use it directly
    if (React.isValidElement(icon)) {
      IconComponent = () => icon;
    } 
    // Otherwise, try to find the icon in the Heroicons libraries
    else if (typeof icon === 'string') {
      // Add "Icon" suffix if it's not already there
      const iconName = icon.endsWith('Icon') ? icon : `${icon}Icon`;
      IconComponent = OutlineIcons[iconName] || SolidIcons[iconName];
    }
  }

  // Base styles for all buttons
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed";

  // Specific styles based on className
  let specificStyles = '';

  // Determine specific styles - Handle compound classes like "btn-outline-primary btn-sm"
  const classes = className.split(' ');
  const btnTypeClass = classes.find(cls => cls.startsWith('btn-'));
  const otherClasses = classes.filter(cls => !cls.startsWith('btn-')).join(' '); // Keep other classes like btn-sm

  switch (btnTypeClass) {
    case 'btn-dark':
      specificStyles = 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-500';
      break;
    case 'btn-outline-dark':
      specificStyles = 'border border-gray-700 bg-transparent text-gray-700 hover:bg-gray-700 hover:text-white focus:ring-gray-500';
      break;
    case 'btn-primary':
      specificStyles = 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500';
      break;
    case 'btn-outline-primary':
      specificStyles = 'border border-primary-500 bg-transparent text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-500';
      break;
    case 'btn-secondary': 
      specificStyles = 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500';
      break;
    case 'btn-outline-secondary':
       specificStyles = 'border border-gray-400 bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400';
      break;
    case 'btn-danger': 
      specificStyles = 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500';
      break;
    case 'btn-outline-danger':
      specificStyles = 'border border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-white focus:ring-red-500';
      break;
    case 'btn-outline-gray':
      specificStyles = 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-300';
      break;
    default:
      // Default to primary if no specific btn- class or only other classes are present
      if (!btnTypeClass && className) {
         // If className was provided but didn't include a btn-* class, append it
         specificStyles = `bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 ${className}`;
      } else {
         specificStyles = 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500';
      }
      break;
  }

  // If other classes like btn-sm were passed, append them
  if (otherClasses) {
      specificStyles += ` ${otherClasses}`;
  }
  
  // Small button adjustments
  if (className.includes('btn-sm')) {
    specificStyles = specificStyles.replace('px-4 py-2', 'px-3 py-1.5 text-sm'); 
  }

  return (
    <button
      type={type}
      className={`${baseStyles} ${specificStyles}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon && (
        <span className="flex-shrink-0">
          {React.isValidElement(icon) ? (
            icon
          ) : IconComponent ? (
            <IconComponent className="h-5 w-5" />
          ) : null}
        </span>
      )}
      {text && <span>{text}</span>}
    </button>
  );
};

export default Button; 