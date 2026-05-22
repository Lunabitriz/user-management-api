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
      className="fixed top-5 right-5 z-[9999] w-[490px] max-w-[calc(100vw-2rem)] shadow-bio font-semibold bg-white gap-2 p-2 flex items-center justify-between animate-fade-in"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <img src={icon} alt={`${notification.type} icon`} className="w-[70px] shrink-0" />

      <div className="flex items-center justify-between gap-2 w-full">
        <p className="m-0 font-semibold">{notification.message}</p>
        <button
          type="button"
          className="mr-2 text-black py-2 px-4 rounded-md shadow-sm scale-x-[1.4] origin-right bg-[var(--bg-profile-card)] border-0 cursor-pointer"
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
