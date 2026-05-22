import { useEffect } from 'react';

import infoIcon    from '../../assets/imgs/pop-ups-arts/info-icon.jpg';
import dangerIcon  from '../../assets/imgs/pop-ups-arts/error-icon.jpg';
import successIcon from '../../assets/imgs/pop-ups-arts/success-icon.jpg';
import warningIcon from '../../assets/imgs/pop-ups-arts/warning-icon.jpg';

import { getColorByType } from '../../utils/colors';
import { useNotification } from '../../context/NotificationContext';

const ICONS = {
  info:    infoIcon,
  danger:  dangerIcon,
  error:   dangerIcon,
  success: successIcon,
  warning: warningIcon,
} as const;

const Notification = () => {
  const { notification, dismiss } = useNotification();

  useEffect(() => {
    if(!notification) return;

    const timer = setTimeout(dismiss, 5000);
    return () => clearTimeout(timer);
  }, [notification, dismiss]);

  if(!notification) return null;

  const color = getColorByType(notification.type);
  const icon  = ICONS[notification.type as keyof typeof ICONS] ?? infoIcon;

  return (
    <div
      className="fixed shadow font-semibold bg-white gap-2 p-2 flex items-center justify-between alert-notification fade show"
      style={{ top: 20, right: 20, borderLeft: `4px solid ${color}` }}
    >
      <img src={icon} alt={`${notification.type} icon`} style={{ width: 70 }} />
      
      <div className="flex items-center justify-between gap-2 w-full">
        <p className="m-0 font-semibold">{notification.message}</p>
        <button
          type="button"
          className="btn-close-notification mr-2 text-black py-2 px-4 rounded-md shadow-sm"
          aria-label="Close"
          onClick={dismiss}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Notification;
