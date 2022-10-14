import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Documents from './pages/Document';
import DashboardApp from './pages/DashboardApp';
import Profile from './pages/Profile';
import Message from './pages/Message';
import Settings from './pages/Settings';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'document', element: <Documents /> },
        { path: 'message', element: <Message /> },
        { path: 'settings', element: <Settings /> },
        { path: 'profile', element: <Profile /> },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
