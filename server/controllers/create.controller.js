const User = require("../models/User");
const Blog = require("../models/Blog");
const cloudinary = require("../config/cloudinary");
const Content = require("../models/Content");


exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const folderMap = {
      profile: "profile-images",
      blog: "blog-images",
      title: "title-images",
    };

    const folder = folderMap[req.body.type] || "default-images";

    const uploadToCloudinary = (fileBuffer, folder) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    };

    const { secure_url: imageUrl, public_id } = await uploadToCloudinary(req.file.buffer, folder);

    if (req.body.type === "profile") {
      await User.findByIdAndUpdate(req.userId, { image: imageUrl }, { new: true });
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
    

    if (!image || !type)
      return res.status(400).json({ message: "No image or type provided" });

    const models = { profile: User, blog: Blog ,thumbnail:Blog };
    const model = models[type];
    if (!model) return res.status(400).json({ message: "Invalid type" });

    const record = await model.findById(req.userId);
    const publicId = image.split("/").pop().split(".")[0];
    const folder = `${type}-images`;

    if (record?.image === image) {
      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
      await model.findByIdAndUpdate(req.userId, { image: null }, { new: true });
      return res
        .status(200)
        .json({ message: "Image deleted from both database and Cloudinary" });
    }

    await cloudinary.uploader.destroy(`${folder}/${publicId}`);
    return res.status(200).json({ message: "Image deleted from Cloudinary" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.BlogPost = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.profileSetup) {
      return res.status(403).json({ message: "Complete your profile to post the blog." });
    }

    const { title, content, thumbnail, categories, location } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const newBlog = new Blog({
      title,
      content,
      thumbnail,
      categories,
      location,
      author: req.userId,
    });

    await newBlog.save();

    user.blogs.push(newBlog._id);
    await user.save();

    res.status(201).json({ message: "Blog saved successfully!", blog: newBlog });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ message: "Error saving blog.", error });
  }
};

