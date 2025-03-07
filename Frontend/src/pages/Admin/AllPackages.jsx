import React from "react";
import { Pencil, Eye, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const packages = [
  {
    id: 1,
    name: "Beach Paradise",
    price: "$200",
    hotel: "Ocean View Resort",
    guide: "John Doe",
    description: "Enjoy the serene beaches with a luxury stay.",
    climate: "Sunny",
  },
  {
    id: 2,
    name: "Mountain Adventure",
    price: "$250",
    hotel: "Hilltop Lodge",
    guide: "Alice Smith",
    description: "Trek the mountains and enjoy breathtaking views.",
    climate: "Cold",
  },
];

const AllPackages = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <button 
          onClick={() => navigate('/admindashboard')}
          className="flex items-center text-blue-500 hover:text-blue-700 mr-4"
        >
          <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold">All Packages</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Package Name</th>
              <th className="p-3 border">Price PP</th>
              <th className="p-3 border">Hotel</th>
              <th className="p-3 border">Guide</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Climate</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border">
                <td className="p-3 border">{pkg.name}</td>
                <td className="p-3 border">{pkg.price}</td>
                <td className="p-3 border">{pkg.hotel}</td>
                <td className="p-3 border">{pkg.guide}</td>
                <td className="p-3 border">{pkg.description}</td>
                <td className="p-3 border">{pkg.climate}</td>
                <td className="p-3 border flex gap-2 justify-center">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Eye size={20} />
                  </button>
                  <button className="text-green-500 hover:text-green-700">
                    <Pencil size={20} />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPackages;