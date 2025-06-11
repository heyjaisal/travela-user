import { useEffect } from "react";
import { useDispatch } from "react-redux";
import socket from "./socket";
import { addMessage } from "../redux/slice/chat-slice";

export default function useChatSocket(currentUser, selectedConversationId) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentUser?._id) return;
    socket.emit("join", { userId: currentUser._id });
  }, [currentUser]);

  useEffect(() => {
    const handleMessage = (message) => {
      if (message.conversationId === selectedConversationId) {
        dispatch(addMessage(message));
      }
    };

    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, [selectedConversationId, dispatch]);

  useEffect(() => {
    if (!selectedConversationId) return;
    socket.emit("join-conversation", selectedConversationId);
  }, [selectedConversationId]);
} 