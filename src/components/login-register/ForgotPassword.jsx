import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../api/authService';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 28rem;
  padding: 2.5rem;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  margin-top: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #111827;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 1px #4f46e5;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.625rem;
  background-color: #4f46e5;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  margin-top: 1rem;

  &:hover {
    background-color: #4338ca;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const BackToLogin = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;

  a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
    margin-left: 0.25rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Message = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  background-color: ${props =>
    props.type === 'error' ? '#fef2f2' :
        props.type === 'success' ? '#ecfdf5' : '#eff6ff'};
  color: ${props =>
    props.type === 'error' ? '#991b1b' :
        props.type === 'success' ? '#065f46' : '#1e40af'};
  border: 1px solid ${props =>
    props.type === 'error' ? '#fecaca' :
        props.type === 'success' ? '#a7f3d0' : '#bfdbfe'};
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 1rem;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #e5e7eb;
    z-index: 1;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const StepNumber = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${props =>
    props.active ? '#4f46e5' :
        props.completed ? '#a5b4fc' : '#e5e7eb'};
  color: ${props =>
    (props.active || props.completed) ? 'white' : '#9ca3af'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const StepLabel = styled.span`
  font-size: 0.75rem;
  color: ${props =>
    (props.active || props.completed) ? '#4f46e5' : '#9ca3af'};
  font-weight: ${props => (props.active ? '600' : '400')};
  text-align: center;
`;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            setMessage({ text: 'Vui lòng nhập email', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            await authService.requestPasswordReset(email);
            setStep(2);
            setMessage({ text: 'Mã xác thực đã được gửi đến email của bạn', type: 'success' });
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            setMessage({ text: 'Vui lòng nhập mã OTP', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            await authService.verifyOtp(email, otp);
            setStep(3);
            setMessage({ text: 'Xác thực thành công, vui lòng đặt mật khẩu mới', type: 'success' });
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            setMessage({ text: 'Vui lòng nhập đầy đủ thông tin', type: 'error' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ text: 'Mật khẩu xác nhận không khớp', type: 'error' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ text: 'Mật khẩu phải có ít nhất 6 ký tự', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword(email, otp, newPassword);
            setMessage({
                text: 'Đặt lại mật khẩu thành công! Bạn sẽ được chuyển hướng về trang đăng nhập',
                type: 'success'
            });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Card>
                <Title>Quên mật khẩu</Title>

                <StepIndicator>
                    <Step>
                        <StepNumber active={step === 1} completed={step > 1}>1</StepNumber>
                        <StepLabel active={step === 1}>Nhập email</StepLabel>
                    </Step>
                    <Step>
                        <StepNumber
                            active={step === 2}
                            completed={step > 2}
                        >
                            {step > 2 ? '✓' : '2'}
                        </StepNumber>
                        <StepLabel active={step === 2}>Xác thực OTP</StepLabel>
                    </Step>
                    <Step>
                        <StepNumber active={step === 3}>3</StepNumber>
                        <StepLabel active={step === 3}>Đặt mật khẩu mới</StepLabel>
                    </Step>
                </StepIndicator>

                {message.text && (
                    <Message type={message.type}>{message.text}</Message>
                )}

                {step === 1 && (
                    <Form onSubmit={handleRequestOtp}>
                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email đã đăng ký"
                                required
                            />
                        </FormGroup>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
                        </Button>
                    </Form>
                )}

                {step === 2 && (
                    <Form onSubmit={handleVerifyOtp}>
                        <FormGroup>
                            <Label htmlFor="otp">Mã xác thực (OTP)</Label>
                            <Input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Nhập mã OTP 6 số"
                                maxLength={6}
                                required
                            />
                            <small style={{
                                display: 'block',
                                marginTop: '0.25rem',
                                color: '#6b7280',
                                fontSize: '0.75rem'
                            }}>
                                Chúng tôi đã gửi mã OTP đến email của bạn
                            </small>
                        </FormGroup>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                        </Button>
                    </Form>
                )}

                {step === 3 && (
                    <Form onSubmit={handleResetPassword}>
                        <FormGroup>
                            <Label htmlFor="newPassword">Mật khẩu mới</Label>
                            <Input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                minLength={6}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                                minLength={6}
                                required
                            />
                        </FormGroup>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                        </Button>
                    </Form>
                )}

                <BackToLogin>
                    Quay lại <Link to="/login">đăng nhập</Link>
                </BackToLogin>
            </Card>
        </Container>
    );
};

export default ForgotPassword;