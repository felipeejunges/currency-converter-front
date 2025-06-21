import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const alertClasses = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info'
  };

  return (
    <div className={`alert ${alertClasses[type]} mb-4`}>
      <div className="flex-1">
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="btn btn-sm btn-ghost">
          ✕
        </button>
      )}
    </div>
  );
}; 