const Blog = require("../models/Blog");

exports.getBlogs = async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    const userId = req.userId;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .select("id title thumbnail createdAt author location")
      .populate("author", "username image");

    const updatedBlogs = blogs.map(blog => ({
      ...blog._doc,
      isLiked: userId ? blog.likes.includes(userId) : false,
      likeCount: blog.likes.length
    }));
    console.log(blogs);
    

    res.json(updatedBlogs);
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



exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    
    const userId = req.userId; 

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const isLiked = blog.likes.includes(userId);
    if (isLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({ isLiked: !isLiked, likeCount: blog.likes.length });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: [{ type: Object, required: true }],
    thumbnail: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, trim: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Store user IDs who liked
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Heart } from "lucide-react";
import axios from "axios";

const BlogCard = ({ blog, user }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(blog.isLiked);
  const [likeCount, setLikeCount] = useState(blog.likeCount);

  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking like button

    try {
      const response = await axios.post(
        `http://localhost:5000/api/blogs/${blog._id}/like`,
        {},
        { withCredentials: true }
      );
      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error("Error liking blog:", error.response?.data || error.message);
    }
  };

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
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
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

          {/* Like Button */}
          <button onClick={handleLike} className="focus:outline-none">
            <motion.div
              animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`w-6 h-6 ${
                  isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
                }`}
              />
            </motion.div>
          </button>
        </div>

        {/* Blog Title */}
        <CardContent className="px-4 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 truncate text-gray-900 dark:text-white">
            {blog.title || "Untitled Blog"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{likeCount} likes</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// export default BlogCard;

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

export default BlogList;

