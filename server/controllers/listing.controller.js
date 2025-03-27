const Events = require("../models/Event");
const User = require("../models/User");
const Blog = require("../models/Blog");
const Property = require("../models/Property");

exports.getListings = async (req, res) => {
  try {
    const { type, page = 1, limit = 6, search } = req.query;
    const userId = req.userId;

    if (!type) {
      return res.status(400).json({ message: "Listing type is required" });
    }

    const skip = (Number(page) - 1) * Number(limit);
    let listings = [];
    let totalListings = 0;
    let filter = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");

      if (type === "event") {
        filter = {
          $or: [
            { title: searchRegex },
            { eventVenue: searchRegex },
            { address: searchRegex },
            { city: searchRegex },
            { state: searchRegex },
            { country: searchRegex },
            { description: searchRegex },
          ],
        };
      } else if (type === "property") {
        filter = {
          $or: [
            { propertyType: searchRegex },
            { description: searchRegex },
            { address: searchRegex },
            { city: searchRegex },
            { street: searchRegex },
            { country: searchRegex },
            { state: searchRegex },
          ],
        };
      } else if (type === "blog") {
        filter = {
          $or: [
            { title: searchRegex },
            { location: searchRegex },
            { categories: searchRegex },
          ],
        };
      } else {
        return res.status(400).json({ message: "Invalid listing type" });
      }
    }

    if (type === "blog") {
      totalListings = await Blog.countDocuments(filter);
      const blogs = await Blog.find(filter)
        .sort({ createdAt: -1 })
        .select("id title thumbnail createdAt author location likes saves")
        .populate("author", "username image")
        .skip(skip)
        .limit(Number(limit))
        .lean();

      listings = blogs.map((blog) => ({
        ...blog,
        isLiked: userId && blog.likes?.some((id) => id.toString() === userId),
        likeCount: blog.likes?.length || 0,
        isSaved:
          userId && blog.saves
            ? blog.saves.map((id) => id.toString()).includes(userId)
            : false,
      }));
    } else if (type === "property") {
      totalListings = await Property.countDocuments(filter);
      const Propertys = await Property.find(filter)
        .sort({ createdAt: -1 })
        .select("propertyType images price country city saves")
        .skip(skip)
        .limit(Number(limit))
        .lean();

      listings = Propertys.map((property) => ({
        ...property,
        isSaved:
          userId && property.saves
            ? property.saves.map((id) => id.toString()).includes(userId)
            : false,
      }));
    } else if (type === "event") {
      totalListings = await Events.countDocuments(filter);
      const events = await Events.find(filter)
        .sort({ createdAt: -1 })
        .select("title images eventVenue country ticketPrice city saves")
        .skip(skip)
        .limit(Number(limit))
        .lean();

      listings = events.map((events) => ({
        ...events,
        isSaved:
          userId && events.saves
            ? events.saves.map((id) => id.toString()).includes(userId)
            : false,
      }));
    }

    const hasMore = skip + listings.length < totalListings;

    res.json({ listings, hasMore, type });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.listing = async (req, res) => {
  const { type, limit } = req.query;
  const maxLimit = Number(limit) || 10;

  try {
    if (!type) {
      return res.status(400).json({ message: "Listing type is required" });
    }

    let listing = [];

    if (type === "event") {
      listing = await Events.find()
        .sort({ createdAt: -1 })
        .select("eventType title ticketPrice country city images")
        .limit(maxLimit)
        .lean();
    } else if (type === "property") {
      listing = await Property.find()
        .sort({ createdAt: -1 })
        .select("propertyType images price country city")
        .limit(maxLimit)
        .lean();
    } else {
      return res.status(400).json({ message: "Invalid listing type" });
    }

    res.json({ listing });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.detailList = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  let item;
  try {
    if (type === "event") {
      item = await Events.findById(id)
        .populate("host", "username image email")
        .lean();
    } else if (type === "property") {
      item = await Property.findById(id)
        .populate("host", "username image email")
        .lean();
    }

    res.json({ item });
  
    
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};
