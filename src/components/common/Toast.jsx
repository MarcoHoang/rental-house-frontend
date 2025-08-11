import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ToastItem = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px 20px;
  min-width: 300px;
  max-width: 400px;
  border-left: 4px solid ${props => {
    switch (props.$type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  }};
  animation: ${props => props.$isVisible ? slideIn : slideOut} 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => {
      switch (props.$type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#3b82f6';
      }
    }};
  }
`;

const Content = styled.div`
  flex: 1;
  
  .title {
    font-weight: 600;
    font-size: 14px;
    color: #1f2937;
    margin-bottom: 4px;
  }
  
  .message {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.4;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f4f6;
    color: #6b7280;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${props => {
    switch (props.$type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  }};
  width: ${props => props.$progress}%;
  transition: width linear ${props => props.$duration}ms;
`;

// Toast context để quản lý toasts
const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    
    // Tự động xóa toast sau thời gian
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (title, message) => {
    addToast({ type: 'success', title, message });
  };

  const showError = (title, message) => {
    addToast({ type: 'error', title, message });
  };

  const showWarning = (title, message) => {
    addToast({ type: 'warning', title, message });
  };

  const showInfo = (title, message) => {
    addToast({ type: 'info', title, message });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} $type={toast.type} $isVisible={true}>
            <IconWrapper $type={toast.type}>
              {toast.type === 'success' && <CheckCircle />}
              {toast.type === 'error' && <XCircle />}
              {toast.type === 'warning' && <AlertCircle />}
              {toast.type === 'info' && <AlertCircle />}
            </IconWrapper>
            <Content>
              <div className="title">{toast.title}</div>
              {toast.message && <div className="message">{toast.message}</div>}
            </Content>
            <CloseButton onClick={() => removeToast(toast.id)}>
              <X />
            </CloseButton>
            <ProgressBar 
              $type={toast.type} 
              $progress={100} 
              $duration={toast.duration || 5000}
            />
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
