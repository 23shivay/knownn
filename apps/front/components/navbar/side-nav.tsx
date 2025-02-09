'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { redirect, usePathname, useRouter } from 'next/navigation';

import { SIDENAV_ITEMS } from '../../helpers/constants';
import { SideNavItem } from '../../types/SidebarTypes';
import { Icon } from '@iconify/react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const SideNav = () => {
  return (
    <div className="md:w-60 bg-black h-screen flex-1 fixed border-r text-white border-gray-600 hidden md:flex">
      <div className="flex flex-col space-y-6 w-full">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6  border-grey-900 h-12 w-full"
        >
          <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
          <span className="font-bold text-xl hidden md:flex bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text">Knownn</span>
        </Link>

        <div className="flex flex-col space-y-2  md:px-6 ">
          {SIDENAV_ITEMS.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SideNav;

// const MenuItem = ({ item }: { item: SideNavItem }) => {

//   const pathname = usePathname();
//   const [subMenuOpen, setSubMenuOpen] = useState(true);
//   const toggleSubMenu = () => {
//     setSubMenuOpen(!subMenuOpen);
//   };
//   const router = useRouter();
//   const {data:session}=useSession();
  
  
//   const orgName = session?.user?.organizationName;

//   const handleButtonClick = (name: string) => {
//     handleChatRooms(name);
//   };

//   const handleChatRooms = async (name: string) => {
//     try {
//       const response = await axios.post(`/api/create-room`, {
//         organizationName: orgName,
//         chatRoomName: name,
//       });
//       const room = response.data.value;
//       router.push(`/chat/${room}`);
//     } catch (error) {
//       console.error('Error in chat room opening', error);
//       alert('Failed to create or navigate to the chat room. Please try again.');
//     }
//   };

//   return (
//     <div >
//       {item.submenu ? (
//         <>
//           <button
//             onClick={toggleSubMenu}
//             className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-gray-900 ${
//               pathname.includes(item.name) ? 'bg-gray-900' : ''
//             }`}
//           >
//             <div className="flex flex-row space-x-4 items-center">
//               {item.icon}
//               <span className="  flex">{item.title}</span>
//             </div>

//             <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
//               <Icon icon="lucide:chevron-down" width="24" height="24" />
//             </div>
//           </button>

//           {subMenuOpen && (
           
//             <div className="my-2 ml-12 flex flex-col space-y-4">
//               {item.subMenuItems?.map((subItem, idx) => {
//                 return (
//                   <div
//                     key={idx}
                   
//                     className={`${
//                       subItem.path === pathname ? 'font-bold' : ''
//                     }`}
//                     onClick={() => {handleButtonClick(subItem.title)}}
//                   >
//                     <span>{subItem.title}</span>
//                   </div>
//                 );
//               })}
//             </div>
           
//           )}
//         </>
//       ) : (
//         <Link
//           href={item.path}
//           className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-gray-900 ${
//             item.path === pathname ? 'bg-gray-900' : ''
//           }`}
//         >
//           {item.icon}
//           <span className=" flex">{item.title}</span>
//         </Link>
//       )}
//     </div>
//   );
// };


const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(true);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };
  const router = useRouter();
  const { data: session } = useSession();  

  const orgName = session?.user?.organizationName;

  const handleButtonClick = (name: string) => {
    if (!session) return; // Prevent function from executing if user is not logged in
    handleChatRooms(name);
  };

  const handleChatRooms = async (name: string) => {
    if (!session) return; // Extra safety check
    try {
      const response = await axios.post(`/api/create-room`, {
        organizationName: orgName,
        chatRoomName: name,
      });
      const room = response.data.value;
      router.push(`/chat/${room}`);
    } catch (error) {
      console.error('Error in chat room opening', error);
      alert('Failed to create or navigate to the chat room. Please try again.');
    }
  };

  return (
    <div>
      {item.submenu ? (
        <>
          <button
            onClick={session ? toggleSubMenu : undefined} // Disable click if no session
            className={`flex flex-row items-center p-2 rounded-lg w-full justify-between hover:bg-gray-900 ${
              pathname.includes(item.name) ? 'bg-gray-900' : ''
            } ${!session ? 'pointer-events-none opacity-50' : ''}`} // Disable interaction
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="flex">{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </button>

          {subMenuOpen && session && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => (
                <div
                  key={idx}
                  className={`${subItem.path === pathname ? 'font-bold' : ''} ${
                    !session ? 'pointer-events-none opacity-50' : ''
                  }`}
                  onClick={() => session && handleButtonClick(subItem.title)} // Only works if session exists
                >
                  <span>{subItem.title}</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={session ? item.path : '#'} // Prevent navigation if no session
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-gray-900 ${
            item.path === pathname ? 'bg-gray-900' : ''
          } ${!session ? 'pointer-events-none opacity-50' : ''}`} // Disable interaction
        >
          {item.icon}
          <span className="flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
