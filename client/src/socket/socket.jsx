import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect_error", (err) => console.error("Socket connect error:", err));
socket.on("disconnect", () => console.log("Socket disconnected"));
socket.on("reconnect", () => console.log("Socket reconnected"));

export default socket;
