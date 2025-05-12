import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  MagnifyingGlassIcon,
  PhotoIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChevronUpDownIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const BACKEND_URL = "http://localhost:3000";

const AdminPackageList = () => {
  const [packages, setPackages] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [guides, setGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPackage, setEditingPackage] = useState(null);
  const [viewingPackage, setViewingPackage] = useState(null);
  const [formData, setFormData] = useState({
    packageName: "",
    pricePerPerson: "",
    area: "",
    hotel: "",
    guide: "",
    climate: "",
    description: "",
    photos: []
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const climateZones = ['Wet Zone', 'Dry Zone', 'Intermediate Zone'];

  useEffect(() => {
    fetchPackages();
    fetchHotels();
    fetchGuides();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/packages");
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
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

  const fetchGuides = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getguide');
      setGuides(response.data);
    } catch (error) {
      console.error("Error fetching guides:", error);
    }
  };

  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h._id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  };

  const getGuideName = (guideId) => {
    const guide = guides.find(g => g._id === guideId);
    return guide ? guide.fullname : 'Unknown Guide';
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await axios.delete(`http://localhost:3000/packages/${id}`);
        fetchPackages();
      } catch (error) {
        console.error("Error deleting package:", error);
      }
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg._id);
    setFormData({
      packageName: pkg.packageName,
      pricePerPerson: pkg.pricePerPerson,
      area: pkg.area,
      hotel: pkg.hotel,
      guide: pkg.guide,
      climate: pkg.climate,
      description: pkg.description,
      photos: pkg.images || []
    });
    setPreviewImages(pkg.images || []);
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const removeImage = (index) => {
    const updatedPreviewImages = [...previewImages];
    updatedPreviewImages.splice(index, 1);
    setPreviewImages(updatedPreviewImages);
    
    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(index, 1);
    setFormData({
      ...formData,
      photos: updatedPhotos
    });
  };

  const handleUpdate = async () => {
    try {
      const updatedFormData = new FormData();
      
      // Add text fields to FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'photos') {
          updatedFormData.append(key, formData[key]);
        }
      });
      
      // Add existing photos that should be kept
      if (formData.photos && formData.photos.length > 0) {
        updatedFormData.append('keepExistingImages', 'true');
      }
      
      // Add new photos
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          updatedFormData.append('images', file);
        });
      }
      
      const response = await axios.put(
        `http://localhost:3000/packages/${editingPackage}`, 
        updatedFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data) {
        setEditingPackage(null);
        setSelectedFiles([]);
        fetchPackages();
      }
    } catch (error) {
      console.error("Error updating package:", error);
      alert("Failed to update package. Please try again.");
    }
  };

  const handleView = (pkg) => {
    setViewingPackage(pkg);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPackages = [...packages].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredPackages = sortedPackages.filter((pkg) =>
    pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPhotoThumbnails = (images) => {
    if (!images || images.length === 0) {
      return (
        <div className="flex items-center text-gray-400">
          <PhotoIcon className="h-4 w-4 mr-1" />
          <span className="text-xs">No photos</span>
        </div>
      );
    }
    
    return (
      <div className="flex -space-x-2">
        {images.slice(0, 3).map((image, index) => (
          <div key={index} className="relative h-8 w-8 rounded-full ring-2 ring-white overflow-hidden">
            <img 
              src={`${BACKEND_URL}${image}`} 
              alt={`Package ${index + 1}`} 
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.jpg';
              }}
            />
          </div>
        ))}
        {images.length > 3 && (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-xs font-medium ring-2 ring-white">
            +{images.length - 3}
          </div>
        )}
      </div>
    );
  };

  const handleDeletePhoto = (photoIndex) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(photoIndex, 1);
    setFormData({...formData, photos: updatedPhotos});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Package Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {packages.length} {packages.length === 1 ? 'package' : 'packages'} available
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link to="/admin/packages/add" className="w-full sm:w-auto">
              <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto">
                <PlusIcon className="h-5 w-5" />
                <span>Add Package</span>
              </button>
            </Link>
            <button 
              onClick={fetchPackages}
              className="flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search packages..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Packages Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('packageName')}
                    >
                      <div className="flex items-center">
                        Package Name
                        <ChevronUpDownIcon className="ml-1 h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('pricePerPerson')}
                    >
                      <div className="flex items-center">
                        Price
                        <ChevronUpDownIcon className="ml-1 h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Area
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hotel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guide
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Climate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photos
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPackages.length > 0 ? (
                    filteredPackages.map((pkg) => (
                      <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {pkg.packageName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{pkg.packageName}</div>
                              <div className="text-sm text-gray-500">{pkg.climate}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            ${parseFloat(pkg.pricePerPerson).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">per person</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 truncate max-w-[100px]">{pkg.area}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{getHotelName(pkg.hotel)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{getGuideName(pkg.guide)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${pkg.climate === 'Wet Zone' ? 'bg-blue-100 text-blue-800' : 
                              pkg.climate === 'Dry Zone' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {pkg.climate}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {renderPhotoThumbnails(pkg.images)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleView(pkg)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(pkg)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(pkg._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                        No packages found. Try adjusting your search or add a new package.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Package Modal */}
        {viewingPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-gray-900">{viewingPackage.packageName}</h3>
                  <button
                    onClick={() => setViewingPackage(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-6">
                  {viewingPackage.images && viewingPackage.images.length > 0 && (
                    <div className="mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {viewingPackage.images.slice(0, 4).map((photo, index) => (
                          <div key={index} className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={`${BACKEND_URL}${photo}`}
                              alt={`Package photo ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder.jpg';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Price</h4>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                          ${parseFloat(viewingPackage.pricePerPerson).toFixed(2)} per person
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Area</h4>
                        <p className="mt-1 text-gray-900">{viewingPackage.area}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Hotel</h4>
                        <p className="mt-1 text-gray-900">{getHotelName(viewingPackage.hotel)}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Guide</h4>
                        <p className="mt-1 text-gray-900">{getGuideName(viewingPackage.guide)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Climate Zone</h4>
                        <p className="mt-1">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${viewingPackage.climate === 'Wet Zone' ? 'bg-blue-100 text-blue-800' : 
                              viewingPackage.climate === 'Dry Zone' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {viewingPackage.climate}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                    <p className="mt-2 text-gray-700 whitespace-pre-line">
                      {viewingPackage.description || 'No description available.'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-xl">
                <button
                  onClick={() => setViewingPackage(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Package Modal */}
        {editingPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-gray-900">Edit Package</h3>
                  <button
                    onClick={() => setEditingPackage(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.packageName}
                        onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Person ($)</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.pricePerPerson}
                        onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.hotel}
                        onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                      >
                        <option value="">Select a Hotel</option>
                        {hotels.map((hotel) => (
                          <option key={hotel._id} value={hotel._id}>
                            {hotel.name} - {hotel.location}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guide</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.guide}
                        onChange={(e) => setFormData({ ...formData, guide: e.target.value })}
                      >
                        <option value="">Select a Guide</option>
                        {guides.map((guide) => (
                          <option key={guide._id} value={guide._id}>
                            {guide.fullname} - {guide.workExperience} years experience
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Climate Zone</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.climate}
                      onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                    >
                      <option value="">Select Climate Zone</option>
                      {climateZones.map((zone) => (
                        <option key={zone} value={zone}>{zone}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Package Photos</label>
                    
                    {/* Existing Photos */}
                    {formData.photos && formData.photos.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Current Photos</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {formData.photos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={`${BACKEND_URL}${photo}`}
                                  alt={`Package ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder.jpg';
                                  }}
                                />
                              </div>
                              <button
                                onClick={() => handleDeletePhoto(index)}
                                className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-100"
                                title="Remove photo"
                              >
                                <XMarkIcon className="h-4 w-4 text-red-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Upload New Photos */}
                    <div className="border border-dashed border-gray-300 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Upload New Photos</p>
                      <label className="block">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col items-center justify-center py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <PhotoIcon className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-1">
                            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </label>
                      {selectedFiles.length > 0 && (
                        <p className="text-sm text-blue-600 mt-2">
                          {selectedFiles.length} new {selectedFiles.length === 1 ? 'photo' : 'photos'} selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-xl">
                <button
                  onClick={() => setEditingPackage(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPackageList;