import { useSelector } from "react-redux";
import ChatLayout from "../chat/index";

export default function ChatPage() {
  const userInfo = useSelector(state => state.auth.userInfo);

  if (!userInfo) return <div>Loading user info...</div>;

  const currentUser = {
    _id: userInfo.id || userInfo._id,
    role: userInfo.role || "User",
    name: userInfo.name || "Unnamed",
  };

  return <ChatLayout currentUser={currentUser} />;
}
