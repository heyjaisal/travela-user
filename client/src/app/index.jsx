import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import axios from "axios";
import { API_BASE_URL } from "@/utils/constants";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const EditorComponent = () => {
  const editorInstance = useRef(null);
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [images, setImages] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const uploadImage = async (file, type) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);
      const { data } = await axios.post(`${API_BASE_URL}/api/upload`, formData, { withCredentials: true });
      if (type === "blog") setImages(prev => [...prev, data.imageUrl]);
      return { success: 1, file: { url: data.imageUrl } };
    } catch {
      return { success: 0 };
    }
  };

  const handleDeleteImage = async (imageUrl, type = "blog") => {
    try {
      await axios.delete(`${API_BASE_URL}/api/delete`, { withCredentials: true, data: { image: imageUrl, type } });
      if (type === "blog") {
        setImages(prev => prev.filter(img => img !== imageUrl));
        const savedData = await editorInstance.current?.save();
        editorInstance.current?.render({ ...savedData, blocks: savedData.blocks.filter(b => b.data?.file?.url !== imageUrl) });
      } else {
        setThumbnailUrl("");
      }
    } catch {}
  };

  const handleSaveBlog = async () => {
    if (!title || !thumbnailUrl) {
      toast.error("Please add a title and thumbnail before saving.");
      return;
    }
  
    setIsSaving(true);
  
    try {
      const content = await editorInstance.current?.save();
      const blogData = {
        title,
        content,
        thumbnail: thumbnailUrl,
      };
  
      const response = await axios.post(`${API_BASE_URL}/api/blogs`, blogData, { withCredentials: true });
      
      if (response.status === 201) {
        toast.success("Blog posted Succesfullly");
        setTitle("");
        setThumbnailUrl("");
        setImages([]);
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
        onChange: async () => {
          const savedData = await editorInstance.current?.save();
          setImages(savedData.blocks.filter(b => b.type === "image").map(b => b.data.file.url));
        },
      });
    }

    return () => {
      if (editorInstance.current?.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="p-4 space-y-4">
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
          onChange={(e) => uploadImage(e.target.files[0], "title").then(({ file }) => setThumbnailUrl(file.url))}
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
      <div id="editorjs" className="p-4 pb-0 border rounded"></div>
      <Button onClick={handleSaveBlog} disabled={isSaving} className="mt-4 p-2 text-white rounded">
        {isSaving ? "Saving..." : "Save Blog"}
      </Button>
    </div>
  );
};

export default EditorComponent;
