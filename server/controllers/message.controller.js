const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const Host = require("../models/Hosts");
const getReceiverInfo = require("../config/getReceiverInfo");

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const userModel = req.user.role;

    const conversations = await Conversation.find({
      participants: {
        $elemMatch: {
          participantId: userId,
          participantModel: userModel,
        },
      },
    })
      .sort({ updatedAt: -1 })
      .lean();

    res.json(conversations);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ message: "Failed to fetch conversations." });
  }
};


exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .lean();

  res.json(messages.reverse());
};

exports.createConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const userModel = req.user.role;
    const { participantId, participantModel } = req.body;

    if (
      userId.toString() === participantId.toString() &&
      userModel === participantModel
    ) {
      return res.status(400).json({ message: "Cannot start conversation with yourself." });
    }

    
    let conversation = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: { participantId: userId, participantModel: userModel } },
          { $elemMatch: { participantId, participantModel } },
        ],
      },
      "participants.2": { $exists: false },
    });

    if (!conversation) {
    
      const CurrentModel = userModel === "User" ? User : Host;
      const OtherModel = participantModel === "User" ? User : Host;

    
      const currentUser = await CurrentModel.findById(userId).select("firstName lastName image role");
      const otherUser = await OtherModel.findById(participantId).select("firstName lastName image role");

      console.log("Current User:", currentUser);
      console.log("Other User:", otherUser);
      

      if (!currentUser || !otherUser) {
        return res.status(404).json({ message: "One or more participants not found." });
      }

      // Create conversation with embedded name, avatar, role
      conversation = await Conversation.create({
        participants: [
          {
            participantId: currentUser._id,
            participantModel: userModel,
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            avatar: currentUser.image || null,
            role: currentUser.role,
          },
          {
            participantId: otherUser._id,
            participantModel,
            name: `${otherUser.firstName} ${otherUser.lastName}`,
            avatar: otherUser.image || null,
            role: otherUser.role,
          },
        ],
      });
    }

    res.json(conversation);
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({ message: "Failed to create conversation." });
  }
};