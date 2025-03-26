import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/AllPackages.module.css';// Define your custom CSS
import Footer from '../../components/footer';

const Hotelview = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    // Fetch travel packages from your backend or mock data
    // Here, I'm using static data for the example
    setHotels([
  //    {
  //   id: 1,
  //   type: 'Adventure',
  //   title: 'Jungle Safari Expedition',
  //   price: '$499',
  //   image: 'https://example.com/jungle-safari.jpg',
  //   description: 'Explore the wild and witness exotic wildlife up close.',
  // },
  // {
  //   id: 2,
  //   type: 'Beach',
  //   title: 'Maldives Beach Escape',
  //   price: '$799',
  //   image: 'https://example.com/maldives-beach.jpg',
  //   description: 'Relax in crystal-clear waters and enjoy luxurious resorts.',
  // },
  // {
  //   id: 3,
  //   type: 'Cultural',
  //   title: 'Historical Wonders Tour',
  //   price: '$399',
  //   image: 'https://example.com/historical-tour.jpg',
  //   description: 'Experience ancient cultures and visit historic landmarks.',
  // },
  // {
  //   id: 4,
  //   type: 'Luxury',
  //   title: '5-Star City Retreat',
  //   price: '$999',
  //   image: 'https://example.com/luxury-hotel.jpg',
  //   description: 'Indulge in premium luxury with world-class hospitality.',
  // },
  // {
  //   id: 5,
  //   type: 'Honeymoon',
  //   title: 'Romantic Island Getaway',
  //   price: '$899',
  //   image: 'https://example.com/honeymoon-island.jpg',
  //   description: 'Enjoy a romantic escape with breathtaking ocean views.',
  // },
  // {
  //   id: 6,
  //   type: 'Wildlife',
  //   title: 'Amazon Rainforest Adventure',
  //   price: '$599',
  //   image: 'https://example.com/amazon-rainforest.jpg',
  //   description: 'Experience the rich biodiversity of the Amazon jungle.',
  // }

  {
    id: 1,
    type: 'Adventure',
    title: 'Jungle Safari Expedition',
    price: '$499',
    image: 'https://cdn.pixabay.com/photo/2014/09/01/11/51/hotel-432721_1280.jpg',
    description: 'Explore the wild and witness exotic wildlife up close.',
  },
  {
    id: 2,
    type: 'Beach',
    title: 'Maldives Beach Escape',
    price: '$799',
    image: 'https://www.traveldealsfinder.com/wp-content/uploads/Ganga-Beach-Resort-Rishikesh.jpg',
    description: 'Relax in crystal-clear waters and enjoy luxurious resorts.',
  },
  {
    id: 3,
    type: 'Cultural',
    title: 'Historical Wonders Tour',
    price: '$399',
    image: 'https://www.trvme.com/img/accommodations/shimla-greens-im1-1.jpg',
    description: 'Experience ancient cultures and visit historic landmarks.',
  },
  {
    id: 4,
    type: 'Luxury',
    title: '5-Star City Retreat',
    price: '$999',
    image: 'https://alawyersvoyage.com/wp-content/uploads/2021/10/Himachal-resort-featured-image.jpg',
    description: 'Indulge in premium luxury with world-class hospitality.',
  },
  {
    id: 5,
    type: 'Honeymoon',
    title: 'Romantic Island Getaway',
    price: '$899',
    image: 'https://cdn.briefly.co.za/images/1120/1e6f0209118fe6c0.jpeg?v=1',
    description: 'Enjoy a romantic escape with breathtaking ocean views.',
  },
  {
    id: 6,
    type: 'Wildlife',
    title: 'Amazon Rainforest Adventure',
    price: '$599',
    image: 'https://th.bing.com/th/id/R.a5eeb769a1d0b74e503cfc7e43dceca4?rik=OKv204QirIJ2Mw&riu=http%3a%2f%2fwww.visithimalaya.in%2fwp-content%2fuploads%2f2019%2f02%2fanant-maya-resort-manali-2.jpg&ehk=3sfeNeaAjpcxK9itvGyR2qo0QG%2fiEeP6J%2fHYVZGwlZs%3d&risl=&pid=ImgRaw&r=0',
    description: 'Experience the rich biodiversity of the Amazon jungle.',
  }

    ]);
  }, []);

  return (
    <>
    <div className="center px-8 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">Our Hotels</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-[-20]">
        {hotels.map((htl) => (
          <div key={htl.id} className={styles.hotelcard}>
            <img
              src={htl.image}
              alt={htl.title}
              className="w-full h-55 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{htl.title}</h2>
              <p className="text-gray-600 mb-2">{htl.description}</p>
              <p className="text-lg font-bold text-green-600">{htl.price}</p>
              <Link to={`/hoteldetails/${htl.id}`} className="text-blue-500 hover:underline" >View Details</Link>
            </div>
          </div>
          
        ))}
      </div>
      </div>
      <Footer/>
      </>
  );
};


export default Hotelview;