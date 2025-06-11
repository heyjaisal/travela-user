import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { Folder, Download, X } from "lucide-react";

import {
  prependMessages,
  setLoading,
  setHasMore,
  setFileDownloadProgress,
  setIsDownloading,
  setUnreadCounts,
} from "@/redux/slice/chat-slice";
import axiosInstance from "@/utils/axios-instance";

const LIMIT = 20;

function MessageContainer({ socket }) {
  const scrollRef = useRef(null);
  const topRef = useRef(null);
  const dispatch = useDispatch();

  const {
    selectedConversation,
    messages,
    hasMore,
    loading,
  } = useSelector((state) => state.chat);
  const userId = useSelector((state) => state.auth.user._id);

  const [page, setPage] = useState(1);
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!selectedConversation?._id || !hasMore || loading) return;
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get(
        `/messages/${selectedConversation._id}?page=${page}&limit=${LIMIT}`,
        { withCredentials: true }
      );
      const fetched = response.data;
      if (fetched.length < LIMIT) dispatch(setHasMore(false));
      dispatch(prependMessages(fetched));
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    dispatch(setLoading(false));
  }, [selectedConversation, page, hasMore, loading]);

  useEffect(() => {
    setPage(1);
    dispatch(setHasMore(true));
  }, [selectedConversation?._id]);

  useEffect(() => {
    if (selectedConversation?._id) {
      fetchMessages();

      socket.emit("markAsRead", {
        conversationId: selectedConversation._id,
        userId,
      });

      axiosInstance
        .get(`/unread-count/${selectedConversation._id}/${userId}`)
        .then((res) => {
          dispatch(setUnreadCounts({ [selectedConversation._id]: res.data.count }));
        })
        .catch(console.error);
    }
  }, [selectedConversation?._id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMessages();
        }
      },
      { threshold: 1 }
    );
    if (topRef.current) observer.observe(topRef.current);
    return () => {
      if (topRef.current) observer.unobserve(topRef.current);
    };
  }, [fetchMessages, hasMore]);

  const checkImage = (url) =>
    /\.(jpg|jpeg|png|gif|webp|svg|ico|heic|heif)$/i.test(url);

  const downloadFile = async (url) => {
    const response = await axios.get(url, {
      responseType: "blob",
      onDownloadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        dispatch(setFileDownloadProgress(percent));
      },
    });
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
    dispatch(setIsDownloading(false));
    dispatch(setFileDownloadProgress(0));
  };

  const renderMessage = (message, index) => {
    const isOwn = message.senderId === userId;
    const alignment = isOwn ? "text-right" : "text-left";
    const bubbleColor = isOwn
      ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]"
      : "bg-[#2a2b33]/5 text-white/80 border-white/20";

    return (
      <div key={message._id || index} className={`${alignment}`}>
        <div
          className={`border inline-block p-4 rounded my-1 max-w-[60%] break-words ${bubbleColor}`}
        >
          {message.messageType === "text" && <p>{message.text}</p>}
          {message.messageType === "media" && message.media?.url && (
            <>
              {checkImage(message.media.url) ? (
                <img
                  src={message.media.url}
                  onClick={() => {
                    setShowImage(true);
                    setImageURL(message.media.url);
                  }}
                  className="cursor-pointer w-[250px] h-auto"
                  alt="media"
                />
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                    <Folder />
                  </span>
                  <span>{message.media.url.split("/").pop()}</span>
                  <span
                    className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                    onClick={() => {
                      dispatch(setIsDownloading(true));
                      dispatch(setFileDownloadProgress(0));
                      downloadFile(message.media.url);
                    }}
                  >
                    <Download />
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {moment(message.createdAt).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 w-full relative">
      <div ref={topRef}></div>
      {messages.map(renderMessage)}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={imageURL}
              alt="image"
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-3">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageURL)}
            >
              <Download />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageContainer;

exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 20, userId } = req.query;  // Assuming you pass the userId for read/unread tracking

  try {
    // Get messages with pagination
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    // Reverse the order to get them from oldest to newest
    const reversedMessages = messages.reverse();

    // Mark messages as read (if the user hasn't already read them)
    await Message.updateMany(
      { conversationId, 'readBy': { $ne: userId } },
      { $push: { readBy: userId } }  // Assuming 'readBy' is an array of userIds
    );

    // Get unread message count for the conversation
    const unreadCount = await Message.countDocuments({
      conversationId,
      readBy: { $ne: userId }, // Messages not read by the user
    });

    res.status(200).json({ messages: reversedMessages, unreadCount });
  } catch (err) {
    console.error("Failed to get messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const registerChatEvents = (io, socket) => {
  // Join a specific conversation
  socket.on("joinConversation", ({ conversationId }) => {
    socket.join(conversationId);
  });

  // Sending a message
  socket.on("sendMessage", async (messageData) => {
    const { conversationId, senderId, senderModel, text, messageType, media } = messageData;

    // Create a new message object
    const newMessage = new Message({
      conversationId,
      senderId,
      senderModel,
      text,
      messageType,
      media,
    });

    // Save the new message
    await newMessage.save();

    // Update the conversation with the last message
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: newMessage._id });

    // Emit the message to the conversation participants
    io.to(conversationId).emit("receiveMessage", newMessage);
  });

  // Marking messages as read
  socket.on("markAsRead", async ({ conversationId, userId }) => {
    // Update the messages in the conversation to mark them as read by the user
    await Message.updateMany(
      { conversationId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );

    // Notify other users in the conversation that the messages have been read
    io.to(conversationId).emit("messagesRead", { userId });
  });

  
};

module.exports = registerChatEvents;
