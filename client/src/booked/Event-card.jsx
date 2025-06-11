import React, { useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";


const EventCard = ({ event }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [showModal, setShowModal] = useState(false);

  const username = event?.hostId?.username || "Unknown Host";
  const image = event?.hostId?.image || "";

  const {
     _id,
    bookingStatus,
    isCheckedIn,
    paymentStatus,
    qrCode,
    refundStatus,
    ticketsBooked,
    totalAmount,
    transactionId,
  } = event;

  const {  images, eventVenue, ticketPrice, country, city, } = event.event;
  console.log("Event Card Data:", event.event._id);
  

  const navigate = useNavigate();

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
                alt={`Event ${index + 1}`}
                className="w-full h-72 object-cover rounded-xl"
              />
            </div>
          ))}
        </Slider>

        <div className="mt-2 px-1">
          <h3 className="text-lg font-semibold truncate">{eventVenue}</h3>
          <p className="text-gray-500 text-sm truncate">
            {city}, {country}
          </p>
          <span className="text-lg font-bold">
            ₹{ticketPrice}/<span className="text-red-200 font-thin">ticket</span>
          </span>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="p-6">
          <DialogTitle className="text-center text-lg font-bold mb-2">
            Event Summary
          </DialogTitle>
          

          <p><strong>Event:</strong> {eventVenue}</p>
          <p><strong>Host:</strong> {username}</p>
          <p><strong>Payment Status:</strong> {paymentStatus}</p>
          <p><strong>Booking Status:</strong> {bookingStatus}</p>
          <p><strong>Tickets Booked:</strong> {ticketsBooked}</p>
          <p><strong>Total Paid:</strong> ₹{totalAmount}</p>
          <p><strong>Checked In:</strong> {isCheckedIn ? "Yes" : "No"}</p>
          <p><strong>Refund Status:</strong> {refundStatus || "N/A"}</p>
          {qrCode && (
  <div className="flex flex-col items-center mt-3">
    <img
      src={qrCode}
      alt="QR Code"
      className="w-32 h-32 rounded-lg border mb-4"
    />
    <div className="flex gap-4">
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={() => {
        
          console.log("Refund requested");
        }}
      >
        Refund
      </button>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => {
          
          navigate(`/event/${event.event._id}`);
        }}
      >
        Full Details
      </button>
    </div>
  </div>
)}

        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;
