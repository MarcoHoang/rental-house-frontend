import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        // Validation phía client
        if (!formData.username || !formData.phone || !formData.password || !formData.confirmPassword) {
            setMessage('Vui lòng điền đầy đủ các trường');
            setIsError(true);
            return;
        }

        if (!/^0\d{9}$/.test(formData.phone)) {
            setMessage('Số điện thoại không hợp lệ');
            setIsError(true);
            return;
        }
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            setMessage('Email không hợp lệ');
            setIsError(true);
            return;
        }

        if (formData.password.length < 6 || formData.password.length > 32) {
            setMessage('Mật khẩu phải từ 6 đến 32 ký tự');
            setIsError(true);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage('Mật khẩu xác nhận không khớp');
            setIsError(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', formData);
            setMessage(response.data.message || 'Đăng ký thành công');
            setIsError(false);
            setTimeout(() => {
                navigate(`/login?username=${encodeURIComponent(formData.username)}`);
            }, 1000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Lỗi kết nối server');
            setIsError(true);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Đăng Ký</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username (*)
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Số điện thoại (*)
                    </label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email (*)
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Mật khẩu (*)
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Xác nhận mật khẩu (*)
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                >
                    Đăng Ký
                </button>
            </form>
            {message && (
                <p className={`mt-4 text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
            <p className="mt-4 text-center">
                Đã có tài khoản?{' '}
                <a href="/login" className="text-blue-500 hover:underline">
                    Đăng nhập
                </a>
            </p>
        </div>
    );
}

export default Register;