import React, { forwardRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const Select = forwardRef(
  (
    {
      label,
      required = false,
      error,
      className = '',
      labelClass = '',
      disabled = false,
      helperText,
      children,
      ...rest
    },
    ref
  ) => {
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={rest.name}
            className={`block text-sm font-medium text-gray-700 mb-1 ${labelClass}`}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={rest.name}
            disabled={disabled}
            required={required}
            ref={ref}
            {...rest}
            className={`
              appearance-none w-full rounded-lg border-2 pr-10
              ${hasError ? 'border-red-500 focus:border-red-600 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'}
              focus:ring-2 focus:outline-none transition duration-150 ease-in-out
              px-3 py-2
              ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'}
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${rest.name}-error` : helperText ? `${rest.name}-helper` : undefined}
          >
            {children}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        {helperText && !hasError && (
           <p id={`${rest.name}-helper`} className="mt-1 text-xs text-gray-500">
             {helperText}
           </p>
         )}
        {hasError && (
          <p id={`${rest.name}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select; 