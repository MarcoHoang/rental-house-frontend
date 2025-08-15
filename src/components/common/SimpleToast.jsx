import React, { useEffect } from 'react';
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
  margin-bottom: 10px;
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

const SimpleToast = ({ type, title, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'error':
        return <XCircle />;
      case 'warning':
        return <AlertCircle />;
      default:
        return <AlertCircle />;
    }
  };

  return (
    <ToastItem $type={type} $isVisible={true}>
      <IconWrapper $type={type}>
        {getIcon()}
      </IconWrapper>
      <Content>
        <div className="title">{title}</div>
        {message && <div className="message">{message}</div>}
      </Content>
      <CloseButton onClick={onClose}>
        <X />
      </CloseButton>
      <ProgressBar 
        $type={type} 
        $progress={100} 
        $duration={duration}
      />
    </ToastItem>
  );
};

export default SimpleToast;
