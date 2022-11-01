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
import TutorProfile from './pages/TutorProfile';
import { useAuthState } from './firebaseConfig/firebaseConfig';

// ----------------------------------------------------------------------

export default function Router() {
  const { isAuthenticated } = useAuthState();
  return useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to='/login' />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'document', element: <Documents /> },
        { path: 'message', element: <Message /> },
        { path: 'settings', element: <Settings /> },
        { path: 'profile', element: <Profile /> },
        { path: 'tutorProfile', element: <TutorProfile />}
      ],
    },
    {
      path: 'login',
      element: isAuthenticated ? <Navigate to='/dashboard/app' /> : <Login />,
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
