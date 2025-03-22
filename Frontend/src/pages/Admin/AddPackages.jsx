import { useState } from "react";
import axios from "axios";

const AddPackage = () => {
  const [formData, setFormData] = useState({
    packageName: "",
    pricePerPerson: "",
    hotel: "",
    guide: "",
    climate: "",
  });

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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Package</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="packageName" className="block text-sm font-medium text-gray-700">
            Package Name
          </label>
          <input
            type="text"
            id="packageName"
            name="packageName"
            className="border p-2 w-full"
            value={formData.packageName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="pricePerPerson" className="block text-sm font-medium text-gray-700">
            Price Per Person
          </label>
          <input
            type="number"
            id="pricePerPerson"
            name="pricePerPerson"
            className="border p-2 w-full"
            value={formData.pricePerPerson}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="hotel" className="block text-sm font-medium text-gray-700">
            Hotel
          </label>
          <input
            type="text"
            id="hotel"
            name="hotel"
            className="border p-2 w-full"
            value={formData.hotel}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="guide" className="block text-sm font-medium text-gray-700">
            Guide
          </label>
          <input
            type="text"
            id="guide"
            name="guide"
            className="border p-2 w-full"
            value={formData.guide}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="guide" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            className="border p-2 w-full"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="climate" className="block text-sm font-medium text-gray-700">
            Climate
          </label>
          <input
            type="text"
            id="climate"
            name="climate"
            className="border p-2 w-full"
            value={formData.climate}
            onChange={handleInputChange}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Add Package
        </button>
      </form>
    </div>
  );
};

export default AddPackage;
