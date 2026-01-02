const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (chatId) => {
    socket.join(chatId);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.chatId).emit("receiveMessage", data);
  });

  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("typing");
  });

  // Handle delivery ack
  socket.on("messageDelivered", ({ messageId, chatId }) => {
    socket.to(chatId).emit("messageDelivered", { messageId });
  });

  // Handle seen ack
  socket.on("messageSeen", ({ messageId, chatId }) => {
    socket.to(chatId).emit("messageSeen", { messageId });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Socket server running on port 5000");
});
