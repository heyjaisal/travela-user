import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConversations, selectConversation } from "../redux/slice/chat-slice";
import axiosInstance from "@/utils/axios-instance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ConversationList() {
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector(state => state.chat);
  const currentUser = useSelector(state => state.auth.userInfo);

  useEffect(() => {
    axiosInstance.get("/chat/conversations")
      .then(res => dispatch(setConversations(res.data)))
      .catch(() => {});
  }, [dispatch]);

  const getOther = (participants) =>
    participants.find(p => p.participantId !== currentUser.id);

  return (
    <div className="w-1/3 border-r border-gray-300 h-full overflow-y-auto bg-white">
      <div className="p-4 border-b font-bold text-lg">Conversations</div>
      {conversations.length === 0 ? (
        <p className="p-4 text-gray-500 text-sm">No conversations yet.</p>
      ) : conversations.map(conv => {
        const other = getOther(conv.participants);
        const selected = selectedConversation?._id === conv._id;
        const initials = other?.name?.split(" ").map(p => p[0]).join("").toUpperCase();

        return (
          <div
            key={conv._id}
            onClick={() => dispatch(selectConversation(conv))}
            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 ${selected ? "bg-gray-200" : ""}`}
          >
            <Avatar>
              <AvatarImage src={other?.avatar} alt={other?.name} />
              <AvatarFallback>{initials || "??"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium truncate">{other?.name}</p>
              <p className="text-sm text-gray-500 truncate">{conv.lastMessage || "No messages yet"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
