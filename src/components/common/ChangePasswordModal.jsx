import React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import ChangePassword from './ChangePassword';

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
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  z-index: 10;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    // Không cần gọi onClose() ở đây vì onSuccess sẽ gọi setShowChangePasswordModal(false)
  };

  const handleCancel = () => {
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
          <X size={20} />
        </CloseButton>
        
        <ChangePassword 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </ModalContent>
    </ModalOverlay>
  );
};

export default ChangePasswordModal;
