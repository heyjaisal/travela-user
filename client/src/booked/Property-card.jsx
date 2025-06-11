import React, { useState } from "react";
import Slider from "react-slick";
import axiosInstance from "@/utils/axios-instance";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const [showModal, setShowModal] = useState(false);
  const [showRefundStatus, setShowRefundStatus] = useState(false);
  const [refundMessage, setRefundMessage] = useState("");
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  const navigate = useNavigate();

  const {
    images,
    propertyType,
    country,
    city,
    price,
  } = property.property;

  const {
    _id,
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

  const handleRefund = async () => {
    setIsProcessingRefund(true);
    try {
      const response = await axiosInstance.post(
        "/checkout/refunds/request",
        { bookingId: _id }
      );

      setRefundMessage("✅ Refund processed successfully.");
    } catch (error) {
      const errMsg =
        error.response?.data?.error || error.message || "Refund failed.";
      setRefundMessage(`❌ Refund failed: ${errMsg}`);
    } finally {
      setShowRefundStatus(true);
      setIsProcessingRefund(false);
    }
  };

  return (
    <>
      <div
        className="transition-transform duration-300 hover:scale-105 relative border p-2 rounded-lg cursor-pointer"
        onClick={() => setShowModal(true)}
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
            <div className="flex flex-col items-center mt-3">
              <img
                src={qrCode}
                alt="QR Code"
                className="w-32 h-32 rounded-lg border mb-4"
              />
              <div className="flex gap-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={handleRefund}
                  disabled={isProcessingRefund}
                >
                  {isProcessingRefund ? "Processing..." : "Refund"}
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  onClick={() => navigate(`/property/${property.property._id}`)}
                >
                  Full Details
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

     
      <Dialog open={showRefundStatus} onOpenChange={setShowRefundStatus}>
        <DialogContent className="text-center py-10 px-6">
          <DialogTitle className="text-xl font-semibold mb-4">
            Refund Status
          </DialogTitle>
          <DialogDescription className="text-md">
            {refundMessage}
          </DialogDescription>
          <div className="mt-6">
            <button
              onClick={() => setShowRefundStatus(false)}
              className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyCard;
