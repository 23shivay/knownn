import React from "react";


export default function ChatNav({roomName}:{roomName:string|any}) {
  return (
    <nav className="w-full flex justify-between items-center  px-6 text-center flex-col mb-1  ">
      <div className="flex space-x-4 md:space-x-0 items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text">
          {roomName}
        </h1>
        {/* <p>{new Date(chatGroup.created_at).toDateString()}</p> */}
      </div>
      
    </nav>
  );
}