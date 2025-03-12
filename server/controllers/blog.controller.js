const Blog = require("../models/Blog");

exports.getBlogs = async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;
    const userId = req.userId;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .select("id title thumbnail createdAt author location likes saves") // Ensure 'saves' is selected
      .populate("author", "username image");

    const updatedBlogs = blogs.map(blog => ({
      ...blog.toObject(),
      isLiked: userId && blog.likes?.some(id => id.toString() === userId),
      likeCount: blog.likes?.length || 0,
      isSaved: userId && blog.saves ? blog.saves.includes(userId) : false,
    }));

    res.json(updatedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getBlogById = async (req, res) => {
  try {
    const userId = req.userId;
    const blog = await Blog.findById(req.params.id)
      .select("id title thumbnail createdAt content location author likes")
      .populate("author", "username image");

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json({
      ...blog._doc,
      isLiked: userId ? blog.likes.includes(userId) : false,
      likeCount: blog.likes.length
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.Like = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (!blog.likes) {
      blog.likes = [];
    }


    const isLiked = blog.likes.includes(userId);
    if (isLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({ isLiked: !isLiked, likeCount: blog.likes.length });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.SaveBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "blog not found" });
    }

    if (!blog.saves) {
      blog.saves = [];
    }

    const isSaved = blog.saves.includes(userId);

    if (isSaved) {
      blog.saves = blog.saves.filter(savedId => savedId.toString() !== userId);
    } else {
      blog.saves.push(userId);
    }

    await blog.save();

    res.json({ isSaved: !isSaved });
  } catch (error) {
    console.error("error toggling like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
