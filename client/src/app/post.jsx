import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import axios from "axios";
import { API_BASE_URL } from "@/utils/constants";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import AsyncSelect from "react-select/async";
import logo from "../assets/logo.png";

const Blogpost = () => {
  const editorInstance = useRef(null);
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [category, setCategory] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  const handleClose = () => navigate("/");

  const handleAddCategory = () => {
    if (inputValue.trim()) {
      setCategory(inputValue.trim());
      setInputValue("");
    }
  };

  const uploadImage = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);
      const { data } = await axios.post(`${API_BASE_URL}/api/upload`, formData, { withCredentials: true });

      if (type === "thumbnail") setThumbnailUrl(data.imageUrl);
      return { success: 1, file: { url: data.imageUrl } };
    } catch (error) {
      console.error("Error uploading image:", error);
      return { success: 0 };
    }
  };

  const handleDeleteImage = async (imageUrl, type = "blog") => {
    try {
      await axios.delete(`${API_BASE_URL}/api/delete`, { withCredentials: true, data: { image: imageUrl, type } });
      if (type === "thumbnail") setThumbnailUrl("");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSaveBlog = async () => {
    if (!title || !thumbnailUrl) {
      toast.error("Please add a title and thumbnail before saving.");
      return;
    }

    setIsSaving(true);

    try {
      const content = await editorInstance.current?.save();
      const blogData = { title, content, thumbnail: thumbnailUrl, category, location };

      const response = await axios.post(`${API_BASE_URL}/api/blogs`, blogData, { withCredentials: true });

      if (response.status === 201) {
        toast.success("Blog posted successfully");
        setTitle("");
        setThumbnailUrl("");
        setCategory("");
        inputValue("")
        setLocation(null);
        editorInstance.current?.clear();
      } else {
        toast.error("Unexpected response from the server. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save blog. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const loadLocationOptions = async (inputValue) => {
    if (!inputValue.trim()) return [];

    try {
      const { data } = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: { format: "json", q: inputValue },
      });

      return data.map((place) => ({
        label: place.display_name,
        value: place.display_name,
      }));
    } catch (error) {
      console.error("Error loading location options:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        holder: "editorjs",
        placeholder: "Write your blog content here...",
        tools: {
          list: List,
          image: {
            class: ImageTool,
            config: {
              uploader: { uploadByFile: (file) => uploadImage(file, "blog") },
            },
          },
        },
      });
    }
  
    
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <img src={logo} alt="logo" className="w-5 h-5" />
          <h1 className="text-2xl font-title font-bold">Publish your blog</h1>
          <button onClick={handleClose} className="text-gray-700">
            <X className="w-8 h-8" />
          </button>
        </div>

        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-4 border rounded text-2xl font-bold"
        />

        <div className="border p-4 rounded">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadImage(e.target.files[0], "thumbnail")}
            className="w-full p-2 border rounded"
          />
          {thumbnailUrl && (
            <div className="relative">
              <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-48 object-cover mt-2 rounded" />
              <button
                onClick={() => handleDeleteImage(thumbnailUrl, "thumbnail")}
                className="absolute top-2 right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center"
              >
                X
              </button>
            </div>
          )}
        </div>

        <div className="border p-4 rounded">
          <AsyncSelect
            loadOptions={loadLocationOptions}
            onChange={(selected) => setLocation(selected.value)}
            placeholder="Search location..."
          />
        </div>

        <div id="editorjs" className="p-4 pb-0 border rounded"></div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a category"
              className="p-2 border rounded flex-1"
            />
            <Button onClick={handleAddCategory} className="p-2 text-white rounded">
              Add
            </Button>
          </div>
          {category && (
            <div className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1">
              <span>{category}</span>
              <button onClick={() => setCategory("")} className="ml-2 text-gray-600 hover:text-gray-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
    

        <Button onClick={handleSaveBlog} disabled={isSaving} className="mt-4 p-2 text-white rounded">
          {isSaving ? "Saving..." : "Publish Blog"}
        </Button>
      </div>
    </div>
  );
};

export default Blogpost;