import { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  active: boolean
}

const LoadingOverlay = ({ active }: LoadingOverlayProps) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if(!active) return;

    let index = 0;
    const text = '...';

    const interval = setInterval(() => {
      setDots(text.slice(0, index + 1));
      index = (index + 1) % text.length;
    }, 980);

    return () => clearInterval(interval);
  }, [active]);

  if(!active) return null;

  return (
    <div className="flex flex-col justify-center items-center gap-2 absolute bottom-1 mb-3">
      <div className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-[rgba(213,102,11,0.92)] animate-spin" />
      <div className="flex gap-0.5">
        <p className="m-0 tracking-[2px]">Processing</p>
        <span className="tracking-[2px]">{dots}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
