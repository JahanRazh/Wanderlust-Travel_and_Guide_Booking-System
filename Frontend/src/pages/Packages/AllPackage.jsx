import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/AllPackages.module.css';// Define your custom CSS

const AllPackages = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Fetch travel packages from your backend or mock data
    // Here, I'm using static data for the example
    setPackages([
      {
        id: 1,
        title: 'Beach Paradise Package',
        price: '$299',
        image: 'https://images6.fanpop.com/image/photos/44400000/Beach-beaches-44438757-550-412.jpg',
        description: 'Enjoy the sun and the sand at the best beach resorts.'
      },
      {
        id: 2,
        title: 'Mountain Adventure Package',
        price: '$399',
        image: 'https://th.bing.com/th/id/R.58f22aca530aa83371d73b93be7d1bf9?rik=%2bIkQnOVEZNChbA&pid=ImgRaw&r=0',
        description: 'Explore the mountains and enjoy thrilling adventures.'
      },
      {
        id: 3,
        title: 'City Tour Package',
        price: '$249',
        image: 'https://th.bing.com/th/id/OIP.ZTXCC-QmdsLQxKsAhca-tAHaE2?rs=1&pid=ImgDetMain',
        description: 'Experience the best city tours with guided visits.'
      },
      {
        id: 4,
        title: 'Cultural Experience Package',
        price: '$399',
        image: 'https://th.bing.com/th/id/R.58f22aca530aa83371d73b93be7d1bf9?rik=%2bIkQnOVEZNChbA&pid=ImgRaw&r=0',
        description: 'Immerse yourself in the rich cultural heritage of a city.'
      },
      {
        id: 1,
        title: 'Beach Paradise Package',
        price: '$299',
        image: 'https://images6.fanpop.com/image/photos/44400000/Beach-beaches-44438757-550-412.jpg',
        description: 'Enjoy the sun and the sand at the best beach resorts.'
      },
      {
        id: 2,
        title: 'Mountain Adventure Package',
        price: '$399',
        image: 'https://th.bing.com/th/id/R.58f22aca530aa83371d73b93be7d1bf9?rik=%2bIkQnOVEZNChbA&pid=ImgRaw&r=0',
        description: 'Explore the mountains and enjoy thrilling adventures.'
      },
      {
        id: 3,
        title: 'City Tour Package',
        price: '$249',
        image: 'https://th.bing.com/th/id/OIP.ZTXCC-QmdsLQxKsAhca-tAHaE2?rs=1&pid=ImgDetMain',
        description: 'Experience the best city tours with guided visits.'
      },
      {
        id: 4,
        title: 'Cultural Experience Package',
        price: '$399',
        image: 'https://th.bing.com/th/id/R.58f22aca530aa83371d73b93be7d1bf9?rik=%2bIkQnOVEZNChbA&pid=ImgRaw&r=0',
        description: 'Immerse yourself in the rich cultural heritage of a city.'
      }

    ]);
  }, []);

  return (
    
    <div className="center px-8 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">Our Travel Packages</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-[-20]">
        {packages.map((pkg) => (
          <div key={pkg.id} className={styles.packageCard}>
            <img
              src={pkg.image}
              alt={pkg.title}
              className="w-full h-55 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{pkg.title}</h2>
              <p className="text-gray-600 mb-2">{pkg.description}</p>
              <p className="text-lg font-bold text-red-600">{pkg.price}</p>
              <Link to={`/packages/${pkg.id}`} className={styles.viewBtn}>View Details</Link>
            </div>
          </div>
          
        ))}
      </div>
      </div>
    
  );
};


export default AllPackages;