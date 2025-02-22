const Blog = require("../models/Blog");

exports.getBlogs = async (req, res) => {
  try {
    const { limit = 10, skip = 0, sortBy = "latest" } = req.query;
    const blogs = await Blog.find()
      .sort(sortBy === "mostLiked" ? { likesCount: -1 } : { createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .select("id title thumbnail createdAt author location likes")
      .populate("author", "username image");
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .select("id title thumbnail createdAt content location author likes")
      .populate("author", "username image");
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You already liked this blog" });
    }

    blog.likedBy.push(userId);
    blog.likes = (blog.likes || 0) + 1;

    await blog.save();

    res.json({ likes: blog.likes });
  } catch (error) {
    console.error("Error liking blog:", error);
    res.status(500).json({ message: "Error liking blog" });
  }
};


exports.saveBlog = async (req, res) => {
  try {
    const userId = req.userId; 
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (!blog.savedBy.includes(userId)) {
      blog.savedBy.push(userId);
      await blog.save();
    }

    res.status(200).json({ message: "Blog saved!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving blog" });
  }
};
