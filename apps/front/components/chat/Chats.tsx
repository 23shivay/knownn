
// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { MessageType } from "types/messageType";
// import ChatNav from "./ChatNav";
// import { useSocket } from "context/SocketContext";
// import ReportMessage from "components/report/ReportMessages";
// import { format } from "date-fns";
// import EmojiPicker from "emoji-picker-react"; // Import Emoji Picker

// export interface MessageItem {
//   id: string;
//   message: string;
//   group_id: string;
//   sender_session_id?: string;
//   createdAt: string;
// }

// export default function Chats({
//   groupId,
//   oldMessages,
// }: {
//   groupId: string;
//   oldMessages: Array<MessageType>;
// }) {  
//   const socket = useSocket();
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState<Array<MessageType>>(oldMessages || []);
//   const [sessionId] = useState<string>(uuidv4());
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Emoji Picker state
//   const roomName = groupId.split("%20")[0];

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     if (!socket) return;
//     socket.auth = { room: groupId, isVoting: true };
//     socket.connect();

//     socket.on("message", (data: MessageType) => {
//       setMessages((prevMessages) => [...prevMessages, data]);
//       scrollToBottom();
//     });

//     return () => {
//       socket.emit("leaveRoom", groupId);
//       socket.off("message");
//     };
//   }, [socket, groupId]);

//   useEffect(() => {
//     if (oldMessages.length > 0) {
//       setMessages(oldMessages);
//       scrollToBottom();
//     }
//   }, [oldMessages]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     const payload: MessageType = {
//       id: uuidv4(),
//       message: message,
//       createdAt: new Date().toISOString(),
//       group_id: groupId,
//       sender_session_id: sessionId,
//     };

//     socket?.emit("message", payload);
//     setMessage("");
//     setMessages((prevMessages) => [...prevMessages, payload]);
//     scrollToBottom();
//   };

//   const handleEmojiSelect = (emoji: any) => {
//     setMessage((prev) => prev + emoji.emoji); // Add selected emoji to message
//     setShowEmojiPicker(false); // Close emoji picker after selection
//   };

//   return (
//     <div className="flex flex-col h-[calc(100vh-6rem)] justify-evenly mt-2 overflow-auto">
//       <ChatNav roomName={roomName} />

//       <div className="flex-1 overflow-y-auto flex flex-col-reverse scrollbar-rounded scrollbar-thin scrollbar-track-black scrollbar-thumb-gray-700">
//         <div ref={messagesEndRef} />
//         <div className="flex flex-col gap-4">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`relative border-e-2 flex max-w-lg rounded-lg p-1 shadow-md space-x-4 ${
//                 msg.sender_session_id === sessionId
//                   ? "bg-gray-400 text-black self-end"
//                   : "bg-gradient-to-r from-gray-200 to-gray-300 text-black self-start"
//               }`}
//             >
//               <p className="break-words space-y-3 flex items-center justify-center text-sm text-left pl-2 flex-1">
//                 {msg.message}
//               </p>
//               <div className="flex flex-col items-end space-y-1">
//                 <div className="text-xs">
//                   <ReportMessage item={msg} sessionId={sessionId} contentType="CHAT" />
//                 </div>
//                 <span className="text-[10px] text-black">
//                   {format(new Date(msg.createdAt), "HH:mm")}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="w-full mt-8 flex relative">
//         <button
//           type="button"
//           className="mr-2 py-2 px-4 rounded-lg bg-black text-white"
//           onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//         >
//           😀
//         </button>
//         {showEmojiPicker && (
//           <div className="absolute bottom-12 left-0 z-50">
//             <EmojiPicker onEmojiClick={handleEmojiSelect} />
//           </div>
//         )}
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={message}
//           className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-600 bg-black text-white border-slate-700"
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button
//           type="submit"
//           disabled={!message.trim()}
//           className={`ml-2 py-2 px-4 rounded-lg text-white ${
//             message.trim() ? "bg-black" : "bg-black cursor-not-allowed"
//           }`}
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }
  

 
// components/chat/Chats.tsx
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { MessageType } from "types/messageType";
import ChatNav from "./ChatNav";
import { useSocket } from "context/SocketContext";
import ReportMessage from "components/report/ReportMessages";
import { format } from "date-fns";
import EmojiPicker from "emoji-picker-react";
import axios, { AxiosError } from "axios";
import { useToast } from "components/ui/use-toast";
import Spinner from "components/overall/Spinner";
import MiniSpinner from "components/overall/MiniSpinner";
import { useInView } from 'react-intersection-observer';
import { ApiResponse } from "types/ApiResponse";

export default function Chats({ groupId }: { groupId: string }) {
  const socket = useSocket();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const [sessionId] = useState<string>(uuidv4());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const roomName = groupId.split("%20")[0];
  const { ref: loadMoreRef, inView } = useInView();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);
  const previousHeightRef = useRef<number>(0);
  const shouldScrollRef = useRef(true);

  
  // Function to check if user is near bottom
  const isNearBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const threshold = 100; // pixels from bottom
      return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    }
    return false;
  }, []);

  // Updated scroll to bottom function
  const scrollToBottom = useCallback((immediate: boolean = false) => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: immediate ? 'auto' : 'smooth'
      });
    }
  }, []);

  // Handle scroll events
  useEffect(() => {
    const container = messagesContainerRef.current;
    const handleScroll = () => {
      shouldScrollRef.current = isNearBottom();
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [isNearBottom]);


  // New useEffect specifically for initial scroll
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      // Use immediate scroll for initial load
      scrollToBottom(true);
    }
  }, [isLoading, messages, scrollToBottom]);

  // Preserve scroll position when loading older messages
  const preserveScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const newHeight = messagesContainerRef.current.scrollHeight;
      const scrollDiff = newHeight - previousHeightRef.current;
      messagesContainerRef.current.scrollTop = scrollDiff;
      previousHeightRef.current = newHeight;
    }
  }, []);

  const fetchMessages = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    if ((!hasMore && !isInitial) || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      
      if (messagesContainerRef.current) {
        previousHeightRef.current = messagesContainerRef.current.scrollHeight;
      }

      const response = await axios.get(`/api/get-chatroommessages/${groupId}?page=${pageNum}&limit=10`);
      const { data: chatMessages, hasMore: hasMoreMessages } = response.data;
      
      if (chatMessages?.length > 0) {
        setMessages(prev => {
          if (isInitial) {
            return chatMessages;
          }
          return [...chatMessages, ...prev];
        });
        setHasMore(hasMoreMessages);
        
        if (isInitial) {
          // Remove the setTimeout here as we handle initial scroll in the useEffect
          // The useEffect will trigger after messages are set and loading is false
          return;
        } else {
          setTimeout(preserveScroll, 0);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to fetch messages",
        variant: "destructive",
      });
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
      if (isInitial) {
        setIsLoading(false);
      }
    }
  }, [groupId, toast, hasMore, isLoadingMore, preserveScroll]);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      if (isInitialLoadRef.current) {
        await fetchMessages(1, true);
        isInitialLoadRef.current = false;
      }
    };
    fetchInitialData();
  }, [fetchMessages]);

  // Infinite scroll for older messages
  useEffect(() => {
    if (inView && !isLoadingMore && hasMore && !isInitialLoadRef.current) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage, false);
    }
  }, [inView, isLoadingMore, hasMore, page, fetchMessages]);

  // Socket connection and message handling
  useEffect(() => {
    if (!socket) return;

    if (socket.connected) {
      socket.disconnect();
    }

    socket.auth = { room: groupId, isVoting: true };
    socket.connect();

    socket.on("message", (data: MessageType) => {
      setMessages(prevMessages => {
        if (!prevMessages.some(msg => msg.id === data.id)) {
          return [...prevMessages, data];
        }
        return prevMessages;
      });
      // Only auto-scroll if user was already near bottom or if it's their own message
      if (shouldScrollRef.current || data.sender_session_id === sessionId) {
        setTimeout(scrollToBottom, 100);
      }
    });

    return () => {
      socket.off("message");
      socket.disconnect();
    };
  }, [socket, groupId, sessionId, scrollToBottom]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    
    shouldScrollRef.current = true; // Ensure scroll happens for sender
    const payload: MessageType = {
      id: uuidv4(),
      message: message,
      createdAt: new Date().toISOString(),
      group_id: groupId,
      sender_session_id: sessionId,
    };

    socket?.emit("message", payload);
    setMessage("");
    setMessages(prevMessages => [...prevMessages, payload]);
    setTimeout(scrollToBottom, 0);
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] justify-evenly mt-2 overflow-auto">
      <ChatNav roomName={roomName} />

      <div 
        ref={messagesContainerRef}
        className="flex-1  flex flex-col-reverse overflow-y-auto scrollbar-rounded scrollbar-thin scrollbar-track-black scrollbar-thumb-gray-700 p-2"
      >
        <div className="flex flex-col space-y-4">
          {/* Loading spinner at top */}
          {isLoadingMore && (
            <div className="flex justify-center p-4">
              <MiniSpinner />
            </div>
          )}
          <div ref={loadMoreRef} className="h-4" />
          
          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`relative border-e-2 flex max-w-lg rounded-lg p-1 shadow-md space-x-4 pr-2 ${
                msg.sender_session_id === sessionId
                  ? "bg-gradient-to-l from-gray-200 to-gray-300 text-black self-end"
                  : "bg-gradient-to-l from-gray-200 to-gray-300 text-black self-start"
              }`}
            >
              <p className="break-words space-y-3 flex items-center justify-center text-sm text-left pl-2 flex-1">
                {msg.message}
              </p>
              <div className="flex flex-col items-end space-y-1">
                <div className="text-xs">
                  <ReportMessage item={msg} sessionId={sessionId} contentType="CHAT" />
                </div>
                <span className="text-[10px] text-black">
                  {format(new Date(msg.createdAt), "HH:mm")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="w-full mt-8 flex relative">
        <button
          type="button"
          className="mr-2 py-2 px-4 rounded-lg bg-black text-white"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😀
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-50">
            <EmojiPicker onEmojiClick={handleEmojiSelect} />
          </div>
        )}
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-600 bg-black text-white border-slate-700"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className={`ml-2 py-2 px-4 rounded-lg text-white ${
            message.trim() ? "bg-black" : "bg-black cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
}