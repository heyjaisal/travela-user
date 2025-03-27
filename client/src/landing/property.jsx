import axiosInstance from "@/utils/axios-instance";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./cards/property";
import { ArrowRight } from "lucide-react";
import { ScaleLoader } from "react-spinners";

const PropertyList = () => {
  const navigate = useNavigate();
  const [properties,SetProperties] = useState([]);
   const [loading, setLoading] = useState(false);

  const fetchProperties  = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/listing/", {
        params: { type: "property", limit: 10 },
        withCredentials: true,
      });
  
      SetProperties(data.listing || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      SetProperties([]); 
    }finally{
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchProperties()
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
        {properties.map((property) => (
          <div key={property._id} className="min-w-[300px]">
                      <PropertyCard {...property} />
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



export default PropertyList;