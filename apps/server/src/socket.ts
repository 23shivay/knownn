import { Server, Socket } from "socket.io";
import db from "@repo/db/client";
import { produceMessage } from "./helper";

interface CustomSocket extends Socket {
  room?: string | any;
}

export function setUpSocket(io: Server) {
  
  // Middleware to validate room on connection (for chatrooms)
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;

    // Allow bypassing the room check for voting-only pages
    if (!room && socket.handshake.auth.isVoting) {
      next(); // Proceed if this is a voting-only page
      return;
    }

    if (!room) {
      return next(new Error("Invalid room, please pass the correct room"));
    }

    socket.room = room;
    next();
  });

  // Listen for a new connection
  io.on("connection", (socket: CustomSocket) => {
    // Join the room if it exists (for chatroom-based features)
    if (socket.room) {
      socket.join(socket.room);
      console.log(`User ${socket.id} joined room ${socket.room}`);
    }

  //   socket.on("leaveRoom", () => {
  //     if (socket.room) {
  //         socket.leave(socket.room);
  //         console.log(`User ${socket.id} left room ${socket.room}`);
  //     }
  // });

  // socket.on("disconnect", () => {
  //     if (socket.room) {
  //         console.log(`User ${socket.id} disconnected from room ${socket.room}`);
  //     }
  // });

  // if (socket.room) {
  //     socket.join(socket.room);
  //     console.log(`User ${socket.id} joined room ${socket.room}`);
  // }
    
    // Chatroom message handling
socket.on("message", async (data) => {
  try {
    console.log("Server received the message:", data);
    
    // Validate the incoming message data
    if (!data || !data.group_id) {
      console.error("Invalid message data received");
      return;
    }

    /*// Ensure the chat room exists before sending messages
    const roomExists = await db.chatRoom.findUnique({
      where: { name: data.group_id },
    });

    if (!roomExists) {
      console.log(`Chat room ${data.group_id} does not exist`);
      return;
    }*/

    // Handle chatroom messages

    await produceMessage("chats", data);
      //socket.to(socket.room).emit("message", data);
      socket.broadcast.to(socket.room).emit("message", data);

  /*  if (socket.room.includes("%20")) {
      await produceMessage("chats", data);
      socket.to(socket.room).emit("message", data);
    } else {
      // Handle content suggestion comments (non-chatroom)
      const suggestedContent = await db.contentSuggestion.findUnique({
        where: { id: data.group_id },
      });
      if (!suggestedContent) {
        console.log("Suggested content does not exist");
        return;
      }

      await produceMessage("chats", data);
      socket.to(socket.room).emit("message", data);
    }*/
  } catch (error) {
    console.error("Error handling message:", error);
  }
});


    
    // Voting feature (does not require rooms)
    socket.on("vote", async (data) => {
      const { contentId,type,sessionId} = data;
    
      // Log the received vote type
      console.log("data coming in server socket",data)
      console.log("Received vote type:", type);
      
    
      if (type !== "like" && type !== "dislike") {
        console.error("Invalid vote type received:", type);
        return; // If the vote type is invalid, stop processing
      }
    
      try {
       /* // Proceed with vote processing
        const content = await db.contentSuggestion.findUnique({
          where: { id: contentId },
        });
    
        if (!content) {
          console.log("Content not found");
          return;
        }*/
    
        // Emit the vote to all clients
        socket.broadcast.emit("vote", {
          contentId,
          type,
          sessionId
        });
        await produceMessage("votes", data);
        console.log("vote data inserted in kafka")
      } catch (error) {
        console.error("Error handling vote:", error);
      }
    });
    
    
    
    
    
    // Disconnect event
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
}
