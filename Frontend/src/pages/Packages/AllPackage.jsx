import React, { useEffect, useState } from 'react';
import Footer from '../../components/footer';
import axios from 'axios';

// // Individual Package Card Component
// const PackageCard = ({ packageData }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   // Function to cycle through images
//   const nextImage = () => {
//     if (packageData.images && packageData.images.length > 0) {
//       setCurrentImageIndex((prevIndex) => 
//         prevIndex === packageData.images.length - 1 ? 0 : prevIndex + 1
//       );
//     }
//   };

//   const prevImage = () => {
//     if (packageData.images && packageData.images.length > 0) {
//       setCurrentImageIndex((prevIndex) => 
//         prevIndex === 0 ? packageData.images.length - 1 : prevIndex - 1
//       );
//     }
//   };

//   return (
//     <>
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//       {/* Image Carousel */}
//       <div className="relative h-64">
//         {packageData.images && packageData.images.length > 0 ? (
//           <>
//             <img 
//               src={packageData.images[currentImageIndex]} 
//               alt={packageData.packageName} 
//               className="w-full h-64 object-cover"
//             />
//             {packageData.images.length > 1 && (
//               <div className="absolute inset-0 flex items-center justify-between px-4">
//                 <button 
//                   onClick={prevImage}
//                   className="bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60 transition"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                 </button>
//                 <button 
//                   onClick={nextImage}
//                   className="bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60 transition"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//           </div>
//         )}
//       </div>

//       {/* Package Info */}
//       <div className="p-6">
//         <div className="flex justify-between items-start mb-4">
//           <h3 className="text-xl font-bold text-gray-900">{packageData.packageName}</h3>
//           <div className="bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 text-sm font-semibold">
//             ${packageData.pricePerPerson} / person
//           </div>
//         </div>

//         {/* Package Details */}
//         <div className="space-y-3 mb-6">
//           <div className="flex items-center text-gray-700">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//             </svg>
//             <span>{packageData.hotel}</span>
//           </div>
          
//           <div className="flex items-center text-gray-700">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//             <span>Guide: {packageData.guide}</span>
//           </div>
          
//           <div className="flex items-center text-gray-700">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
//             </svg>
//             <span>Climate: {packageData.climate}</span>
//           </div>
//         </div>

//         {/* Description (truncated) */}
//         <p className="text-gray-600 mb-6 line-clamp-3">{packageData.description}</p>
        
//         {/* Button */}
//         <button onClick={() => {window.location.href = "/packages/:packageId"}} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
//           View Details

//         </button>
//       </div>
//     </div>
    
//     </>
//   );
// };

// // Package List Component that fetches and displays all packages
// const AllPackages = () => {
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/packages');
//         setPackages(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch packages');
//         setLoading(false);
//         console.error('Error fetching packages:', err);
//       }
//     };

//     fetchPackages();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//         <strong className="font-bold">Error!</strong>
//         <span className="block sm:inline"> {error}</span>
//       </div>
//     );
//   }

//   return (
//     <>
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">Travel Packages</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {packages.map((pkg) => (
//           <PackageCard key={pkg._id} packageData={pkg} />
//         ))}
//       </div>
//     </div>
//     <Footer />
//     </>
//   );
// };

// export default AllPackages;

import { Link } from 'react-router-dom';

// Individual Package Card Component
const PackageCard = ({ packageData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to cycle through images
  const nextImage = () => {
    if (packageData.images && packageData.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === packageData.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (packageData.images && packageData.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? packageData.images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image Carousel */}
      <div className="relative h-64">
        {packageData.images && packageData.images.length > 0 ? (
          <>
            <img 
              src={packageData.images[currentImageIndex]} 
              alt={packageData.packageName} 
              className="w-full h-64 object-cover"
            />
            {packageData.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button 
                  onClick={prevImage}
                  className="bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextImage}
                  className="bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Package Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{packageData.packageName}</h3>
          <div className="bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 text-sm font-semibold">
            ${packageData.pricePerPerson} / person
          </div>
        </div>

        {/* Package Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{packageData.hotel}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Guide: {packageData.guide}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span>Climate: {packageData.climate}</span>
          </div>
        </div>
        
        {/* Button */}
        <Link 
          to={`/packages/${packageData._id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

// Package List Component that fetches and displays all packages
const AllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/packages');
        setPackages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch packages');
        setLoading(false);
        console.error('Error fetching packages:', err);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Travel Packages</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <PackageCard key={pkg._id} packageData={pkg} />
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default AllPackages;