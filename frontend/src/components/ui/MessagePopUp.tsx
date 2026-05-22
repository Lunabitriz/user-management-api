import editIcon    from '../../assets/imgs/pop-ups-arts/edit-icon.jpg';
import infoIcon    from '../../assets/imgs/pop-ups-arts/info-icon.jpg';
import errorIcon   from '../../assets/imgs/pop-ups-arts/error-icon.jpg';
import deleteIcon  from '../../assets/imgs/pop-ups-arts/delete-icon.jpg';
import logoutIcon  from '../../assets/imgs/pop-ups-arts/logout-icon.jpg';
import successIcon from '../../assets/imgs/pop-ups-arts/success-icon.jpg';
import warningIcon from '../../assets/imgs/pop-ups-arts/warning-icon.jpg';

import { getColorByType } from '../../utils/colors';

const POPUP_ICONS: Record<string, string> = {
  info:    infoIcon,
  edit:    editIcon,
  error:   errorIcon,
  delete:  deleteIcon,
  logout:  logoutIcon,
  success: successIcon,
  warning: warningIcon,
};

interface MessagePopUpProps {
  type:    string
  title:   string
  message: string
  onClose: () => void
}

const MessagePopUp = (
  { type, title, message, onClose }: MessagePopUpProps
) => {

  const color = getColorByType(type);
  const icon  = POPUP_ICONS[type] ?? successIcon;

  return (
    <div
      className="max-w-md mx-auto bg-white rounded-2xl flex flex-col items-center justify-center gap-2 px-12 py-12"
      style={{ width: 348 }}
    >
      <div className="email-ilustration w-full flex flex-col items-center justify-center">
        <img src={icon} alt={`${type} icon`} className="mb-4" />
      </div>
      
      <div className="header-form text-center">
        <h3>{title}</h3>
        <p className="mb-3">{message}</p>
      </div>

      <button
        type="button"
        id="popup-confirm-btn"
        className="btn text-white w-full"
        style={{ backgroundColor: color }}
        onClick={onClose}
      >
        Confirm
      </button>
    </div>
  );
};

export default MessagePopUp;
