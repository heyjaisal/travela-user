import React, { useState, useEffect } from "react";
import BlogCard from "../components/blog-card";
import axios from "axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState(new Set());
  const [savedBlogs, setSavedBlogs] = useState(new Set());

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/blogs", {
        withCredentials: true,
      });
      setBlogs(response.data);
      console.log(response);
      

      const liked = new Set(response.data.filter((blog) => blog.isLiked).map((blog) => blog._id));
      const saved = new Set(response.data.filter((blog) => blog.isSaved).map((blog) => blog._id));

      setLikedBlogs(liked);
      setSavedBlogs(saved);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleLike = async (blogId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/blogs/${blogId}/like`, {}, { withCredentials: true });

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, likes: response.data.likes, isLiked: response.data.isLiked } : blog
        )
      );

      if (response.data.isLiked) {
        setLikedBlogs((prev) => new Set([...prev, blogId]));
      } else {
        setLikedBlogs((prev) => {
          const updatedLikes = new Set(prev);
          updatedLikes.delete(blogId);
          return updatedLikes;
        });
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleSave = async (blogId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/blogs/${blogId}/save`, {}, { withCredentials: true });

      if (response.data.isSaved) {
        setSavedBlogs((prev) => new Set([...prev, blogId]));
      } else {
        setSavedBlogs((prev) => {
          const updatedSaves = new Set(prev);
          updatedSaves.delete(blogId);
          return updatedSaves;
        });
      }
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-6 gap-4 px-5 p-2">
      {blogs.map((blog) => (
        <BlogCard
          key={blog._id}
          blog={blog}
          handleLike={() => handleLike(blog._id)}
          handleSave={() => handleSave(blog._id)}
          isLike={likedBlogs.has(blog._id)}
          isFavorite={savedBlogs.has(blog._id)}
        />
      ))}
    </div>
  );
};

export default BlogList;

const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: [
      {
        type: Object,
        required: true,
      },
    ],
    thumbnail: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });
blogSchema.index({ title: "text", content: "text" });

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;


exports.getBlogs = async (req, res) => {
  try {
    const { limit = 10, skip = 0, sortBy = "latest" } = req.query;
    const userId = req.userId; // Assuming the user is authenticated

    const blogs = await Blog.find()
      .sort(sortBy === "mostLiked" ? { likes: -1 } : { createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .select("id title thumbnail createdAt author location likes likedBy savedBy")
      .populate("author", "username image");

    const blogsWithLikeStatus = blogs.map(blog => ({
      ...blog.toObject(),
      isLiked: blog.likedBy.includes(userId), // Check if the current user has liked this blog
      isSaved: blog.savedBy.includes(userId), // Check if the current user has saved this blog
    }));

    res.json(blogsWithLikeStatus);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const BlogCard = ({ blog, handleLike, handleSave, isLike, isFavorite }) => {
  const navigate = useNavigate();

  if (!blog) return null;

  return (
    <motion.div
      key={blog._id}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
      onClick={() => navigate(`/blog/${blog._id}`)}
    >
      <Card className="overflow-hidden border border-gray-200 transition bg-white dark:bg-gray-900 relative">
        {blog.thumbnail && (
          <img src={blog.thumbnail} alt={blog.title} className="w-full h-52 object-cover" />
        )}

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

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          className="absolute top-3 right-2 p-2 z-10"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="gray"
            strokeWidth="2"
            className="w-6 h-6"
            animate={{ scale: isFavorite ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <motion.path
              fill={isFavorite ? "#ff006a" : "white"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M6 2v20l6-4 6 4V2z"
            />
          </motion.svg>
        </button>

        <div className="absolute bottom-4 right-3 z-10">
          <Dropdown>
            <DropdownTrigger>
              <button className="p-2 rounded-full transition">
                <MoreHorizontal className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem className="text-red-500">Report</DropdownItem>
              <DropdownItem>Share</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <CardContent className="px-4 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 truncate text-gray-900 dark:text-white">
            {blog.title || "Untitled Blog"}
          </h3>

          <button
            className="p-2 rounded-full flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="gray"
              strokeWidth="2"
              className="w-6 h-6"
              animate={{ scale: isLike ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <motion.path
                fill={isLike ? "red" : "white"}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </motion.svg>
            <span className={isLike ? "text-red-500 font-semibold" : "text-gray-700 dark:text-gray-300"}>
              {blog.likes || 0}
            </span>
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// export default BlogCard;
