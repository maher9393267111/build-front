import React, { forwardRef } from 'react';

const Textinput = forwardRef(
  (
    {
      label,
      type = 'text',
      placeholder,
      required = false,
      error,
      className = '',
      labelClass = '',
      disabled = false,
      icon,
      helperText,
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
          {icon && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              {icon}
            </span>
          )}
          <input
            type={type}
            id={rest.name}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            ref={ref}
            {...rest}
            className={`
              w-full rounded-lg border-2
              ${hasError ? 'border-red-500 focus:border-red-600 focus:ring-red-200' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'}
              focus:ring-2 focus:outline-none transition duration-150 ease-in-out
              px-3 py-2
              ${icon ? 'pl-10' : ''}
              ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'}
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${rest.name}-error` : helperText ? `${rest.name}-helper` : undefined}
          />
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

Textinput.displayName = 'Textinput';

export default Textinput; 