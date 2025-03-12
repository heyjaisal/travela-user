import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Heart } from "lucide-react";
import axios from "axios";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(blog.isLiked);
  const [likeCount, setLikeCount] = useState(blog.likeCount);
  const [isSaved, setIsSaved] = useState(blog.isSaved);

  const handleLike = async (e) => {
    e.stopPropagation();
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

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/blogs/${blog._id}/save`,
        {},
        { withCredentials: true }
      );
      setIsSaved(response.data.isSaved);
    } catch (error) {
      console.error("Error saving blog:", error.response?.data || error.message);
    }
  };

  return (
    <motion.div
      key={blog._id}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer relative"
      onClick={() => navigate(`/blog/${blog._id}`)}
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 transition bg-white dark:bg-gray-900">
        {blog.thumbnail && (
          <img
            src={blog.thumbnail}
            alt={blog.title || "Blog Thumbnail"}
            className="w-full h-52 object-cover"
            loading="lazy"
          />
        )}

        {/* Save Button at Top Right */}
        <button
          onClick={handleSave}
          className="absolute top-2 right-2 p-2 z-10 rounded-full"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="gray"
            strokeWidth="2"
            className="w-6 h-6"
            animate={{ scale: isSaved ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <motion.path
              fill={isSaved ? "#ff006a" : "white"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M6 2v20l6-4 6 4V2z"
            />
          </motion.svg>
        </button>

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
              <Heart className={`w-6 h-6 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
            </motion.div>
          </button>
        </div>

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

export default BlogCard;
