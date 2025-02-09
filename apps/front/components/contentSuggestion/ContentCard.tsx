"use client";

import ReportPost from 'components/report/ReportPost';
import { Button } from 'components/ui/button';
import { useSocket } from 'context/SocketContext';
import { getSocket } from 'lib/socket.config';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import CountUp from 'react-countup';

export interface ContentItem {
  id: string;
  contentType: string;
  genre: string;
  contentName: string;
  platform: string;
  language: string;
  createdAt: string;
  description: string;
  likeCount: number | any;
  dislikeCount: number | any;
  status:string
}

export interface VoteItem {
  id: number;
  contentId: string;
  voteType: "like" | "dislike";
  sessionId: string;
}

interface ContentCardProps {
  content: ContentItem[];
  sessionIdVotes: VoteItem[]; // New prop
}

const ContentCard: React.FC<ContentCardProps> = ({ content, sessionIdVotes }) => {
  const { data: session } = useSession();
  const userid = session?.user?.sessionId;

 /* // Setting up socket connection  socket.config wala code we are using in this
  const socket = useMemo(() => {
    const socketInstance = getSocket();
    socketInstance.auth = { isVoting: true };
    return socketInstance.connect();
  }, [content]);
*/
//using socket context methode
const socket = useSocket();

useEffect(() => {
    if (socket) {
        socket.auth = { isVoting: true };
        socket.connect();
    }
}, [socket, content]);  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-6">
  {content.map((item) => (
    item.status === "active" ? (
      <Card 
        key={item.id} 
        item={item} 
        socket={socket} 
        sessionId={userid} 
        sessionIdVotes={sessionIdVotes} 
      />
    ) : null
  ))}
</div>

    </>
  );
};

interface CardProps {
  item: ContentItem;
  socket: any;
  sessionId: string | undefined;
  sessionIdVotes: VoteItem[]; // New prop
}



const Card = ({ item, socket, sessionId, sessionIdVotes }: CardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [voteStatus, setVoteStatus] = useState<"like" | "dislike" | null>(null);
  const [likeCount, setLikeCount] = useState(item.likeCount);
  const [dislikeCount, setDislikeCount] = useState(item.dislikeCount);
  

  // Check if the user has already voted for this content
  useEffect(() => {
    const previousVote = sessionIdVotes.find(vote => vote.contentId === item.id && vote.sessionId === sessionId);
    if (previousVote) {
      setVoteStatus(previousVote.voteType); // Highlight the previous vote
    }
  }, [sessionIdVotes, item.id, sessionId]);

  // Toggle description expansion
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  // Voting functionality with socket emission
  const handleLike = () => {
    if (voteStatus === "like") return; // Prevent multiple likes

    setVoteStatus("like");
    setLikeCount((prevLikeCount: number) => prevLikeCount + 1);

    // Reduce dislike count if user had previously disliked
    if (voteStatus === "dislike" && dislikeCount > 0) {
      setDislikeCount((prevDislikeCount: number) => prevDislikeCount - 1);
    }

    // Emit the like vote through the socket
    const votePayload = {
      contentId: item.id,
      type: "like",
      sessionId: sessionId, // Send sessionId to prevent multiple voting
    };

    socket.emit("vote", votePayload);
  };

  const handleDislike = () => {
    if (voteStatus === "dislike") return; // Prevent multiple dislikes

    setVoteStatus("dislike");
    setDislikeCount((prevDislikeCount: number) => prevDislikeCount + 1);

    // Reduce like count if user had previously liked
    if (voteStatus === "like" && likeCount > 0) {
      setLikeCount((prevLikeCount: number) => prevLikeCount - 1);
    }

    // Emit the dislike vote through the socket
    const votePayload = {
      contentId: item.id,
      type: "dislike",
      sessionId: sessionId, // Send sessionId to prevent multiple voting
    };

    socket.emit("vote", votePayload);
  };

  // Listening for incoming vote updates
  useEffect(() => {
    socket.on("vote", (data: { contentId: string; type: "like" | "dislike" }) => {
      if (data.contentId === item.id) {
        if (data.type === "like") {
          setLikeCount((prevCount: number) => prevCount + 1);
        } else if (data.type === "dislike") {
          setDislikeCount((prevCount: number) => prevCount + 1);
        }
      }
    });

    return () => {
      socket.off("vote");
    };
  }, [socket, item.id]);

  const descriptionToShow = isExpanded ? item.description : item.description.slice(0, 100);

  return (
    <div className="border border-gray-700 rounded-lg pt-3 pr-3 pl-3 pb-3 text-white hover:shadow-2xl hover:shadow-gray-700 transition-shadow duration-300 flex flex-col justify-between">
      {/* Conditionally render ReportPost based on isReported */}
      <div className="flex justify-end"> 
        
          <ReportPost
            item={item}
            sessionId={sessionId}
            contentType='CONTENT_SUGGESTION'
            
          />
        
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {item.contentName}
        </h3>

        <p className="text-sm mb-3 leading-relaxed">
          {descriptionToShow}
          {item.description.length > 100 && (
            <button onClick={toggleDescription} className="text-blue-600 ml-1 underline hover:text-blue-800">
              {isExpanded ? 'Show Less' : 'More'}
            </button>
          )}
        </p>

        <div className="text-sm mb-2">
          <span className="font-medium">Type: </span>{item.contentType}
        </div>

        <div className="text-sm mb-2">
          <span className="font-medium">Genre: </span>{item.genre}
        </div>

        {item.platform && (
          <div className="text-sm mb-2">
            <span className="font-medium">Platform: </span>{item.platform}
          </div>
        )}

        {item.language && (
          <div className="text-sm mb-2">
            <span className="font-medium">Language: </span>{item.language}
          </div>
        )}
      </div>

      <div className="flex flex-row justify-evenly items-center mt-4">
        <Button onClick={handleLike} className={voteStatus === "like" ? "bg-gradient-to-r from-pink-400 to-purple-600" : ""}>
          Like
          <CountUp className='px-1' start={Math.max(0, likeCount - 1)} end={likeCount} duration={0.5} />
        </Button>
        <Button onClick={handleDislike} className={voteStatus === "dislike" ? "bg-gradient-to-r from-pink-400 to-purple-600" : ""}>
          Dislike
          <CountUp className='px-1' start={Math.max(0, dislikeCount - 1)} end={dislikeCount} duration={0.5} />
        </Button>

        <Link href={`/contentsuggestion/${item.id}`}>
          <Button>Comments</Button>
        </Link>
      </div>

      <div className="flex justify-end mt-5">
        <div className="text-sm">
          {new Date(item.createdAt).getDate().toString().padStart(2, '0')}/
          {(new Date(item.createdAt).getMonth() + 1).toString().padStart(2, '0')}/
          {new Date(item.createdAt).getFullYear()}
        </div>
      </div>
    </div>
  );
};



export default ContentCard;
