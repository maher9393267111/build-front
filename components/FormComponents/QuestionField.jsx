'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const QuestionField = ({ field, value, onChange, allFields }) => {
  const [selectedOption, setSelectedOption] = useState(value || null);
  
  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option.value);
    onChange(`question_${field.id}`, option.value);
  };
  
  // Get options from the field
  const options = field.options || [];
  
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label} {field.isRequired && <span className="text-red-500">*</span>}
      </label>
      {field.placeholder && (
        <p className="text-gray-600 mb-4">{field.placeholder}</p>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {options.map((option, index) => {
          // Handle different option formats
          const optionObj = typeof option === 'object' ? option : { label: option, value: option };
          const hasImage = optionObj.image && optionObj.image.url;
          
          return (
            <div
              key={index}
              className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 
                ${selectedOption === optionObj.value 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              onClick={() => handleOptionSelect(optionObj)}
            >
              <div className="flex items-start">
                {/* Radio button */}
                <div className="flex items-center h-5 mr-3">
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center
                    ${selectedOption === optionObj.value 
                      ? 'border-primary-500' 
                      : 'border-gray-300'
                    }`}
                  >
                    {selectedOption === optionObj.value && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary-500"></div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  {/* Option image */}
                  {hasImage && (
                    <div className="mb-3 rounded-md overflow-hidden">
                      <img 
                        src={optionObj.image.url} 
                        alt={optionObj.label || ''} 
                        className="w-full object-cover h-36"
                      />
                    </div>
                  )}
                  
                  {/* Option label */}
                  <div className="text-gray-900 font-medium">
                    {optionObj.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {field.error && (
        <p className="mt-3 text-sm text-red-600">{field.error}</p>
      )}
    </div>
  );
};

export default QuestionField; 