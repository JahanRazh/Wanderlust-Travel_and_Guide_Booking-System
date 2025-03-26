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

const AdminHotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingHotel, setEditingHotel] = useState(null);
  const [viewingHotel, setViewingHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pno: "",
    type: "",
    location: "",
    no_of_rooms: "",
    description: ""
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
    try {
      const response = await axios.get('http://localhost:3000/hotels');
      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
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
      description: hotel.description
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/hotels/${editingHotel}`, formData);
      setEditingHotel(null);
      fetchHotels();
    } catch (error) {
      console.error("Error updating hotel:", error);
    }
  };

  const handleView = (hotel) => {
    setViewingHotel(hotel);
  };

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="container mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Hotel Management</h2>
          <Link to="/admin/hotels/add">
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <PlusIcon className="h-5 w-5" />
              <span>Add New Hotel</span>
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search hotels by name or location..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Hotels Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-green-100">
              <tr>
                {['Hotel Name', 'Email', 'Contact', 'Location', 'Type', 'Rooms', 'Actions'].map((header) => (
                  <th 
                    key={header} 
                    className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredHotels.map((hotel) => (
                <tr key={hotel._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">{hotel.name}</td>
                  <td className="px-4 py-4">{hotel.email}</td>
                  <td className="px-4 py-4">{hotel.pno}</td>
                  <td className="px-4 py-4">{hotel.location}</td>
                  <td className="px-4 py-4">{hotel.type}</td>
                  <td className="px-4 py-4">{hotel.no_of_rooms}</td>

                  <td className="px-4 py-4 flex space-x-2">
                    <button 
                      onClick={() => handleEdit(hotel)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(hotel._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleView(hotel)}
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

        {/* View Hotel Modal */}
        {viewingHotel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Hotel Details</h3>
              <div className="space-y-2">
                <p><strong>Hotel Name:</strong> {viewingHotel.name}</p>
                <p><strong>Email:</strong> {viewingHotel.email}</p>
                <p><strong>Phone:</strong> {viewingHotel.pno}</p>
                <p><strong>Type:</strong> {viewingHotel.type}</p>
                <p><strong>Location:</strong> {viewingHotel.location}</p>
                <p><strong>Number of Rooms:</strong> {viewingHotel.no_of_rooms}</p>
                <p><strong>Description:</strong> {viewingHotel.description}</p>
              </div>
              <button
                onClick={() => setViewingHotel(null)}
                className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Edit Hotel Modal */}
        {editingHotel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Hotel</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Hotel Name"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Phone Number"
                  maxLength={10}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.pno}
                  onChange={(e) => setFormData({ ...formData, pno: e.target.value })}
                />
                <div>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Number of Rooms"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.no_of_rooms}
                  onChange={(e) => setFormData({ ...formData, no_of_rooms: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingHotel(null)}
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

export default AdminHotelList;