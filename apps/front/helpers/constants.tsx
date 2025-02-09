import { Icon } from '@iconify/react';

import { SideNavItem } from '../types/SidebarTypes';

export const SIDENAV_ITEMS: SideNavItem[] = [
  // {
  //   title: 'Home',
  //   path: '/',
  //   icon: <Icon icon="lucide:home" width="24" height="24" />,
  // },
  {
    title: 'Chat',
    name:'chat',
    submenu: true,  // Indicates that this item has a submenu
    icon: <Icon icon="mdi:chat-outline" width="24" height="24" />,
    subMenuItems: [
      { title: 'Dank' },
      { title: 'Situation' },
      { title: 'Sports' },
    ],
  },
  {
    title: 'Recommendation',
    path: '/contentsuggestion',
    icon: <Icon icon="material-symbols:lightbulb-outline" width="24" height="24"/>,
  },
  {
    title: 'Gossip',
    path: '/gossip',
    icon: <Icon icon="mdi:comment-multiple-outline" width="24" height="24"/>,
  },
  {
    title: 'Feedback',
    path: '/feedback',
    icon: <Icon icon="mdi:clipboard-text-outline" width="24" height="24"/>,
  },
 /* {
    title: 'Setting',
    submenu: true,  // Indicates that this item has a submenu
    icon: <Icon icon="lucide:settings" width="24" height="24" />,
    subMenuItems: [
      
      { title: 'Privacy', path: '/settings/privacy' },
    ],
  },
  {
    title: 'Help',
    path: '/help',
    icon: <Icon icon="lucide:help-circle" width="24" height="24" />,
  },*/
];
