"use client";

import { Button } from 'components/ui/button';
import { getSocket } from 'lib/socket.config';
import React, { useEffect, useMemo } from 'react';
import { v4 as uuidV4 } from "uuid";
import Chats from './Chats';
import { MessageType } from 'types/messageType';
import ChatNav from './ChatNav';


const ChatBase = ({groupId}:{groupId:string}) => {
   
    
    /* 
    const socket = useMemo(() => {
        const socket = getSocket();
        socket.auth={
            room:groupId
        }
       
        return socket.connect();
    }, []); // Ensure the socket is updated when groupId changes

    useEffect(() => {
        // Listen for incoming messages
        socket.on("message", (data: any) => {
            console.log("The socket message is:", data);
        });

        // Clean up the socket connection on component unmount or when groupId changes
        return () => {
            socket.close();
        };
    }, []); // Ensure cleanup when groupId changes

    // Handle the click event to send a message
    const handleClick = () => {
        console.log("clicking Button"+uuidV4());
        socket.emit("message", {
            name: "shivam",
            id: uuidV4(),
        });
    };
  */
    return (
        <div>
           
           
            
            {/* <Button onClick={handleClick}>Send Message</Button>*/ } 
             
        </div>
    );
};

export default ChatBase;
