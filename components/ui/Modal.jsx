'use client';
import { Fragment, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Icon from './Icon';

const Modal = ({
  title,
  open,
  onClose,
  children,
  size = 'md',
  footer,
  className = '',
  disableOutsideClick = false,
  showCloseButton = true,
}) => {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && open && !disableOutsideClick) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [open, onClose, disableOutsideClick]);

  // Size mappings
  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    '5xl': 'sm:max-w-5xl',
    '6xl': 'sm:max-w-6xl',
    '7xl': 'sm:max-w-7xl',
    full: 'sm:max-w-full sm:w-full'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog 
        as="div" 
        className="fixed inset-0 z-50 overflow-y-auto" 
        initialFocus={cancelButtonRef}
        onClose={disableOutsideClick ? () => {} : onClose}
      >
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* Trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className={`relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:align-middle ${sizeClass} ${className}`}>
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    {title}
                  </Dialog.Title>
                  {showCloseButton && (
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <Icon icon="XMark" className="h-6 w-6" aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="bg-white">{children}</div>
              
              {/* Footer */}
              {footer && (
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  {footer}
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;