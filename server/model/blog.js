const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", imageSchema);

module.exports = Blog;
