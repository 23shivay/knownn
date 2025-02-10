"use client"
import React, { createContext, useContext, useMemo, ReactNode, useEffect } from "react";
import { io, Socket } from "socket.io-client";

// Define the type for the socket context (nullable to handle initial state)
const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    // Memoize the socket instance so it’s created only once
    const socket = useMemo(() => {
        const socketInstance: Socket = io('https://knownn.onrender.com', {
            autoConnect: true, // Ensures connection is established immediately
        });
        return socketInstance;
    }, []);

    // Use an effect to handle socket cleanup on unmount (optional but recommended)
    useEffect(() => {
        return () => {
            socket.disconnect(); // Clean up socket on unmount
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook to use the socket in any component
export const useSocket = (): Socket | null => useContext(SocketContext); 