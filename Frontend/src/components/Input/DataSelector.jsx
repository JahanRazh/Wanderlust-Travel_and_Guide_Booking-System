import React, { useState } from 'react';
import { MdOutlineDateRange, MdClose } from 'react-icons/md'; // Importing icons from react-icons library
import { DayPicker } from 'react-day-picker'; // Importing a date picker component
import moment from 'moment'; // Library for formatting dates
import 'react-day-picker/dist/style.css'; // Importing styles for the date picker

/**
 * DataSelector component to allow users to pick a date using a calendar popup.
 * @param {Object} props - Component props
 * @param {Date} props.date - Current selected date
 * @param {Function} props.setDate - Function to update the selected date
 */
const DataSelector = ({ date, setDate }) => {
  // State to track whether the date picker is visible
  const [openDatePicker, setOpenDatePicker] = useState(false);

  return (
    <div>
      {/* Button to open the date picker */}
      <button
        className="inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-100/40 hover:bg-sky-200/70 rounded px-2 py-1 cursor-pointer"
        onClick={() => setOpenDatePicker(true)}
      >
        {/* Calendar Icon */}
        <MdOutlineDateRange className="text-lg" />
        {/* Display selected date or current date if no date is selected */}
        {date ? moment(date).format("Do MMM YYYY") : moment().format("Do MMM YYYY")}
      </button>

      {/* Conditional rendering of the date picker */}
      {openDatePicker && (
        <div className="overflow-y-scroll p-5 bg-sky-50/80 rounded-lg relative pt-9">
          {/* Button to close the date picker */}
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 hover:bg-sky-100 absolute top-2 right-2"
            onClick={() => setOpenDatePicker(false)}
          >
            <MdClose className="text-xl text-sky-600" />
          </button>

          {/* DayPicker component for selecting dates */}
          <DayPicker
            captionLayout="dropdown-buttons" // Layout style for month navigation
            mode="single" // Only a single date can be selected
            selected={date} // Pass the currently selected date
            onSelect={setDate} // Update the selected date when a user chooses a new one
            pagedNavigation // Enable navigation between months in paged steps
          />
        </div>
      )}
    </div>
  );
};

export default DataSelector; // Export the component for use in other files
