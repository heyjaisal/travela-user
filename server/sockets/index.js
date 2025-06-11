const setupRedisAdapter = require("./bridge");
const registerChatHandlers = require("./events");

async function setupSocketServer(io) {
  await setupRedisAdapter(io);

  io.on("connection", (socket) => {
    console.log("[Socket.IO] 🔌 Client connected:", socket.id);
    registerChatHandlers(io, socket);
  });
}

module.exports = setupSocketServer;
