import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import EventCard from '@/booked/Event-card';
import { ScaleLoader } from 'react-spinners';
import axiosInstance from '@/utils/axios-instance';

function BookedEvent() {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const isLoading = useRef(false);

    const fetchEvents = async () => {
        if (isLoading.current) return;
        isLoading.current = true;

        try {
            const { data } = await axiosInstance.get('/listing/booked/all-item', {
                params: { type: 'event', page, limit: 6 },
                withCredentials: true,
            });

            if (!data?.listings || !Array.isArray(data.listings)) {
                throw new Error("Invalid API response");
            }

            setEvents((prev) => [...prev, ...data.listings]);
            setHasMore(data.hasMore);
            setPage((prev) => prev + 1);
        } catch (error) {
            console.error("Fetch error:", error.message);
        } finally {
            isLoading.current = false;
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);
    

    return (
        <div>
            <InfiniteScroll
                dataLength={events.length}
                next={fetchEvents}
                loader={<div className="flex justify-center"><ScaleLoader color="#C0C2C9" /></div>}
                hasMore={hasMore}
                endMessage={
                    <div className="text-center text-gray-500 py-4">
                      No more properties
                    </div>
                  }
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6 gap-6 px-5 p-4">
                    {events.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
}

export default BookedEvent;
