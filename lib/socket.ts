// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initSocket = (token: string) => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("authenticate", token);
    });

    socket.on("authenticated", (data) => {
      if (data.success) {
        console.log("Authenticated!");
      } else {
        console.error("Authentication failed:", data.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized");
  return socket;
};
