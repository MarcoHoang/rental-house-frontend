import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 1rem;
  border-left: 4px solid;
  
  ${props => {
    if (props.type === 'error') {
      return `
        background: #fef2f2;
        color: #991b1b;
        border-left-color: #e53e3e;
        box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);
      `;
    } else if (props.type === 'success') {
      return `
        background: #f0fdf4;
        color: #166534;
        border-left-color: #38a169;
        box-shadow: 0 2px 4px rgba(56, 161, 105, 0.1);
      `;
    } else if (props.type === 'warning') {
      return `
        background: #fffbeb;
        color: #92400e;
        border-left-color: #d69e2e;
        box-shadow: 0 2px 4px rgba(214, 158, 46, 0.1);
      `;
    } else {
      return `
        background: #f8fafc;
        color: #475569;
        border-left-color: #94a3b8;
        box-shadow: 0 2px 4px rgba(148, 163, 184, 0.1);
      `;
    }
  }}
`;

const ErrorMessage = ({ 
  message, 
  type = 'error', 
  children,
  ...props 
}) => {
  if (!message && !children) return null;
  
  return (
    <MessageContainer type={type} {...props}>
      {message || children}
    </MessageContainer>
  );
};

export default ErrorMessage;
