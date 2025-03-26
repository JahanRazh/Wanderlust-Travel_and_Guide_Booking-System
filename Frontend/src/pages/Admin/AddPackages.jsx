import { useState } from "react";
import axios from "axios";

const AddPackage = () => {
  const [formData, setFormData] = useState({
    packageName: "",
    pricePerPerson: "",
    hotel: "",
    guide: "",
    climate: "",
    description: "",
  });

  const climateZones = [
    'Wet Zone',
    'Dry Zone', 
    'Intermediate Zone'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the POST request to add the new package
      await axios.post("http://localhost:3000/packages", formData);
      alert("Package added successfully!");
      // Reset form data after successful submission
      setFormData({
        packageName: "",
        pricePerPerson: "",
        hotel: "",
        guide: "",
        description: "",
        climate: "",
      });
    } catch (error) {
      console.error("Error adding package:", error);
      alert("Failed to add package.");
    }
  };

  return (
    <div className="container mx-auto p-8 bg-blue-50 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Add New Travel Package
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
        <div>
          <label htmlFor="packageName" className="block text-lg font-medium text-gray-700 mb-2">
            Package Name
          </label>
          <input
            type="text"
            id="packageName"
            name="packageName"
            className="border border-gray-300 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            value={formData.packageName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="pricePerPerson" className="block text-lg font-medium text-gray-700 mb-2">
            Price Per Person
          </label>
          <input
            type="number"
            id="pricePerPerson"
            name="pricePerPerson"
            className="border border-gray-300 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            value={formData.pricePerPerson}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="hotel" className="block text-lg font-medium text-gray-700 mb-2">
            Hotel
          </label>
          <input
            type="text"
            id="hotel"
            name="hotel"
            className="border border-gray-300 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            value={formData.hotel}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="guide" className="block text-lg font-medium text-gray-700 mb-2">
            Guide
          </label>
          <input
            type="text"
            id="guide"
            name="guide"
            className="border border-gray-300 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            value={formData.guide}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="border border-gray-300 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Climate
          </label>
         
          <select
            id="climate"
            name="climate"
            className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            value={formData.climate}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Climate Zone</option>
            {climateZones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        <button
  type="submit"
  className="block mx-auto px-8 py-3 text-lg font-semibold rounded-lg shadow-md btn-light "
>
  Add Package
</button>
      </form>
    </div>
  );
};

export default AddPackage;


// import { useState, useEffect } from "react";
// import axios from "axios";

// const AddPackage = () => {
//   const [formData, setFormData] = useState({
//     packageName: "",
//     pricePerPerson: "",
//     hotel: "",
//     guide: "",
//     climate: "",
//     description: "",
//   });

//   const [hotels, setHotels] = useState([]); // Store hotel list

//   const climateZones = ["Wet Zone", "Dry Zone", "Intermediate Zone"];

//   // Fetch hotels from backend
//   useEffect(() => {
//     const fetchHotels = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/hotels"); // Adjust your API URL
//         setHotels(response.data); // Update hotel list
//       } catch (error) {
//         console.error("Error fetching hotels:", error);
//       }
//     };
//     fetchHotels();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:3000/packages", formData);
//       alert("Package added successfully!");
//       setFormData({
//         packageName: "",
//         pricePerPerson: "",
//         hotel: "",
//         guide: "",
//         description: "",
//         climate: "",
//       });
//     } catch (error) {
//       console.error("Error adding package:", error);
//       alert("Failed to add package.");
//     }
//   };

//   return (
//     <div className="container mx-auto p-8 bg-blue-50 min-h-screen">
//       <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
//         Add New Travel Package
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
//         <div>
//           <label htmlFor="packageName" className="block text-lg font-medium text-gray-700 mb-2">
//             Package Name
//           </label>
//           <input
//             type="text"
//             id="packageName"
//             name="packageName"
//             className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//             value={formData.packageName}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="pricePerPerson" className="block text-lg font-medium text-gray-700 mb-2">
//             Price Per Person
//           </label>
//           <input
//             type="number"
//             id="pricePerPerson"
//             name="pricePerPerson"
//             className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//             value={formData.pricePerPerson}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         {/* ✅ Hotel Dropdown Instead of Text Input */}
//         <div>
//           <label htmlFor="hotel" className="block text-lg font-medium text-gray-700 mb-2">
//             Select Hotel
//           </label>
//           <select
//             id="hotel"
//             name="hotel"
//             className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//             value={formData.hotel}
//             onChange={handleInputChange}
//             required
//           >
//             <option value="">Select a hotel</option>
//             {hotels.map((hotel) => (
//               <option key={hotel._id} value={hotel._id}>
//                 {hotel.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="guide" className="block text-lg font-medium text-gray-700 mb-2">
//             Guide
//           </label>
//           <input
//             type="text"
//             id="guide"
//             name="guide"
//             className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//             value={formData.guide}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
//             Description
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//             value={formData.description}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-lg font-medium text-gray-700 mb-2">
//             Climate
//           </label>
//           <select
//             id="climate"
//             name="climate"
//             className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
//             value={formData.climate}
//             onChange={handleInputChange}
//             required
//           >
//             <option value="">Select Climate Zone</option>
//             {climateZones.map((zone) => (
//               <option key={zone} value={zone}>
//                 {zone}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="block mx-auto px-8 py-3 text-lg font-semibold rounded-lg shadow-md btn-light"
//         >
//           Add Package
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddPackage;


