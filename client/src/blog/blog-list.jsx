import React, { useState, useEffect, useRef } from "react";
import BlogCard from "./blog-card";
import axiosInstance from "../utils/axios-instance";
import InfiniteScroll from "react-infinite-scroll-component";
import { ToastContainer } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import { FaSearch } from "react-icons/fa";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const isLoading = useRef(false);

  const fetchBlogs = async (reset = false) => {
    if (isLoading.current) return;
    isLoading.current = true;
    
    try {
      const { data } = await axiosInstance.get('/listing/all-items', {
        params: { type: 'blog', page, limit: 6, search },
        withCredentials: true,
      });

      if (!data?.listings || !Array.isArray(data.listings)) {
        throw new Error("Invalid API response");
      }

      setBlogs((prev) => reset ? data.listings : [...prev, ...data.listings]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching blogs:", error.response?.data || error.message);
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    fetchBlogs(true);
  }, [search]); 

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center mb-4 mt-6">
              <div className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Search properties..."
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
        dataLength={blogs.length}
        next={() => fetchBlogs()}
        hasMore={hasMore}
        loader={<div className="flex justify-center"><ScaleLoader color="#C0C2C9" /></div>}
        endMessage={<div className="text-center text-gray-500 py-4">No more properties</div>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6 gap-4 px-5 p-2">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default BlogList;
