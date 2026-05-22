import type { ReactNode } from 'react';

interface PopUpOverlayProps {
  active:    boolean
  children?: ReactNode
}

const PopUpOverlay = ({ active, children }: PopUpOverlayProps) => {
  if(!active) return null;

  return (
    <div id="overflow" className="overflow active">
      <div id="pop-up-container">{children}</div>
    </div>
  );
};

export default PopUpOverlay;
