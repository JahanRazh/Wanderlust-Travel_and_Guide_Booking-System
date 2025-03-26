import React from 'react';
import { useParams } from 'react-router-dom';

const PackageDetails = () => {
  const { packageId } = useParams();
  // Fetch package data based on packageId (e.g., using an API)
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">Package Details</h1>
      <div className="my-6">
        <h2 className="text-2xl">Package Title</h2>
        <p className="text-lg">Description of the package</p>
        <p className="font-bold">Price: $xxx</p>
        {/* Add additional package details */}
      </div>
    </div>
  );
};

export default PackageDetails;