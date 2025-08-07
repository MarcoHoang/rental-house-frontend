import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset, verifyOtp, resetPassword } from '../../api/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP, 3: Đổi mật khẩu
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await requestPasswordReset(email);
            setStep(2);
            setMessage({ text: 'Mã xác thực đã được gửi đến email của bạn', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Có lỗi xảy ra', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await verifyOtp(email, otp);
            setStep(3);
            setMessage({ text: 'Xác thực thành công, vui lòng đặt mật khẩu mới', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Mã xác thực không đúng', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ text: 'Mật khẩu xác nhận không khớp', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(email, otp, newPassword);
            setMessage({
                text: 'Đặt lại mật khẩu thành công! Bạn sẽ được chuyển hướng về trang đăng nhập',
                type: 'success'
            });
            setTimeout(() => window.location.href = '/login', 3000);
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Có lỗi xảy ra', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Quên mật khẩu</h2>

            {message.text && (
                <div className={`alert alert-${message.type}`}>{message.text}</div>
            )}

            {step === 1 && (
                <form onSubmit={handleRequestOtp}>
                    <div className="form-group">
                        <label>Email đăng ký</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Nhập email đã đăng ký"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Gửi mã xác thực'}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleVerifyOtp}>
                    <div className="form-group">
                        <label>Mã xác thực (5 chữ số)</label>
                        <input
                            type="text"
                            className="form-control"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 5))}
                            pattern="\d{5}"
                            maxLength="5"
                            required
                            placeholder="Nhập mã xác thực"
                        />
                        <small className="text-muted">Vui lòng kiểm tra email để lấy mã xác thực</small>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        disabled={isLoading || otp.length !== 5}
                    >
                        {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                    </button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handleResetPassword}>
                    <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength="6"
                            required
                            placeholder="Nhập mật khẩu mới"
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            minLength="6"
                            required
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        disabled={isLoading || !newPassword || !confirmPassword}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                    </button>
                </form>
            )}

            <div className="text-center mt-3">
                <a href="/login" className="text-primary">Quay lại đăng nhập</a>
            </div>
        </div>
    );
};

export default ForgotPassword;