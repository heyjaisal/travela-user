const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

module.exports = (io, socket) => {
  socket.on("join", ({ userId }) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`[Socket.IO] [JOIN] ${userId} joined their room`);
    }
  });

  socket.on("send-message", async ({ conversationId, text, sender }) => {
    try {
      if (!conversationId || !text || !sender?.id || !sender?.model) {
        return console.warn("[Socket.IO] Invalid message payload");
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return console.warn(`[Socket.IO] Conversation ${conversationId} not found`);
      }

      const receiver = conversation.participants.find(
        (p) => p.participantId.toString() !== sender.id.toString()
      );

      if (!receiver) {
        return console.warn("[Socket.IO] Receiver not found");
      }

      const message = await Message.create({
        conversationId,
        sender: {
          id: sender.id,
          model: sender.model,
        },
        receiver: {
          id: receiver.participantId,
          model: receiver.participantModel,
        },
        text,
      });

      conversation.lastMessage = text;
      conversation.lastMessageAt = new Date();
      await conversation.save();

      const payload = {
        _id: message._id,
        conversationId,
        sender: {
          id: sender.id,
          model: sender.model,
        },
        receiver: {
          id: receiver.participantId,
          model: receiver.participantModel,
        },
        text,
        createdAt: message.createdAt || new Date().toISOString(),
      };

      io.to(receiver.participantId.toString()).emit("receive-message", payload);
      console.log(`[Socket.IO] [EMIT] ${sender.model} → ${receiver.participantModel}: ${text}`);

    } catch (err) {
      console.error(`[Socket.IO] Error sending message: ${err.message}`);
      socket.emit("message-error", {
        conversationId,
        error: "Failed to send message"
      });
    }
  });
};
