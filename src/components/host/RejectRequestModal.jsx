import React, { useState } from 'react';
import styled from 'styled-components';
import { X, AlertTriangle } from 'lucide-react';
import { useToast } from '../common/Toast';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const CharacterCount = styled.div`
  font-size: 0.75rem;
  color: ${props => props.$isOverLimit ? '#ef4444' : '#6b7280'};
  text-align: right;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &.secondary {
    background: #6b7280;
    color: white;

    &:hover {
      background: #4b5563;
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }

  &.danger {
    background: #ef4444;
    color: white;

    &:hover {
      background: #dc2626;
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }
`;

const RejectRequestModal = ({ isOpen, onClose, onReject, requestInfo }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxLength = 500;
  const { showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      showError('Lỗi', 'Vui lòng nhập lý do từ chối');
      return;
    }

    if (reason.length > maxLength) {
      showError('Lỗi', 'Lý do từ chối quá dài');
      return;
    }

    try {
      setIsSubmitting(true);
      await onReject(requestInfo.id, reason.trim());
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <AlertTriangle size={20} color="#ef4444" />
            Từ chối yêu cầu thuê nhà
          </ModalTitle>
          <CloseButton onClick={handleClose} disabled={isSubmitting}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
              Bạn sắp từ chối yêu cầu thuê nhà từ <strong>{requestInfo?.renterName}</strong>.
              Vui lòng cung cấp lý do để người thuê hiểu rõ hơn.
            </p>
          </div>

          <FormGroup>
            <Label htmlFor="reason">Lý do từ chối *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do từ chối yêu cầu thuê nhà..."
              maxLength={maxLength}
              disabled={isSubmitting}
            />
            <CharacterCount $isOverLimit={reason.length > maxLength}>
              {reason.length}/{maxLength} ký tự
            </CharacterCount>
          </FormGroup>

          <ButtonGroup>
            <Button
              type="button"
              className="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="danger"
              disabled={isSubmitting || !reason.trim()}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Từ chối yêu cầu'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RejectRequestModal;
