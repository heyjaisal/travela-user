import ImageGallery from "@/components/image";
import MapWithDirectionButton from "@/components/map";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NumberInput } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Eventpage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableTickets, setAvailableTickets] = useState(0);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axiosInstance.get(`/listing/details/${id}`, {
          params: { type: "event" },
          withCredentials: true,
        });
        setEvent(data.item || {});
        setAvailableTickets(data.item?.maxGuests || 0);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
      }
    };

    if (id) fetchEvent();
  }, [id]);

  const handleReserve = async () => {
    if (!userInfo) {
      setShowLoginModal(true);
      return;
    }

    if (!event || ticketCount < 1 || ticketCount > availableTickets) {
      toast.error("Invalid ticket count");
      return;
    }

    setLoading(true);

    try {
      if (!event.host || !event.host._id) {
        throw new Error("Host information is missing");
      }

      const response = await axiosInstance.post("/checkout/event", {
        eventId: id,
        title: event.title,
        location: `${event.city}, ${event.state}, ${event.country}`,
        image: event.images?.[0] || "",
        hostId: event.host?._id,
        date: event.eventDateTime,
        ticketCount,
        ticketPrice: event.ticketPrice,
        hostName: `${event.host?.firstName} ${event.host?.lastName}`,
        hostStripeAccount: event.host?.stripeAccountId,
      });

      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error("Invalid response from server");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error(error.message || "Failed to create checkout session");
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">
          {event?.title || "Event Details"}
        </h2>
        <ImageGallery images={event?.images || []} />
      </div>
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-lg border order-1 md:order-2 md:sticky md:top-20 self-start">
          <h2 className="text-xl font-bold">
            ₹{event?.ticketPrice || "N/A"}
            <span className="text-sm font-normal">/Ticket</span>
          </h2>
          <p className="text-gray-600">Available Tickets: {availableTickets}</p>
          <NumberInput
            isRequired
            className="py-4"
            value={ticketCount}
            onChange={(e) => setTicketCount(e.target.value)}
            min={1}
            max={availableTickets}
            label="Tickets"
            placeholder="Enter the amount"
          />
          <p className="text-lg font-semibold mt-2">
            Total: ₹
            {event?.ticketPrice ? event.ticketPrice * ticketCount : "N/A"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Platform fee: ₹
            {event?.ticketPrice
              ? Math.round(event.ticketPrice * ticketCount * 0.04 * 100) / 100
              : "N/A"}
          </p>
          <p className="text-lg font-semibold mt-2">
            Grand Total: ₹
            {event?.ticketPrice
              ? Math.round(event.ticketPrice * ticketCount * 1.04 * 100) / 100
              : "N/A"}
          </p>

          <button
            onClick={handleReserve}
            disabled={
              loading || ticketCount < 1 || ticketCount > availableTickets
            }
            className="w-full bg-button text-white py-2 rounded-lg font-semibold disabled:opacity-50 mt-4"
          >
            {loading ? "Processing..." : "Reserve"}
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">
            You won't be charged yet
          </p>
        </div>

        <div className="md:col-span-2 space-y-4 order-2 md:order-1">
          <h1 className="text-2xl font-bold">
            Event in {event?.state || "Unknown"}, {event?.country || "Unknown"}
          </h1>
          <p className="text-gray-600">
            Event Type: {event?.eventType || "N/A"}
          </p>
          <p className="text-gray-600">
            Event Venue: {event?.eventVenue || "N/A"}
          </p>
          <p className="text-gray-700">
            Location: {event?.city || "N/A"}, {event?.state || "N/A"},{" "}
            {event?.country || "N/A"}
          </p>
          <div className="border-t pt-4 flex items-center gap-3">
            <Link
              to={`/host/${event?.host?._id}`}
              className="flex items-center gap-3 mb-4 cursor-pointer"
            >
              <Avatar>
                <AvatarImage src={event?.host?.image || ""} alt="Host Avatar" />
                <AvatarFallback>
                  {event?.host?.firstName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  Hosted by {event?.host?.firstName || "Unknown"}{" "}
                  {event?.host?.lastName || ""}
                </h3>
                <p className="text-sm text-gray-500">
                  3 years hosting{" "}
                  {event?.host?.profileSetup && "· Verified Host"}
                </p>
              </div>
            </Link>
          </div>

          <p className="py-5">
            {event?.description || "No description available."}
          </p>
          <h3 className="text-lg font-semibold mb-2">About this place</h3>
          <ul className="space-y-1 text-gray-700 text-sm">
            {event?.features && event?.features?.length > 0 ? (
              event?.features.map((feature) => (
                <ul key={feature._id}>{feature.text}</ul>
              ))
            ) : (
              <li>No features listed</li>
            )}
          </ul>
          <h3 className="text-xl font-bold">Where you'll be</h3>
          {/* <p>
            {event.street}, {event.city}, {event.state}, {event.country}
          </p> */}
          {/* <MapWithDirectionButton
            lat={event.location?.lat}
            lng={event.location?.lng}
          /> */}
        </div>
      </div>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="p-6">
          <h1 className="text-center">Create a new account to book tickets</h1>
          <Button variant="outline" className="w-full mt-5" onClick={() => {}}>
            <img
              src="https://img.icons8.com/color/24/000000/google-logo.png"
              alt="Google Logo"
              className="mr-2"
            />
            Login with Google
          </Button>
          <Button variant="outline" className="w-full mt-3" onClick={() => {}}>
            <img
              src="https://img.icons8.com/color/24/000000/email.png"
              alt="Email Logo"
              className="mr-2"
            />
            Signup with Email
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Eventpage;
