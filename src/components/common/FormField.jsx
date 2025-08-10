import React from 'react';
import styled from 'styled-components';

const FieldContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
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
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  background: #f7fafc;

  &:focus {
    outline: none;
    border-color: #3182ce;
    background: white;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

// Tạo component wrapper để filter props
const Input = React.forwardRef(({ hasError, fullWidth, loading, variant, size, ...props }, ref) => {
  // Filter out all custom props before passing to StyledInput
  const { hasError: __, fullWidth: ___, loading: ____, variant: _____, size: ______, ...cleanProps } = props;
  // Chỉ truyền hasError cho StyledInput, không truyền xuống DOM
  return <StyledInput ref={ref} hasError={hasError} {...cleanProps} />;
});

Input.displayName = 'Input';

const IconWrapper = styled.div`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
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
  color: #a0aec0;
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
  transition: color 0.2s;
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
  hasError, // Extract hasError from props
  fullWidth, // Extract fullWidth from props
  loading, // Extract loading from props
  variant, // Extract variant from props
  size, // Extract size from props
  ...domProps
}) => {
  // Filter out custom props from domProps
  const { hasError: _, fullWidth: __, loading: ___, variant: ____, size: _____, ...cleanDomProps } = domProps;
  
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
          ref={null}
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
