import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PropertyCard from '@/property/property-card';
import { ToastContainer, toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ScaleLoader } from 'react-spinners';
import { FaSearch } from 'react-icons/fa';

function Propertylist() {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const isLoading = useRef(false);

  const fetchProperties = async () => {
    if (isLoading.current) return;
    isLoading.current = true;
    setLoading(true);
    
    try {
      const { data } = await axios.get('http://localhost:5000/api/listing/all-items', {withCredentials:true},{
        params: { type: 'property', page, limit: 10, search: searchTerm },
      });

      const newData = data.data.filter(
        (newItem) => !properties.some((item) => item._id === newItem._id)
      );

      setProperties((prev) => [...prev, ...newData]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
      isLoading.current = false;
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setProperties([]); 
  };

  useEffect(() => {
    fetchProperties();
  }, [searchTerm]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
      return newFavorites;
    });
  };

  return (
    <div className="mx-auto">
      <ToastContainer />
      <div className="flex justify-center">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 pl-10 border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <InfiniteScroll
        dataLength={properties.length}
        next={fetchProperties}
        hasMore={hasMore}
        loader={<div className="flex justify-center"><ScaleLoader color="#C0C2C9" /></div>}
        endMessage={<div className="text-center text-gray-500 py-4">No more properties</div>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6 gap-6 px-5 p-4">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              {...property}
              isFavorite={favorites.has(property._id)}
              onFavoriteToggle={toggleFavorite}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default Propertylist;