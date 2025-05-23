'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { ChevronDown } from "lucide-react";
import { motion, useCycle } from 'framer-motion';
import { SIDENAV_ITEMS } from '../../helpers/constants';
import { MenuItemWithSubMenuProps, SideNavItem } from '../../types/SidebarTypes';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: 'circle(0px at 100% 0)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
};

const HeaderMobile = () => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(containerRef);
  const [isOpen, toggleOpen] = useCycle(false, true);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      custom={height}
      className={`fixed inset-0 z-50 w-full md:hidden ${
        isOpen ? '' : 'pointer-events-none'
      }`}
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-0 right-0 w-full bg-black "
        variants={sidebarVariants}
      />
      <motion.ul
        variants={variants}
        className="absolute grid w-full gap-3 px-10 py-16 max-h-screen overflow-y-auto text-white "
      >
        {SIDENAV_ITEMS.map((item, idx) => {
          const isLastItem = idx === SIDENAV_ITEMS.length - 1;

          return (
            <div key={idx}>
              {item.submenu ? (
                <MenuItemWithSubMenu item={item} toggleOpen={toggleOpen} />
              ) : (
                <MenuItem>
                  <Link
                    href={item.path || '#'}
                    onClick={() => toggleOpen()}
                    className={`flex w-full text-lg ${
                      item.path === pathname ? 'font-bold' : ''
                    }`}
                  >
                    {item.title}
                  </Link>
                </MenuItem>
              )}

              {!isLastItem && (
                <MenuItem className="my-3 h-px w-full bg-gray-800 " />
              )}
            </div>
          );
        })}
      </motion.ul>
      <MenuToggle toggle={toggleOpen} />
    </motion.nav>
  );
};

export default HeaderMobile;

// const MenuToggle = ({ toggle }: { toggle: () => void }) => (
//   <button
//     onClick={toggle}
//     className="pointer-events-auto absolute right-4 top-[14px] z-30  bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text"
//   >
//     <svg className=' bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text' width="23" height="23" viewBox="0 0 23 23">
//       <Path
//         variants={{
//           closed: { d: 'M 2 2.5 L 20 2.5' },
//           open: { d: 'M 3 16.5 L 17 2.5' },
//         }}
//       />
//       <Path
//         d="M 2 9.423 L 20 9.423"
//         variants={{
//           closed: { opacity: 1 },
//           open: { opacity: 0 },
//         }}
//         transition={{ duration: 0.1 }}
//       />
//       <Path
//         variants={{
//           closed: { d: 'M 2 16.346 L 20 16.346' },
//           open: { d: 'M 3 2.5 L 17 16.346' },
//         }}
//       />
//     </svg>
//   </button>
// );
const MenuToggle = ({ toggle }: { toggle: () => void }) => (
  <button
    onClick={toggle}
    className="pointer-events-auto absolute right-4 top-[14px] z-30  "
  >
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      className="bg-gradient-to-r from-pink-400 to-purple-600 text-transparent bg-clip-text"
    >
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
  </button>
);

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuItem = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <motion.li variants={MenuItemVariants} className={className}>
      {children}
    </motion.li>
  );
};

const MenuItemWithSubMenu: React.FC<MenuItemWithSubMenuProps> = ({
  item,
  toggleOpen,
}) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(true);
  const router = useRouter();
  const {data:session}=useSession();
  const orgName = session?.user?.organizationName;


  const handleButtonClick = (name: string) => {
    handleChatRooms(name);
  };

  const handleChatRooms = async (name: string) => {
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
    <>
      <MenuItem>
       
      <button
          className="flex w-full text-xl"
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          <div
            className="flex flex-row justify-between w-full items-center"
            
          >
            <span
              className={`${
                pathname.includes(item.name) ? 'font-bold' : ''
              }`}
            >
              {item.title}
            </span>
            <div className={`${subMenuOpen && 'rotate-180'}`}>
             <ChevronDown size={24} />
            </div>
          </div>
        </button>

      </MenuItem>
      <div className="mt-2 ml-2 flex flex-col space-y-2">
        {subMenuOpen && (
          <>
            {item.subMenuItems?.map((subItem, subIdx) => (
              <MenuItem key={subIdx}>
                <div
                  
                  
                  className={` ${
                    subItem.path === pathname ? 'font-bold' : ''
                  }`}
                  onClick={() => {handleButtonClick(subItem.title);toggleOpen()}}>
                  {subItem.title} 
                </div>
              </MenuItem>
            ))}
          </>
        )}
      </div>
    </>
  );
};

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
      duration: 0.02,
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.02, delayChildren: 0.15 },
  },
  closed: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const useDimensions = (ref: React.RefObject<HTMLDivElement>) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};



// 'use client';

// import React, { ReactNode, useEffect, useRef, useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Icon } from '@iconify/react';
// import { motion, useCycle } from 'framer-motion';
// import { SIDENAV_ITEMS } from '../../helpers/constants';
// import { MenuItemWithSubMenuProps, SideNavItem } from '../../types/SidebarTypes';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { useSession } from 'next-auth/react';

// const sidebarVariants = {
//   open: (height = 1000) => ({
//     clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
//     transition: {
//       type: 'spring',
//       stiffness: 20,
//       restDelta: 2,
//     },
//   }),
//   closed: {
//     clipPath: 'circle(0px at 100% 0)',
//     transition: {
//       type: 'spring',
//       stiffness: 400,
//       damping: 40,
//     },
//   },
// };

// const HeaderMobile = () => {
//   const pathname = usePathname();
//   const containerRef = useRef<HTMLDivElement>(null);
//   const { height } = useDimensions(containerRef);
//   const [isOpen, toggleOpen] = useCycle(false, true);
//   const { data: session } = useSession();

//   return (
//     <motion.nav
//       initial={false}
//       animate={isOpen ? 'open' : 'closed'}
//       custom={height}
//       className={`fixed inset-0 z-50 w-full md:hidden ${
//         isOpen ? '' : 'pointer-events-none'
//       }`}
//       ref={containerRef}
//     >
//       <motion.div
//         className="absolute inset-0 right-0 w-full bg-black "
//         variants={sidebarVariants}
//       />
//       <motion.ul
//         variants={variants}
//         className="absolute grid w-full gap-3 px-10 py-16 max-h-screen overflow-y-auto text-white "
//       >
//         {SIDENAV_ITEMS.map((item, idx) => {
//           const isLastItem = idx === SIDENAV_ITEMS.length - 1;

//           return (
//             <div key={idx}>
//               {item.submenu ? (
//                 <MenuItemWithSubMenu item={item} toggleOpen={toggleOpen} session={session} />
//               ) : (
//                 <MenuItem>
//                   <button
//                     disabled={!session}
//                     onClick={() => session && toggleOpen()}
//                     className={`flex w-full text-lg ${
//                       item.path === pathname ? 'font-bold' : ''
//                     } ${!session ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   >
//                     {item.title}
//                   </button>
//                 </MenuItem>
//               )}

//               {!isLastItem && (
//                 <MenuItem className="my-3 h-px w-full bg-gray-800 " />
//               )}
//             </div>
//           );
//         })}
//       </motion.ul>
//       <MenuToggle toggle={toggleOpen} />
//     </motion.nav>
//   );
// };

// export default HeaderMobile;

// const MenuToggle = ({ toggle }: { toggle: () => void }) => (
//   <button
//     onClick={toggle}
//     className="pointer-events-auto absolute right-4 top-[14px] z-30"
//   >
//     <svg width="23" height="23" viewBox="0 0 23 23">
//       <Path
//         variants={{
//           closed: { d: 'M 2 2.5 L 20 2.5' },
//           open: { d: 'M 3 16.5 L 17 2.5' },
//         }}
//       />
//       <Path
//         d="M 2 9.423 L 20 9.423"
//         variants={{
//           closed: { opacity: 1 },
//           open: { opacity: 0 },
//         }}
//         transition={{ duration: 0.1 }}
//       />
//       <Path
//         variants={{
//           closed: { d: 'M 2 16.346 L 20 16.346' },
//           open: { d: 'M 3 2.5 L 17 16.346' },
//         }}
//       />
//     </svg>
//   </button>
// );

// const Path = (props: any) => (
//   <motion.path
//     fill="transparent"
//     strokeWidth="2"
//     stroke="hsl(0, 0%, 18%)"
//     strokeLinecap="round"
//     {...props}
//   />
// );

// const MenuItem = ({ className, children }: { className?: string; children?: ReactNode }) => (
//   <motion.li variants={MenuItemVariants} className={className}>
//     {children}
//   </motion.li>
// );

// const MenuItemWithSubMenu: React.FC<MenuItemWithSubMenuProps & { session: any }> = ({
//   item,
//   toggleOpen,
//   session,
// }) => {
//   const pathname = usePathname();
//   const [subMenuOpen, setSubMenuOpen] = useState(true);
//   const router = useRouter();
//   const orgName = session?.user?.organizationName;

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
//     <>
//       <MenuItem>
//         <button
//           disabled={!session}
//           className={`flex w-full text-xl ${!session ? 'opacity-50 cursor-not-allowed' : ''}`}
//           onClick={() => session && setSubMenuOpen(!subMenuOpen)}
//         >
//           <div className="flex flex-row justify-between w-full items-center">
//             <span className={pathname.includes(item.name) ? 'font-bold' : ''}>
//               {item.title}
//             </span>
//             <div className={`${subMenuOpen ? 'rotate-180' : ''}`}>
//               <Icon icon="lucide:chevron-down" width="24" height="24" />
//             </div>
//           </div>
//         </button>
//       </MenuItem>

//       {/* Render submenus when subMenuOpen is true */}
//       {subMenuOpen && item.subMenuItems && (
//         <div className="mt-2 ml-4 flex flex-col space-y-2">
//           {item.subMenuItems.map((subItem, subIdx) => (
//             <MenuItem key={subIdx}>
//               <button
//                 className={`w-full text-lg text-left ${
//                   pathname === subItem.path ? 'font-bold text-blue-500' : 'text-gray-300'
//                 }`}
//                 onClick={() => handleChatRooms(subItem.name)}
//               >
//                 {subItem.title}
//               </button>
//             </MenuItem>
//           ))}
//         </div>
//       )}
//     </>
//   );
// };

// const MenuItemVariants = {
//   open: { y: 0, opacity: 1, transition: { y: { stiffness: 1000, velocity: -100 } } },
//   closed: { y: 50, opacity: 0, transition: { y: { stiffness: 1000 }, duration: 0.02 } },
// };

// const variants = {
//   open: { transition: { staggerChildren: 0.02, delayChildren: 0.15 } },
//   closed: { transition: { staggerChildren: 0.01, staggerDirection: -1 } },
// };

// const useDimensions = (ref: React.RefObject<HTMLDivElement>) => {
//   const dimensions = useRef({ width: 0, height: 0 });
//   useEffect(() => {
//     if (ref.current) {
//       dimensions.current.width = ref.current.offsetWidth;
//       dimensions.current.height = ref.current.offsetHeight;
//     }
//   }, [ref]);
//   return dimensions.current;
// };
