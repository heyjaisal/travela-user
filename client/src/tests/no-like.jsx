const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: [{ type: Object, required: true }],
    thumbnail: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, trim: true }
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      key={blog._id}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
      onClick={() => navigate(`/blog/${blog._id}`)}
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 transition bg-white dark:bg-gray-900">
        {/* Thumbnail */}
        {blog.thumbnail && (
          <img
            src={blog.thumbnail}
            alt={blog.title || "Blog Thumbnail"}
            className="w-full h-52 object-cover"
            loading="lazy"
          />
        )}

        {/* Author */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-3">
          <Avatar className="w-8 h-8">
            {blog.author?.image ? (
              <AvatarImage src={blog.author.image} alt={blog.author?.username || "Author"} />
            ) : (
              <AvatarFallback>
                {blog.author?.username?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            )}
          </Avatar>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {blog.author?.username || "Unknown Author"}
          </p>
        </div>

        {/* Blog Title */}
        <CardContent className="px-4 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 truncate text-gray-900 dark:text-white">
            {blog.title || "Untitled Blog"}
          </h3>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlogCard;

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


const Blog = require("../models/Blog");

exports.getBlogs = async (req, res) => {
  try {
    const { limit = 10, skip = 0, sortBy = "latest" } = req.query;

    const blogs = await Blog.find()
      .sort(sortBy === "mostLiked" ? { createdAt: -1 } : { createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .select("id title thumbnail createdAt author location")
      .populate("author", "username image");

    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .select("id title thumbnail createdAt content location author")
      .populate("author", "username image");

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

