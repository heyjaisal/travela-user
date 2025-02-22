import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { Heart, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { SnackbarProvider, useSnackbar } from "notistack";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

axios.defaults.withCredentials = true;

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(data);
      } catch (error) {
        showToast("Error fetching blogs", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const showToast = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  const handleLike = async (id) => {
    try {
      const { data } = await axios.post(`http://localhost:5000/api/blogs/${id}/like`);
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === id ? { ...blog, likes: data.likes, likedByUser: true } : blog
        )
      );
      showToast("Liked the blog!", "success");
    } catch (error) {
      console.log("Error liking the image");
    }
  };

  const handleSave = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/blogs/${id}/save`);
      showToast("Blog saved successfully!", "success");
    } catch (error) {
      showToast("Error saving blog", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ScaleLoader color="#C0C2C9" />
      </div>
    );

  return (
    <div className="max-w-screen-xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {blogs.length === 0 ? (
        <p className="text-center col-span-3 text-gray-500">No blogs available.</p>
      ) : (
        blogs.map((blog) => (
          <motion.div
            key={blog._id}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => navigate(`/blog/${blog._id}`)}
          >
            <Card className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition">
              {/* Thumbnail */}
              <img src={blog.thumbnail} alt={blog.title} className="w-full h-52 object-cover" />

              <CardContent className="p-4 flex flex-col">
                {/* Title */}
                <h3 className="text-lg font-bold mb-2">{blog.title}</h3>

                {/* Author Info */}
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="w-8 h-8">
                    {blog.author.image ? (
                      <AvatarImage src={blog.author.image} alt={blog.author.username} />
                    ) : (
                      <AvatarFallback>{blog.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                  <p className="text-sm font-semibold">{blog.author.username}</p>
                </div>

                {/* Like & Save Buttons */}
                <div className="flex justify-between items-center mt-auto">
                  <Button
                    variant="ghost"
                    size="icon"
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
        ))
      )}
    </div>
  );
};

const BlogListWithSnackbar = () => (
  <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
    <BlogList />
  </SnackbarProvider>
);

export default BlogListWithSnackbar;
