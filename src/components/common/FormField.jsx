import React from 'react';
import styled from 'styled-components';

const FieldContainer = styled.div`
  margin-bottom: 0.75rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.375rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;

  .required {
    color: #e53e3e;
    margin-left: 0.25rem;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 2px solid ${props => props.hasError ? '#e53e3e' : '#e2e8f0'};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  background: #f7fafc;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
  transition: color 0.2s ease-in-out;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #4a5568;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #e53e3e;
  font-weight: 500;
`;

const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  icon: Icon,
  showToggle = false,
  onToggle,
  toggleIcon: ToggleIcon,
  // Filter out custom props that shouldn't be passed to DOM
  hasError,
  fullWidth,
  loading,
  variant,
  size,
  ...domProps
}) => {
  // Filter out all custom props from domProps to prevent React warnings
  const {
    hasError: _hasError,
    fullWidth: _fullWidth,
    loading: _loading,
    variant: _variant,
    size: _size,
    ...cleanDomProps
  } = domProps;
  
  return (
    <FieldContainer>
      <Label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </Label>
      
      <InputWrapper>
        {Icon && (
          <IconWrapper>
            <Icon size={18} />
          </IconWrapper>
        )}
        
        <StyledInput
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          hasError={!!error}
          {...cleanDomProps}
        />
        
        {showToggle && ToggleIcon && (
          <ToggleButton type="button" onClick={onToggle}>
            <ToggleIcon size={18} />
          </ToggleButton>
        )}
      </InputWrapper>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FieldContainer>
  );
};

export default FormField;
