import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Save,
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Shield,
} from "lucide-react";
import { useToast } from "../../components/common/Toast";
import hostApi from "../../api/hostApi";
import authService from "../../api/authService";
import HostPageWrapper from "../../components/layout/HostPageWrapper";
import { getAvatarUrl } from "../../utils/avatarHelper";

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;
`;

const ProfileCard = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
  position: relative;

  .back-button {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    font-weight: 500;
    
    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  }
  
  .host-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.75rem 1.5rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 1.5rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 0.75rem 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  p {
    font-size: 1.25rem;
    margin: 0;
    opacity: 0.95;
    font-weight: 500;
  }
`;

const AvatarSection = styled.div`
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  height: fit-content;
  max-width: 350px;
  margin: 0 auto;
  
  .avatar-container {
    position: relative;
    display: inline-block;
    margin-bottom: 1rem;
  }
  
  .avatar {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }
  }
  
  .avatar-upload {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: 2px solid white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
    }
  }
  
  .avatar-input {
    display: none;
  }
`;

const ProfileForm = styled.form`
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 900px;
  margin: 0 auto;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButtons = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 2rem;
  margin-top: 1rem;
`;

const FormField = ({
  label,
  name,
  value,
  onChange,
  error,
  icon: Icon,
  required,
  ...props
}) => (
  <div style={{ gridColumn: name === "address" ? "1 / -1" : "auto" }}>
    <label style={{ display: "block", marginBottom: "0.5rem" }}>
      {label} {required && "*"}
    </label>
    <div style={{ position: "relative" }}>
      {Icon && (
        <Icon
          size={18}
          style={{
            position: "absolute",
            left: "0.75rem",
            top: "0.875rem",
            color: "#9ca3af",
          }}
        />
      )}
      <input
        name={name}
        value={value}
        onChange={onChange}
        {...props}
        style={{
          width: "100%",
          padding: "0.75rem",
          paddingLeft: Icon ? "2.5rem" : "0.75rem",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
        }}
      />
    </div>
    {error && (
      <p style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem" }}>
        {error}
      </p>
    )}
  </div>
);

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const HostProfilePage = () => {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("/default-avatar.png");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    phone: "",
    address: "",
    nationalId: "",
    avatarFile: null,
  });

  const [errors, setErrors] = useState({});

  const fetchHostProfile = useCallback(async () => {
    setLoading(true);
    try {
      const hostData = await hostApi.getMyProfile();
      
      setFormData({
        fullName: hostData.fullName || "",
        email: hostData.email || "",
        username: hostData.username || "",
        phone: hostData.phone || "",
        address: hostData.address || "",
        nationalId: hostData.nationalId || "",
        avatarFile: null,
      });
                   // Debug avatar data
      console.log('HostProfilePage - hostData.avatar:', hostData.avatar);
      console.log('HostProfilePage - hostData:', hostData);
      
      // Sử dụng avatarHelper để xử lý URL avatar
      const avatarUrl = getAvatarUrl(hostData.avatar);
      console.log('HostProfilePage - Processed avatar URL:', avatarUrl);
      setAvatarPreview(avatarUrl);
    } catch (error) {
      showError("Lỗi", "Không thể tải thông tin cá nhân.");
      navigate("/host");
    } finally {
      setLoading(false);
    }
  }, [showError, navigate]);

  useEffect(() => {
    fetchHostProfile();
  }, [fetchHostProfile]);

  // Cleanup blob URLs khi component unmount hoặc khi avatarPreview thay đổi
  useEffect(() => {
    return () => {
      // Cleanup blob URL khi component unmount
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Cleanup blob URL khi avatarPreview thay đổi
  useEffect(() => {
    const prevAvatarPreview = avatarPreview;
    return () => {
      if (prevAvatarPreview && prevAvatarPreview.startsWith('blob:') && prevAvatarPreview !== avatarPreview) {
        URL.revokeObjectURL(prevAvatarPreview);
      }
    };
  }, [avatarPreview]);

  // Debug: Log khi avatarPreview thay đổi
  useEffect(() => {
    console.log('HostProfilePage - Avatar preview changed to:', avatarPreview);
  }, [avatarPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      // Nếu không có file được chọn, không làm gì
      return;
    }

    console.log('HostProfilePage - Selected file:', file.name, file.type, file.size);

    // Kiểm tra loại file
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      showError("Lỗi", "Chỉ chấp nhận file JPG hoặc PNG");
      return;
    }

    // Kiểm tra dung lượng file (tối đa 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showError("Lỗi", "Kích thước ảnh tối đa 5MB");
      return;
    }

    // Tạo URL tạm để hiển thị preview
    const previewUrl = URL.createObjectURL(file);
    console.log('HostProfilePage - Created preview URL:', previewUrl);
    
    setFormData((prev) => ({ ...prev, avatarFile: file }));
    setAvatarPreview(previewUrl);
    console.log('HostProfilePage - Set avatar preview to:', previewUrl);

    // Không hiển thị toast ở đây nữa, chỉ hiển thị khi lưu thành công
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
      isValid = false;
    } else if (!/^[\p{L}\s]+$/u.test(formData.fullName)) {
      newErrors.fullName = "Họ và tên không được chứa ký tự đặc biệt";
      isValid = false;
    }

    if (!formData.phone) {
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

    if (formData.address && !/^[\p{L}0-9\s,./-]+$/u.test(formData.address)) {
      newErrors.address = "Địa chỉ chứa ký tự không hợp lệ";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedAvatarUrl = null;

      if (formData.avatarFile) {
        const uploadResult = await authService.uploadAvatar(
          formData.avatarFile
        );
        
        console.log('HostProfilePage - Upload result:', uploadResult);
        
        if (uploadResult && uploadResult.fileUrl) {
          uploadedAvatarUrl = uploadResult.fileUrl;
          console.log('HostProfilePage - Uploaded avatar URL:', uploadedAvatarUrl);
        } else {
          throw new Error("Upload avatar thất bại");
        }
      }

                   const profileData = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        nationalId: formData.nationalId,
        email: formData.email,
      };

      // Chỉ thêm avatarUrl nếu có file avatar mới
      if (uploadedAvatarUrl) {
        profileData.avatarUrl = uploadedAvatarUrl;
      }

      // Debug: Log dữ liệu gửi lên
      console.log('HostProfilePage - Sending profile data:', profileData);

            const updatedProfile = await hostApi.updateMyProfile(profileData);
      
      // Debug: Log dữ liệu nhận về
      console.log('HostProfilePage - Received updated profile:', updatedProfile);
      
      // Hiển thị thông báo thành công
      if (uploadedAvatarUrl) {
        showSuccess("Thành công!", "Thông tin và ảnh đại diện của bạn đã được cập nhật.");
      } else {
        showSuccess("Thành công!", "Thông tin của bạn đã được cập nhật.");
      }
      
      setFormData(prev => ({
        ...prev,
        fullName: updatedProfile.fullName || prev.fullName,
        phone: updatedProfile.phone || prev.phone,
        address: updatedProfile.address || prev.address,
        nationalId: updatedProfile.nationalId || prev.nationalId,
      }));
      
      // Cập nhật avatar preview từ response của backend hoặc từ uploadedAvatarUrl
      if (uploadedAvatarUrl) {
        // Nếu có upload avatar mới, sử dụng URL đã upload
        console.log('HostProfilePage - Using uploaded avatar URL:', uploadedAvatarUrl);
        
        const newAvatarPreview = getAvatarUrl(uploadedAvatarUrl);
        console.log('HostProfilePage - New avatar preview URL from upload:', newAvatarPreview);
        
        setAvatarPreview(newAvatarPreview);
        
        window.dispatchEvent(new CustomEvent('avatarUpdated', {
          detail: { avatarUrl: uploadedAvatarUrl }
        }));
      } else if (updatedProfile.avatar || updatedProfile.avatarUrl) {
        // Nếu không có upload mới, sử dụng từ response của backend
        const newAvatarUrl = updatedProfile.avatar || updatedProfile.avatarUrl;
        console.log('HostProfilePage - Avatar from updated profile:', newAvatarUrl);
        
        const newAvatarPreview = getAvatarUrl(newAvatarUrl);
        console.log('HostProfilePage - New avatar preview URL from profile:', newAvatarPreview);
        
        setAvatarPreview(newAvatarPreview);
        
        window.dispatchEvent(new CustomEvent('avatarUpdated', {
          detail: { avatarUrl: newAvatarUrl }
        }));
      }
      
      // Reset avatar file sau khi upload thành công
      setFormData(prev => ({
        ...prev,
        avatarFile: null
      }));
      
      // Debug: Log final avatar preview
      console.log('HostProfilePage - Final avatar preview state:', avatarPreview);
    } catch (err) {
      showError("Cập nhật thất bại!", err.message || "Có lỗi xảy ra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProfileContainer>
        <h1>Đang tải...</h1>
      </ProfileContainer>
    );
  }

  return (
    <HostPageWrapper 
      title="Thông tin chủ nhà"
      subtitle={formData.fullName || formData.username}
      showBackButton={true}
    >
      <div style={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
        padding: '1.5rem', 
        borderRadius: '1rem',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Building2 size={20} style={{ color: "#667eea" }} />
        <span style={{ color: "#4a5568", fontWeight: "500" }}>
          Chủ nhà
        </span>
      </div>

        <ProfileForm onSubmit={handleSubmit}>
          {/* Thông báo yêu cầu cập nhật số điện thoại cho Google users */}
          {formData.phone === "0000000000" && (
            <div style={{
              background: "#fff3cd",
              border: "1px solid #ffeaa7",
              color: "#856404",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              gridColumn: "1 / -1"
            }}>
              📱 <strong>Vui lòng cập nhật số điện thoại của bạn!</strong> 
              Số điện thoại hiện tại là số mặc định. Hãy cập nhật để có thể sử dụng đầy đủ tính năng của hệ thống.
            </div>
          )}
          
          <AvatarSection>
            <div className="avatar-container" style={{ position: 'relative' }}>
              <img 
                src={avatarPreview} 
                alt="Avatar" 
                className="avatar" 
                onLoad={() => console.log('HostProfilePage - Avatar image loaded successfully:', avatarPreview)}
                onError={(e) => console.error('HostProfilePage - Avatar image failed to load:', avatarPreview, e)}
              />
              {formData.avatarFile && (
                <div
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    background: "#10b981",
                    color: "white",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    border: "2px solid white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                  title="Ảnh mới đã được chọn"
                >
                  ✨
                </div>
              )}
              <label className="avatar-upload">
                <Camera size={16} />
                <input
                  type="file"
                  className="avatar-input"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            {formData.avatarFile && (
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#10b981",
                  marginTop: "0.5rem",
                  fontWeight: "500",
                  textAlign: "center"
                }}
              >
                ✅ Ảnh đã được chọn - Nhấn "Cập nhật" để lưu thay đổi
              </p>
            )}
          </AvatarSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ 
                color: "#1a202c", 
                fontSize: "1.25rem", 
                fontWeight: "600", 
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <User size={20} /> Thông tin cá nhân
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <FormField
                  label="Họ và tên"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  icon={User}
                  error={errors.fullName}
                />
                <FormField
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={Phone}
                  error={errors.phone}
                />
                <FormField
                  label="Địa chỉ"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  icon={MapPin}
                  error={errors.address}
                />
              </div>
            </div>

            <div>
              <h3 style={{ 
                color: "#1a202c", 
                fontSize: "1.25rem", 
                fontWeight: "600", 
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <Shield size={20} /> Thông tin tài khoản
              </h3>
              <div style={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
                padding: '1.5rem', 
                borderRadius: '1rem',
                border: '1px solid #e2e8f0'
              }}>
                <p style={{ 
                  color: "#4a5568", 
                  fontSize: "1rem",
                  fontWeight: "500",
                  margin: "0",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <Mail size={18} style={{ color: "#667eea" }} />
                  <strong>Email:</strong> {formData.email} (không thể thay đổi)
                </p>
              </div>
            </div>
          </div>

          <ActionButtons>
            <Button 
              type="button" 
              onClick={() => navigate("/host")}
              style={{
                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                color: '#475569',
                border: '1px solid #cbd5e0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              <ArrowLeft size={16} />
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
            >
              <Save size={16} />
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </ActionButtons>
        </ProfileForm>
    </HostPageWrapper>
  );
};

export default HostProfilePage;
