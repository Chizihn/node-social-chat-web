import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { token } from "@/utils/session";
import { Attachment } from "@/types/message";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  typingUsers: Record<string, string[]>; // conversationId -> userId[]
  unreadNotificationCount: number;
  connectSocket: () => void;
  disconnectSocket: () => void;
  sendMessage: (
    recipientId: string,
    text: string,
    attachments?: Attachment[]
  ) => boolean;
  markAsRead: (conversationId: string, senderId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  sendTypingIndicator: (conversationId: string, recipientId: string) => void;
  sendStopTypingIndicator: (
    conversationId: string,
    recipientId: string
  ) => void;
}

const API_URL = "http://localhost:5000" as string;

export const useSocketStore = create<SocketState>((set, get) => {
  let socket: Socket | null = null;

  const connectSocket = () => {
    console.log("running socket");

    if (!token) {
      console.log("No token available for socket connection");
      return;
    }

    if (socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    if (!API_URL) {
      console.error(
        "API_URL is not configured. Please check your environment variables."
      );
      return;
    }

    console.log("Attempting to connect to socket at:", API_URL);

    socket = io(API_URL + "/", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      withCredentials: true,
    });

    // Authenticate user when socket connects
    socket.on("connect", () => {
      console.log("Socket connected successfully with ID:", socket?.id);

      // Send authentication token immediately after connection
      socket?.emit("authenticate", token);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      set({ isConnected: false });
    });

    socket.on("authenticated", (response) => {
      if (response.success) {
        console.log("Socket authenticated successfully");
        set({ isConnected: true });
      } else {
        console.error("Socket authentication failed:", response.message);
        set({ isConnected: false });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      set({ isConnected: false });
    });

    socket.on("user_status", ({ userId, status }) => {
      set((state) => {
        const newSet = new Set(state.onlineUsers);
        if (status === "online") {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return { onlineUsers: newSet };
      });
    });

    socket.on("notification_count", ({ count }) => {
      set({ unreadNotificationCount: count });
    });

    socket.on("new_message", (message) => {
      // Log the message for debugging
      console.log("New message received in socket store:", message);

      // The event will be handled by components that are listening for it
      // We don't need to do anything here as the chat page is listening for this event
    });

    socket.on("message_status", ({ messageId, status }) => {
      // Update message status in your message store
      console.log(`Message ${messageId} status: ${status}`);
    });

    socket.on("messages_read", ({ conversationId, readBy }) => {
      // Update read status in your message store
      console.log(
        `Messages in conversation ${conversationId} read by ${readBy}`
      );
    });

    socket.on("new_notification", (notification) => {
      // This event should be handled by your notification store/context
      // Example: notificationStore.addNotification(notification);
      console.log("New notification received:", notification);
      set((state) => ({
        unreadNotificationCount: state.unreadNotificationCount + 1,
      }));
    });

    socket.on("user_typing", ({ conversationId, userId }) => {
      set((state) => {
        const conversationTypers = state.typingUsers[conversationId] || [];
        if (!conversationTypers.includes(userId)) {
          return {
            typingUsers: {
              ...state.typingUsers,
              [conversationId]: [...conversationTypers, userId],
            },
          };
        }
        return state;
      });
    });

    socket.on("user_stop_typing", ({ conversationId, userId }) => {
      set((state) => {
        const conversationTypers = state.typingUsers[conversationId] || [];
        if (conversationTypers.includes(userId)) {
          return {
            typingUsers: {
              ...state.typingUsers,
              [conversationId]: conversationTypers.filter(
                (id) => id !== userId
              ),
            },
          };
        }
        return state;
      });
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    set({ socket });
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      set({
        socket: null,
        isConnected: false,
        onlineUsers: new Set(),
        typingUsers: {},
        unreadNotificationCount: 0,
      });
    }
  };

  const sendMessage = (
    recipientId: string,
    text: string,
    attachments: Attachment[] = []
  ) => {
    const currentSocket = get().socket;
    if (currentSocket && get().isConnected) {
      console.log("Sending message via socket to recipient:", recipientId);
      currentSocket.emit("send_message", {
        recipientId,
        text,
        attachments,
      });
      return true;
    } else {
      console.error("Cannot send message: Socket not connected");
      // Try to reconnect socket if not connected
      if (!get().isConnected) {
        console.log("Attempting to reconnect socket before sending message");
        connectSocket();
      }
      return false;
    }
  };

  const markAsRead = (conversationId: string, senderId: string) => {
    const currentSocket = get().socket;
    if (currentSocket && get().isConnected) {
      currentSocket.emit("mark_read", {
        conversationId,
        senderId,
      });
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    const currentSocket = get().socket;
    if (currentSocket && get().isConnected) {
      currentSocket.emit("mark_notification_read", {
        notificationId,
      });
    }
  };

  const markAllNotificationsAsRead = () => {
    const currentSocket = get().socket;
    if (currentSocket && get().isConnected) {
      currentSocket.emit("mark_all_notifications_read");
    }
  };

  const sendTypingIndicator = (conversationId: string, recipientId: string) => {
    const currentSocket = get().socket;
    if (currentSocket && get().isConnected) {
      currentSocket.emit("typing", {
        conversationId,
        recipientId,
      });
    }
  };

  const sendStopTypingIndicator = (
    conversationId: string,
    recipientId: string
  ) => {
    const currentSocket = get().socket;
    if (currentSocket && get().isConnected) {
      currentSocket.emit("stop_typing", {
        conversationId,
        recipientId,
      });
    }
  };

  return {
    socket: null,
    isConnected: false,
    onlineUsers: new Set(),
    typingUsers: {},
    unreadNotificationCount: 0,
    connectSocket,
    disconnectSocket,
    sendMessage,
    markAsRead,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    sendTypingIndicator,
    sendStopTypingIndicator,
  };
});
