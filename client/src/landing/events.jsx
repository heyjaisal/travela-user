import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "./cards/event";
import axiosInstance from "@/utils/axios-instance";
import { ScaleLoader } from "react-spinners";
import { ArrowRight } from "lucide-react";

const EventList = () => {
  const navigate = useNavigate();
  const [Events, SetEvents] = useState([]);
   const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/listing/", {
        params: { type: "event", limit: 10 },
        withCredentials: true,
      });
      SetEvents(data.listing || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      SetEvents([]); 
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ScaleLoader color="#C0C2C9" aria-label="loading" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex items-center gap-4 px-4 py-2">
        {Events.map((events) => (
          <div key={events._id} className="min-w-[300px]">
            <EventCard {...events} />
          </div>
        ))}
        <button
          onClick={() => navigate("/booking")}
          className="min-w-[50px] h-[50px] bg-gray-200 text-gray-700 font-semibold rounded-full flex items-center justify-center text-xl"
        >
            <ArrowRight/>
        </button>
      </div>
    </div>
  );
};

export default EventList;
