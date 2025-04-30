import React from 'react';
import * as HeroIconsSolid from '@heroicons/react/24/solid';
import * as HeroIconsOutline from '@heroicons/react/24/outline';

const Icon = ({ icon, className = '', ...props }) => {
  // Extract icon name and determine if it's an outline or solid icon
  const iconName = icon.includes(':') ? icon.split(':')[1] : icon;
  const isOutline = icon.includes('heroicons-outline:') || icon.includes('outline:');
  
  // Convert kebab-case to PascalCase for HeroIcons
  const formattedIconName = iconName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  // Append "Icon" suffix for Heroicons v2 compatibility
  const ComponentName = `${formattedIconName}Icon`;
  
  // Get the appropriate icon component using the name with the suffix
  const IconComponent = isOutline 
    ? HeroIconsOutline[ComponentName] 
    : HeroIconsSolid[ComponentName];
  
  if (!IconComponent) {
    // Log a warning if the icon (with suffix) wasn't found
    console.warn(`Icon component ${ComponentName} not found (from input: ${icon})`);
    return null;
  }
  
  return <IconComponent className={`h-5 w-5 ${className}`} {...props} />;
};

export default Icon; 