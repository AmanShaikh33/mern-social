import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { UserData } from "./UserContext";

const SocketContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://mern-social-91de.onrender.com";

export const SocketContextProvider = ({ children }) => {
  const { user } = UserData();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user?._id && !socketRef.current) {
      socketRef.current = io(BACKEND_URL, {
        query: {
          userId: user._id,
        },
        withCredentials: true,
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Socket connected:", socketRef.current.id);
      });

      socketRef.current.on("getOnlineUser", (users) => {
        setOnlineUsers(users);
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const SocketData = () => useContext(SocketContext);