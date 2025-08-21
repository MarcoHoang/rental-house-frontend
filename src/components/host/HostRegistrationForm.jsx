import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  DocumentTextIcon,
  PhotoIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3182ce, #667eea);
    z-index: 1;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  z-index: 2;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #3182ce;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background-color: #f1f5f9;
    color: #475569;
    transform: scale(1.05);
  }
`;

const Form = styled.form`
  padding: 2rem;
  padding-bottom: 3rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;

  span {
    color: #ef4444;
    margin-left: 0.25rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  background-color: #fafafa;

  &:focus {
    outline: none;
    border-color: #3182ce;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }

  &[type="file"] {
    padding: 1rem;
    border: 2px dashed #d1d5db;
    background-color: #f8fafc;
    cursor: pointer;
    text-align: center;

    &::file-selector-button {
      display: none;
    }

    &:hover {
      border-color: #3182ce;
      background-color: #f0f9ff;
    }
  }

  &:disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
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
  transition: color 0.2s;

  ${Input}:focus + & {
    color: #3182ce;
  }
`;

const ErrorText = styled.p`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const FilePreview = styled.div`
  margin-top: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #bae6fd;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #0369a1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ProfileSection = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
  border: 2px solid #bae6fd;
`;

const ProfileTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0c4a6e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProfileGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.875rem;
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
  border: 1px solid rgba(186, 230, 253, 0.5);
`;

const ProfileLabel = styled.span`
  font-weight: 600;
  color: #0c4a6e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  min-width: 120px;
`;

const ProfileValue = styled.span`
  color: #0369a1;
  font-weight: 500;
  font-size: 1rem;
  flex: 1;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #3182ce 0%, #667eea 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(49, 130, 206, 0.4);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const InfoText = styled.p`
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const HostRegistrationForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nationalId: "",
    address: "",
    phone: "",
    submissionDate: new Date().toISOString().split("T")[0],
  });
  const [userProfile, setUserProfile] = useState(null);
  const [frontPreviewUrl, setFrontPreviewUrl] = useState(null);
  const [backPreviewUrl, setBackPreviewUrl] = useState(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy thông tin user profile khi component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.id && user.email) {
          setUserProfile(user);
          // Pre-fill form với thông tin từ profile
          setFormData((prev) => ({
            ...prev,
            address: user.address || "",
            phone: user.phone || "",
          }));
        } else {
          // Thử lấy thông tin từ authService
          const authService = (await import("../../api/authService")).default;
          const profile = await authService.getProfile();
          if (profile) {
            setUserProfile(profile);
            localStorage.setItem("user", JSON.stringify(profile));
            // Pre-fill form với thông tin từ profile
            setFormData((prev) => ({
              ...prev,
              address: profile.address || "",
              phone: profile.phone || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    if (isOpen) {
      loadUserProfile();
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.nationalId.trim()) {
      newErrors.nationalId = "Vui lòng nhập số căn cước công dân/CMT";
      isValid = false;
    } else if (!/^[0-9]{9,12}$/.test(formData.nationalId)) {
      newErrors.nationalId = "Số căn cước/CMT không hợp lệ (9-12 số)";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
      isValid = false;
    } else {
      // Loại bỏ khoảng trắng và dấu gạch ngang trước khi validate
      const cleanPhone = formData.phone.replace(/[\s-]/g, '');
      if (!/^[0-9]+$/.test(cleanPhone)) {
        newErrors.phone = "Số điện thoại chỉ được chứa các chữ số từ 0-9";
        isValid = false;
      } else if (cleanPhone === "0000000000") {
        newErrors.phone = "Vui lòng nhập số điện thoại thực tế của bạn";
        isValid = false;
      } else if (!/^0\d{9}$/.test(cleanPhone)) {
        newErrors.phone = "Số điện thoại không hợp lệ, phải bắt đầu bằng 0 và có 10 chữ số";
        isValid = false;
      }
    }

    if (!formData.idFrontPhoto) {
      newErrors.idFrontPhoto = "Vui lòng tải lên ảnh mặt trước CCCD/CMT";
      isValid = false;
    }

    if (!formData.idBackPhoto) {
      newErrors.idBackPhoto = "Vui lòng tải lên ảnh mặt sau CCCD/CMT";
      isValid = false;
    }

    if (!formData.proofOfOwnership) {
      newErrors.proofOfOwnership =
        "Vui lòng tải lên giấy tờ chứng minh quyền sở hữu";
      isValid = false;
    }

    // Kiểm tra thông tin profile
    if (!userProfile?.fullName) {
      newErrors.profile = "Vui lòng cập nhật họ tên trong hồ sơ cá nhân";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (
      (name === "idFrontPhoto" ||
        name === "idBackPhoto" ||
        name === "proofOfOwnership") &&
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
      } else if (name === "idBackPhoto") {
        setBackPreviewUrl(fileUrl);
      } else if (name === "proofOfOwnership") {
        setProofPreviewUrl(fileUrl);
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
      if (!userProfile?.id || !userProfile?.email) {
        throw new Error(
          "Thông tin người dùng không đầy đủ. Vui lòng đăng nhập lại."
        );
      }

      // Tạo FormData với thông tin user và files
      const formDataToSend = new FormData();
      formDataToSend.append("userId", userProfile.id.toString());
      formDataToSend.append("userEmail", userProfile.email);
      formDataToSend.append(
        "username",
        userProfile.fullName || userProfile.username || userProfile.email
      );
      formDataToSend.append("nationalId", formData.nationalId);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("phone", formData.phone);

      // Thêm files vào FormData
      if (formData.idFrontPhoto) {
        formDataToSend.append("idFrontPhoto", formData.idFrontPhoto);
      }
      if (formData.idBackPhoto) {
        formDataToSend.append("idBackPhoto", formData.idBackPhoto);
      }
      if (formData.proofOfOwnership) {
        formDataToSend.append("proofOfOwnership", formData.proofOfOwnership);
      }

      console.log("FormData being sent:", {
        userId: userProfile.id,
        userEmail: userProfile.email,
        username:
          userProfile.fullName || userProfile.username || userProfile.email,
        nationalId: formData.nationalId,
        address: formData.address,
        phone: formData.phone,
        hasFrontPhoto: !!formData.idFrontPhoto,
        hasBackPhoto: !!formData.idBackPhoto,
        hasProofOfOwnership: !!formData.proofOfOwnership,
      });

      await onSubmit(formDataToSend);
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi đơn đăng ký:", error);
      // Không throw error ở đây, để Header.jsx xử lý
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <HomeIcon className="w-6 h-6" />
            Đăng ký trở thành chủ nhà
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <XMarkIcon className="w-5 h-5" />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          {/* Hiển thị thông tin từ profile */}
          {userProfile && (
            <ProfileSection>
              <ProfileTitle>
                <UserIcon className="w-5 h-5" />
                Thông tin từ hồ sơ cá nhân
              </ProfileTitle>
                             <ProfileGrid>
                 <ProfileItem>
                   <ProfileLabel>
                     <UserIcon className="w-4 h-4" />
                     Họ tên:
                   </ProfileLabel>
                   <ProfileValue>
                     {userProfile.fullName || "Chưa cập nhật"}
                   </ProfileValue>
                 </ProfileItem>
                 <ProfileItem>
                   <ProfileLabel>
                     <EnvelopeIcon className="w-4 h-4" />
                     Email:
                   </ProfileLabel>
                   <ProfileValue>{userProfile.email}</ProfileValue>
                 </ProfileItem>
                 <ProfileItem>
                   <ProfileLabel>
                     <PhoneIcon className="w-4 h-4" />
                     Số điện thoại:
                   </ProfileLabel>
                   <ProfileValue>
                     {userProfile.phone || "Chưa cập nhật"}
                   </ProfileValue>
                 </ProfileItem>
                 {userProfile.address && (
                   <ProfileItem>
                     <ProfileLabel>
                       <MapPinIcon className="w-4 h-4" />
                       Địa chỉ:
                     </ProfileLabel>
                     <ProfileValue>{userProfile.address}</ProfileValue>
                   </ProfileItem>
                 )}
               </ProfileGrid>
                              {errors.profile && (
                 <ErrorText>
                   <ExclamationCircleIcon className="w-4 h-4" />
                   {errors.profile}
                 </ErrorText>
                )}
            </ProfileSection>
          )}

          <FormGroup>
            <Label htmlFor="nationalId">
              Số căn cước công dân/CMT <span>*</span>
            </Label>
            <InputWrapper>
              <InputIcon>
                <DocumentTextIcon className="w-5 h-5" />
              </InputIcon>
              <Input
                type="text"
                id="nationalId"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                placeholder="Nhập số căn cước/CMT (9-12 số)"
                className={errors.nationalId ? "border-red-500" : ""}
              />
            </InputWrapper>
                         {errors.nationalId && <ErrorText><ExclamationCircleIcon className="w-4 h-4" />{errors.nationalId}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="address">
              Địa chỉ <span>*</span>
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
                placeholder="Nhập địa chỉ của bạn"
                className={errors.address ? "border-red-500" : ""}
              />
            </InputWrapper>
                         {errors.address && <ErrorText><ExclamationCircleIcon className="w-4 h-4" />{errors.address}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">
              Số điện thoại <span>*</span>
            </Label>
            <InputWrapper>
              <InputIcon>
                <PhoneIcon className="w-5 h-5" />
              </InputIcon>
              <Input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại liên lạc"
                className={errors.phone ? "border-red-500" : ""}
              />
            </InputWrapper>
                         {errors.phone && <ErrorText><ExclamationCircleIcon className="w-4 h-4" />{errors.phone}</ErrorText>}
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
                         {errors.idFrontPhoto && <ErrorText><ExclamationCircleIcon className="w-4 h-4" />{errors.idFrontPhoto}</ErrorText>}

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
                         {errors.idBackPhoto && <ErrorText><ExclamationCircleIcon className="w-4 h-4" />{errors.idBackPhoto}</ErrorText>}

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

          <FormGroup>
            <Label htmlFor="proofOfOwnership">
              Giấy tờ chứng minh quyền sở hữu <span>*</span>
            </Label>
            <Input
              type="file"
              id="proofOfOwnership"
              name="proofOfOwnership"
              accept="image/*"
              onChange={handleChange}
              className={errors.proofOfOwnership ? "border-red-500" : ""}
            />
                         {errors.proofOfOwnership && <ErrorText><ExclamationCircleIcon className="w-4 h-4" />{errors.proofOfOwnership}</ErrorText>}

            {proofPreviewUrl && (
              <FilePreview>
                <DocumentTextIcon className="w-4 h-4" />
                <span>Đã chọn: {formData.proofOfOwnership?.name}</span>
                <div style={{ marginTop: "8px" }}>
                  <img
                    src={proofPreviewUrl}
                    alt="Giấy tờ chứng minh quyền sở hữu"
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

          <InfoText>
            <PhotoIcon className="w-4 h-4" />
            Vui lòng tải lên ảnh rõ nét, đầy đủ thông tin trên giấy tờ tùy thân
          </InfoText>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner />
                Đang gửi...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                Gửi đơn đăng ký
              </>
            )}
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default HostRegistrationForm;
