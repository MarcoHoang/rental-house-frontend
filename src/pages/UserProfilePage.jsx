import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import authService from "../api/authService";
import { useToast } from "../components/common/Toast";
import { getAvatarUrl } from "../utils/avatarHelper";
import Avatar from "../components/common/Avatar";
import HostApplicationStatus from "../components/host/HostApplicationStatus";

const ProfileContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
`;

const ProfileTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const ProfileSubtitle = styled.p`
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
`;

const ProfileContent = styled.div`
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const SectionDivider = styled.div`
  height: 1px;
  background: linear-gradient(to right, transparent, #e5e7eb, transparent);
  margin: 2rem 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;

  span {
    color: #ef4444;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 1px #4f46e5;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const AvatarWrapper = styled.div`
  margin-right: 1.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
    border-color: #9ca3af;
    transform: translateY(-1px);
  }
`;

const Button = styled.button`
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &.secondary {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
  }

  &.outline {
    background: transparent;
    border: 2px solid #667eea;
    color: #667eea;
    
    &:hover {
      background: #667eea;
      color: white;
    }
  }
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SuccessMessage = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    avatar: null,
    avatarPreview: getAvatarUrl(null),
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();

  // Lấy thông tin user khi component mount
  useEffect(() => {
    console.log("UserProfilePage mounted or updated");
    let isMounted = true;

    const fetchUserProfile = async () => {
      console.log("Starting to fetch user profile...");
      if (!isMounted) return;

      setIsSubmitting(true);
      try {
        // Kiểm tra xem có đang bật xác thực không
        const ENABLE_AUTH = false; // Lấy từ App.jsx hoặc config

        if (ENABLE_AUTH) {
          // Kiểm tra token trước khi gọi API
          const token = localStorage.getItem("token");
          if (!token) {
            navigate("/login", {
              state: {
                from: "/profile",
                error: "Vui lòng đăng nhập để tiếp tục",
              },
              replace: true,
            });
            return;
          }
        }

        const userData = await authService.getCurrentUser();
        console.log("=== DEBUG USER PROFILE PAGE ===");
        console.log("UserProfilePage - Received user data:", userData);
        console.log(
          "UserProfilePage - userData.fullName (tên hiển thị):",
          userData?.fullName
        );
        console.log(
          "UserProfilePage - userData.email (email):",
          userData?.email
        );
        console.log(
          "UserProfilePage - userData.username (username):",
          userData?.username
        );
        console.log("=== END DEBUG ===");

        if (!isMounted) {
          console.log("Component unmounted, skipping state update");
          return;
        }

        // Nếu không có dữ liệu user và đang bật xác thực, chuyển hướng
        if (ENABLE_AUTH && !userData) {
          navigate("/login", {
            state: {
              from: "/profile",
              error: "Vui lòng đăng nhập để tiếp tục",
            },
            replace: true,
          });
          return;
        }

        // Cập nhật state với dữ liệu người dùng
        setUser(userData);
        setUserId(userData?.id);

        setProfile((prev) => ({
          ...prev,
          email: userData?.email || "",
          fullName: userData?.fullName || "",
          phone: userData?.phone || "",
          address: userData?.address || "",
          dateOfBirth: userData?.birthDate || userData?.dateOfBirth || "", // Hỗ trợ cả birthDate và dateOfBirth
          avatar: null, // Reset avatar file
          avatarPreview: getAvatarUrl(userData?.avatarUrl || userData?.avatar), // Sử dụng helper function để xử lý URL
        }));
      } catch (error) {
        if (!isMounted) return;

        const ENABLE_AUTH = false; // Lấy từ App.jsx hoặc config

        if (ENABLE_AUTH && error.response?.status === 401) {
          // Chuyển hướng về trang đăng nhập nếu chưa đăng nhập
          navigate("/login", {
            state: {
              from: "/profile",
              error: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
            },
            replace: true,
          });
        } else {
          // Chỉ hiển thị lỗi nếu không phải lỗi 401 (đã xử lý redirect)
          if (error.response?.status !== 401) {
            setMessage({
              text: "Không thể tải thông tin người dùng. Vui lòng thử lại sau.",
              type: "error",
            });
          }
        }
      } finally {
        if (isMounted) {
          setIsSubmitting(false);
        }
      }
    };

    fetchUserProfile();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Hàm xử lý quay lại trang trước
  const handleGoBack = () => {
    // Kiểm tra xem có phải đang từ trang change-password quay lại không
    const referrer = location.state?.from;

    if (referrer && referrer !== "/change-password") {
      // Nếu có referrer và không phải từ change-password, quay lại trang đó
      navigate(referrer, { replace: true });
    } else {
      // Nếu không có referrer hoặc từ change-password, quay về trang chủ
      navigate("/", { replace: true });
    }
  };

  // Cập nhật thông tin profile khi user thay đổi
  useEffect(() => {
    const ENABLE_AUTH = false; // Lấy từ App.jsx hoặc config

    if (user) {
      setProfile((prev) => ({
        ...prev,
        email: user.email || "",
        fullName: user.fullName || "",
        phone: user.phone || "",
        address: user.address || "",
        dateOfBirth: user.birthDate || user.dateOfBirth || "", // Hỗ trợ cả birthDate và dateOfBirth
        avatarPreview: getAvatarUrl(user.avatarUrl || user.avatar), // Sử dụng helper function để xử lý URL
      }));
    } else if (ENABLE_AUTH) {
      // Nếu không có thông tin user và đang bật xác thực, chuyển hướng về trang đăng nhập
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Debug cho ngày sinh
    if (name === "dateOfBirth") {
      console.log("UserProfilePage.handleChange - dateOfBirth changed:", value);
    }

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

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
    if (!file) return;

    // Kiểm tra loại file
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ text: "Chỉ chấp nhận file JPG hoặc PNG", type: "error" });
      return;
    }

    // Kiểm tra dung lượng file (tối đa 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ text: "Kích thước ảnh tối đa 5MB", type: "error" });
      return;
    }

    // Tạo URL tạm để hiển thị preview
    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) => ({
      ...prev,
      avatar: file,
      avatarPreview: previewUrl,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!profile.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
      isValid = false;
    } else if (!/^[\p{L}\s]+$/u.test(profile.fullName)) {
      newErrors.fullName = "Họ và tên không được chứa ký tự đặc biệt";
      isValid = false;
    }

    if (!profile.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
      isValid = false;
    } else {
      // Loại bỏ khoảng trắng và dấu gạch ngang trước khi validate
      const cleanPhone = profile.phone.replace(/[\s-]/g, '');
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

    if (profile.address && !/^[\p{L}0-9\s,./-]+$/u.test(profile.address)) {
      newErrors.address = "Địa chỉ chứa ký tự không hợp lệ";
      isValid = false;
    }

    // Validation cho ngày sinh
    if (profile.dateOfBirth) {
      const selectedDate = new Date(profile.dateOfBirth);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Đặt thời gian cuối ngày hôm nay

      if (isNaN(selectedDate.getTime())) {
        newErrors.dateOfBirth = "Ngày sinh không hợp lệ";
        isValid = false;
      } else if (selectedDate > today) {
        newErrors.dateOfBirth = "Ngày sinh không được vượt quá ngày hiện tại";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !userId) {
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      let avatarUrl = profile.avatarPreview; // Giữ avatar hiện tại

      // Upload avatar mới nếu có
      if (profile.avatar && profile.avatar instanceof File) {
        try {
          const uploadResult = await authService.uploadAvatar(profile.avatar);
          
          // Xử lý response format từ fileUploadApi
          if (uploadResult && uploadResult.fileUrl) {
            avatarUrl = uploadResult.fileUrl;
            showSuccess(
              "Upload avatar thành công!",
              "Ảnh đại diện của bạn đã được cập nhật."
            );
          } else if (uploadResult && typeof uploadResult === 'string') {
            // Nếu response là string URL
            avatarUrl = uploadResult;
            showSuccess(
              "Upload avatar thành công!",
              "Ảnh đại diện của bạn đã được cập nhật."
            );
          } else {
            throw new Error("Upload avatar thất bại - response không hợp lệ");
          }
        } catch (uploadError) {
          showError(
            "Upload avatar thất bại!",
            "Lỗi khi upload ảnh đại diện: " +
              (uploadError.message || "Upload thất bại")
          );
          return;
        }
      }

      // Chuẩn bị dữ liệu gửi đi
      const userData = {
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address || null,
        dateOfBirth: profile.dateOfBirth || null,
        avatarUrl: avatarUrl, // Sử dụng URL avatar đã upload hoặc hiện tại
      };

      // Gọi API cập nhật profile
      const result = await authService.updateProfile(userId, userData);

      if (!result || !result.success) {
        throw new Error(result?.error || "Cập nhật thất bại");
      }

      // Cập nhật thông tin trong localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const newUserData = {
        ...currentUser,
        ...result.data,
        avatarUrl: avatarUrl, // Đảm bảo avatar URL mới được lưu
      };
      localStorage.setItem("user", JSON.stringify(newUserData));

      setUser(newUserData);

      // Cập nhật avatar preview với URL mới
      const newAvatarPreview = getAvatarUrl(avatarUrl);
      
      setProfile((prev) => ({
        ...prev,
        avatarPreview: newAvatarPreview,
        avatar: null, // Reset avatar file
      }));

      showSuccess(
        "Cập nhật thành công!",
        "Thông tin hồ sơ của bạn đã được cập nhật thành công."
      );

      // Cập nhật lại giao diện
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      // Chỉ hiển thị thông báo nếu không phải lỗi 401 (đã xử lý trong authService)
      if (error.response?.status !== 401) {
        showError(
          "Cập nhật thất bại!",
          error.message || "Có lỗi xảy ra khi cập nhật thông tin"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hiển thị loading state
  if (isSubmitting && !user) {
    return (
      <ProfileContainer>
        <ProfileCard>
          <ProfileHeader>
            <ProfileTitle>Hồ sơ cá nhân</ProfileTitle>
            <ProfileSubtitle>Đang tải thông tin...</ProfileSubtitle>
          </ProfileHeader>
          <ProfileContent>
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <LoadingSpinner />
              <p style={{ marginTop: '1rem', color: '#6b7280' }}>
                Đang tải thông tin hồ sơ...
              </p>
            </div>
          </ProfileContent>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <div style={{ position: 'relative' }}>
            <Button
              type="button"
              className="outline"
              onClick={handleGoBack}
              style={{
                position: 'absolute',
                top: '-1rem',
                left: '-1rem',
                padding: '0.5rem',
                minWidth: 'auto',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontSize: '0.75rem'
              }}
            >
              ←
            </Button>
            <ProfileTitle>Hồ sơ cá nhân</ProfileTitle>
            <ProfileSubtitle>
              Quản lý thông tin cá nhân và bảo mật tài khoản
            </ProfileSubtitle>
          </div>
        </ProfileHeader>

        <ProfileContent>
          {/* Thông báo thành công */}
          {message.type === "success" && (
            <SuccessMessage>
              ✅ {message.text}
            </SuccessMessage>
          )}

          {/* Thông báo lỗi */}
          {message.type === "error" && (
            <ErrorText>
              ❌ {message.text}
            </ErrorText>
          )}

          {/* Thông báo yêu cầu cập nhật số điện thoại cho Google users */}
          {profile.phone === "0000000000" && (
            <div style={{
              background: "#fff3cd",
              border: "1px solid #ffeaa7",
              color: "#856404",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              📱 <strong>Vui lòng cập nhật số điện thoại của bạn!</strong> 
              Số điện thoại hiện tại là số mặc định. Hãy cập nhật để có thể sử dụng đầy đủ tính năng của hệ thống.
            </div>
          )}

          {/* Phần thông tin cá nhân */}
          <Section>
            <SectionTitle>
              👤 Thông tin cá nhân
            </SectionTitle>
            <SectionDescription>
              Cập nhật thông tin cá nhân của bạn để có trải nghiệm tốt nhất
            </SectionDescription>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Ảnh đại diện</Label>
                <AvatarSection>
                  <AvatarWrapper>
                    <Avatar
                      src={profile.avatarPreview}
                      alt="Avatar"
                      size="100px"
                      name={profile.fullName}
                    />
                  </AvatarWrapper>
                  <div>
                    <FileInput
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <FileLabel htmlFor="avatar">📷 Chọn ảnh</FileLabel>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        marginTop: "0.5rem",
                      }}
                    >
                      Định dạng: JPG, PNG. Kích thước tối đa: 5MB
                    </p>
                  </div>
                </AvatarSection>
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                  placeholder="Email"
                  style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  Họ và tên <span>*</span>
                </Label>
                <Input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                />
                {errors.fullName && <ErrorText>⚠️ {errors.fullName}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>Ngày sinh</Label>
                <Input
                  type="date"
                  name="dateOfBirth"
                  max={new Date().toISOString().split("T")[0]}
                  value={(() => {
                    if (!profile.dateOfBirth) return "";
                    try {
                      const date = new Date(profile.dateOfBirth);
                      if (isNaN(date.getTime())) return "";
                      return date.toISOString().split("T")[0];
                    } catch (error) {
                      console.error("Error parsing dateOfBirth:", error);
                      return "";
                    }
                  })()}
                  onChange={handleChange}
                />
                {errors.dateOfBirth && <ErrorText>⚠️ {errors.dateOfBirth}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="phone">
                  Số điện thoại <span>*</span>
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && <ErrorText>⚠️ {errors.phone}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={profile.address || ""}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ"
                />
                {errors.address && <ErrorText>⚠️ {errors.address}</ErrorText>}
              </FormGroup>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    💾 Lưu thay đổi
                  </>
                )}
              </Button>
            </form>
          </Section>

          <SectionDivider />

          {/* Phần bảo mật tài khoản */}
          <Section>
            <SectionTitle>
              🔒 Bảo mật tài khoản
            </SectionTitle>
            <SectionDescription>
              Đổi mật khẩu để bảo vệ tài khoản của bạn khỏi các rủi ro bảo mật
            </SectionDescription>
            
            <Button
              type="button"
              className="secondary"
              onClick={() => {
                const originalFrom = location.state?.from || "/";
                navigate("/change-password", {
                  state: { from: originalFrom },
                });
              }}
            >
              🔑 Đổi mật khẩu
            </Button>
          </Section>

          <SectionDivider />

          {/* Phần đơn đăng ký làm chủ nhà */}
          <Section>
            <SectionTitle>
              🏠 Đơn đăng ký làm chủ nhà
            </SectionTitle>
            <SectionDescription>
              Theo dõi trạng thái đơn đăng ký làm chủ nhà của bạn và cập nhật thông tin khi cần thiết
            </SectionDescription>
            
            <HostApplicationStatus />
          </Section>
        </ProfileContent>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default UserProfilePage;
