import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const EventCard = ({ images, eventVenue, ticketPrice, country, city, _id, isSaved}) => {


  const navigate = useNavigate()
  const settings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1 };

  const handleClick = ()=>{
    navigate(`/event/${_id}`)
  }

  return (
    <div className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg cursor-pointer" onClick={handleClick}>

      <Slider {...settings} className="rounded-xl overflow-hidden">
        {images.map((img, index) => (
          <div key={index}>
            <img src={img} alt={`Event ${index + 1}`} className="w-full h-72 object-cover rounded-xl" />
          </div>
        ))}
      </Slider>

      <div className="mt-2 px-1">
        <h3 className="text-lg font-semibold truncate">{eventVenue}</h3>
        <p className="text-gray-500 text-sm truncate">{city}, {country}</p>
        <span className="text-lg font-bold">₹{ticketPrice}/<span className="text-red-200 font-thin">ticket</span></span>
      </div>
    </div>
  );
};

export default EventCard;
