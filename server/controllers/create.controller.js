const User = require("../model/profile");
const Blog = require("../model/blog")
const cloudinary = require('../config/cloudinary')

exports.uploadImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      const folderMap = {
        profile: "profile-images",
        blog: "blog-images",
      };
  
      const folder = folderMap[req.body.type] || "default-images";
  
      const { secure_url: imageUrl, public_id } = await cloudinary.uploader.upload(req.file.path, { folder });
  
      if (req.body.type === "profile") {
       
        
        const updatedUser = await User.findByIdAndUpdate(
          req.userId,
          { image: imageUrl},
          { new: true }
        );
     
      }
  
      res.status(200).json({ imageUrl, public_id, type: req.body.type });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  
  exports.deleteImage = async (req, res) => {
    try {
      const { image, type } = req.body;
      
      if (!image || !type) return res.status(400).json({ message: "No image or type provided" });
  
      const models = { profile: User, blog: Blog };
      const model = models[type];
      if (!model) return res.status(400).json({ message: "Invalid type" });
  
      const record = await model.findById(req.userId);
      const publicId = image.split("/").pop().split(".")[0];
      const folder = `${type}-images`;
  
      if (record?.image === image) {
        await cloudinary.uploader.destroy(`${folder}/${publicId}`);
        await model.findByIdAndUpdate(req.userId, { image: null }, { new: true });
        return res.status(200).json({ message: "Image deleted from both database and Cloudinary" });
      }
  
      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
      return res.status(200).json({ message: "Image deleted from Cloudinary" });
  
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  