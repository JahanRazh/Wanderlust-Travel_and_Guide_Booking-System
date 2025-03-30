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
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (files.length > 5) {
      alert("You can only upload up to 5 images");
      return;
    }

    setImages(files);
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreview(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create FormData object to send both text fields and files
      const packageFormData = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        packageFormData.append(key, formData[key]);
      });
      
      // Add images
      images.forEach(image => {
        packageFormData.append('images', image);
      });
      
      // Send the POST request to add the new package
      await axios.post("http://localhost:3000/packages", packageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
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
      setImages([]);
      setImagePreview([]);
    } catch (error) {
      console.error("Error adding package:", error);
      alert("Failed to add package.");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove image preview and from selected images
  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
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

        {/* Image Upload Section */}
        <div>
          <label htmlFor="images" className="block text-lg font-medium text-gray-700 mb-2">
            Package Images (Up to 5)
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            className="border border-gray-300 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
            onChange={handleImageChange}
          />
          <p className="text-sm text-gray-500 mt-1">
            You can upload up to 5 images. Supported formats: JPG, PNG, JPEG
          </p>
        </div>

        {/* Image Preview Section */}
        {imagePreview.length > 0 && (
          <div className="mt-4">
            <p className="text-md font-medium text-gray-700 mb-2">Preview:</p>
            <div className="flex flex-wrap gap-2">
              {imagePreview.map((url, index) => (
                <div key={index} className="relative">
                  <img 
                    src={url} 
                    alt={`Preview ${index}`} 
                    className="w-24 h-24 object-cover rounded border border-gray-300"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-md"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`block mx-auto px-8 py-3 text-lg font-semibold rounded-lg shadow-md btn-light ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Package'}
        </button>
      </form>
    </div>
  );
};

export default AddPackage;