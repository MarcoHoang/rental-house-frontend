import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
  border-left: 4px solid;
  
  ${props => {
    if (props.type === 'error') {
      return `
        background: #fed7d7;
        color: #742a2a;
        border-left-color: #e53e3e;
      `;
    } else if (props.type === 'success') {
      return `
        background: #c6f6d5;
        color: #22543d;
        border-left-color: #38a169;
      `;
    } else if (props.type === 'warning') {
      return `
        background: #fef5e7;
        color: #744210;
        border-left-color: #d69e2e;
      `;
    } else {
      return `
        background: #e2e8f0;
        color: #4a5568;
        border-left-color: #a0aec0;
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
