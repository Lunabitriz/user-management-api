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
    <div
      className="loading-container flex-col justify-center items-center gap-2 absolute mb-3 active"
      style={{ bottom: 4 }}
    >
      <div className="loading-spinner active rounded-full" />
      <div className="flex" style={{ gap: 2 }}>
        <p className="loading-text m-0">Processing</p>
        <span>{dots}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
