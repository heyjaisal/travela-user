import React, { useState, useEffect } from "react";
import BlogCard from "../components/blog-card";
import axios from "axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/blogs", {
        withCredentials: true,
      });
      setBlogs(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching blogs:", error.response?.data || error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6 gap-4 px-5 p-2">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
