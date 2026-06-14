// React tools
import { useEffect, useState } from "react";

// Socket context + shared instance
import { SocketContext } from "../context/SocketContext";
import { getSocket } from "../lib/socket";

// ---------------------------------------IMPORTS---------------------------------------

// Owns the single Socket.io connection for the whole app and exposes it.
export const SocketProvider = ({ children }) => {
    // Lazy initialiser runs once; getSocket() returns a shared singleton.
    const [socket] = useState(() => getSocket());
    const [connected, setConnected] = useState(socket.connected);

    useEffect(() => {
        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
};
