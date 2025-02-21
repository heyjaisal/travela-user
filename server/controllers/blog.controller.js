const Blog = require("../models/Blog");

exports.GetBlog = async (req, res) => {
    const limit = 10;
    const lastCreatedAt = req.query.lastCreatedAt;
  
    try {
      let query = {};
      if (lastCreatedAt) {
        query = { createdAt: { $lt: new Date(lastCreatedAt) } };
      }
  
      const blogs = await Blog.find(query)
        .populate("author", "username image")
        .sort({ createdAt: -1 })
        .limit(limit);
  
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };