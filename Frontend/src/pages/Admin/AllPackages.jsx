import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";  // Import Link from react-router-dom

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
  });

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
    try {
      await axios.delete(`http://localhost:3000/packages/${id}`);
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
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
    setViewingPackage(pkg); // Set the package to view
  };

  // Search filter
  const filteredPackages = packages.filter((pkg) =>
    pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Admin - Package List</h2>

      {/* Add Package Button */}
      <Link to="/admin/packages/add">
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
          Add New Package
        </button>
      </Link>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by package name..."
        className="border p-2 mb-4 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Package Name</th>
              <th className="border px-4 py-2">Price Per Person</th>
              <th className="border px-4 py-2">Hotel</th>
              <th className="border px-4 py-2">Guide</th>
              <th className="border px-4 py-2">Climate</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackages.map((pkg) => (
              <tr key={pkg._id} className="border">
                <td className="border px-4 py-2">{pkg.packageName}</td>
                <td className="border px-4 py-2">${pkg.pricePerPerson}</td>
                <td className="border px-4 py-2">{pkg.hotel}</td>
                <td className="border px-4 py-2">{pkg.guide}</td>
                <td className="border px-4 py-2">{pkg.climate}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleEdit(pkg)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => handleDelete(pkg._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => handleView(pkg)} // View button
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View package details */}
      {viewingPackage && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-bold mb-2">Package Details</h3>
          <p><strong>Package Name:</strong> {viewingPackage.packageName}</p>
          <p><strong>Price Per Person:</strong> ${viewingPackage.pricePerPerson}</p>
          <p><strong>Hotel:</strong> {viewingPackage.hotel}</p>
          <p><strong>Guide:</strong> {viewingPackage.guide}</p>
          <p><strong>Climate:</strong> {viewingPackage.climate}</p>
          <button
            className="bg-gray-500 text-white px-3 py-1 rounded mt-2"
            onClick={() => setViewingPackage(null)} // Close the view
          >
            Close View
          </button>
        </div>
      )}

      {/* Edit Package Form */}
      {editingPackage && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-bold mb-2">Edit Package</h3>
          <input
            type="text"
            className="border p-2 w-full mb-2"
            placeholder="Package Name"
            value={formData.packageName}
            onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
          />
          <input
            type="number"
            className="border p-2 w-full mb-2"
            placeholder="Price Per Person"
            value={formData.pricePerPerson}
            onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value })}
          />
          <input
            type="text"
            className="border p-2 w-full mb-2"
            placeholder="Hotel"
            value={formData.hotel}
            onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
          />
          <input
            type="text"
            className="border p-2 w-full mb-2"
            placeholder="Guide"
            value={formData.guide}
            onChange={(e) => setFormData({ ...formData, guide: e.target.value })}
          />
          <input
            type="text"
            className="border p-2 w-full mb-2"
            placeholder="Climate"
            value={formData.climate}
            onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
          />
          <button
            className="bg-green-500 text-white px-3 py-1 rounded mt-2"
            onClick={handleUpdate}
          >
            Update Package
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPackageList;
