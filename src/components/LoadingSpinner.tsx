import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary' 
}) => {
  return (
    <div className="d-flex justify-content-center align-items-center p-4">
      <div 
        className={`spinner-border text-${color} ${size === 'sm' ? 'spinner-border-sm' : ''}`} 
        role="status"
      >
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  );
};