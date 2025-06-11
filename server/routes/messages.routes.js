const express = require("express");
const router = express.Router();
const chatController = require("../controllers/message.controller");
const middleware = require("../middleware/messages");

router.get("/conversations", middleware, chatController.getConversations);
router.get("/messages/:conversationId", middleware, chatController.getMessages);
router.post("/conversations", middleware, chatController.createConversation);

module.exports = router;
