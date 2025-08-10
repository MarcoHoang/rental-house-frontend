import { useState, useCallback } from 'react';

export const useForm = (initialState, validationRules = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setField = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setField(name, value);
  }, [setField]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    if (validationRules[name]) {
      const error = validationRules[name](formData[name], formData);
      setFieldError(name, error);
    }
  }, [formData, validationRules, setFieldError]);

  const validateField = useCallback((name, value) => {
    if (!validationRules[name]) return '';
    return validationRules[name](value, formData);
  }, [validationRules, formData]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules, validateField, formData]);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  const setFormDataWithErrors = useCallback((data, newErrors = {}) => {
    setFormData(data);
    setErrors(newErrors);
  }, []);

  return {
    formData,
    errors,
    touched,
    setField,
    setFieldError,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    resetForm,
    setFormDataWithErrors
  };
};

// Common validation rules
export const validationRules = {
  email: (value) => {
    if (!value) return 'Email là bắt buộc';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email không đúng định dạng';
    return '';
  },
  
  password: (value) => {
    if (!value) return 'Mật khẩu là bắt buộc';
    if (value.length < 6 || value.length > 32) return 'Mật khẩu phải từ 6 đến 32 ký tự';
    return '';
  },
  
  confirmPassword: (value, formData) => {
    if (!value) return 'Xác nhận mật khẩu là bắt buộc';
    if (value !== formData.password) return 'Mật khẩu xác nhận không khớp';
    return '';
  },
  
  fullName: (value) => {
    if (!value) return 'Họ và tên là bắt buộc';
    if (value.length < 2) return 'Họ và tên phải có ít nhất 2 ký tự';
    if (value.length > 100) return 'Họ và tên không được vượt quá 100 ký tự';
    return '';
  },
  
  phone: (value) => {
    if (!value) return 'Số điện thoại là bắt buộc';
    if (!/^[0-9]+$/.test(value)) return 'Số điện thoại chỉ được chứa các chữ số từ 0-9';
    if (value.length < 9 || value.length > 12) return 'Số điện thoại phải có từ 9 đến 12 số';
    return '';
  },
  
  username: (value) => {
    if (!value) return 'Tên người dùng là bắt buộc';
    if (value.length < 2) return 'Tên người dùng phải có ít nhất 2 ký tự';
    if (value.length > 100) return 'Tên người dùng không được vượt quá 100 ký tự';
    // Kiểm tra ký tự đặc biệt
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) return 'Tên người dùng chỉ được chứa chữ cái và khoảng trắng';
    return '';
  },
  
  address: (value) => {
    // Address là optional, nhưng nếu có thì validate
    if (value && value.length > 200) return 'Địa chỉ không được vượt quá 200 ký tự';
    return '';
  },
  
  required: (value, fieldName = 'Trường này') => {
    if (!value || value.trim() === '') return `${fieldName} là bắt buộc`;
    return '';
  }
};
