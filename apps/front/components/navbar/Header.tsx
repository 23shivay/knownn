'use client';

import React, { useEffect } from 'react';

import Link from 'next/link';
import { useRouter, useSelectedLayoutSegment } from 'next/navigation';

import useScroll from 'hooks/use-scroll';
import { cn } from 'lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from 'components/ui/button';

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const {data:session}=useSession()
  const router=useRouter()
  const user:User=session?.user
  
 

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full bg-black transition-all border-b border-gray-700`,
        {
          'border-b border-gray-700 g-black backdrop-blur-lg': scrolled,
          'border-b border-gray-700 g-black': selectedLayout,
        },
      )}
    >
      <div className="flex h-[50px]  items-center justify-between px-4">
        <div className="flex items-center space-x-4"> 
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
             {/* <span className="h-7 w-7 bg-zinc-300 rounded-lg" />*/ }
           
            <span className="font-bold text-xl flex bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text ">Knownn</span>
          </Link>
        </div>

        <div className="hidden md:block">
          <div className="">
          {session ? (
        <div>
          <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant="outline" >
            Logout
          </Button>
        </div>
      ) : (
        <Link href="/sign-in">
          <Button className="w-full md:w-auto bg-slate-100 text-black" variant="outline">
            Login
          </Button>
        </Link>
      )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;