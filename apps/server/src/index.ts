import express, { application, Application } from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import {createServer} from "http"
import { createAdapter } from "@socket.io/redis-streams-adapter";
import redis from "./config/redis.config";
import { setUpSocket } from "./socket";
import{instrument} from "@socket.io/admin-ui"
import { connectKafkaProducer } from "./config/kafka.config";
import { consumeMessages, consumeVoteMessages } from "./helper";
 

// Create an Express app
const app: Application = express();
const PORT = process.env.PORT || 8000;

// Create the HTTP server
const server = createServer(app);

// Initialize Socket.IO and attach to the HTTP server
const io = new Server(server, {
  cors: {
    origin: [`${process.env.SOCKET_CONNECT}`],
    credentials:true // Allow all origins (adjust for security if needed)
  },
 adapter:createAdapter(redis),
});

instrument(io, {
  auth: false,
  mode: "development",
});


// Set up Socket.IO events
setUpSocket(io);

connectKafkaProducer().catch((err)=>{
  console.log("Something Went wrong while connecting kafka")
})

consumeMessages("chats").catch((err)=>{
  console.log("consumer error is ",err)
})

consumeVoteMessages("votes").catch((err)=>{
  console.log("issue in cumsuming votes")
})



// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});