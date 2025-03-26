import { useState } from "react";
import axios from "axios";

const AddHotel = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pno: "",
    type: "",
    location: "",
    no_of_rooms: "",
    description: "",
  });

  const hotelTypes = [
    'Resort',
    'Business Hotel', 
    'Luxury Hotel',
    'Budget Hotel',
    'Boutique Hotel'
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
      // Send the POST request to add the new hotel
      await axios.post("http://localhost:3000/hotels", {
        ...formData,
        no_of_rooms: parseInt(formData.no_of_rooms) // Ensure rooms is a number
      });
      alert("Hotel added successfully!");
      // Reset form data after successful submission
      setFormData({
        name: "",
        email: "",
        pno: "",
        type: "",
        location: "",
        no_of_rooms: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding hotel:", error);
      alert("Failed to add hotel.");
    }
  };

  return (
    <div className="container mx-auto p-8 bg-blue-50 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Add New Hotel
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
            Hotel Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border border-gray-300 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="border border-gray-300 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="pno" className="block text-lg font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="number"
            id="pno"
            name="pno"
            className="border border-gray-300 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            value={formData.pno}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-lg font-medium text-gray-700 mb-2">
            Hotel Type
          </label>
          <select
            id="type"
            name="type"
            className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            value={formData.type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Hotel Type</option>
            {hotelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="border border-gray-300 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="no_of_rooms" className="block text-lg font-medium text-gray-700 mb-2">
            Number of Rooms
          </label>
          <input
            type="number"
            id="no_of_rooms"
            name="no_of_rooms"
            className="border border-gray-300 p-1 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            value={formData.no_of_rooms}
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

        <button
          type="submit"
          className="block mx-auto px-8 py-3 text-lg font-semibold rounded-lg shadow-md btn-light"
        >
          Add Hotel
        </button>
      </form>
    </div>
  );
};

export default AddHotel;