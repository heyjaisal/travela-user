import React, { useState } from "react";
import Slider from "react-slick";
import { FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ images, propertyType, price, country, city, _id,isSaved}) => {

  const navigate = useNavigate()

  const handleClick = ()=>{
    navigate(`/property/${_id}`)
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg cursor-pointer" onClick={handleClick}>
      <div className="overflow-hidden">
   {images.length > 1 ? (
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
          )}
</div>

      <div className="mt-2 px-1">
        <h3 className="text-lg font-semibold truncate">{propertyType}</h3>
        <p className="text-gray-500 text-sm truncate">{city}, {country}</p>
        <div className="flex justify-between items-center mt-1 relative">
          <span className="text-lg font-bold">
            ₹{price}/<span className="text-red-200 font-thin">night</span>
          </span>
        
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
