import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://your-frontend.vercel.app"
      ],
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected: " + socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

export const getSocketIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};