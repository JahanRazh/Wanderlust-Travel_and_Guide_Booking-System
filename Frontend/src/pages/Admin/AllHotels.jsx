import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  MagnifyingGlassIcon,
  PhotoIcon,
  ArrowPathIcon,
  ChevronUpDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdminHotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingHotel, setEditingHotel] = useState(null);
  const [viewingHotel, setViewingHotel] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pno: "",
    type: "",
    location: "",
    no_of_rooms: "",
    description: "",
    photos: []
  });

  const hotelTypes = [
    'Resort',
    'Business Hotel', 
    'Luxury Hotel',
    'Budget Hotel',
    'Boutique Hotel'
  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await axios.delete(`http://localhost:3000/hotels/${id}`);
        fetchHotels();
      } catch (error) {
        console.error("Error deleting hotel:", error);
      }
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel._id);
    setFormData({
      name: hotel.name,
      email: hotel.email,
      pno: hotel.pno,
      type: hotel.type,
      location: hotel.location,
      no_of_rooms: hotel.no_of_rooms,
      description: hotel.description,
      photos: hotel.photos || []
    });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
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
      
      // Add existing photos
      if (formData.photos && formData.photos.length > 0) {
        updatedFormData.append('existingPhotos', JSON.stringify(formData.photos));
      }
      
      // Add new photos
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          updatedFormData.append('photos', file);
        });
      }
      
      await axios.put(
        `http://localhost:3000/hotels/${editingHotel}`, 
        updatedFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setEditingHotel(null);
      setSelectedFiles([]);
      fetchHotels();
    } catch (error) {
      console.error("Error updating hotel:", error);
    }
  };

  const handleDeletePhoto = (photoIndex) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(photoIndex, 1);
    setFormData({...formData, photos: updatedPhotos});
  };

  const handleView = (hotel) => {
    setViewingHotel(hotel);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedHotels = [...hotels].sort((a, b) => {
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

  const filteredHotels = sortedHotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPhotoThumbnails = (photos) => {
    if (!photos || photos.length === 0) {
      return (
        <div className="flex items-center text-gray-400">
          <PhotoIcon className="h-4 w-4 mr-1" />
          <span className="text-xs">No photos</span>
        </div>
      );
    }
    
    return (
      <div className="flex -space-x-2">
        {photos.slice(0, 3).map((photo, index) => (
          <div key={index} className="relative h-8 w-8 rounded-full ring-2 ring-white overflow-hidden">
            <img 
              src={photo.url || photo} 
              alt={`Hotel ${index + 1}`} 
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {photos.length > 3 && (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-xs font-medium ring-2 ring-white">
            +{photos.length - 3}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hotel Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              {hotels.length} {hotels.length === 1 ? 'hotel' : 'hotels'} available
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link to="/admin/hotels/add" className="w-full sm:w-auto">
              <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto">
                <PlusIcon className="h-5 w-5" />
                <span>Add Hotel</span>
              </button>
            </Link>
            <button 
              onClick={fetchHotels}
              className="flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search hotels by name or location..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Hotels Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('name')}
                    >
                      <div className="flex items-center">
                        Hotel Name
                        <ChevronUpDownIcon className="ml-1 h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('location')}
                    >
                      <div className="flex items-center">
                        Location
                        <ChevronUpDownIcon className="ml-1 h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rooms
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
                  {filteredHotels.length > 0 ? (
                    filteredHotels.map((hotel) => (
                      <tr key={hotel._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-600 font-medium">
                                {hotel.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                              <div className="text-sm text-gray-500">{hotel.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{hotel.pno}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{hotel.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${hotel.type === 'Luxury Hotel' ? 'bg-purple-100 text-purple-800' : 
                              hotel.type === 'Resort' ? 'bg-blue-100 text-blue-800' :
                              hotel.type === 'Business Hotel' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {hotel.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{hotel.no_of_rooms}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderPhotoThumbnails(hotel.photos)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleView(hotel)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(hotel)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(hotel._id)}
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
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No hotels found. Try adjusting your search or add a new hotel.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Hotel Modal */}
        {viewingHotel && (
          <div className="fixed inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-gray-900">{viewingHotel.name}</h3>
                  <button
                    onClick={() => setViewingHotel(null)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mt-6">
                  {viewingHotel.photos && viewingHotel.photos.length > 0 && (
                    <div className="mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {viewingHotel.photos.slice(0, 4).map((photo, index) => (
                          <div key={index} className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={photo.url || photo}
                              alt={`Hotel photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                        <div className="mt-2 space-y-1">
                          <p className="text-gray-900">{viewingHotel.email}</p>
                          <p className="text-gray-900">{viewingHotel.pno}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Location</h4>
                        <p className="mt-1 text-gray-900">{viewingHotel.location}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Hotel Type</h4>
                        <p className="mt-1">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${viewingHotel.type === 'Luxury Hotel' ? 'bg-purple-100 text-purple-800' : 
                              viewingHotel.type === 'Resort' ? 'bg-blue-100 text-blue-800' :
                              viewingHotel.type === 'Business Hotel' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {viewingHotel.type}
                          </span>
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Number of Rooms</h4>
                        <p className="mt-1 text-gray-900">{viewingHotel.no_of_rooms}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                    <p className="mt-2 text-gray-700 whitespace-pre-line">
                      {viewingHotel.description || 'No description available.'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end rounded-b-xl">
                <button
                  onClick={() => setViewingHotel(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Hotel Modal */}
        {editingHotel && (
          <div className="fixed inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-gray-900">Edit Hotel</h3>
                  <button
                    onClick={() => {
                      setEditingHotel(null);
                      setSelectedFiles([]);
                    }}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                        value={formData.pno}
                        onChange={(e) => setFormData({ ...formData, pno: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Type</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="">Select Hotel Type</option>
                        {hotelTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                        value={formData.no_of_rooms}
                        onChange={(e) => setFormData({ ...formData, no_of_rooms: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-green-500 focus:border-green-500"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Hotel Photos</label>
                    
                    {/* Existing Photos */}
                    {formData.photos && formData.photos.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Current Photos</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {formData.photos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={photo.url || photo}
                                  alt={`Hotel ${index + 1}`}
                                  className="w-full h-full object-cover"
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
                            <span className="font-medium text-green-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </label>
                      {selectedFiles.length > 0 && (
                        <p className="text-sm text-green-600 mt-2">
                          {selectedFiles.length} new {selectedFiles.length === 1 ? 'photo' : 'photos'} selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-xl">
                <button
                  onClick={() => {
                    setEditingHotel(null);
                    setSelectedFiles([]);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

export default AdminHotelList;