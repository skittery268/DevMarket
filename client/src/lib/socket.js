import { io } from "socket.io-client";

// The REST base URL includes the "/api/v1" suffix. Socket.io must connect to the
// bare server origin, so we strip the API path before opening the connection.
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000/api/v1";

export const SOCKET_ORIGIN = SERVER_URL.replace(/\/api\/v1\/?$/, "");

// Single shared socket instance. Created lazily and reused across the app.
let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_ORIGIN, {
      withCredentials: true,
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};
