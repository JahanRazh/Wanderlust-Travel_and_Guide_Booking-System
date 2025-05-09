import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddPackageWithWeather = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    packageName: "",
    pricePerPerson: "",
    area: "",
    hotel: "",
    guide: "",
    climate: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [guides, setGuides] = useState([]);
  const [hotels, setHotels] = useState([]);
  
  // Weather forecast states
  const [weatherDate, setWeatherDate] = useState('');
  const [weatherResult, setWeatherResult] = useState(null);
  const [weatherError, setWeatherError] = useState('');
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  const climateZones = ["Wet Zone", "Dry Zone", "Intermediate Zone"];

  useEffect(() => {
    fetchGuides();
    fetchHotels();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getguide');
      setGuides(response.data);
    } catch (error) {
      console.error("Error fetching guides:", error);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:3000/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("You can only upload up to 5 images");
      return;
    }

    setImages(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const packageFormData = new FormData();
      Object.keys(formData).forEach((key) => {
        packageFormData.append(key, formData[key]);
      });
      images.forEach((image) => {
        packageFormData.append("images", image);
      });

      await axios.post("http://localhost:3000/packages", packageFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Package added successfully!");
      navigate("/admin/packages");
    } catch (error) {
      console.error("Error adding package:", error);
      alert("Failed to add package.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Weather forecast function
  const handleWeatherForecast = async (e) => {
    e.preventDefault();
    setWeatherError('');
    setWeatherResult(null);
    setIsWeatherLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/predict', { 
        city: formData.area, 
        date: weatherDate 
      });
      setWeatherResult(res.data);
    } catch (err) {
      setWeatherError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const validateCity = (cityName) => {
    if (!cityName) {
      setWeatherError('Please enter an area in the package details first');
      return false;
    }
    if (!/^[A-Z]/.test(cityName)) {
      setWeatherError('Area name must start with a capital letter');
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back</span>
          </button>
          <h2 className="text-3xl font-bold text-gray-800">Add New Travel Package</h2>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Package Form Container */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden lg:w-2/3">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Grid Layout for Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Package Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Package Name *</label>
                    <input
                      type="text"
                      name="packageName"
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={formData.packageName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Price Per Person */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Price Per Person *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        name="pricePerPerson"
                        className="block w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        value={formData.pricePerPerson}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Area */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Area *</label>
                    <input
                      type="text"
                      name="area"
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Hotel Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Hotel *</label>
                    <select
                      name="hotel"
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={formData.hotel}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a Hotel</option>
                      {hotels.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name} - {hotel.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Guide Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Guide *</label>
                    <select
                      name="guide"
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={formData.guide}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a Guide</option>
                      {guides.map((guide) => (
                        <option key={guide._id} value={guide._id}>
                          {guide.fullname} - {guide.workExperience} years experience
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Climate Zone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Climate Zone *</label>
                    <select
                      name="climate"
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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

                  {/* Image Upload */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Package Images (Up to 5)</label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5 images)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description (Full Width) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    name="description"
                    rows={4}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Image Preview */}
                {imagePreview.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Image Previews</label>
                    <div className="flex flex-wrap gap-4">
                      {imagePreview.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                            onClick={() => removeImage(index)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Add Package"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Weather Forecast Container */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-indigo-700 mb-4">Weather Forecast</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Check the weather forecast for the selected area to help with planning your package.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (validateCity(formData.area)) {
                      handleWeatherForecast(e);
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-gray-100"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This uses the Area from your package details
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={weatherDate}
                      onChange={(e) => setWeatherDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isWeatherLoading || !formData.area}
                    className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors ${
                      isWeatherLoading || !formData.area
                        ? 'bg-indigo-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isWeatherLoading ? 'Loading...' : 'Get Forecast'}
                  </button>
                </form>

                {weatherError && (
                  <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                    <p>{weatherError}</p>
                  </div>
                )}

                {weatherResult && (
                  <div className="mt-6 p-5 bg-white rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {weatherResult.city} <span className="text-gray-500">on</span> {weatherResult.date}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">🌡️</span>
                        <div>
                          <p className="text-sm text-gray-500">Temperature</p>
                          <p className="font-medium text-indigo-600">{weatherResult.temperature}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">🌧️</span>
                        <div>
                          <p className="text-sm text-gray-500">Rainfall</p>
                          <p className="font-medium text-blue-600">{weatherResult.rainfall}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">🌤️</span>
                        <div>
                          <p className="text-sm text-gray-500">Conditions</p>
                          <p className="font-medium text-green-600">{weatherResult.conditions}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPackageWithWeather;