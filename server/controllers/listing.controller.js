const Events = require("../models/Event");
const User = require("../models/User");
const Blog = require("../models/Blog");
const Property = require("../models/Property");
const Booking = require("../models/Booking");
const Reserve = require("../models/Booking");
const Ticket = require("../models/Ticket");

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
        .populate(
          "host",
          "username image email firstName lastName stripeAccountId"
        )
        .lean();
    } else if (type === "property") {
      item = await Property.findById(id)
        .populate(
          "host",
          "username image firstName lastName email stripeAccountId"
        )
        .lean();

      const bookings = await Booking.find({
        property: id,
        bookingStatus: "confirmed",
      }).select("checkIn checkOut");

      item.bookedDates = bookings.map(({ checkIn, checkOut }) => ({
        checkIn: checkIn.toISOString().split("T")[0],
        checkOut: checkOut.toISOString().split("T")[0],
      }));
    }

    res.json({ item });
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.BookedListings = async (req, res) => {
  try {
    const { type, page = 1, limit = 6 } = req.query;
    const userId = req.userId;

    if (!type) {
      return res.status(400).json({ message: "Listing type is required" });
    }

    const skip = (Number(page) - 1) * Number(limit);
    let listings = [];
    let totalListings = 0;

    if (type === "property") {
      totalListings = await Reserve.countDocuments({ user: userId });
      listings = await Reserve.find({ user: userId })
        .sort({ createdAt: -1 })
        .select("_id checkIn checkOut guests totalAmount transactionId qrCode platformFee isCheckedIn")
        .populate("property", "propertyType title price country city images")
        .populate("hostId", "username image")
        .skip(skip)
        .limit(Number(limit))
        .lean();
    } else if (type === "event") {
      totalListings = await Ticket.countDocuments({ user: userId });
      listings = await Ticket.find({ user: userId })
        .sort({ createdAt: -1 })
        .select("_id ticketsBooked totalAmount bookingStatus paymentStatus refundStatus qrCode isCheckedIn transactionId")
        .populate("hostId", "username image")
        .populate("event", "eventType title eventVenue ticketPrice country city images")
        .skip(skip)
        .limit(Number(limit))
        .lean();
    }

    const hasMore = skip + listings.length < totalListings;

    res.json({ listings, hasMore, type });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.hostProfileLising = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, page = 1, limit = 10 } = req.query;

    if (!type) {
      return res.status(400).json({ message: "Listing type is required" });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const query = { host: id };
    let listings = [];
    let totalListings = 0;

    if (type === "property") {
      totalListings = await Property.countDocuments(query);
      listings = await Property.find(query)
        .sort({ createdAt: -1 })
        .select("propertyType images price country city")
        .skip(skip)
        .limit(Number(limit))
        .lean();
    } else if (type === "event") {
      totalListings = await Events.countDocuments(query);
      listings = await Events.find(query)
        .sort({ createdAt: -1 })
        .select("title images eventVenue country ticketPrice city")
        .skip(skip)
        .limit(Number(limit))
        .lean();
    } else {
      return res.status(400).json({ message: "Invalid listing type" });
    }

    const hasMore = skip + listings.length < totalListings;
    res.json({ listings, hasMore, type });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};