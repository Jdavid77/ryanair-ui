import { useState, useMemo } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  XMarkIcon, 
  CalendarDaysIcon 
} from '@heroicons/react/24/outline';
import { DailyFareCard } from './DailyFareCard';
import { useDailyFareRange } from '../../hooks/useFares';
import type { Airport } from '../../services/types';

interface DailyFaresCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  origin: Airport | null;
  destination: Airport | null;
  selectedDate?: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
  currency?: string;
  onDateSelect: (date: Date) => void;
}

export function DailyFaresCalendarModal({
  isOpen,
  onClose,
  origin,
  destination,
  selectedDate,
  startDate,
  endDate,
  currency = 'EUR',
  onDateSelect
}: DailyFaresCalendarModalProps) {

  // Generate date range - use provided dates for Daily Fares, or default range for single searches
  let apiStartDate: Date;
  let apiEndDate: Date;

  if (startDate && endDate) {
    // Daily Fares mode: use the actual provided dates (not full months)
    apiStartDate = startDate;
    apiEndDate = endDate;
  } else {
    // Single search mode: show 2 months from selected date
    const baseDate = selectedDate || new Date();
    apiStartDate = startOfMonth(baseDate);
    apiEndDate = endOfMonth(addMonths(baseDate, 1));
  }

  const { 
    data: fareData, 
    isLoading: fareLoading, 
    error: fareError 
  } = useDailyFareRange({
    from: origin?.code || '',
    to: destination?.code || '',
    startDate: format(apiStartDate, 'yyyy-MM-dd'),
    endDate: format(apiEndDate, 'yyyy-MM-dd'),
    currency,
  }, {
    enabled: isOpen && !!(origin && destination)
  });

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    onClose();
  };


  // Get fare data for specific date
  const getFareForDate = (date: Date) => {
    if (!fareData) return undefined;
    const dateStr = format(date, 'yyyy-MM-dd');
    return fareData.find(fare => fare.day === dateStr);
  };

  // Generate calendar months
  const generateCalendarMonth = (monthStart: Date) => {
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add empty slots for days before the month starts
    const firstDayOfWeek = getDay(monthStart);
    const emptyDays = Array(firstDayOfWeek).fill(null);
    
    return [...emptyDays, ...days];
  };

  // Generate months to display based on mode
  const months = useMemo(() => {
    if (startDate && endDate) {
      // Daily Fares mode: show all months that contain days in the range
      const startMonth = startOfMonth(startDate);
      const endMonth = startOfMonth(endDate);
      const monthsToShow = [];
      let currentMonthIter = startMonth;
      
      while (currentMonthIter <= endMonth) {
        monthsToShow.push(new Date(currentMonthIter));
        currentMonthIter = addMonths(currentMonthIter, 1);
      }
      
      return monthsToShow;
    } else {
      // Single search mode: show 2 months from selected date
      const baseDate = selectedDate || new Date();
      const currentMonth = startOfMonth(baseDate);
      return [currentMonth, addMonths(currentMonth, 1)];
    }
  }, [startDate, endDate, selectedDate]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                      Choose Your Travel Dates
                    </Dialog.Title>
                    {origin && destination && (
                      <p className="text-sm text-gray-600 mt-1">
                        {origin.code} → {destination.code} • {currency}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>


                {/* Error State */}
                {fareError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      Unable to load fare data. Please try again.
                    </p>
                  </div>
                )}

                {/* No route selected */}
                {(!origin || !destination) && (
                  <div className="text-center py-8">
                    <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Please select origin and destination airports first</p>
                  </div>
                )}

                {/* Calendar Grid */}
                {origin && destination && (
                  <div className="space-y-8">
                    {months.map((month, monthIndex) => (
                      <div key={month.toISOString()} className="space-y-3">
                        {/* Month Header */}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {format(month, 'MMMM yyyy')}
                        </h3>
                        
                        {/* Days of week header */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-1">
                          {generateCalendarMonth(month).map((day, dayIndex) => {
                            if (!day) {
                              return <div key={`empty-${monthIndex}-${dayIndex}`} />;
                            }
                            
                            // For Daily Fares mode, only show days within the selected range
                            const isWithinRange = startDate && endDate ? 
                              (day >= startDate && day <= endDate) : true;
                            
                            if (!isWithinRange) {
                              return (
                                <div 
                                  key={day.toISOString()} 
                                  className="w-full h-20 p-2 border border-gray-100 bg-gray-50 rounded-lg opacity-50"
                                >
                                  <div className="text-sm font-medium text-gray-300">
                                    {format(day, 'd')}
                                  </div>
                                </div>
                              );
                            }
                            
                            const fareForDay = getFareForDate(day);
                            const isSelected = selectedDate && 
                              format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                            
                            return (
                              <DailyFareCard
                                key={day.toISOString()}
                                date={day}
                                fareData={fareForDay}
                                isSelected={!!isSelected}
                                isLoading={fareLoading}
                                onClick={() => handleDateSelect(day)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary-500 rounded" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary-50 border border-primary-300 rounded" />
                      <span>Today</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-white border border-gray-200 rounded" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded" />
                      <span>No flights</span>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}