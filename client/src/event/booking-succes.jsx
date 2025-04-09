import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const BookingConfirmed = () => {
  const { state: booking } = useLocation();
  const navigate = useNavigate();

  if (!booking) {
    return (
      <h2 className="text-center mt-10 text-red-500">
        No booking details available
      </h2>
    );
  }

  const isEventBooking = booking?.ticketCount !== undefined;

  return (
    <div className="flex items-center justify-center h-screen p-4 bg-gray-100">
      <div className="relative bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <button
          onClick={() => navigate("/booking")}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">Booking Confirmed</h2>

        {isEventBooking ? (
          <>
            <p className="text-gray-700">
              Transaction ID: <span className="font-medium">{booking.transactionId}</span>
            </p>
            <p className="text-gray-700">
              Host: <span className="font-medium">{booking.hostName}</span>
            </p>
            <p className="text-gray-700">
              Tickets: <span className="font-medium">{booking.ticketCount}</span>
            </p>
            <p className="text-gray-700">
              Total Price: <span className="font-medium">${booking.totalPrice}</span>
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-700">
              Transaction ID: <span className="font-medium">{booking.transactionId}</span>
            </p>
            <p className="text-gray-700">
              Host: <span className="font-medium">{booking.hostName}</span>
            </p>
            <p className="text-gray-700">
              Guests: <span className="font-medium">{booking.guests}</span>
            </p>
            <p className="text-gray-700">
              Check-In: <span className="font-medium">{booking.checkIn}</span>
            </p>
            <p className="text-gray-700">
              Check-Out: <span className="font-medium">{booking.checkOut}</span>
            </p>
            <p className="text-gray-700">
              Total Price: <span className="font-medium">${booking.totalPrice}</span>
            </p>
          </>
        )}

        <div className="flex justify-center mt-4">
          <img src={booking.qrCode} alt="Booking QR Code" className="w-40 h-40 rounded-md shadow" />
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmed;
