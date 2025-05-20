import React from 'react';


const MarkdownRenderer = ({ markdown, className = '' }) => {
  // Sanitize the HTML content before rendering
 
  return (
    <div 
      className={`prose max-w-none `}
      dangerouslySetInnerHTML={{ __html: markdown }} 
    />
  );
};

export default MarkdownRenderer;