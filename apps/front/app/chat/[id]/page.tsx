// "use client";
// import axios, { AxiosError } from "axios";
// import Chats from "components/chat/Chats";
// import Spinner from "components/overall/Spinner";
// import { useToast } from "components/ui/use-toast";
// import React, { useCallback, useEffect, useState } from "react";
// import { ApiResponse } from "types/ApiResponse";
// import { MessageType } from "types/messageType";

// const Page = ({ params }: { params: { id: string } }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();
//   const [oldMessages, setOldMessages] = useState<Array<MessageType>>([]);
     
//   // Fetching chats from API
//   const fetchingChatRoomMessages = useCallback(async () => {
    
//     try {
//       const response = await axios.get(`/api/get-chatroommessages/${params.id}`);
//       const chatRoomMessages: Array<MessageType> | [] = response.data.data;
//       console.log("this is an response console",chatRoomMessages)
      
      
//        // Set oldMessages state with the fetched data
//        setOldMessages(chatRoomMessages)
//        console.log("chatroom messages",oldMessages)
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast({
//         title: "Error",
//         description:
//           axiosError.response?.data.message ?? "Failed to fetch content",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [params.id, toast]);

//     useEffect(() => {
//       const fetchData = async () => {
//         setIsLoading(true); // Start loading
//         await Promise.all([
//           fetchingChatRoomMessages()
//         ]);
//         setIsLoading(false); // End loading
//       };
//       fetchData();
//     }, [fetchingChatRoomMessages]);
    

//   return isLoading?(
//     <div className="flex justify-center items-center h-screen">
//       <Spinner/> {/* Loader is displayed while loading */}
//     </div>
//   ): (
//     <div>
//       <Chats groupId={params.id} oldMessages={oldMessages} />
//     </div>
//   );
// };

// export default Page;



"use client";
import Chats from "components/chat/Chats";

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="">
      <Chats groupId={params.id} />
    </div>
  );
};

export default Page;