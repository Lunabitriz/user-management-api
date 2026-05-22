import {
  useMemo,
  useState,
  useContext,
  useCallback,
  createContext,
  type ReactNode,
} from 'react';

import type { NotificationType } from '../types/api';

interface NotificationState {
  id:      number
  type:    NotificationType
  message: string
}

interface NotificationContextValue {
  notification: NotificationState | null
  dismiss: () => void
  notify:  (message: string, type?: NotificationType) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider = (
  { children }: { children: ReactNode }
) => {

  const [notification, setNotification] = useState<NotificationState | null>(null);

  const dismiss = useCallback(() => {
    setNotification(null);
  }, []);

  const notify = useCallback((
    message: string, type: NotificationType = 'info'
  ) => {
    setNotification({ id: Date.now(), message, type });
  }, []);

  const value = useMemo(
    () => ({ notification, notify, dismiss }),
    [notification, notify, dismiss],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if(!context)
    throw new Error('useNotification deve ser usado dentro de NotificationProvider');

  return context;
};
