import { useEffect } from 'react';

import Notification from '../components/ui/Notification';

import { Outlet } from 'react-router-dom';
import { storage } from '../utils/storage';
import { AuthProvider } from '../context/AuthContext';
import { applyDocumentTheme } from '../constants/themes';
import { NotificationProvider } from '../context/NotificationContext';

const AppProviders = () => {
  useEffect(() => {
    applyDocumentTheme(storage.getUserTheme());
  }, []);

  return (
    <NotificationProvider>
      <AuthProvider>
        <Outlet />
        <Notification />
      </AuthProvider>
    </NotificationProvider>
  );
};

export default AppProviders;
