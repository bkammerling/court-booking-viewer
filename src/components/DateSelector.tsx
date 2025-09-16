'use client';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  daysToShow?: number;
  showLabel?: boolean;
  className?: string;
}

const DateSelector = ({ 
  selectedDate, 
  onDateChange, 
  daysToShow = 8, 
  showLabel = true,
  className = ""
}: DateSelectorProps) => {
  return (
    <div className={className}>
      {showLabel && (
        <label htmlFor="date" className="mr-2 text-sm font-semibold">When do you want to play?</label>
      )}
      <div className="flex mt-1 border border-gray-300 rounded-full bg-white px-2 justify-around overflow-x-scroll">
        {Array.from({ length: daysToShow }).map((_, index) => {
          const date = new Date();
          date.setDate(date.getDate() + index);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0); // First letter of the day
          const dayNumber = date.getDate();
          const isSelected = selectedDate === date.toISOString().split('T')[0];
          const isLastDay = index === daysToShow - 1;
          const isDisabled = isLastDay && new Date().getHours() < 22; // Disable the last button if it's before 10 PM

          return (
            <button
              key={index}
              onClick={() => onDateChange(date.toISOString().split('T')[0])}
              disabled={isDisabled}
              className={`flex flex-col items-center justify-center px-2 py-1 w-[35px] ${
                isSelected ? 'bg-yellow-500 text-black' : 'dark:bg-gray-700 text-gray-700 dark:text-white'
              } ${
                isDisabled ? 'cursor-default opacity-50' : 'cursor-pointer'
              }`}
            >
              <span className="text-xs font-semibold text-gray-500">{dayName}</span>
              <span className={`${index === 0 ? 'font-bold' : ''}`}>{dayNumber}</span>
            </button>
          );
        })}
      </div>
      <input
        type="hidden"
        id="date"
        value={selectedDate}
        className="min-w-min border border-gray-300 rounded-full px-4 py-3 mt-1 block bg-white dark:bg-gray-700 text-black dark:text-white w-full appearance-none"
        onChange={(e) => onDateChange(e.target.value)}
      />
    </div>
  );
};

export default DateSelector;
