import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 3rem;
  text-decoration: none;
  
  /* Variants */
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: #e2e8f0;
          color: #4a5568;
          
          &:hover:not(:disabled) {
            background: #cbd5e0;
          }
        `;
      case 'danger':
        return `
          background: #e53e3e;
          color: white;
          
          &:hover:not(:disabled) {
            background: #c53030;
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: #3182ce;
          border: 2px solid #3182ce;
          
          &:hover:not(:disabled) {
            background: #3182ce;
            color: white;
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #3182ce, #667eea);
          color: white;
        `;
    }
  }}
  
  /* Sizes */
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          min-height: 2.5rem;
        `;
      case 'large':
        return `
          padding: 1rem 1.5rem;
          font-size: 1.125rem;
          min-height: 3.5rem;
        `;
      default:
        return '';
    }
  }}
  
  /* Full width */
  ${props => props.fullWidth && `
    width: 100%;
  `}
  
  /* Disabled state */
  &:disabled {
    background: #a0aec0 !important;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  /* Loading state */
  ${props => props.loading && `
    cursor: not-allowed;
    opacity: 0.7;
  `}
`;

const Spinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Tạo component wrapper để filter props
const ButtonComponent = React.forwardRef(({ 
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  hasError,
  ...props 
}, ref) => {
  // Filter out all custom props before passing to StyledButton
  const { hasError: __, fullWidth: ___, loading: ____, variant: _____, size: ______, ...cleanProps } = props;
  
  return (
    <StyledButton
      ref={ref}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      {...cleanProps}
    />
  );
});

ButtonComponent.displayName = 'ButtonComponent';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  type = 'button',
  hasError,
  ...domProps
}) => {
  // Filter out ALL custom props that shouldn't be passed to DOM
  const {
    hasError: _hasError,
    fullWidth: _fullWidth,
    loading: _loading,
    variant: _variant,
    size: _size,
    icon: _icon,
    ...cleanDomProps
  } = domProps;

  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...cleanDomProps}
    >
      {loading && <Spinner />}
      {!loading && Icon && <Icon size={18} />}
      {children}
    </StyledButton>
  );
};

export default Button;
