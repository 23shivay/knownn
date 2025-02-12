"use client";
import axios, { AxiosError } from "axios";
import { useToast } from "components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; 
import { useCallback, useState, useEffect, useRef } from "react";
import React from "react";
import { ApiResponse } from "types/ApiResponse";
import { ContentItem } from "../../../components/contentSuggestion/ContentCard";
import CountUp from "react-countup";
import { Button } from "components/ui/button";
import { MessageType } from "types/messageType";
import { v4 as uuidv4 } from "uuid";
import { useSocket } from "context/SocketContext";
import { formatDistanceToNow } from "date-fns";
import ReportMessage from "components/report/ReportMessages";
import Spinner from "components/overall/Spinner";
import EmojiPicker from "emoji-picker-react";
import { useInView } from 'react-intersection-observer';
import MiniSpinner from "components/overall/MiniSpinner";

type voteType = {
  contentId: string;
  type: "like" | "dislike";
  sessionId: string;
};

const particularGossipPage = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState<"like" | "dislike" | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<MessageType[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [particularContent, setParticularContent] = useState<ContentItem | null>(null);
  const { data: session } = useSession();
  const userid = session?.user?.sessionId;
  const [sessionId] = useState<string>(uuidv4());
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  
  const socket = useSocket();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { ref: loadMoreRef, inView } = useInView();

  const fetchingParticularContent = useCallback(async () => {
    try {
      const response = await axios.get(`/api/get-particulargossip/${params.id}`);
      const particularContent = response.data.data;
      setParticularContent(particularContent);
      setLikeCount(particularContent.likeCount);
      setDislikeCount(particularContent.dislikeCount);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to fetch content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [params.id, toast]);

  const fetchingSessionIdVoting = useCallback(async () => {
    try {
      const response = await axios.post(`/api/get-listofvoted/${params.id}`, { userId: userid });
      const sessionIdVoting = response.data.data;
      setVoteStatus(sessionIdVoting?.voteType ?? null);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to fetch voting",
        variant: "destructive",
      });
    }
  }, [params.id, toast, userid]);

  const fetchingOldComments = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    if ((!hasMore && !isInitial) || isLoadingMore) return;
    
    try {
      setIsLoadingMore(true);
      const response = await axios.get(`/api/get-gossipcomment/${params.id}?page=${pageNum}&limit=10`);
      const { data: contentComments, hasMore: hasMoreComments } = response.data;
      
      if (contentComments?.length > 0) {
        setComments(prev => {
          const newComments = isInitial ? contentComments : [...prev, ...contentComments];
          return newComments;
        });
        setHasMore(hasMoreComments);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Failed to fetch comments",
        variant: "destructive",
      });
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [params.id, toast, hasMore, isLoadingMore]);

  useEffect(() => {
    if (!socket) return;

    if (socket.connected) {
      socket.disconnect();
    }

    socket.auth = { room: params.id, isVoting: true };
    socket.connect();

    socket.on("message", (data: MessageType) => {
      setComments(prevMessages => {
        // Check if message already exists
        if (!prevMessages.some(msg => msg.id === data.id)) {
          // Always add new messages to the beginning of the array
          return [data, ...prevMessages];
        }
        return prevMessages;
      });
    });

    socket.on("vote", (data: voteType) => {
      if (data.contentId === params.id) {
        if (data.type === "like") {
          setLikeCount(prevCount => prevCount + 1);
        } else if (data.type === "dislike") {
          setDislikeCount(prevCount => prevCount + 1);
        }
      }
    });

    return () => {
      socket.off("message");
      socket.off("vote");
      socket.disconnect();
    };
  }, [socket, params.id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: MessageType = {
      id: uuidv4(),
      message: comment,
      createdAt: new Date().toISOString(),
      group_id: params.id,
      sender_session_id: sessionId,
    };
    
    socket?.emit("message", payload);
    setComment("");
    // Add new message to the beginning of the array
    setComments(prevMessages => [payload, ...prevMessages]);
  };

  const handleVote = (type: "like" | "dislike") => {
    if (voteStatus === type) return;
    const updatedStatus = type === "like" ? setLikeCount : setDislikeCount;
    setVoteStatus(type);
    updatedStatus((prevCount) => prevCount + 1);
    if (voteStatus && voteStatus !== type) {
      const oppositeCount = voteStatus === "like" ? setDislikeCount : setLikeCount;
      oppositeCount((prevCount) => Math.max(0, prevCount - 1));
    }
    socket?.emit("vote", {
      contentId: params.id,
      type,
      sessionId: userid,
    });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchingParticularContent(),
          fetchingSessionIdVoting(),
          fetchingOldComments(1, true),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (inView && !isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchingOldComments(nextPage, false);
    }
  }, [inView, isLoadingMore, hasMore, page, fetchingOldComments]);

  const handleEmojiSelect = (emoji: any) => {
    setComment((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <Spinner/>
    </div> 
  ) : ( 
    <div className="flex flex-col justify-center items-center h-[calc(100vh-6rem)] bg-black text-white overflow-auto pt-2">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-black shadow-lg h-auto lg:h-3/4 overflow-hidden border-b border-r border-gray-700">
        <div className="flex flex-col w-full lg:w-1/3 items-start justify-between space-y-6 h-full p-3 border border-gray-700 bg-black">
          <div className="flex flex-col space-y-4 w-full h-full">
            <div className="text-yellow-100 text-3xl font-semibold text-left">
              {particularContent?.contentName}
            </div>
            {particularContent?.description && (
              <div className={`${
                particularContent.description.split(' ').length > 120 
                  ? 'overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-track-black scrollbar-thumb-gray-700' 
                  : ''
              } text-white text-sm`}>
                {particularContent.description}
              </div>
            )}
          </div>

          <div className="flex flex-row justify-evenly items-center w-full pt-4 pb-4">
            <button
              onClick={() => handleVote('like')}
              className={`py-2 px-6 rounded-lg text-white font-semibold transition-all duration-300 ${
                voteStatus === 'like' ? 'bg-gradient-to-r from-pink-400 to-purple-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Like <CountUp start={Math.max(0, likeCount - 1)} end={likeCount} duration={0.5} />
            </button>
            <button
              onClick={() => handleVote('dislike')}
              className={`py-2 px-6 rounded-lg text-white font-semibold transition-all duration-300 ${
                voteStatus === 'dislike' ? 'bg-gradient-to-r from-pink-400 to-purple-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            > 
              Dislike <CountUp start={Math.max(0, dislikeCount - 1)} end={dislikeCount} duration={0.5} />
            </button>
          </div>
        </div>

        <div 
          ref={commentsContainerRef}
          className="flex-1 flex flex-col bg-black rounded-lg p-1 overflow-y-auto max-h-full scrollbar-thin scrollbar-track-black scrollbar-thumb-gray-700"
        >
          <div className="flex flex-col space-y-2">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="relative p-3 bg-black rounded-lg shadow-lg text-sm"
              >
                <div className="absolute top-2 right-2">
                  <ReportMessage
                    item={comment}
                    sessionId={sessionId}
                    contentType="GOSSIP_COMMENT"
                  />
                </div>
                <p className="text-base">{comment.message}</p>
                <span className="absolute right-2 bottom-2 text-xs text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt))}
                </span>
              </div>
            ))}
            
            {isLoadingMore && (
              <div className="flex justify-center p-4">
                <MiniSpinner />
              </div>
            )}
            
            <div ref={loadMoreRef} className="h-4" />
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl sticky bottom-0 flex items-center mt-4 bg-black"
      >
        <div className="relative">
          <button
            type="button"
            className="mr-2 py-2 px-4 rounded-lg bg-black text-white"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😀
          </button>
          {showEmojiPicker && (
            <div
              className="absolute z-50 bg-black rounded-lg p-2 shadow-lg"
              style={{
                bottom: "100%",
                left: "0",
              }}
            >
              <EmojiPicker
                className="bg-black text-white scrollbar-thin scrollbar-track-black scrollbar-thumb-black"
                onEmojiClick={handleEmojiSelect}
              />
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Type a message..."
          value={comment}
          className="flex-1 p-2 border border-gray-700 rounded-lg outline-none text-white bg-black focus:ring-2 focus:ring-purple-600"
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="submit"
          disabled={!comment.trim()}
          className={`ml-2 py-2 px-4 rounded-lg text-white ${
            comment.trim() ? 'bg-black' : 'bg-black cursor-not-allowed'
          }`}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default particularGossipPage;