import ImageGallery from "@/components/image";
import MapWithDirectionButton from "@/components/map";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/axios-instance";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const features = [
  "Entire villa",
  "2 bedrooms, 2 beds",
  "2 bathrooms",
  "Self check-in",
  "Great location",
  "Fast WiFi",
];

function propertypage() {
  const { id } = useParams();
  const [property, Setproperty] = useState([]);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [showCalendar, setShowCalendar] = useState(null);

  useEffect(() => {
    const fetchproperty = async () => {
      const { data } = await axiosInstance.get(`/listing/details/${id}`, {
        params: { type: "property" },
        withCredentials: true,
      });
      Setproperty(data.item);
      console.log(data);
    };

    if (id) {
      fetchproperty();
    }
  }, [id]);
  console.log(property);

  console.log(property.host?.username);

  const fullName =
    property.host?.firstName && property.host?.lastName
      ? `${property.host.firstName} ${property.host.lastName}`
      : property.host?.username;

  return (
    <>
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">
          {property.title || "Property Details"}
        </h2>
        <ImageGallery images={property.images || []} />
      </div>
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-lg border order-1 md:order-2 md:sticky md:top-20 self-start">
          <h2 className="text-xl font-bold">
            ₹{property.price}
            <span className="text-sm font-normal">/night</span>
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
            <h1>Max Gust : {property.maxStay}</h1>
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
          <h1 className="text-2xl font-bold">
            Barn in {property.state}, {property.country}
          </h1>
          <p className="text-gray-600">
            {property.maxStay} guests · {property.bedrooms} bedrooms ·{" "}
            {property.kitchen} Kitchen · {property.bathrooms} bathrooms
          </p>
          <p className="text-gray-700">
            Location: {property.city}, {property.state}, {property.country}
          </p>
          <div className="border-t pt-4 flex items-center gap-3">
            <Avatar>
              <AvatarImage src={property.host?.image} alt="Host Avatar" />
              <AvatarFallback>
                {property.host?.username
                  ? property.host.username.charAt(0).toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-semibold">
                Hosted by {fullName || "unknown host"}
              </h3>
              <p className="text-sm text-gray-500">
                3 years hosting · Verified Host
              </p>
            </div>
          </div>
          <p className="py-5">
            {property.description}
          </p>
          <h3 className="text-lg font-semibold mb-2">About this place</h3>
          <ul className="space-y-1 text-gray-700 text-sm">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <h3 className="text-xl font-bold">Where you’ll be</h3>
          <p>Street, City , State, country</p>

          <MapWithDirectionButton lat={27.1751} lng={78.0421} />
        </div>
      </div>
    </>
  );
}

export default propertypage;
