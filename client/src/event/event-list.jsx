import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import EventCard from '@/event/events-card';
import { FaSearch } from 'react-icons/fa';
import { ScaleLoader } from 'react-spinners';
import axiosInstance from '@/utils/axios-instance';

function Eventlist() {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");
    const isLoading = useRef(false);

    const fetchEvents = async (reset = false) => {
        if (isLoading.current) return;
        isLoading.current = true;

        try {
            const { data } = await axiosInstance.get('/listing/all-items', {
                params: { type: 'event', page, limit: 6, search },
                withCredentials: true,
            });

            if (!data?.listings || !Array.isArray(data.listings)) {
                throw new Error("Invalid API response");
            }

            setEvents((prev) => reset ? data.listings : [...prev, ...data.listings]);
            setHasMore(data.hasMore);
            setPage((prev) => prev + 1);
        } catch (error) {
            console.error("Fetch error:", error.message);
        } finally {
            isLoading.current = false;
        }
    };

    useEffect(() => {
        fetchEvents(true);
    }, [search]);

    return (
        <div>
            <div className="flex justify-center">
            <div className="relative w-1/2">
            <input
                type="text"
                placeholder="Search events..."
                            className="w-full p-3 pl-10 border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                    setHasMore(true);
                }}
            />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            </div>
            <InfiniteScroll
                dataLength={events.length}
                next={() => fetchEvents()}
                loader={<div className="flex justify-center"><ScaleLoader color="#C0C2C9" /></div>}
                hasMore={hasMore}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6 gap-6 px-5 p-4">
                    {events.map((event) => (
                        <EventCard key={event._id} {...event} />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
}

export default Eventlist;
