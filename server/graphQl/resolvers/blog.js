const mongoose = require("mongoose");
const Blog = require("../../models/Blog");

module.exports = {
  Query: {
    blogs: async (_, { limit = 15, skip = 0, sortBy = "latest" }) => {
      if (sortBy === "mostLiked") {
        const blogs = await Blog.aggregate([
          {
            $addFields: {
              likesCount: { $size: "$likes" },
            },
          },
          { $sort: { likesCount: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "author",
            },
          },
          { $unwind: "$author" },
        ]);
        return blogs;
      } else {
        const blogs = await Blog.find({})
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skip)
          .populate("author", "username image")
          .exec();
        return blogs;
      }
    },

    blog: async (_, { id }) => {
      const blog = await Blog.findById(id).populate("author", "username image");
      if (!blog) throw new Error("Blog not found");
      return blog;
    },
  },

  Blog: {
    id: (parent) => parent._id.toString(),
    date: (parent) => parent.createdAt.toISOString(),
    location: (parent) => parent.location || "",
  },

  User: {
    id: (parent) => parent._id.toString(),
  },
};
