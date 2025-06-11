const { io: Client } = require("socket.io-client");

const hostSocket = Client("http://localhost:7000", {
  transports: ["websocket"],
  reconnection: true,
});

hostSocket.on("connect", () => {
  console.log("[User-Server] Connected to Host-Server via socket bridge");
});

module.exports = hostSocket;
