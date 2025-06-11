import React, { useState, useEffect, useRef } from "react";
import BlogCard from "../blog/blog-card";
import axiosInstance from "../utils/axios-instance";
import InfiniteScroll from "react-infinite-scroll-component";
import { ToastContainer } from "react-toastify";
import { ScaleLoader } from "react-spinners";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isLoading = useRef(false);

  const fetchBlogs = async () => {
    if (isLoading.current) return;
    isLoading.current = true;

    try {
      const { data } = await axiosInstance.get('/listing/saved', {
        params: { type: 'blog', page, limit: 6 },
        withCredentials: true,
      });

      if (!data?.listings || !Array.isArray(data.listings)) {
        throw new Error("Invalid API response");
      }

      setBlogs((prev) => [...prev, ...data.listings]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching blogs:", error.response?.data || error.message);
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <ToastContainer />
      <InfiniteScroll
        dataLength={blogs.length}
        next={fetchBlogs}
        hasMore={hasMore}
        loader={<div className="flex justify-center"><ScaleLoader color="#C0C2C9" /></div>}
        endMessage={<div className="text-center text-gray-500 py-4">No more blogs</div>}
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
