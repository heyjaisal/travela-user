import ImageGallery from "@/components/image";
import MapWithDirectionButton from "@/components/map";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axiosInstance from "@/utils/axios-instance";
import { NumberInput } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Eventpage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axiosInstance.get(`/listing/details/${id}`, {
          params: { type: "event" },
          withCredentials: true,
        });
        setEvent(data.item || {});
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  if (!event) return <div>Loading...</div>;

  const fullName =
    event.host?.firstName && event.host?.lastName
      ? `${event.host.firstName} ${event.host.lastName}`
      : event.host?.username || "Unknown Host";

  return (
    <>
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">
          {event.title || "Event Details"}
        </h2>
        <ImageGallery images={event.images || []} />
      </div>
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-lg border order-1 md:order-2 md:sticky md:top-20 self-start">
          <h2 className="text-xl font-bold">
            ₹{event.ticketPrice || "N/A"}
            <span className="text-sm font-normal">/Ticket</span>
          </h2>
          <p className="text-sm text-gray-600">Availability: Available</p>
          <NumberInput
            isRequired
            className="py-4"
            defaultValue={1024}
            label="Tickets"
            placeholder="Enter the amount"
          />
          <button className="w-full bg-button text-white py-2 rounded-lg font-semibold">
            Book Ticket
          </button>

          <p className="text-center text-sm text-gray-500 mt-2">
            You won't be charged yet
          </p>
        </div>
        <div className="md:col-span-2 space-y-4 order-2 md:order-1">
          <h1 className="text-2xl font-bold">
            Event in {event.state || "Unknown"}, {event.country || "Unknown"}
          </h1>
          <p className="text-gray-600">
            Event Type: {event.eventType || "N/A"}
          </p>
          <p className="text-gray-600">
            Event Venue: {event.eventVenue || "N/A"}
          </p>
          <p className="text-gray-700">
            Location: {event.city || "N/A"}, {event.state || "N/A"},{" "}
            {event.country || "N/A"}
          </p>
          <div className="border-t pt-4 flex items-center gap-3">
            <Avatar>
              <AvatarImage src={event.host?.image || ""} alt="Host Avatar" />
              <AvatarFallback>
                {fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Hosted by {fullName}</h3>
              <p className="text-sm text-gray-500">
                3 years hosting {event.host?.profileSetup && "· Verified Host"}
              </p>
            </div>
          </div>
          <p className="py-5">
            {event.description || "No description available."}
          </p>
          <h3 className="text-lg font-semibold mb-2">About this place</h3>
          <ul className="space-y-1 text-gray-700 text-sm">
            {event.features && event.features.length > 0 ? (
              event.features.map((feature) => (
                <li key={feature._id}>{feature.text}</li>
              ))
            ) : (
              <li>No features listed</li>
            )}
          </ul>
          <h3 className="text-xl font-bold">Where you’ll be</h3>
          <p>
            {event.street || ""}, {event.city || ""}, {event.state || ""},{" "}
            {event.country || ""}
          </p>
          {event.location && (
            <MapWithDirectionButton
              lat={event.location.lat}
              lng={event.location.lng}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Eventpage;
