'use client';

import { TypewriterEffect } from 'components/ui/typewriter-effect';
import Image from 'next/image';
import React from 'react';

const Page = () => {
  return (
    <div className="w-full  h-[calc(100vh-6rem)] flex flex-col justify-center items-center bg-black">
      {/* Logo Image */}
      <Image src="/home.svg" width={800} height={800} alt="home logo" className="drop-shadow-lg" />
      
      {/* Animated Text */}
      <TypewriterEffect
        words={[
          { text: "Knownn", className: "text-blue-500 font-bold" }, // "Knownn" in blue
          { text: "–", className: "text-white" }, // Dash
          { text: "Drop Thoughts,", className: "text-white" },
          { text: "Not Names!", className: "text-red-500 font-bold" }, // "Not Names!" in red
        ]}
        className="text-white text-4xl md:text-6xl text-center mt-6 tracking-wide"
        cursorClassName="bg-white h-6 w-[3px]" // Visible cursor
      />
    </div>
  );
};

export default Page;
