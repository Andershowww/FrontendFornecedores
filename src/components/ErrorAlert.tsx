import React from 'react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger d-flex align-items-center" role="alert">
      <div className="flex-grow-1">
        <strong>Erro:</strong> {message}
      </div>
      {onRetry && (
        <button 
          className="btn btn-outline-danger btn-sm ms-2" 
          onClick={onRetry}
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
};