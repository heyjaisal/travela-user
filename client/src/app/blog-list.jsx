import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Heart, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

axios.defaults.withCredentials = true;

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleLike = async (id) => {
    try {
      const { data } = await axios.post(`http://localhost:5000/api/blogs/${id}/like`);
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === id ? { ...blog, likes: data.likes } : blog
        )
      );
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleSave = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/blogs/${id}/save`);
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => navigate(`/blog/${blog._id}`)}
            >
              <Card className="overflow-hidden rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition bg-white">
                {/* Thumbnail */}
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-52 object-cover"
                />

                <CardContent className="p-4 flex flex-col">
                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-2 truncate" title={blog.title}>
                    {blog.title}
                  </h3>

                  {/* Author Info */}
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar className="w-8 h-8">
                      {blog.author.image ? (
                        <AvatarImage src={blog.author.image} alt={blog.author.username} />
                      ) : (
                        <AvatarFallback>
                          {blog.author.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <p className="text-sm font-medium">{blog.author.username}</p>
                  </div>

                  {/* Like & Save Buttons */}
                  <div className="flex justify-between items-center mt-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(blog._id);
                      }}
                    >
                      <Heart className="w-5 h-5 text-red-500" /> {blog.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(blog._id);
                      }}
                    >
                      <Bookmark className="w-5 h-5 text-green-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;