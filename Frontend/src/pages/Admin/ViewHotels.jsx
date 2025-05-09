import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  PhotoIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ViewHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/hotels');
      setHotels(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch hotels');
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;

    try {
      setDeleteLoading(id);
      await axios.delete(`http://localhost:3000/hotels/${id}`);
      setHotels(hotels.filter(hotel => hotel._id !== id));
    } catch (err) {
      console.error('Error deleting hotel:', err);
      alert('Failed to delete hotel');
    } finally {
      setDeleteLoading(null);
    }
  };

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
              src={photo.url}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Hotels</h1>
              <div className="flex space-x-4">
                <button
                  onClick={fetchHotels}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Refresh
                </button>
                <Link
                  to="/admin/hotels/add"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Hotel
                </Link>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 border-b border-red-100">
              {error}
            </div>
          )}

          {/* Hotels Table */}
          <div className="overflow-x-auto">
            {hotels.length === 0 ? (
              <div className="text-center py-12">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hotels</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new hotel.</p>
                <div className="mt-6">
                  <Link
                    to="/admin/hotels/add"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Add Hotel
                  </Link>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hotel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rooms
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photos
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hotels.map((hotel) => (
                    <tr key={hotel._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {hotel.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {hotel.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {hotel.email}
                            </div>
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
                          <Link
                            to={`/admin/hotels/edit/${hotel._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(hotel._id)}
                            disabled={deleteLoading === hotel._id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHotels; 