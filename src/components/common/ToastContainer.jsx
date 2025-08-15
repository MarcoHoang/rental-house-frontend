import React from 'react';
import styled from 'styled-components';
import SimpleToast from './SimpleToast';

const ToastContainerWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ToastContainer = ({ toasts, onRemoveToast }) => {
  return (
    <ToastContainerWrapper>
      {toasts.map(toast => (
        <SimpleToast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => onRemoveToast(toast.id)}
          duration={5000}
        />
      ))}
    </ToastContainerWrapper>
  );
};

export default ToastContainer;
