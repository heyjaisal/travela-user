import ConversationList from "./Converstion-list";
import MessageWindow from "./Message-container";
import MessageInput from "./Input-container";
import useChatSocket from "../socket/useChatsocket";
import { useSelector } from "react-redux";

export default function ChatLayout({ currentUser }) {
  const selectedConversationId = useSelector(state => state.chat.selectedConversation?._id);

  useChatSocket(currentUser, selectedConversationId);

  return (
    <div className="flex h-screen">
      <ConversationList />
      <div className="flex-1 flex flex-col">
        <MessageWindow currentUser={currentUser} />
        <MessageInput currentUser={currentUser} />
      </div>
    </div>
  );
}
