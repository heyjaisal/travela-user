import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Calendar } from "@/components/ui/calendar";
import "tailwindcss/tailwind.css";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const images = [
  "https://a0.muscache.com/im/pictures/hosting/Hosting-1346147961467201760/original/2cf80dff-90c7-46d2-b5b6-5613189ebdd5.jpeg?im_w=960",
  "https://a0.muscache.com/im/pictures/hosting/Hosting-1346147961467201760/original/1720e6f6-3b97-4e60-960f-c3684f1bdb7f.jpeg?im_w=960",
  "https://a0.muscache.com/im/pictures/hosting/Hosting-1346147961467201760/original/2cf80dff-90c7-46d2-b5b6-5613189ebdd5.jpeg?im_w=960",
  "https://a0.muscache.com/im/pictures/hosting/Hosting-1346147961467201760/original/1720e6f6-3b97-4e60-960f-c3684f1bdb7f.jpeg?im_w=960",
];

const PropertyGallery = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Rawstone Luxury 2BR Villa</h2>
      {isMobile ? (
        <Slider
          dots
          infinite
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          adaptiveHeight
        >
          {images.map((img, idx) => (
            <div key={idx}>
              <img
                src={img}
                alt={`Slide ${idx + 1}`}
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="flex gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedImage(img)}
              className={`h-64 transition-all duration-300 ease-in-out flex-1 cursor-pointer ${
                hoveredIndex === idx ? "flex-[4]" : ""
              }`}
            >
              <img
                src={img}
                alt={`Image ${idx + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          ))}
        </div>
      )}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-5 right-5 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            &times;
          </button>
          <img
            src={selectedImage}
            alt="Selected"
            className="max-w-3xl max-h-[80vh] rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

const PropertyDetails = () => {

   const [checkIn, setCheckIn] = React.useState(null);
    const [checkOut, setCheckOut] = React.useState(null);
    const [showCalendar, setShowCalendar] = React.useState(null);

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow-lg p-6 rounded-lg border order-1 md:order-2 md:sticky md:top-20 self-start">
        <h2 className="text-xl font-bold">
          ₹25,000 <span className="text-sm font-normal">/night</span>
        </h2>
        <div className="border p-3 rounded-lg my-4">
          <div className="flex justify-between">
          <div onClick={() => setShowCalendar('checkin')} className="cursor-pointer">
              <p className="text-sm text-gray-600">CHECK-IN</p>
              <p className="font-normal">{checkIn ? checkIn.toDateString() : "Select Date"}</p>
            </div>
            <div onClick={() => setShowCalendar('checkout')} className="cursor-pointer">
              <p className="text-sm text-gray-600">CHECKOUT</p>
              <p className="font-normal">{checkOut ? checkOut.toDateString() : "Select Date"}</p>
            </div>
          </div>
          {showCalendar && (
                      <div className="absolute top-full left-0 bg-white shadow-md p-3 rounded-md z-10">
                        <Calendar
                          mode="single"
                          selected={showCalendar === 'checkin' ? checkIn : checkOut}
                          onSelect={(date) => {
                            showCalendar === 'checkin' ? setCheckIn(date) : setCheckOut(date);
                            setShowCalendar(null);
                          }}
                          className="rounded-md border shadow"
                        />
                      </div>
                    )}
          <div className="mt-3">
            <p className="text-sm text-gray-600">GUESTS</p>
            <select className="w-full p-2 border rounded">
              <option>1 guest</option>
              <option>2 guests</option>
              <option>3 guests</option>
            </select>
          </div>
        </div>
        <button className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold">
          Reserve
        </button>
        <p className="text-center text-sm text-gray-500 mt-2">
          You won't be charged yet
        </p>
      </div>
      <div className="md:col-span-2 space-y-4 order-2 md:order-1">
        <h1 className="text-2xl font-bold">Barn in Jaipur, India</h1>
        <p className="text-gray-600">
          6 guests · 2 bedrooms · 2 beds · 2 bathrooms
        </p>
        <div className="border-t pt-4 flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src="https://via.placeholder.com/50"
              alt="Host Avatar"
            />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Hosted by Sangeeta</h3>
            <p className="text-sm text-gray-500">3 years hosting</p>
          </div>
        </div>
        <p className="text-gray-700">
          Our Two-Bedroom Villa offers modern elegance and comfort in the serene
          surroundings of Kukas, Jaipur...
        </p>
      </div>
    </div>
  );
};

const PropertyPage = () => {
  return (
    <div>
      <PropertyGallery />
      <PropertyDetails />
    </div>
  );
};

export default PropertyPage;