import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  className = '',
  labelClass = '',
  disabled = false,
  placeholder = 'Select an option',
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className={`block text-sm font-medium text-gray-700 mb-1 ${labelClass}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            appearance-none w-full rounded-lg border-2 pr-10
            ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} 
            focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            ${className}
          `}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select; 