import React from 'react';

const Textinput = ({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  className = '',
  labelClass = '',
  disabled = false,
  icon,
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className={`block text-sm font-medium text-gray-700 mb-1 ${labelClass}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-lg border-2 
            ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'} 
            focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none
            ${icon ? 'pl-10' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
            ${className}
          `}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Textinput; 