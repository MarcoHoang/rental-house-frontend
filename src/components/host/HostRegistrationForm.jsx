import React, { useState } from "react";
import {
  XMarkIcon,
  DocumentTextIcon,
  PhotoIcon,
  MapPinIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import styled from "styled-components";

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
  background-color: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;

  &:hover {
    background-color: #f3f4f6;
    color: #4b5563;
  }
`;

const Form = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;

  span {
    color: #ef4444;
    margin-left: 0.25rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem 0.625rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &[type="file"] {
    padding: 0.5rem 0.75rem;
    border: 1px dashed #d1d5db;
    background-color: #f9fafb;
    cursor: pointer;

    &::file-selector-button {
      display: none;
    }
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
`;

const ErrorText = styled.p`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #ef4444;
`;

const FilePreview = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.625rem 1rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: #4338ca;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const HostRegistrationForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    idNumber: "",
    address: "",
    submissionDate: new Date().toISOString().split("T")[0],
    idPhoto: null,
  });
  const [frontPreviewUrl, setFrontPreviewUrl] = useState(null);
  const [backPreviewUrl, setBackPreviewUrl] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = "Vui lòng nhập số căn cước công dân/CMT";
      isValid = false;
    } else if (!/^[0-9]{9,12}$/.test(formData.idNumber)) {
      newErrors.idNumber = "Số căn cước/CMT không hợp lệ";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
      isValid = false;
    }

    if (!formData.idPhoto) {
      newErrors.idPhoto = "Vui lòng tải lên ảnh giấy tờ tùy thân";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (
      (name === "idFrontPhoto" || name === "idBackPhoto") &&
      files &&
      files.length > 0
    ) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Tạo URL xem trước cho ảnh
      const fileUrl = URL.createObjectURL(file);
      if (name === "idFrontPhoto") {
        setFrontPreviewUrl(fileUrl);
      } else {
        setBackPreviewUrl(fileUrl);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Xóa thông báo lỗi khi người dùng nhập liệu
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Tạo FormData để gửi file
      const formDataToSend = new FormData();
      formDataToSend.append("idNumber", formData.idNumber);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("submissionDate", formData.submissionDate);
      formDataToSend.append("idFrontPhoto", formData.idFrontPhoto);
      formDataToSend.append("idBackPhoto", formData.idBackPhoto);

      await onSubmit(formDataToSend);
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi đơn đăng ký:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Đăng ký trở thành chủ nhà</ModalTitle>
          <CloseButton onClick={onClose}>
            <XMarkIcon className="w-5 h-5" />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="idNumber">
              Số căn cước công dân/CMT <span>*</span>
            </Label>
            <InputWrapper>
              <InputIcon>
                <DocumentTextIcon className="w-5 h-5" />
              </InputIcon>
              <Input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="Nhập số căn cước/CMT"
                className={errors.idNumber ? "border-red-500" : ""}
              />
            </InputWrapper>
            {errors.idNumber && <ErrorText>{errors.idNumber}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="address">
              Địa chỉ thường trú <span>*</span>
            </Label>
            <InputWrapper>
              <InputIcon>
                <MapPinIcon className="w-5 h-5" />
              </InputIcon>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ thường trú"
                className={errors.address ? "border-red-500" : ""}
              />
            </InputWrapper>
            {errors.address && <ErrorText>{errors.address}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="submissionDate">Ngày gửi đơn</Label>
            <InputWrapper>
              <InputIcon>
                <CalendarIcon className="w-5 h-5" />
              </InputIcon>
              <Input
                type="date"
                id="submissionDate"
                name="submissionDate"
                value={formData.submissionDate}
                onChange={handleChange}
                disabled
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="idFrontPhoto">
              Ảnh mặt trước CCCD/CMT <span>*</span>
            </Label>
            <Input
              type="file"
              id="idFrontPhoto"
              name="idFrontPhoto"
              accept="image/*"
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.idFrontPhoto && (
              <ErrorText>{errors.idFrontPhoto}</ErrorText>
            )}

            {frontPreviewUrl && (
              <FilePreview>
                <PhotoIcon className="w-4 h-4" />
                <span>Đã chọn: {formData.idFrontPhoto?.name}</span>
                <div style={{ marginTop: "8px" }}>
                  <img
                    src={frontPreviewUrl}
                    alt="Mặt trước giấy tờ tùy thân"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </FilePreview>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="idBackPhoto">
              Ảnh mặt sau CCCD/CMT <span>*</span>
            </Label>
            <Input
              type="file"
              id="idBackPhoto"
              name="idBackPhoto"
              accept="image/*"
              onChange={handleChange}
              className={errors.idBackPhoto ? "border-red-500" : ""}
            />
            {errors.idBackPhoto && <ErrorText>{errors.idBackPhoto}</ErrorText>}

            {backPreviewUrl && (
              <FilePreview>
                <PhotoIcon className="w-4 h-4" />
                <span>Đã chọn: {formData.idBackPhoto?.name}</span>
                <div style={{ marginTop: "8px" }}>
                  <img
                    src={backPreviewUrl}
                    alt="Mặt sau giấy tờ tùy thân"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </FilePreview>
            )}
          </FormGroup>

          <p className="mt-1 text-xs text-gray-500">
            Vui lòng tải lên ảnh rõ nét, đầy đủ thông tin trên giấy tờ tùy thân
          </p>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Gửi đơn đăng ký"}
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default HostRegistrationForm;
