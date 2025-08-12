import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  
  svg {
    width: 48px;
    height: 48px;
  }
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`;

const Message = styled.p`
  margin: 0 0 1.5rem 0;
  color: #6b7280;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #3b82f6;
  color: white;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #e5e7eb;
  color: #374151;
  
  &:hover {
    background-color: #d1d5db;
  }
`;

const DangerButton = styled(Button)`
  background-color: #ef4444;
  color: white;
  
  &:hover {
    background-color: #dc2626;
  }
`;

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  type = 'info', 
  onConfirm, 
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  showCancel = true
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle color="#10b981" />;
      case 'error':
      case 'danger':
        return <XCircle color="#ef4444" />;
      case 'warning':
        return <AlertTriangle color="#f59e0b" />;
      default:
        return <Info color="#3b82f6" />;
    }
  };

  const getButton = () => {
    if (type === 'danger' || type === 'error') {
      return (
        <DangerButton onClick={onConfirm}>
          {confirmText}
        </DangerButton>
      );
    }
    return (
      <PrimaryButton onClick={onConfirm}>
        {confirmText}
      </PrimaryButton>
    );
  };

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <IconWrapper>
          {getIcon()}
        </IconWrapper>
        
        <Title>{title}</Title>
        <Message>{message}</Message>
        
        <ButtonGroup>
          {getButton()}
          {showCancel && (
            <SecondaryButton onClick={onCancel}>
              {cancelText}
            </SecondaryButton>
          )}
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmModal;
