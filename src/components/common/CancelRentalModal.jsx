import React, { useState } from 'react';
import styled from 'styled-components';
import { X, AlertTriangle } from 'lucide-react';

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
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
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

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const WarningSection = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const WarningIcon = styled.div`
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

const WarningContent = styled.div`
  color: #92400e;
  
  h4 {
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  &.cancel {
    background: #f3f4f6;
    color: #374151;
    border-color: #d1d5db;

    &:hover {
      background: #e5e7eb;
    }
  }

  &.confirm {
    background: #ef4444;
    color: white;
    border-color: #ef4444;

    &:hover {
      background: #dc2626;
    }

    &:disabled {
      background: #fca5a5;
      cursor: not-allowed;
    }
  }
`;

const CancelRentalModal = ({ isOpen, onClose, onConfirm, rental, loading }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do hủy đơn thuê');
      return;
    }

    setError('');
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <AlertTriangle size={20} />
            Hủy đơn thuê
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <WarningSection>
            <WarningIcon>
              <AlertTriangle size={20} />
            </WarningIcon>
            <WarningContent>
              <h4>Bạn có chắc chắn muốn hủy đơn thuê này?</h4>
              <p>
                Hành động này không thể hoàn tác. Đơn thuê sẽ được hủy và bạn sẽ không thể khôi phục lại.
              </p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                <strong>Lưu ý:</strong> Chỉ có thể hủy trước 24 giờ so với thời gian bắt đầu thuê.
              </p>
            </WarningContent>
          </WarningSection>

          {rental && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Thông tin đơn thuê:</h4>
              <p style={{ margin: '0', color: '#6b7280', fontSize: '0.875rem' }}>
                <strong>Nhà:</strong> {rental.houseTitle}
              </p>
              <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                <strong>Thời gian:</strong> {new Date(rental.startDate).toLocaleDateString('vi-VN')} - {new Date(rental.endDate).toLocaleDateString('vi-VN')}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="cancelReason">
                Lý do hủy đơn thuê <span style={{ color: '#ef4444' }}>*</span>
              </Label>
              <TextArea
                id="cancelReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Vui lòng nhập lý do hủy đơn thuê..."
                disabled={loading}
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </FormGroup>

            <ButtonGroup>
              <Button type="button" className="cancel" onClick={handleClose} disabled={loading}>
                Hủy
              </Button>
              <Button type="submit" className="confirm" disabled={loading || !reason.trim()}>
                {loading ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </Button>
            </ButtonGroup>
          </form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CancelRentalModal;
