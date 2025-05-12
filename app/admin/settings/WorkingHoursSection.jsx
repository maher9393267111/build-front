import React, { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, PlusIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const WorkingHoursSection = ({ register, control, watch, setValue, errors }) => {
  const [expandedDay, setExpandedDay] = useState(null);
  
  const { fields: workingHoursFields, append: appendDay, remove: removeDay } = useFieldArray({
    control,
    name: "contactSection.workingHours"
  });

  // Add a new day
  const addWorkingDay = () => {
    appendDay({ 
      day: 'Custom Day', 
      title: 'Custom Day',
      startTime: '09:00',
      endTime: '17:00',
      isOpen: true
    });
    // Automatically expand the newly added day
    setExpandedDay(workingHoursFields.length);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold text-gray-800">Business Hours</h3>
        <button
          type="button"
          onClick={addWorkingDay}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Custom Day
        </button>
      </div>
      
      <div className="space-y-3">
        {workingHoursFields.map((day, index) => (
          <Disclosure
            key={day.id}
            as="div"
            className={`border rounded-lg overflow-hidden ${
              watch(`contactSection.workingHours.${index}.isOpen`) 
                ? 'border-green-200' 
                : 'border-red-200'
            }`}
            defaultOpen={index === expandedDay}
          >
            {({ open }) => (
              <>
                <Disclosure.Button 
                  className={`w-full px-4 py-3 flex justify-between items-center text-left font-medium ${
                    watch(`contactSection.workingHours.${index}.isOpen`) 
                      ? 'bg-green-50 text-green-800 hover:bg-green-100' 
                      : 'bg-red-50 text-red-800 hover:bg-red-100'
                  }`}
                  onClick={() => setExpandedDay(open ? null : index)}
                >
                  <div className="flex items-center">
                    {watch(`contactSection.workingHours.${index}.isOpen`) ? (
                      <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 mr-2 text-red-600" />
                    )}
                    <span className="font-medium">
                      {watch(`contactSection.workingHours.${index}.title`) || day.day || `Day ${index + 1}`}
                    </span>
                    <span className="ml-3 text-sm opacity-80">
                      {watch(`contactSection.workingHours.${index}.isOpen`) 
                        ? `${watch(`contactSection.workingHours.${index}.startTime`) || '00:00'} - ${watch(`contactSection.workingHours.${index}.endTime`) || '00:00'}`
                        : 'Closed'
                      }
                    </span>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDay(index);
                      }}
                      className={`mr-2 p-1 rounded-full ${
                        watch(`contactSection.workingHours.${index}.isOpen`) 
                          ? 'hover:bg-green-200 text-green-700' 
                          : 'hover:bg-red-200 text-red-700'
                      }`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                    <ChevronDownIcon
                      className={`${open ? 'transform rotate-180' : ''} w-5 h-5 ${
                        watch(`contactSection.workingHours.${index}.isOpen`) 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}
                    />
                  </div>
                </Disclosure.Button>
                
                <Disclosure.Panel className="px-4 py-3 bg-white">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Day Title
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                          placeholder="Monday"
                          {...register(`contactSection.workingHours.${index}.title`)}
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Day of Week
                        </label>
                        <select
                          className="w-full rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                          {...register(`contactSection.workingHours.${index}.day`)}
                        >
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                          <option value="Weekdays">Weekdays</option>
                          <option value="Weekend">Weekend</option>
                          <option value="Holidays">Holidays</option>
                          <option value="Custom">Custom</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          {...register(`contactSection.workingHours.${index}.isOpen`)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                          {watch(`contactSection.workingHours.${index}.isOpen`) ? 'Open' : 'Closed'}
                        </span>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Opening Time
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <ClockIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            type="time"
                            className={`w-full rounded-lg border-2 pl-10 ${
                              !watch(`contactSection.workingHours.${index}.isOpen`) 
                                ? 'bg-gray-100 text-gray-400 border-gray-200' 
                                : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                            } transition-all px-3 py-2 outline-none`}
                            disabled={!watch(`contactSection.workingHours.${index}.isOpen`)}
                            {...register(`contactSection.workingHours.${index}.startTime`)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Closing Time
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <ClockIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            type="time"
                            className={`w-full rounded-lg border-2 pl-10 ${
                              !watch(`contactSection.workingHours.${index}.isOpen`) 
                                ? 'bg-gray-100 text-gray-400 border-gray-200' 
                                : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                            } transition-all px-3 py-2 outline-none`}
                            disabled={!watch(`contactSection.workingHours.${index}.isOpen`)}
                            {...register(`contactSection.workingHours.${index}.endTime`)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
        
        {workingHoursFields.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No business hours defined. Click the button above to add your first day.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkingHoursSection;