import { Server } from "socket.io";

let onlineUsers = [];

const io = new Server({
  cors: {
    origin: "http://localhost:3002",
  },
});

const addUser = (userEmail, chatRoom, socketId) => {
  const existingUser = onlineUsers.find((user) => user.userEmail === userEmail);
  if (!existingUser) {
    onlineUsers.push({ userEmail, chatRoom, socketId });
    return;
  }
};

io.on("connection", (socket) => {
  // console.log(`somebody has connected with ID :${socket.id}`);
  socket.on("newUserJoining", (payload) => {
    socket.join(payload.chatRoom);
    addUser(payload.userEmail, payload.chatRoom, socket.id);
    io.to(payload.chatRoom).emit("onlineUsers", onlineUsers);
  });

  socket.on("newMessage", (payload) => {
    io.to(payload.chatRoom).emit("allMessages", {
      senderEmail: payload.senderEmail,
      userMessage: payload.userMessage,
    });
  });

  socket.on("disconnect", () => {
    const user = onlineUsers.find((user) => user.socketId === socket.id);
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    if (user) {
      io.to(user.chatRoom).emit("onlineUsers", onlineUsers);
      io.to(user.chatRoom).emit("allMessages", {senderEmail: user.userEmail, userMessage : `${user.userEmail} left from the chat`, leftChat : true})
    }
  });
});

io.listen(3010);
