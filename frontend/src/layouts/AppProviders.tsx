import Notification from '../components/ui/Notification';

import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';

const AppProviders = () => (
  <NotificationProvider>
    <AuthProvider>
      <Outlet />
      <Notification />
    </AuthProvider>
  </NotificationProvider>
);

export default AppProviders;
