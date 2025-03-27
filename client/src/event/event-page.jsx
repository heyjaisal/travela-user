import ImageGallery from "@/components/image";
import axiosInstance from "@/utils/axios-instance";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Eventpage() {
  const { id } = useParams();
  const [event, Setevent] = useState({ images: [] });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axiosInstance.get(`/listing/details/${id}`, {
          params: { type: "event" },
          withCredentials: true,
        });
        Setevent(data.item);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">{event.title || "Event Details"}</h2>
      <ImageGallery images={event.images || []} />
    </div>
  );
}

export default Eventpage;
