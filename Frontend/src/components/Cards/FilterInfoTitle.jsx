import React from "react";
import { MdOutlineClose } from "react-icons/md";
import moment from "moment";
import PropTypes from "prop-types";

const FilterInfoTitle = ({ filterType, filterDates, onClear }) => {
  const DateRangeChip = ({ date }) => {
    const startDate = date?.from
      ? moment(date.from).format("DD MMM YYYY")
      : "N/A";
    const endDate = date?.to ? moment(date.to).format("DD MMM YYYY") : "N/A";
    return (
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md">
        <p className="text-xs font-medium">
          {startDate} - {endDate}
        </p>
        <button onClick={onClear} aria-label="Clear filter">
          <MdOutlineClose />
        </button>
      </div>
    );
  };

  return (
    filterType && (
      <div className="mb-5">
        {filterType === "search" ? (
          <h3 className="text-lg font-semibold">Search Results</h3>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Travel Stories from</h3>
            <DateRangeChip date={filterDates} />
          </div>
        )}
      </div>
    )
  );
};

FilterInfoTitle.propTypes = {
  filterType: PropTypes.string,
  filterDates: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  onClear: PropTypes.func.isRequired,
};

export default FilterInfoTitle;