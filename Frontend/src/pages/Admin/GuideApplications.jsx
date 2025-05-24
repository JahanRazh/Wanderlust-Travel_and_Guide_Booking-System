import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const GuideApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:3000/guide/applications');
      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch applications');
      setLoading(false);
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:3000/guide/applications/${id}/approve`);
      fetchApplications(); // Refresh the list
      alert('Guide application approved successfully!');
    } catch (err) {
      setError('Failed to approve application');
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      try {
        await axios.put(`http://localhost:3000/guide/applications/${id}/reject`);
        fetchApplications(); // Refresh the list
        alert('Guide application rejected successfully!');
      } catch (err) {
        setError('Failed to reject application');
        console.error(err);
      }
    }
  };

  const handleView = (application) => {
    setSelectedApplication(application);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Guide Applications</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => (
              <tr key={application._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {application.profilePic ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={`http://localhost:3000${application.profilePic}`}
                          alt={application.fullname}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            {application.fullname.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {application.fullname}
                      </div>
                      <div className="text-sm text-gray-500">{application.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{application.contactNumber}</div>
                  <div className="text-sm text-gray-500">{application.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{application.workExperience} years</div>
                  <div className="text-sm text-gray-500">{application.age} years old</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    application.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {application.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(application)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    {!application.isApproved && (
                      <>
                        <button
                          onClick={() => handleApprove(application._id)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleReject(application._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Application Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Guide Application Details</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {selectedApplication.profilePic && (
                  <img
                    src={`http://localhost:3000${selectedApplication.profilePic}`}
                    alt={selectedApplication.fullname}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{selectedApplication.fullname}</h3>
                  <p className="text-gray-600">{selectedApplication.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p>{selectedApplication.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p>{selectedApplication.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p>{selectedApplication.contactNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Work Experience</p>
                  <p>{selectedApplication.workExperience} years</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p>{selectedApplication.address}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">About</p>
                <p>{selectedApplication.about}</p>
              </div>

              {selectedApplication.certificate && (
                <div>
                  <p className="text-sm text-gray-500">Certificate</p>
                  <a
                    href={`http://localhost:3000${selectedApplication.certificate}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Certificate
                  </a>
                </div>
              )}
            </div>

            {!selectedApplication.isApproved && (
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => handleReject(selectedApplication._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedApplication._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideApplications; 