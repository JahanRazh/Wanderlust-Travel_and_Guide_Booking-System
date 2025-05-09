import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPrint, FaSearch } from 'react-icons/fa';

const AllGuides = () => {
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    experience: '',
    ageRange: ''
  });

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    filterGuides();
  }, [searchTerm, filters, guides]);

  const fetchGuides = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getguide');
      setGuides(response.data);
      setFilteredGuides(response.data);
    } catch (err) {
      setError('Failed to fetch guides');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterGuides = () => {
    let filtered = [...guides];

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(guide => 
        guide.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(guide => guide.gender === filters.gender);
    }

    // Experience filter
    if (filters.experience) {
      const [min, max] = filters.experience.split('-').map(Number);
      filtered = filtered.filter(guide => 
        guide.workExperience >= min && guide.workExperience <= max
      );
    }

    // Age range filter
    if (filters.ageRange) {
      const [min, max] = filters.ageRange.split('-').map(Number);
      filtered = filtered.filter(guide => 
        guide.age >= min && guide.age <= max
      );
    }

    setFilteredGuides(filtered);
  };

  const handleEdit = (guideId) => {
    navigate(`/guideprofile/${guideId}`);
  };

  const handleDelete = async (guideId) => {
    if (window.confirm('Are you sure you want to delete this guide?')) {
      try {
        await axios.delete(`http://localhost:3000/guide/${guideId}`);
        setGuides(guides.filter(guide => guide._id !== guideId));
        setError('');
      } catch (err) {
        setError('Failed to delete guide');
        console.error(err);
      }
    }
  };

  const handlePrint = (guide) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Guide Profile - ${guide.fullname}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .profile { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .info { margin-bottom: 20px; }
            .label { font-weight: bold; }
            img { max-width: 200px; border-radius: 50%; }
          </style>
        </head>
        <body>
          <div class="profile">
            <div class="header">
              <h1>${guide.fullname}</h1>
              <p>${guide.email}</p>
            </div>
            <div class="info">
              <p><span class="label">Age:</span> ${guide.age}</p>
              <p><span class="label">Gender:</span> ${guide.gender}</p>
              <p><span class="label">Contact:</span> ${guide.contactNumber}</p>
              <p><span class="label">Address:</span> ${guide.address}</p>
              <p><span class="label">Experience:</span> ${guide.workExperience} years</p>
              <p><span class="label">About:</span> ${guide.about}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Manage Guides</h1>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.experience}
            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Experience</option>
            <option value="0-5">0-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="11-20">11-20 years</option>
            <option value="21-50">21+ years</option>
          </select>

          <select
            value={filters.ageRange}
            onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Ages</option>
            <option value="18-25">18-25 years</option>
            <option value="26-35">26-35 years</option>
            <option value="36-50">36-50 years</option>
            <option value="51-100">51+ years</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Guides Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guide
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuides.map((guide) => (
                <tr key={guide._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {guide.profilePic ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={`http://localhost:3000/uploads/${guide.profilePic}`}
                            alt={guide.fullname}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">
                              {guide.fullname.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {guide.fullname}
                        </div>
                        <div className="text-sm text-gray-500">{guide.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{guide.contactNumber}</div>
                    <div className="text-sm text-gray-500">{guide.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{guide.workExperience} years</div>
                    <div className="text-sm text-gray-500">{guide.age} years old</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(guide._id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(guide._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handlePrint(guide)}
                        className="text-green-600 hover:text-green-900"
                        title="Print"
                      >
                        <FaPrint />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No guides found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default AllGuides;
