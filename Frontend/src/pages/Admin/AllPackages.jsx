import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

const AdminPackageList = () => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPackage, setEditingPackage] = useState(null);
  const [viewingPackage, setViewingPackage] = useState(null);
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

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/packages");
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
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
      hotel: pkg.hotel,
      guide: pkg.guide,
      climate: pkg.climate,
      description: pkg.description,
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

  const filteredPackages = packages.filter((pkg) =>
    pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="container mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Package Management</h2>
          <Link to="/admin/packages/add">
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="h-5 w-5" />
              <span>Add New Package</span>
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search packages..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Packages Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-100">
              <tr>
                {['Package Name', 'Price', 'Hotel', 'Guide', 'Climate', 'Actions'].map((header) => (
                  <th 
                    key={header} 
                    className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredPackages.map((pkg) => (
                <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">{pkg.packageName}</td>
                  <td className="px-4 py-4">${pkg.pricePerPerson}</td>
                  <td className="px-4 py-4">{pkg.hotel}</td>
                  <td className="px-4 py-4">{pkg.guide}</td>
                  <td className="px-4 py-4">{pkg.climate}</td>

                  <td className="px-4 py-4 flex space-x-2">
                    <button 
                      onClick={() => handleEdit(pkg)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(pkg._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleView(pkg)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="View"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Package Modal */}
        {viewingPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Package Details</h3>
              <div className="space-y-2">
                <p><strong>Package Name:</strong> {viewingPackage.packageName}</p>
                <p><strong>Price:</strong> ${viewingPackage.pricePerPerson}</p>
                <p><strong>Hotel:</strong> {viewingPackage.hotel}</p>
                <p><strong>Guide:</strong> {viewingPackage.guide}</p>
                <p><strong>Climate:</strong> {viewingPackage.climate}</p>
                <p><strong>Description:</strong> {viewingPackage.description}</p>
              </div>
              <button
                onClick={() => setViewingPackage(null)}
                className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Edit Package Modal */}
        {editingPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Package</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Package Name"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.packageName}
                  onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price Per Person"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.pricePerPerson}
                  onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Hotel"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.hotel}
                  onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Guide"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.guide}
                  onChange={(e) => setFormData({ ...formData, guide: e.target.value })}
                />
                 <div>
                  
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={formData.climate}
                    onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
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
                <input
                  type="text"
                  placeholder="Description"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingPackage(null)}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPackageList;