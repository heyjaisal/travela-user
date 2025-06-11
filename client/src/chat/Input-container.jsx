import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../socket/socket";
import { addMessage } from "../redux/slice/chat-slice";

export default function MessageInput({ currentUser }) {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector(state => state.chat);

  const handleSend = () => {
    if (!text.trim()) return;

    const receiver = selectedConversation.participants.find(p => p.participantId !== currentUser._id);

    const message = {
      conversationId: selectedConversation._id,
      sender: { id: currentUser._id, model: currentUser.role },
      receiver,
      text,
    };

    socket.emit("send-message", message);
    dispatch(addMessage({ ...message, createdAt: new Date().toISOString() }));
    setText("");
  };

  return (
    <div className="p-3 border-t flex">
      <input
        type="text"
        className="flex-1 border px-4 py-2 rounded"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSend} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
        Send
      </button>
    </div>
  );
}
