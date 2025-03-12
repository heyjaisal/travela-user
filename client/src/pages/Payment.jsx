import React, { useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropertyCard from "@/components/blog-card";



const PropertyList = () => {

  

  const properties = [
    {
      id: 1,
      images: [
        "https://res.cloudinary.com/dzfdpc00p/image/upload/v1740241091/default-images/i7udi5yfehfogwn58cfd.jpg",
        "https://res.cloudinary.com/dzfdpc00p/image/upload/v1740096569/default-images/sdhujgdx2asfelu1awb5.png",
      ],
      title: "Cozy Apartment",
      price: 120,
      location: "New York, USA",
      rating: 4.8,
    },
    {
      id: 2,
      images: [
        "https://res.cloudinary.com/dzfdpc00p/image/upload/v1739836105/title-images/azrybtlmlit8sdpvp2w4.jpg",
        "https://res.cloudinary.com/dzfdpc00p/image/upload/v1740241091/default-images/i7udi5yfehfogwn58cfd.jpg",
      ],
      title: "Luxury Villa",
      price: 250,
      location: "Los Angeles, USA",
      rating: 4.9,
    },
    {
      id: 2,
      images: [
        "https://res.cloudinary.com/dzfdpc00p/image/upload/v1740096569/default-images/sdhujgdx2asfelu1awb5.png",
        "https://res.cloudinary.com/dzfdpc00p/image/upload/v1740241091/default-images/i7udi5yfehfogwn58cfd.jpg",
      ],
      title: "Luxury Villa",
      price: 250,
      location: "Los Angeles, USA",
      rating: 4.9,
    },
    {
      id: 2,
      images: [
        "https://res.cloudinary.com/dzfdpc00p/image/upload/v1740096569/default-images/sdhujgdx2asfelu1awb5.png",
        "https://res.cloudinary.com/dzfdpc00p/image/upload/v1740241091/default-images/i7udi5yfehfogwn58cfd.jpg",
      ],
      title: "Luxury Villa",
      price: 250,
      location: "Los Angeles, USA",
      rating: 4.9,
    },
    {
      id: 2,
      images: [
        "https://res.cloudinary.com/dzfdpc00p/image/upload/v1739836105/title-images/azrybtlmlit8sdpvp2w4.jpg",
        "https://res.cloudinary.com/dzfdpc00p/image/upload/v1740241091/default-images/i7udi5yfehfogwn58cfd.jpg",
      ],
      title: "Luxury Villa",
      price: 250,
      location: "Los Angeles, USA",
      rating: 4.9,
    },{
      id: 2,
      images: [
        "https://res.cloudinary.com/dzfdpc00p/image/upload/v1739804258/title-images/x69e6txjdbhbks7g0lgo.jpg",
        "https://res.cloudinary.com/dzfdpc00p/image/upload/v1740241091/default-images/i7udi5yfehfogwn58cfd.jpg",
      ],
      title: "Luxury Villa",
      price: 250,
      location: "Los Angeles, USA",
      rating: 4.9,
    },
    
  ];

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(id)) {
        return prevFavorites.filter((favId) => favId !== id);
      }
      return [...prevFavorites, id];
    });
  };

  return (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6 gap-6 px-5 p-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          {...property}
          onFavoriteToggle={toggleFavorite}
          isFavorite={favorites.includes(property.id)}
        />
      ))}
    </div>
  );
};

export default PropertyList;
