import type { ReactNode } from 'react';

interface PopUpOverlayProps {
  active:    boolean
  children?: ReactNode
}

const PopUpOverlay = ({ active, children }: PopUpOverlayProps) => {
  if(!active) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[rgba(28,28,28,0.24)]">
      <div className="relative z-[1000]">{children}</div>
    </div>
  );
};

export default PopUpOverlay;
