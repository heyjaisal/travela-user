const Blog = require("../models/Blog");
const Events = require("../models/Event");
const Host = require("../models/Hosts");
const Property = require("../models/Property");
const User = require("../models/User");
const Review = require("../models/Review");
const { default: mongoose } = require("mongoose");
const Report = require("../models/Report");


exports.searchUser = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || null) {
      return res.status(400).send("search tearm is requried");
    }
    const sanitize = searchTerm.replace(/[.*+?^${}|[\]\\]/g, "\\$&");
    const regex = new RegExp(sanitize, "i");
    const users = await User.find({
      $and: [
        {
          _id: { $ne: req.userId },
        },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { username: regex }],
        },
      ],
    }).select("username firstName lastName _id email image");
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server Error");
  }
};

exports.getUserBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const blogs = await Blog.find({ author: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("title thumbnail createdAt")
      .populate("author", "username image")
      .lean();

    const totalBlogs = await Blog.countDocuments({ author: id });
    const hasMore = skip + blogs.length < totalBlogs;

    res.json({ blogs, hasMore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.userDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    const isHost = type === "host";
    const Model = isHost ? Host : User;
    const fields = isHost
      ? "_id image firstName lastName username country email gender followers"
      : " _id image firstName lastName username followers country gender email";

    const user = await Model.findById(id).select(fields).lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    const loggedInUserId = req.userId;

    if (!isHost) {
      user.followerCount = Array.isArray(user.followers)
        ? user.followers.length
        : 0;
      user.isFollowing = user.followers.includes(loggedInUserId);
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

exports.SaveItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = req.userId;

    let item;
    if (type === "blog") {
      item = await Blog.findById(id);
    } else if (type === "property") {
      item = await Property.findById(id);
    } else if (type === "event") {
      item = await Events.findById(id);
    }

    if (!item) {
      return res.status(404).json({ message: "blog not found" });
    }

    if (!item.saves) {
      item.saves = [];
    }

    const isSaved = item.saves.includes(userId);

    if (isSaved) {
      item.saves = item.saves.filter(
        (savedId) => savedId.toString() !== userId
      );
    } else {
      item.saves.push(userId);
    }

    await item.save();

    res.json({ isSaved: !isSaved });
  } catch (error) {
    console.error("error toggling like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.followToggle = async (req, res) => {
  const currentUserId = req.userId;
  const targetUserId = req.params.id;

  if (currentUserId.toString() === targetUserId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  try {
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      isFollowing: !isFollowing,
      followerCount: targetUser.followers.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.Hostfollow = async (req, res) => {
  const currentUserId = req.userId;
  const targetUserId = req.params.id;

  if (currentUserId.toString() === targetUserId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  try {
    const targetUser = await Host.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      isFollowing: !isFollowing,
      followerCount: targetUser.followers.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.postReviews = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { itemType, item } = req.params;

    const user = req.userId;

    console.log(itemType, item);

    if (!["Event", "Property"].includes(itemType)) {
      return res.status(400).json({ error: "Invalid itemType" });
    }

    const existingReview = await Review.findOne({ itemType, item, user });

    let review;
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      review = await existingReview.save();
    } else {
      review = new Review({ itemType, item, user, rating, comment });
      await review.save();
    }
    const stats = await Review.aggregate([
      { $match: { itemType, item: new mongoose.Types.ObjectId(item) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const { averageRating, reviewCount } = stats[0];

    const Model = itemType === "Event" ? Events : Property;
    await Model.findByIdAndUpdate(item, {
      averageRating,
      reviewCount,
    });

    res.status(201).json({ review, averageRating, reviewCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { itemType, item } = req.params;

    if (!["Event", "Property"].includes(itemType)) {
      return res.status(400).json({ error: "Invalid itemType" });
    }

    const reviews = await Review.find({ itemType, item }).populate({
      path: "user",
      select: "username image"
    });

    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.ReportContent = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { reasons } = req.body;

    console.log(reasons);
    

    if (!["Event", "Property"].includes(type)) {
      return res.status(400).json({ error: "Invalid report type" });
    }

    if (!reasons || reasons.length === 0) {
      return res.status(400).json({ error: "Reasons are required" });
    }

    const report = new Report({
      contentType: type,
      contentId: id,
      userId: req.userId,
      reasons,
    });

    await report.save();
    res.status(201).json({ message: "Report submitted successfully" });
  } catch (err) {
    console.error("Report Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

