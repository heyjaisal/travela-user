import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Calendar } from "@/components/ui/calendar";
import "tailwindcss/tailwind.css";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PropertyMap from "@/event/map";
import { Input } from "@/components/ui/input";
import ImageGallery from "@/components/image";

const images = [
  "https://a0.muscache.com/im/pictures/hosting/Hosting-1346147961467201760/original/2cf80dff-90c7-46d2-b5b6-5613189ebdd5.jpeg?im_w=960",
  "https://a0.muscache.com/im/pictures/hosting/Hosting-1346147961467201760/original/1720e6f6-3b97-4e60-960f-c3684f1bdb7f.jpeg?im_w=960",
  "https://a0.muscache.com/im/pictures/hosting/Hosting-1346147961467201760/original/2cf80dff-90c7-46d2-b5b6-5613189ebdd5.jpeg?im_w=960",
  "https://a0.muscache.com/im/pictures/hosting/Hosting-1346147961467201760/original/1720e6f6-3b97-4e60-960f-c3684f1bdb7f.jpeg?im_w=960",
];


const features = [
  "Entire villa",
  "2 bedrooms, 2 beds",
  "2 bathrooms",
  "Self check-in",
  "Great location",
  "Fast WiFi",
];


const PropertyDetails = () => {

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [showCalendar, setShowCalendar] = useState(null);

  return (
    <>
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Rawstone Luxury 2BR Villa</h2>
      <ImageGallery images={images} />
    </div>
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow-lg p-6 rounded-lg border order-1 md:order-2 md:sticky md:top-20 self-start">
        <h2 className="text-xl font-bold">
          ₹25,000 <span className="text-sm font-normal">/night</span>
        </h2>
        <p className="text-sm text-gray-600">Availability: Available</p>
        <div className="border p-3 rounded-lg my-4">
          <div className="flex justify-between">
            <div
              onClick={() => setShowCalendar("checkin")}
              className="cursor-pointer"
            >
              <p className="text-sm text-gray-600">CHECK-IN</p>
              <p className="font-normal">
                {checkIn ? checkIn.toDateString() : "Select Date"}
              </p>
            </div>
            <div
              onClick={() => setShowCalendar("checkout")}
              className="cursor-pointer"
            >
              <p className="text-sm text-gray-600">CHECKOUT</p>
              <p className="font-normal">
                {checkOut ? checkOut.toDateString() : "Select Date"}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <h1>Max Gust : 10</h1>
          <Input placeholder="Add Gust" />
        </div>
        <button className="w-full bg-button text-white py-2 rounded-lg font-semibold">
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
        <p className="text-gray-700">Location: Kukas, Jaipur, India</p>
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
            <p className="text-sm text-gray-500">
              3 years hosting · Verified Host
            </p>
          </div>
        </div>
        <p className="py-5">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged.{" "}
        </p>
        <h3 className="text-lg font-semibold mb-2">About this place</h3>
        <ul className="space-y-1 text-gray-700 text-sm">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <h3 className="text-xl font-bold">Where you’ll be</h3>
        <p>Street, City , State, country</p>

        <PropertyMap lat={27.1751} lng={78.0421} />
      </div>
    </div>
    </>

  );
};

export default PropertyDetails;
