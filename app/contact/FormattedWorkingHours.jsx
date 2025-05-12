import React, { useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

// Function to format time from 24h format to 12h format with AM/PM
const formatTime = (time) => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  
  if (isNaN(hour)) return time;
  
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
  
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Function to determine if a business is currently open
const isCurrentlyOpen = (workingHours) => {
  if (!workingHours || !Array.isArray(workingHours) || workingHours.length === 0) {
    return false;
  }
  
  const now = new Date();
  const currentDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
  const currentTimeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  // Find the current day's schedule
  const todaySchedule = workingHours.find(day => day.day === currentDayName);
  
  if (!todaySchedule || !todaySchedule.isOpen) {
    return false;
  }
  
  // Check if current time is within opening hours
  return currentTimeString >= todaySchedule.startTime && currentTimeString <= todaySchedule.endTime;
};

// Main component to display formatted working hours
const FormattedWorkingHours = ({ workingHours, showStatus = true }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!workingHours || !Array.isArray(workingHours) || workingHours.length === 0) {
    return <p className="text-gray-500 italic">No working hours available</p>;
  }
  
  // Sort days into a consistent order
  const daysOrder = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7 };
  const sortedHours = [...workingHours].sort((a, b) => {
    const orderA = daysOrder[a.day] || 99;
    const orderB = daysOrder[b.day] || 99;
    return orderA - orderB;
  });
  
  // Get today's day name to prioritize showing it
  const today = new Date();
  const currentDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
  
  // Move today and tomorrow to the beginning of the list
  const todayIndex = sortedHours.findIndex(day => day.day === currentDayName);
  const displayOrder = [...sortedHours];
  
  if (todayIndex !== -1) {
    const todayItem = displayOrder.splice(todayIndex, 1)[0];
    displayOrder.unshift(todayItem);
  }
  
  // Calculate tomorrow's day name
  const tomorrowDay = new Date();
  tomorrowDay.setDate(today.getDate() + 1);
  const tomorrowDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][tomorrowDay.getDay()];
  
  // Move tomorrow to the second position if it's different from today
  if (currentDayName !== tomorrowDayName) {
    const tomorrowIndex = displayOrder.findIndex(day => day.day === tomorrowDayName);
    if (tomorrowIndex !== -1 && tomorrowIndex !== 1) {
      const tomorrowItem = displayOrder.splice(tomorrowIndex, 1)[0];
      displayOrder.splice(1, 0, tomorrowItem);
    }
  }
  
  // Determine which hours to display
  const displayedHours = expanded ? displayOrder : displayOrder.slice(0, 2);
  const hasMoreHours = displayOrder.length > 2;
  
  const open = isCurrentlyOpen(workingHours);
  
  return (
    <div className="working-hours">
      {showStatus && (
        <div className={`mb-3 p-2 rounded-md ${open ? 'bg-green-50' : 'bg-red-50'} flex items-center`}>
          {open ? (
            <>
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Currently Open</span>
            </>
          ) : (
            <>
              <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">Currently Closed</span>
            </>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        {displayedHours.map((day, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between py-1 border-b border-gray-100 ${
              day.day === currentDayName ? 'bg-primary-50 -mx-2 px-2 rounded' : ''
            }`}
          >
            <span className={`font-medium ${day.day === currentDayName ? 'text-primary-700' : 'text-gray-700'}`}>
              {day.day === currentDayName ? `${day.title} (Today)` : day.title}
            </span>
            {day.isOpen ? (
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span>{formatTime(day.startTime)} - {formatTime(day.endTime)}</span>
              </div>
            ) : (
              <span className="text-red-500">Closed</span>
            )}
          </div>
        ))}
      </div>
      
      {hasMoreHours && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 w-full flex items-center justify-center py-1 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200 focus:outline-none group"
        >
          {expanded ? (
            <>
              <span>Show less</span>
              <ChevronUpIcon className="h-4 w-4 ml-1 group-hover:translate-y-px transition-transform duration-200" />
            </>
          ) : (
            <>
              <span>Show all hours</span>
              <ChevronDownIcon className="h-4 w-4 ml-1 group-hover:translate-y-px transition-transform duration-200" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default FormattedWorkingHours;