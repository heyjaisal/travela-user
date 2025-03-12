import React, { useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EventCard = ({ images, eventType, ticketPrice, country, city, _id, onFavoriteToggle, isFavorite }) => {
  const settings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1 };

  return (
    <div className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg">
      <button onClick={() => onFavoriteToggle(_id)} className="absolute top-3 right-2 p-2 z-10">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="grey"
          strokeWidth="2"
          className="w-6 h-6"
          animate={{ scale: isFavorite ? 1.2 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <motion.path
            fill={isFavorite ? "red" : "white"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </motion.svg>
      </button>

      <Slider {...settings} className="rounded-xl overflow-hidden">
        {images.map((img, index) => (
          <div key={index}>
            <img src={img} alt={`Event ${index + 1}`} className="w-full h-72 object-cover rounded-xl" />
          </div>
        ))}
      </Slider>

      <div className="mt-2 px-1">
        <h3 className="text-lg font-semibold truncate">{eventType}</h3>
        <p className="text-gray-500 text-sm truncate">{city}, {country}</p>
        <span className="text-lg font-bold">₹{ticketPrice}/<span className="text-red-200 font-thin">ticket</span></span>
      </div>
    </div>
  );
};

export default EventCard;
