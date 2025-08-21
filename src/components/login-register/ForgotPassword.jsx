import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import authService from "../../api/authService";
import { Mail, Lock, Home, Key, Eye, EyeOff } from "lucide-react";
import FormField from "../common/FormField";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";

const ForgotPasswordContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
`;

const ForgotPasswordCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

const ForgotPasswordHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  .icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    margin-bottom: 1rem;
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
  }

  h1 {
    color: #1a202c;
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #718096;
    font-size: 0.875rem;
    margin: 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterLinks = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;

  p {
    margin: 0 0 0.75rem 0;
    color: #718096;
    font-size: 0.875rem;
  }

  a {
    color: #667eea;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    transition: all 0.2s ease-in-out;

    &:hover {
      color: #5a67d8;
      text-decoration: underline;
    }
  }
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const InfoMessage = styled.div`
  background: linear-gradient(135deg, #4299e1, #3182ce);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: "Vui lòng nhập email", type: "error" });
      return;
    }

    // Validation email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: "Email không hợp lệ. Vui lòng nhập email đúng định dạng (ví dụ: example@gmail.com)", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      // Bước 1: Check email có tồn tại trong database không
      const checkResponse = await authService.checkEmailExists(email);
      if (!checkResponse.data) {
        setMessage({
          text: "Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại email hoặc đăng ký tài khoản mới.",
          type: "error",
        });
        return;
      }

      // Bước 2: Nếu email tồn tại, gửi OTP
      await authService.requestPasswordReset(email);
      setEmailSent(true);
      setStep(2); // Chuyển đến bước kiểm tra email
      setMessage({
        text: "Mã OTP 6 số đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến (và cả thư mục spam/junk).",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToOtp = () => {
    setStep(3); // Chuyển đến bước nhập OTP
    setMessage({
      text: "Vui lòng nhập mã OTP 6 số từ email vào ô bên dưới",
      type: "info",
    });
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage({ text: "Vui lòng nhập mã OTP từ email", type: "error" });
      return;
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setMessage({ text: "Mã OTP phải là 6 số", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyOtp(otp);
      if (response.data) {
        setStep(4); // Chuyển đến bước đặt mật khẩu mới
        setMessage({
          text: "Mã OTP hợp lệ, vui lòng đặt mật khẩu mới",
          type: "success",
        });
      } else {
        setMessage({
          text: "Mã OTP không đúng hoặc đã hết hạn",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setMessage({ text: "Vui lòng nhập đầy đủ thông tin", type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Mật khẩu xác nhận không khớp", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: "Mật khẩu phải có ít nhất 6 ký tự", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(otp, newPassword);
      setMessage({
        text: "Đặt lại mật khẩu thành công! Bạn sẽ được chuyển hướng về trang đăng nhập",
        type: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setMessage({ text: "Vui lòng nhập email trước", type: "error" });
      return;
    }

    // Validation email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: "Email không hợp lệ. Vui lòng nhập email đúng định dạng (ví dụ: example@gmail.com)", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      // Check email trước khi gửi lại
      const checkResponse = await authService.checkEmailExists(email);
      if (!checkResponse.data) {
        setMessage({
          text: "Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại email hoặc đăng ký tài khoản mới.",
          type: "error",
        });
        return;
      }

      await authService.requestPasswordReset(email);
      setMessage({
        text: "Mã OTP 6 số đã được gửi lại đến email của bạn",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <ForgotPasswordContainer>
      <ForgotPasswordCard>
        {/* Đường viền gradient phía trên */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #3182ce, #667eea)",
          }}
        />

        {/* Phần tiêu đề */}
                 <ForgotPasswordHeader>
           <div className="icon-wrapper">
             <Key color="white" size={32} />
           </div>
           <h1>Quên mật khẩu</h1>
           <p>Vui lòng làm theo các bước để đặt lại mật khẩu</p>
         </ForgotPasswordHeader>

         {/* Thông báo sẽ hiển thị ở dưới step indicator */}

        {/* Step Indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2rem",
            position: "relative",
          }}
        >
          <div
            style={{
              content: "",
              position: "absolute",
              top: "1rem",
              left: 0,
              right: 0,
              height: "2px",
              backgroundColor: "#e5e7eb",
              zIndex: 1,
            }}
          />
          {[
            { num: 1, label: "Nhập email" },
            { num: 2, label: "Kiểm tra email" },
            { num: 3, label: "Nhập OTP" },
            { num: 4, label: "Đặt mật khẩu mới" },
          ].map((s, index) => (
            <div
              key={s.num}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                zIndex: 2,
                flex: 1,
              }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  backgroundColor:
                    step === s.num
                      ? "#4f46e5"
                      : step > s.num
                      ? "#a5b4fc"
                      : "#e5e7eb",
                  color: step === s.num || step > s.num ? "white" : "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: step === s.num || step > s.num ? "#4f46e5" : "#9ca3af",
                  fontWeight: step === s.num ? "600" : "400",
                  textAlign: "center",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Hộp thông báo - chỉ hiển thị ở step 1 */}
        {step === 1 && message.text && (
          <div
            style={{
              background: message.type === "error" ? "#fed7d7" : "#c6f6d5",
              color: message.type === "error" ? "#742a2a" : "#22543d",
              padding: "0.875rem 1rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              textAlign: "center",
              borderLeft: `4px solid ${
                message.type === "error" ? "#e53e3e" : "#38a169"
              }`,
              marginBottom: "1.25rem",
            }}
          >
            {message.text}
          </div>
        )}

        {step === 1 && (
          <Form onSubmit={handleRequestReset}>
                         <FormField
               label="Email"
               name="email"
               type="email"
               placeholder="Nhập email đã đăng ký"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               icon={Mail}
             />
                         <Button
               type="submit"
               disabled={isLoading}
               loading={isLoading}
             >
               {isLoading ? "Đang xử lý..." : "Gửi mã OTP"}
             </Button>
          </Form>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <InfoMessage>
              <Mail color="white" size={24} />
              📧 Hướng dẫn kiểm tra email:
            </InfoMessage>
            <ul
              style={{
                color: "#0c4a6e",
                fontSize: "0.875rem",
                margin: "0 0 0 0.5rem",
                paddingLeft: "1rem",
                lineHeight: "1.5",
              }}
            >
              <li>Kiểm tra hộp thư đến của bạn</li>
              <li>Kiểm tra thư mục spam/junk nếu không thấy</li>
              <li>Copy mã OTP 6 số từ email</li>
              <li>Nhấn "Tiếp tục" để nhập mã OTP</li>
            </ul>

            <div style={{ display: "flex", gap: "1rem" }}>
                             <Button
                 type="button"
                 onClick={handleResendEmail}
                 disabled={isLoading}
                 loading={isLoading}
                 variant="outline"
               >
                 {isLoading ? "Đang xử lý..." : "Gửi lại OTP"}
               </Button>

               <Button
                 type="button"
                 onClick={handleContinueToOtp}
                 disabled={isLoading}
               >
                 Tiếp tục
               </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <Form onSubmit={handleVerifyOtp}>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "3rem",
                  height: "3rem",
                  background: "#8b5cf6",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
              >
                <Lock color="white" size={24} />
              </div>
              <h3
                style={{
                  color: "#1a202c",
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Nhập mã OTP từ email
              </h3>
              <p
                style={{
                  color: "#718096",
                  fontSize: "0.875rem",
                  margin: 0,
                  lineHeight: "1.5",
                }}
              >
                Vui lòng copy mã OTP 6 số từ email và paste vào ô bên dưới
              </p>
            </div>

                         <FormField
               label="Mã OTP từ email"
               name="otp"
               type="text"
               placeholder="Nhập mã OTP 6 số từ email"
               value={otp}
               onChange={(e) => {
                 const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                 setOtp(value);
               }}
               required
               icon={Lock}
             />
            <small
              style={{
                display: "block",
                marginTop: "0.5rem",
                color: "#718096",
                fontSize: "0.75rem",
              }}
            >
              💡 <strong>Mẹo:</strong> Mã OTP là 6 số (ví dụ: 123456)
            </small>

            {/* Nút gửi lại email */}
                         <Button
               type="button"
               onClick={handleResendEmail}
               disabled={isLoading}
               loading={isLoading}
               variant="outline"
             >
               {isLoading ? "Đang xử lý..." : "Gửi lại OTP"}
             </Button>

             <Button
               type="submit"
               disabled={isLoading || !otp}
               loading={isLoading}
             >
               {isLoading ? "Đang xác thực..." : "Xác thực OTP"}
             </Button>
          </Form>
        )}

        {step === 4 && (
          <Form onSubmit={handleResetPassword}>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "3rem",
                  height: "3rem",
                  background: "#059669",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
              >
                <Key color="white" size={24} />
              </div>
              <h3
                style={{
                  color: "#1a202c",
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Đặt mật khẩu mới
              </h3>
              <p
                style={{
                  color: "#718096",
                  fontSize: "0.875rem",
                  margin: 0,
                  lineHeight: "1.5",
                }}
              >
                Mã OTP đã được xác thực thành công. Vui lòng đặt mật khẩu mới cho tài khoản của bạn.
              </p>
            </div>

                         <FormField
               label="Mật khẩu mới"
               name="newPassword"
               type={showPassword ? "text" : "password"}
               placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
               value={newPassword}
               onChange={(e) => setNewPassword(e.target.value)}
               required
               icon={Lock}
               showToggle={true}
               onToggle={() => setShowPassword(!showPassword)}
               toggleIcon={showPassword ? EyeOff : Eye}
             />
            <small
              style={{
                display: "block",
                marginTop: "0.5rem",
                color: "#718096",
                fontSize: "0.75rem",
              }}
            >
              💡 <strong>Gợi ý:</strong> Sử dụng mật khẩu mạnh với ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
            </small>
                         <FormField
               label="Xác nhận mật khẩu"
               name="confirmPassword"
               type={showConfirmPassword ? "text" : "password"}
               placeholder="Nhập lại mật khẩu mới"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               required
               icon={Lock}
               showToggle={true}
               onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
               toggleIcon={showConfirmPassword ? EyeOff : Eye}
             />
                         <Button
               type="submit"
               disabled={isLoading}
               loading={isLoading}
             >
               {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
             </Button>
          </Form>
        )}

        {/* Phần liên kết chân trang */}
        <FooterLinks>
          <p>
            Quay lại{" "}
            <Link
              to="/login"
              style={{
                color: "#3182ce",
                textDecoration: "none",
                fontWeight: "500",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#2c5aa0";
                e.target.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#3182ce";
                e.target.style.textDecoration = "none";
              }}
            >
              đăng nhập
            </Link>
          </p>
          <Link
            to="/"
            style={{
              color: "#3182ce",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: "500",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#2c5aa0";
              e.target.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#3182ce";
              e.target.style.textDecoration = "none";
            }}
          >
            <Home size={16} />
            Quay về trang chủ
          </Link>
        </FooterLinks>
      </ForgotPasswordCard>
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;
