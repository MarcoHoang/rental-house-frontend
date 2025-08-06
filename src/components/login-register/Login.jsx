import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const username = params.get('username') || '';
        setFormData((prev) => ({ ...prev, username }));
    }, [location]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (!formData.username || !formData.password) {
            setMessage('Vui lòng điền đầy đủ các trường');
            setIsError(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);
            setMessage(response.data.message || 'Đăng nhập thành công');
            setIsError(false);
            localStorage.setItem('token', response.data.data);
            setTimeout(() => {
                alert('Đăng nhập thành công! Token đã được lưu.');
            }, 1000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Lỗi kết nối server');
            setIsError(true);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Đăng Nhập</h2>
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
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                >
                    Đăng Nhập
                </button>
                <button
                    type="button"
                    className="w-full mt-3 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 flex items-center justify-center gap-2"
                >
                    <svg width="20" height="20" viewBox="0 0 48 48" className="inline" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path d="M44.5 20H24V28.5H36.9C35.2 33.1 30.2 36 24 36C16.3 36 10 29.7 10 22C10 14.3 16.3 8 24 8C27.1 8 29.9 9.1 32.1 10.9L38.1 5C34.4 1.9 29.5 0 24 0C10.7 0 0 10.7 0 24C0 37.3 10.7 48 24 48C37.3 48 48 37.3 48 24C48 22.3 47.8 20.7 47.5 19.1L44.5 20Z" fill="#FFC107"/>
                            <path d="M6.3 14.7L13.7 20.1C15.7 15.7 19.5 12.5 24 12.5C26.6 12.5 29 13.5 30.8 15.1L37.2 9.2C33.7 5.9 29.1 4 24 4C16.3 4 10 10.3 10 18C10 19.3 10.2 20.6 10.5 21.8L6.3 14.7Z" fill="#FF3D00"/>
                            <path d="M24 44C29.1 44 33.7 42.1 37.2 38.8L30.8 32.9C29 34.5 26.6 35.5 24 35.5C19.5 35.5 15.7 32.3 13.7 27.9L6.3 33.3C10.2 39.1 16.3 44 24 44Z" fill="#4CAF50"/>
                            <path d="M47.5 19.1H44.5V20H24V28.5H36.9C36.1 30.7 34.7 32.6 32.8 34L39.2 39.9C42.7 36.7 44.9 32.1 44.9 27C44.9 25.3 44.7 23.7 44.5 22.1L47.5 19.1Z" fill="#1976D2"/>
                        </g>
                    </svg>
                    Đăng nhập bằng Google
                </button>
            </form>
            {message && (
                <p className={`mt-4 text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
            <p className="mt-4 text-center">
                Chưa có tài khoản?{' '}
                <a href="/register" className="text-blue-500 hover:underline">
                    Đăng ký
                </a>
            </p>
        </div>
    );
}

export default Login;