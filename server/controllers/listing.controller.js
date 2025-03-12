const Events = require("../models/Event");
const Property = require("../models/Property");
const User = require("../models/User");

exports.listing = async (req, res) => {
  try {
    const { type, page = 1, limit = 10, search = "" } = req.query;

    const Model = type === "property" ? Property : Events;
    const skip = (page - 1) * limit;

    const fields = type === "property"
      ? "_id country city propertyType price images"
      : "_id eventType title city ticketPrice country eventVenue images";

    const searchFields = type === "property"
      ? ["city", "country", "propertyType"]
      : ["title", "city", "country", "eventVenue"];

    const searchQuery = search
      ? {
          $or: searchFields.map(field => ({ [field]: { $regex: search, $options: "i" } }))
        }
      : {};

    const data = await Model.find(searchQuery, fields).skip(skip).limit(limit).lean();
    const totalCount = await Model.countDocuments(searchQuery);
    const hasMore = skip + limit < totalCount;

    res.status(200).json({ data, hasMore });
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    res.status(500).json({ message: `Error fetching ${type}`, error: error.message });
  }
};
