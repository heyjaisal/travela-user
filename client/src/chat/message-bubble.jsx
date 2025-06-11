export default function MessageItem({ message, currentUserId }) {
  const isMine = message.sender.id === currentUserId;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} my-2`}>
      <div className={`px-3 py-2 rounded-lg max-w-xs ${isMine ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
        {message.text}
      </div>
    </div>
  );
}
