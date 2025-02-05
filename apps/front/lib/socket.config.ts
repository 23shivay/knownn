import { io, Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io("http://localhost:8000", { autoConnect: false });
    }
    return socket;
};


// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// export const getSocket = (): Socket => {
//     if (!socket) {
//         socket = io("http://localhost:8000", { autoConnect: false });
//     }
//     return socket;
// };

// export const connectToRoom = (room: string, isVoting: boolean = false) => {
//     const socket = getSocket();
//     if (socket.connected) {
//         // Leave any previous room
//         socket.emit("leaveRoom");
//     }
//     socket.auth = { room, isVoting };
//     socket.connect();
// };
  