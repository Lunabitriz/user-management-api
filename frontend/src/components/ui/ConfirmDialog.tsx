import editIcon   from '../../assets/imgs/pop-ups-arts/edit-icon.jpg';
import deleteIcon from '../../assets/imgs/pop-ups-arts/delete-icon.jpg';
import logoutIcon from '../../assets/imgs/pop-ups-arts/logout-icon.jpg';

import { getColorByType } from '../../utils/colors';

const CONFIRM_ICONS: Record<string, string> = {
  edit:   editIcon,
  delete: deleteIcon,
  logout: logoutIcon,
};

interface ConfirmDialogProps {
  type:      string
  title:     string
  message:   string
  ctaLabel:  string
  onCancel:  () => void
  onConfirm: () => void
}

const ConfirmDialog = ({
  type,
  title,
  message,
  ctaLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {

  const color = getColorByType(type);
  const icon  = CONFIRM_ICONS[type] ?? editIcon;

  return (
    <div
      className="container bg-white rounded-2xl flex flex-col items-center justify-center gap-2 px-12 py-12"
      style={{ width: 420 }}
    >
      <div className={`${type}-ilustration`}>
        <img src={icon} alt={`${type} image`} width={193} />
      </div>

      <div className="header-form text-center">
        <h3 className="text-center">{title}</h3>
        <p
          className="mb-0 text-center"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>

      <div className="flex justify-between w-full gap-2 mt-2">
        <button
          type="button"
          id="popup-cancel-btn"
          className="btn btn-popup-confirm w-full"
          onClick={onCancel}
        >
          Cancelar
        </button>        
        <button
          type="button"
          className="btn btn-popup-confirm text-white w-full"
          style={{ backgroundColor: color }}
          onClick={onConfirm}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
};

export default ConfirmDialog;
