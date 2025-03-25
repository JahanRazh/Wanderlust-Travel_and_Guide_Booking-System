import React, { useState, useEffect } from 'react';

const DateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update the date and time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Format options for date and time
  const dateOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };

  const timeOptions = { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: true 
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Current Date</h3>
          <p className="text-lg font-semibold text-gray-800">
            {currentDateTime.toLocaleDateString(undefined, dateOptions)}
          </p>
        </div>

              <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
        
        <div className="text-right">
          <h3 className="text-sm font-medium text-gray-500">Current Time</h3>
          <p className="text-lg font-semibold text-gray-800">
            {currentDateTime.toLocaleTimeString(undefined, timeOptions)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DateTime;