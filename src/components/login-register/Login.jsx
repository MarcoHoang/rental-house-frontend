// src/components/login-register/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Đang xử lý...');
        setIsError(false);

        try {
            const response = await authService.login(
                formData.email,
                formData.password
            );

            // Lưu token và thông tin người dùng vào localStorage
            if (response.token) {
                localStorage.setItem('token', response.token);
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
                
                setMessage('Đăng nhập thành công!');
                setIsError(false);

                // Kích hoạt sự kiện để cập nhật giao diện
                window.dispatchEvent(new Event('storage'));

                // Chuyển hướng về trang chủ sau 1 giây
                setTimeout(() => {
                    navigate('/');
                    window.location.reload(); // Tải lại trang để đảm bảo cập nhật giao diện
                }, 1000);
            } else {
                throw new Error('Không nhận được thông tin đăng nhập từ máy chủ');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            setMessage(error.response?.data?.message || error.message || 'Đăng nhập thất bại');
            setIsError(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đăng nhập tài khoản
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Địa chỉ email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`rounded-md ${isError ? 'bg-red-50' : 'bg-green-50'} p-4`}>
                            <div className={`text-sm ${isError ? 'text-red-700' : 'text-green-700'}`}>
                                {message}
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;