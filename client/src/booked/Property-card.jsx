import React, { useState } from "react";
import Slider from "react-slick";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";


const PropertyCard = ({ property }) => {
  const [showModal, setShowModal] = useState(false);

  const {
    images,
    propertyType,
    country,
    city,
    price,
  } = property.property;

  const {
    checkIn,
    checkOut,
    guests,
    totalAmount,
    transactionId,
    platformFee,
    isCheckedIn,
    qrCode,
  } = property;

  const username = property?.hostId?.username || "Unknown Host";
  const hostImage = property?.hostId?.image || "";

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div
        className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg cursor-pointer"
        onClick={handleClick}
      >
        <Slider {...settings} className="rounded-xl overflow-hidden">
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

        <div className="mt-2 px-1">
          <h3 className="text-lg font-semibold truncate">{propertyType}</h3>
          <p className="text-gray-500 text-sm truncate">
            {city}, {country}
          </p>
          <div className="flex justify-between items-center mt-1 relative">
            <span className="text-lg font-bold">
              ₹{price}/<span className="text-red-200 font-thin">night</span>
            </span>
          </div>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="p-6">
          <DialogTitle className="text-center text-lg font-bold mb-2">
            Booking Summary
          </DialogTitle>
          <DialogDescription className="mb-4 text-center">
            Here are your stay details
          </DialogDescription>

          <p><strong>Property:</strong> {propertyType}</p>
          <p><strong>Host:</strong> {username}</p>
          <p><strong>Check In:</strong> {checkIn}</p>
          <p><strong>Check Out:</strong> {checkOut}</p>
          <p><strong>Guests:</strong> {guests}</p>
          <p><strong>Total Paid:</strong> ₹{totalAmount}</p>
          <p><strong>Platform Fee:</strong> ₹{platformFee}</p>
          <p><strong>Checked In:</strong> {isCheckedIn ? "Yes" : "No"}</p>
          <p><strong>Transaction ID:</strong> {transactionId}</p>
          {qrCode && (
            <div className="flex justify-center mt-3">
              <img
                src={qrCode}
                alt="QR Code"
                className="w-32 h-32 rounded-lg border"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyCard;
