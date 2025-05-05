import React from "react";
import Footer from "../../components/footer";
//import css file from style sheets directory
import styleHome from "../../styles/Home.module.css";

//import images from img directory
import coverImg from "../../assets/images/home/beach.jpg";
import paymentImg from "../../assets/images/home/ezpayment.png";
import nearbyImg from "../../assets/images/home/Nearby.png";
import covidImg from "../../assets/images/home/Safe.png";
import priceImg from "../../assets/images/home/Prices.png";
import sriLankaImg from "../../assets/images/home/climate .jpg";

const Home = () => {
  return (
    <>
      <div className={styleHome.container}>
        <img src={coverImg} alt="Cover Beach" className={styleHome.img} />
        <div className={styleHome.layer}>
          <div className={styleHome.centered}>
            <div className={styleHome.headerTxt}>TRAVEL TO EXPLORE</div>
            <div className={styleHome.sloganTxt}>
              Stop worrying about the potholes in the road and enjoy the journey{" "}
              <br />~ Babs Hoffman ~
            </div>
            <button
              onClick={() => {
                window.location.href = "/view/Travel-packeges";
              }}
              className={styleHome.exploreBtn}
            >
              Explore Now
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-10">
        {[
          {
            img: priceImg,
            title: "Get Best Prices",
            text: "Pay through our application and save thousands and get amazing rewards",
          },
          {
            img: covidImg,
            title: " Safety Frist",
            text: "We have all the curated hotels that have all the precautions for a covid safe environment",
          },
          {
            img: paymentImg,
            title: "Flexible Payment",
            text: "Enjoy the flexible payment through our app and get rewards on every payment",
          },
          {
            img: nearbyImg,
            title: "Find The Best Near You",
            text: "Find the best hotels and places to visit near you in a single click",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center"
          >
            <div className="bg-gray-200 p-4 rounded-full">
              <img src={item.img} className="w-12 h-12" alt="Feature Icon" />
            </div>
            <h5 className="mt-4 text-lg font-semibold">{item.title}</h5>
            <p className="text-gray-600 text-sm mt-2 text-center">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <section className="py-16 px-10 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Climate Zone Details */}
          <div>
            <h3 className="text-4xl font-extrabold ml-25 mb-6">
              Sri Lanka's Climate Zones
            </h3>
            <div className="space-y-6 ml-20">
              <div className="bg-blue-50 p-5 rounded-lg shadow hover:shadow-md transition">
                <h4 className="text-xl font-semibold text-blue-800 mb-2">
                  🌧️ Wet Zone
                </h4>
                <p className="text-gray-700">
                  Located in the southwest, this zone receives high rainfall
                  year-round. It features lush green vegetation and is famous
                  for tea plantations.
                </p>
              </div>

              <div className="bg-yellow-50 p-5 rounded-lg shadow hover:shadow-md transition">
                <h4 className="text-xl font-semibold text-yellow-800 mb-2">
                  ☀️ Dry Zone
                </h4>
                <p className="text-gray-700">
                  Covers the northern and eastern parts of Sri Lanka. It has
                  lower rainfall, high temperatures, and is characterized by
                  scrub forests and ancient reservoirs.
                </p>
              </div>

              <div className="bg-green-50 p-5 rounded-lg shadow hover:shadow-md transition">
                <h4 className="text-xl font-semibold text-green-800 mb-2">
                  🌿 Intermediate Zone
                </h4>
                <p className="text-gray-700">
                  Lies between the Wet and Dry zones. It gets moderate rainfall
                  and supports mixed agriculture, like vegetables and spices.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Sri Lanka Image */}
          <div className="flex justify-center">
            <img
              src={sriLankaImg}
              alt="Map of Sri Lanka"
              className="rounded-xl shadow-lg w-full max-w-md border-4 border-blue-100"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="text-center">
          <h3 className="text-3xl font-bold">Here's What Our Customers Say?</h3>
          <p className="text-gray-600 mt-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit,
            error amet numquam iure provident voluptate esse quasi.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 px-10">
          {[
            {
              img: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(1).webp",
              name: "Maria Smantha",
              role: "Travel Vlogger",
              text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
            },
            {
              img: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(2).webp",
              name: "Lisa Cudrow",
              role: "Traveller",
              text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
            },
            {
              img: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp",
              name: "John Smith",
              role: "Traveller",
              text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.",
            },
          ].map((review, index) => (
            <div
              key={index}
              className="bg-white shadow-lg p-6 rounded-lg text-center"
            >
              <img
                src={review.img}
                alt={review.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h5 className="text-lg font-semibold">{review.name}</h5>
              <h6 className="text-blue-500 text-sm">{review.role}</h6>
              <p className="text-gray-600 mt-2">{review.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="py-16 px-10 text-center">
        <p className="text-3xl font-bold">
          <span className="text-blue-500">BEST</span> DESTINATIONS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[
            "https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp",
            "https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain1.webp",
            "https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(18).webp",
            "https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain2.webp",
            "https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp",
            "https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain3.webp",
          ].map((img, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={img}
                alt={`Destination ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
