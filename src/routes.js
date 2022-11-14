import { Navigate, useRoutes } from 'react-router-dom';
import { loggedIn } from './firebaseConfig/firebaseConfig';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Documents from './pages/Document';
import DashboardApp from './pages/DashboardApp';
import TutorDashboardApp from './pages/TutorDashboardApp';
import Profile from './pages/Profile';
import Message from './pages/Message';
import Settings from './pages/Settings';
import TutorProfile from './pages/TutorProfile';
import AdminPanel from './pages/TestAdmin';
import ForgotPassword from './pages/ForgotPassword';


// ----------------------------------------------------------------------

export default function Router() {
  
  
  return useRoutes([
    {
      path: '/dashboard',
      element: loggedIn() ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'tutorapp', element: <TutorDashboardApp /> },
        { path: 'document', element: <Documents /> },
        { path: 'message', element: <Message /> },
        { path: 'settings', element: <Settings /> },
        { path: 'profile', element: <Profile /> },
        { path: 'tutorProfile', element: <TutorProfile />}
      ],
    },
 
    {
      path: 'admin',
      element: loggedIn() ? <AdminPanel /> : <Navigate to="login" />
    },
    {
      path: 'login',
      element: loggedIn() ? <Navigate to="/dashboard/app" /> : <Login />
    },
    {
      path: 'forgotpassword',
      element: loggedIn() ? <Navigate to="/dashboard/app" /> : <ForgotPassword />
    },
    {
      path: '/register',
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
