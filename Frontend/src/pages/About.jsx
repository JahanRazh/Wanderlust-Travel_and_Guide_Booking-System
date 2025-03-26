import React from "react";
import Footer from "../components/footer";

const About = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-white tracking-wide uppercase bg-gradient-to-b from-gray-800 to-gray-900 p-4 rounded-lg shadow-xl">
          About Wanderlust Travels
        </h1>

        <p className="mt-4 text-xl text-gray-700">
          Welcome to Wanderlust Travels, where adventure meets comfort. We are
          dedicated to helping you find the perfect stay for your dream
          destinations.
        </p>
      </div>

      {/* Special Features Section */}
      <div className="mt-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Our Special Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-gradient-to-br from-blue-300 to-blue-500 p-6 rounded-lg shadow-2xl text-gray-900 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold">Boutique Stays</h3>
            <p className="mt-2 text-sm">
              Discover unique, handpicked boutique hotels that offer a blend of
              luxury and local culture.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gradient-to-br from-teal-300 to-teal-500 p-6 rounded-lg shadow-2xl text-gray-900 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold">Eco-Friendly</h3>
            <p className="mt-2 text-sm">
              We prioritize eco-friendly accommodations to ensure sustainable
              travel for future generations.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gradient-to-br from-gray-300 to-gray-500 p-6 rounded-lg shadow-2xl text-gray-900 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold">Local Experiences</h3>
            <p className="mt-2 text-sm">
              Immerse yourself in authentic local experiences curated by our
              travel experts.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gradient-to-br from-indigo-300 to-indigo-500 p-6 rounded-lg shadow-2xl text-gray-900 transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold">24/7 Support</h3>
            <p className="mt-2 text-sm">
              Our team is available around the clock to assist you with your
              travel needs.
            </p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Explore the World?
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Start your journey today and create unforgettable memories.
        </p>
        <a
          href="/home"
          className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          Book Your Adventure
        </a>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default About;
