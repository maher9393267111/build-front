import React from 'react';

const Card = ({ title, children, className = '', bodyClass = '' }) => {
  return (
    <div className={`rounded-lg bg-white shadow-lg border border-gray-100 ${className}`}>
      {title && (
        <div className="border-b border-gray-100 px-6 py-4">
          <h4 className="text-xl font-medium text-gray-900">{title}</h4>
        </div>
      )}
      <div className={`p-6 ${bodyClass}`}>
        {children}
      </div>
    </div>
  );
};

export default Card; 