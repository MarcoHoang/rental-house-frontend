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
import hostApi from "../../api/hostApi"; // API dành riêng cho Host
import authService from "../../api/authService"; // API chung, dùng để upload ảnh

// --- STYLED COMPONENTS (Giữ nguyên 100% giao diện của bạn) ---

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;
`;
const ProfileCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;
const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  position: relative;

  .back-button {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
  .host-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 1rem;
  }
  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
  }
  p {
    font-size: 1.125rem;
    margin: 0;
    opacity: 0.9;
  }
`;
const AvatarSection = styled.div`
  text-align: center;
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
  .avatar-container {
    position: relative;
    display: inline-block;
    margin-bottom: 1rem;
  }
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #e2e8f0;
  }
  .avatar-upload {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #1e40af;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    &:hover {
      background: #1e3a8a;
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
  gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const FormSection = styled.div`
  grid-column: 1 / -1;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
  margin-top: 1rem;
  h3 {
    color: #1a202c;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;
const ActionButtons = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  margin-top: 1rem;
`;

// --- COMPONENT MẪU (BẠN CÓ THỂ THAY BẰNG COMPONENT CỦA MÌNH) ---
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
  /* ... */
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
      setAvatarPreview(hostData.avatar || "/default-avatar.png");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatarFile: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let uploadedAvatarUrl = null;

      if (formData.avatarFile) {
        // Tái sử dụng authService để upload avatar, vì nó là chức năng chung
        const uploadResult = await authService.uploadAvatar(
          formData.avatarFile
        );
        if (uploadResult.success && uploadResult.data.fileUrl) {
          uploadedAvatarUrl = uploadResult.data.fileUrl;
        } else {
          throw new Error("Upload avatar thất bại");
        }
      }

      const profileData = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        nationalId: formData.nationalId,
        avatarUrl: uploadedAvatarUrl,
      };

      await hostApi.updateMyProfile(profileData);
      showSuccess("Thành công!", "Thông tin của bạn đã được cập nhật.");
      fetchHostProfile();
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
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <button className="back-button" onClick={() => navigate("/host")}>
            <ArrowLeft size={20} /> Quay lại
          </button>
          <h1>Thông tin chủ nhà</h1>
          <p>{formData.fullName || formData.username}</p>
          <div className="host-badge">
            <Building2 size={16} /> Chủ nhà
          </div>
        </ProfileHeader>

        <ProfileForm onSubmit={handleSubmit}>
          <AvatarSection>
            <div className="avatar-container">
              <img src={avatarPreview} alt="Avatar" className="avatar" />
              <label className="avatar-upload">
                <Camera size={20} />
                <input
                  type="file"
                  className="avatar-input"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              Nhấp vào camera để đổi ảnh đại diện
            </p>
          </AvatarSection>

          <FormSection style={{ gridColumn: "1 / -1", marginTop: 0 }}>
            <h3>
              <User size={20} /> Thông tin cá nhân
            </h3>
          </FormSection>

          <FormField
            label="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            icon={User}
          />
          <FormField
            label="Số điện thoại"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            icon={Phone}
          />
          <FormField
            label="Địa chỉ"
            name="address"
            value={formData.address}
            onChange={handleChange}
            icon={MapPin}
          />

          <FormSection>
            <h3>
              <Shield size={20} /> Thông tin tài khoản
            </h3>
            <p style={{ color: "#718096" }}>
              <strong>Username:</strong> {formData.username} (không thể thay
              đổi)
            </p>
            <p style={{ color: "#718096" }}>
              <strong>Email:</strong> {formData.email} (không thể thay đổi)
            </p>
          </FormSection>

          <ActionButtons>
            <Button type="button" onClick={() => navigate("/host")}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save size={16} style={{ marginRight: "0.5rem" }} />
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </ActionButtons>
        </ProfileForm>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default HostProfilePage;
