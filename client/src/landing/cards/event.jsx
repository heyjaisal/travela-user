import React, { useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const EventCard = ({ images, eventVenue, ticketPrice, country, city, _id, isSaved}) => {


  const navigate = useNavigate()
  const settings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1 };

  const handleClick = ()=>{
    navigate(`/event/${_id}`)
  }

  return (
    <div className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg cursor-pointer" onClick={handleClick}>

      <div className="overflow-hidden">  {images.length > 1 ? (
          <Slider {...settings} className="rounded-xl">
            {images.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`Property ${index + 1}`}
                  className="w-full h-72 object-cover rounded-xl"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <img
            src={images[0]}
            alt="Property"
            className="w-full h-72 object-cover rounded-xl"
          />
        )}</div>

      <div className="mt-2 px-1">
        <h3 className="text-lg font-semibold truncate">{eventVenue}</h3>
        <p className="text-gray-500 text-sm truncate">{city}, {country}</p>
        <span className="text-lg font-bold">₹{ticketPrice}/<span className="text-red-200 font-thin">ticket</span></span>
      </div>
    </div>
  );
};

export default EventCard;
