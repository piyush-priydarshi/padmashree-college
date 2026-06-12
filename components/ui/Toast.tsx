import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColors = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-navy-mid text-white border border-gold/20',
  };

  return (
    <div className={`fixed bottom-5 right-5 z-[9999] flex items-center px-4 py-3 rounded-lg shadow-lg ${bgColors[type]}`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-3 font-bold text-lg hover:opacity-75 cursor-pointer">
        &times;
      </button>
    </div>
  );
};
