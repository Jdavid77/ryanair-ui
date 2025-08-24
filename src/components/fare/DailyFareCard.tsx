import { format, isBefore, isToday } from 'date-fns';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { formatPrice } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { DailyFareRange } from '../../services/types';

interface DailyFareCardProps {
  date: Date;
  fareData?: DailyFareRange;
  isSelected?: boolean;
  isLoading?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function DailyFareCard({ 
  date, 
  fareData, 
  isSelected = false, 
  isLoading = false,
  onClick,
  disabled = false
}: DailyFareCardProps) {
  const isPast = isBefore(date, new Date().setHours(0, 0, 0, 0));
  const isCurrentDay = isToday(date);
  const hasValidFare = fareData && !fareData.unavailable && !fareData.soldOut && fareData.price;
  const isClickable = !disabled && !isPast && hasValidFare;

  const handleClick = () => {
    if (isClickable) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isClickable}
      className={cn(
        'relative w-full h-20 p-2 border rounded-lg transition-all duration-200 text-left',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        // Past dates
        isPast && 'bg-gray-50 border-gray-200 cursor-not-allowed',
        // Today highlight
        isCurrentDay && !isSelected && 'border-primary-300 bg-primary-50',
        // Selected state
        isSelected && 'bg-primary-500 border-primary-500 text-white',
        // Available fares
        !isSelected && hasValidFare && !isPast && 'hover:bg-primary-50 hover:border-primary-300 border-gray-200 bg-white cursor-pointer',
        // Unavailable fares
        !hasValidFare && !isPast && 'bg-gray-50 border-gray-200 cursor-not-allowed',
        // Loading state
        isLoading && 'bg-gray-50 border-gray-200 animate-pulse'
      )}
    >
      {/* Date */}
      <div className={cn(
        'text-sm font-medium mb-1',
        isPast && 'text-gray-400',
        isSelected && 'text-white',
        !isSelected && (isCurrentDay ? 'text-primary-700' : 'text-gray-900')
      )}>
        {format(date, 'd')}
      </div>

      {/* Day of week for first few days of month */}
      {date.getDate() <= 7 && (
        <div className={cn(
          'text-xs mb-1',
          isPast && 'text-gray-400',
          isSelected && 'text-white/80',
          !isSelected && 'text-gray-500'
        )}>
          {format(date, 'EEE')}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-300 rounded animate-pulse" />
          <div className="w-8 h-2 bg-gray-300 rounded animate-pulse" />
        </div>
      ) : hasValidFare ? (
        <>
          {/* Departure and Arrival Times - Top Right */}
          {fareData.departureDate && fareData.arrivalDate && (
            <div className={cn(
              'absolute top-1 right-1 text-[9px] leading-tight text-right',
              isSelected && 'text-white/80',
              !isSelected && 'text-gray-500'
            )}>
              <div>{format(new Date(fareData.departureDate), 'HH:mm')}</div>
              <div>{format(new Date(fareData.arrivalDate), 'HH:mm')}</div>
            </div>
          )}
          
          {/* Price */}
          <div className={cn(
            'text-xs font-semibold',
            isSelected && 'text-white',
            !isSelected && 'text-green-600'
          )}>
            {formatPrice(fareData.price)}
          </div>
          
          {/* Flight indicator */}
          <div className={cn(
            'absolute bottom-1 right-1 opacity-60',
            isSelected && 'text-white',
            !isSelected && 'text-primary-500'
          )}>
            <PaperAirplaneIcon className="w-3 h-3" />
          </div>
        </>
      ) : !isPast ? (
        // No flights available
        <div className="text-xs text-gray-400">
          No flights
        </div>
      ) : null}

      {/* Current day indicator */}
      {isCurrentDay && !isSelected && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
      )}
    </button>
  );
}