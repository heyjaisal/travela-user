import ImageGallery from "@/components/image";
import MapWithDirectionButton from "@/components/map";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/axios-instance";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [showCalendar, setShowCalendar] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axiosInstance.get(`/listing/details/${id}`, {
          params: { type: "property" },
          withCredentials: true,
        });
        setProperty(data.item);

        // Fetch booked dates
        if (data.item.bookings) {
          const bookedRanges = data.item.bookings.map((booking) => {
            const start = new Date(booking.checkIn);
            const end = new Date(booking.checkOut);
            const dates = [];
            while (start <= end) {
              dates.push(new Date(start));
              start.setDate(start.getDate() + 1);
            }
            return dates;
          });
          setBookedDates(bookedRanges.flat());
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  if (!property) return <p className="text-center mt-10">Loading...</p>;

  const fullName =
    property.host?.firstName && property.host?.lastName
      ? `${property.host.firstName} ${property.host.lastName}`
      : property.host?.username;

  const getNumberOfNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

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
          {showCalendar && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowCalendar(null)}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg relative">
                <Calendar
                  mode="single"
                  selected={showCalendar === "checkin" ? checkIn : checkOut}
                  onSelect={(date) => {
                    if (showCalendar === "checkin") setCheckIn(date);
                    else setCheckOut(date);
                    setShowCalendar(null);
                  }}
                  disabled={(date) =>
                    bookedDates.some(
                      (d) => d.toDateString() === date.toDateString()
                    )
                  }
                  className="rounded-md border shadow"
                />
              </div>
            </div>
          )}

          {checkIn && checkOut && (
            <div className="my-4">
              <h3 className="text-xl font-semibold">
                Total Price: ₹{property.price * getNumberOfNights()}
              </h3>
              <p className="text-sm text-gray-600">
                Total: ₹{property.price * getNumberOfNights()} for{" "}
                {getNumberOfNights()} night{getNumberOfNights() > 1 ? "s" : ""}
              </p>
            </div>
          )}

          <div className="mb-3">
            <h1>Max Guests: {property.maxStay}</h1>
            <Input placeholder="Add Guests" />
          </div>
          <button
  onClick={() =>
    navigate("/checkout", {
      state: {
        property,
        checkIn,
        checkOut,
        totalNights: getNumberOfNights(),
        totalPrice: property.price * getNumberOfNights(),
      },
    })
  }
  className="w-full bg-button text-white py-2 rounded-lg font-semibold"
>
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
          <p className="py-5">{property.description}</p>
          <h3 className="text-lg font-semibold mb-2">About this place</h3>
          <ul className="space-y-1 text-gray-700 text-sm">
            {property.features && property.features.length > 0 ? (
              property.features.map((feature) => (
                <li key={feature._id}>{feature.text}</li>
              ))
            ) : (
              <li>No features listed</li>
            )}
          </ul>
          <h3 className="text-xl font-bold">Where you’ll be</h3>
          <p>
            {property.street}, {property.city}, {property.state},{" "}
            {property.country}
          </p>
          <MapWithDirectionButton
            lat={property.location?.lat}
            lng={property.location?.lng}
          />
        </div>
      </div>
    </>
  );
}

export default PropertyPage;
