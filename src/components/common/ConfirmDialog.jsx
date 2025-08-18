import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, X } from 'lucide-react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Dialog = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideIn 0.2s ease-in-out;

  @keyframes slideIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => {
    switch (props.$type) {
      case 'danger': return '#fef2f2';
      case 'warning': return '#fffbeb';
      case 'info': return '#eff6ff';
      default: return '#f0fdf4';
    }
  }};
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => {
      switch (props.$type) {
        case 'danger': return '#dc2626';
        case 'warning': return '#d97706';
        case 'info': return '#2563eb';
        default: return '#16a34a';
      }
    }};
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
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
    width: 20px;
    height: 20px;
  }
`;

const Content = styled.div`
  margin-bottom: 24px;
  
  .message {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.5;
    margin: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  &.cancel {
    background: #f3f4f6;
    color: #6b7280;
    
    &:hover {
      background: #e5e7eb;
    }
  }
  
  &.confirm {
    background: ${props => {
      switch (props.$type) {
        case 'danger': return '#dc2626';
        case 'warning': return '#d97706';
        case 'info': return '#2563eb';
        default: return '#16a34a';
      }
    }};
    color: white;
    
    &:hover {
      background: ${props => {
        switch (props.$type) {
          case 'danger': return '#b91c1c';
          case 'warning': return '#b45309';
          case 'info': return '#1d4ed8';
          default: return '#15803d';
        }
      }};
    }
  }
`;

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Xác nhận', 
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?', 
  type = 'warning',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Overlay onClick={handleClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Header>
          <IconWrapper $type={type}>
            <AlertTriangle />
          </IconWrapper>
          <Title>{title}</Title>
          <CloseButton onClick={handleClose}>
            <X />
          </CloseButton>
        </Header>
        
        <Content>
          {typeof message === 'string' ? (
            <p className="message">{message}</p>
          ) : (
            <div className="message">{message}</div>
          )}
        </Content>
        
        <Actions>
          <Button className="cancel" onClick={handleClose}>
            {cancelText}
          </Button>
          <Button className="confirm" $type={type} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </Actions>
      </Dialog>
    </Overlay>
  );
};

export default ConfirmDialog;
