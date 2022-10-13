// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Home',
    path: '/dashboard/app',
    icon: getIcon('eva:home-fill'),
  },
  {
    title: 'Messages',
    path: '/dashboard/user',
    icon: getIcon('eva:message-circle-fill'),
  },
  {
    title: 'Profile',
    path: '/dashboard/profile',
    icon: getIcon('eva:person-outline'),
  },
  {
    title: 'Documents',
    path: '/dashboard/document',
    icon: getIcon('eva:file-text-outline'),
  },
  {
    title: 'Settings',
    path: '/dashboard/products',
    icon: getIcon('eva:settings-fill'),
  },
  
];

export default navConfig;
