import editIcon   from '../../assets/imgs/pop-ups-arts/edit-icon.jpg';
import deleteIcon from '../../assets/imgs/pop-ups-arts/delete-icon.jpg';
import logoutIcon from '../../assets/imgs/pop-ups-arts/logout-icon.jpg';

import Button from './Button';
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
    <div className="w-[420px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl flex flex-col items-center justify-center gap-2 px-12 py-12">
      <button
        type="button"
        id="close-popup-btn"
        className="absolute top-12 right-12 text-xl p-0 text-[#979797] border-0 bg-transparent cursor-pointer"
        onClick={onCancel}
      >
        <i className="fa-solid fa-xmark" />
      </button>

      <div>
        <img src={icon} alt={`${type} image`} width={193} />
      </div>

      <div className="text-center">
        <h3 className="text-center">{title}</h3>
        <p
          className="mb-0 text-center"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>

      <div className="flex justify-between w-full gap-2 mt-2">
        <Button type="button" id="popup-cancel-btn" variant="popup-cancel" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="button"
          variant="primary"
          className="text-white"
          style={{ backgroundColor: color }}
          onClick={onConfirm}
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmDialog;
