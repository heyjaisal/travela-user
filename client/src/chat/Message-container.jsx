import { useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector, useDispatch } from "react-redux";
import MessageItem from "./message-bubble";
import axiosInstance from "@/utils/axios-instance";
import {
  initializeConversationMessages,
  prependMessages,
  setHasMore,
} from "../redux/slice/chat-slice";
import { ScaleLoader } from "react-spinners";

export default function MessageWindow({ currentUser }) {
  const dispatch = useDispatch();
  const { selectedConversation, messagesByConversation } = useSelector(state => state.chat);

  const convId = selectedConversation?._id;
  const msgData = messagesByConversation[convId];
  const messages = msgData?.messages || [];
  const hasMore = msgData?.hasMore ?? true;
  const page = msgData?.page || 1;

  const isLoading = useRef(false);

  const fetchMessages = async () => {
    if (!convId || isLoading.current || !hasMore) return;
    isLoading.current = true;

    try {
      const res = await axiosInstance.get(`/chat/messages/${convId}`, { params: { page } });
      if (res.data.length === 0) {
        dispatch(setHasMore({ conversationId: convId, hasMore: false }));
      } else {
        dispatch(prependMessages({ conversationId: convId, messages: res.data }));
      }
    } catch {
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    if (!convId) return;
    dispatch(initializeConversationMessages({ conversationId: convId }));
    fetchMessages();
  }, [convId]);

  if (!selectedConversation) return <div className="flex-1 p-4">Select a conversation</div>;

  return (
    <div id="scrollableDiv" className="flex-1 flex flex-col-reverse overflow-y-auto p-4">
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchMessages}
        hasMore={hasMore}
        inverse={true}
        scrollableTarget="scrollableDiv"
        loader={<div className="flex justify-center py-2"><ScaleLoader color="#C0C2C9" height={20} /></div>}
        endMessage={<div className="text-center text-gray-500 py-2 text-sm">No more messages</div>}
      >
        {messages.map(msg => (
          <MessageItem key={msg._id || msg.createdAt} message={msg} currentUserId={currentUser._id} />
        ))}
      </InfiniteScroll>
    </div>  );
}
