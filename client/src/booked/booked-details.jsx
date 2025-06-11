import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import { Button } from "@/components/ui/button";

const BookingDetails = () => {
  const { type, id } = useParams(); 
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log(type, id);
  

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await axiosInstance.get(`/listing/bookings/${id}?type=${type}`);
        setBookingData(res.data.booking);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    if (type && id) {
      fetchBookingDetails();
    }
  }, [type, id]);

  if (loading) return <div className="text-center mt-4">Loading booking details...</div>;
  if (error) return <div className="text-center text-red-500 mt-4">{error}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>

      <div className="bg-white rounded shadow p-4 space-y-2">
        <p><strong>Booking ID:</strong> {bookingData._id}</p>
        <p><strong>Total Paid:</strong> ₹{bookingData.totalAmount}</p>
        <p><strong>Transaction ID:</strong> {bookingData.transactionId}</p>
        <p><strong>Checked In:</strong> {bookingData.isCheckedIn ? "Yes" : "No"}</p>
        <p><strong>Host:</strong> {bookingData.hostId?.username}</p>

        {type === "property" && (
          <>
            <p><strong>Property:</strong> {bookingData.property?.title}</p>
            <p><strong>Location:</strong> {bookingData.property?.city}, {bookingData.property?.country}</p>
            <p><strong>Check In:</strong> {bookingData.checkIn}</p>
            <p><strong>Check Out:</strong> {bookingData.checkOut}</p>
            <p><strong>Guests:</strong> {bookingData.guests}</p>
          </>
        )}

        {type === "event" && (
          <>
            <p><strong>Event:</strong> {bookingData.event?.title}</p>
            <p><strong>Date:</strong> {bookingData.event?.date}</p>
            <p><strong>Time:</strong> {bookingData.event?.time}</p>
            <p><strong>Tickets Booked:</strong> {bookingData.ticketsBooked}</p>
            <p><strong>Booking Status:</strong> {bookingData.bookingStatus}</p>
           <div className="flex justify-center mt-4">
  <Button >Refund</Button>
</div>

          </>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
