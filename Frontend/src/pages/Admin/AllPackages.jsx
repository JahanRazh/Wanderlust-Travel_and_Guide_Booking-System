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
  FunnelIcon
} from '@heroicons/react/24/outline';

const AdminPackageList = () => {
  const [packages, setPackages] = useState([]);
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

  const climateZones = ['Wet Zone', 'Dry Zone', 'Intermediate Zone'];

  useEffect(() => {
    fetchPackages();
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
      photos: pkg.photos || []
    });
    setPreviewImages(pkg.photos || []);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviewImages = [...previewImages];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviewImages.push(e.target.result);
        setPreviewImages([...newPreviewImages]);
      };
      reader.readAsDataURL(file);
    });
    
    const updatedPhotos = [...formData.photos];
    files.forEach(file => {
      updatedPhotos.push({
        name: file.name,
        url: URL.createObjectURL(file)
      });
    });
    
    setFormData({
      ...formData,
      photos: updatedPhotos
    });
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
      await axios.put(`http://localhost:3000/packages/${editingPackage}`, formData);
      setEditingPackage(null);
      fetchPackages();
    } catch (error) {
      console.error("Error updating package:", error);
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${parseFloat(pkg.pricePerPerson).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">per person</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{pkg.area}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{pkg.hotel}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{pkg.guide}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${pkg.climate === 'Wet Zone' ? 'bg-blue-100 text-blue-800' : 
                              pkg.climate === 'Dry Zone' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {pkg.climate}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {pkg.photos && pkg.photos.length > 0 ? (
                            <div className="flex items-center">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {pkg.photos.length}
                              </span>
                              <div className="ml-2 flex -space-x-1 overflow-hidden">
                                {pkg.photos.slice(0, 3).map((photo, index) => (
                                  <img
                                    key={index}
                                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                    src={photo.url || '/placeholder.jpg'}
                                    alt=""
                                  />
                                ))}
                                {pkg.photos.length > 3 && (
                                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-xs text-gray-600 ring-2 ring-white">
                                    +{pkg.photos.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Photos
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
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
                  {viewingPackage.photos && viewingPackage.photos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {viewingPackage.photos.map((photo, index) => (
                        <div key={index} className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={photo.url || '/placeholder.jpg'}
                            alt={`Package photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-8 mb-6">
                      <PhotoIcon className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-500 text-sm">No photos available for this package</p>
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
                        <p className="mt-1 text-gray-900">{viewingPackage.hotel}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Guide</h4>
                        <p className="mt-1 text-gray-900">{viewingPackage.guide}</p>
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
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.hotel}
                        onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guide</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.guide}
                        onChange={(e) => setFormData({ ...formData, guide: e.target.value })}
                      />
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
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Package Photos</label>
                    
                    {previewImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                        {previewImages.map((img, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={img.url || img}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-100"
                              title="Remove photo"
                            >
                              <XCircleIcon className="h-5 w-5 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 mb-4 border-2 border-dashed border-gray-300">
                        <PhotoIcon className="h-10 w-10 text-gray-400 mb-3" />
                        <p className="text-gray-500 text-sm mb-3">Upload package photos</p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
                    >
                      <PhotoIcon className="h-5 w-5" />
                      <span>Upload Photos</span>
                    </button>
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