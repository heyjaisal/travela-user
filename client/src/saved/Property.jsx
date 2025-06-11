import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from "../utils/axios-instance";
import PropertyCard from '@/property/property-card';
import { ToastContainer } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ScaleLoader } from 'react-spinners';

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isLoading = useRef(false);

  const fetchProperties = async () => {
    if (isLoading.current) return;
    isLoading.current = true;

    try {
      const { data } = await axiosInstance.get('/listing/saved', {
        params: { type: 'property', page, limit: 6 },
        withCredentials: true,
      });

      if (!data?.listings || !Array.isArray(data.listings)) {
        throw new Error("Invalid API response");
      }

      setProperties((prev) => [...prev, ...data.listings]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Fetch error:", error.message);
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="mx-auto">
      <ToastContainer />

      <InfiniteScroll
        dataLength={properties.length}
        next={fetchProperties}
        hasMore={hasMore}
        loader={<div className="flex justify-center"><ScaleLoader color="#C0C2C9" /></div>}
        endMessage={<div className="text-center text-gray-500 py-4">No more saved properties</div>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6 gap-6 px-5 p-4">
          {properties.map((property) => (
            <PropertyCard key={property._id} {...property} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default PropertyList;
