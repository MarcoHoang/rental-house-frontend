import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, User, Phone, Mail, Lock, Eye, EyeOff, MapPin } from "lucide-react";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        address: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
        if (message) setMessage("");
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                if (!value) return 'Email là bắt buộc';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email không đúng định dạng';
                return '';
            case 'phone':
                if (!value) return 'Số điện thoại là bắt buộc';
                if (!/^0[0-9]{9,10}$/.test(value)) return 'Số điện thoại phải có 10-11 số và bắt đầu bằng số 0';
                return '';
            case 'password':
                if (!value) return 'Mật khẩu là bắt buộc';
                if (value.length < 6 || value.length > 32) return 'Mật khẩu phải từ 6 đến 32 ký tự';
                return '';
            case 'confirmPassword':
                if (value !== formData.password) return 'Mật khẩu xác nhận không khớp';
                return '';
            default:
                return '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setIsError(false);

        // Validate all fields
        const newErrors = {};
        ['email', 'phone', 'password', 'confirmPassword'].forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const userData = {
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                fullName: formData.fullName || null,
                address: formData.address || null
            };

            const response = await axios.post(
                "http://localhost:8080/api/auth/register",
                userData
            );

            setMessage(response.data.message || "Đăng ký thành công!");
            setIsError(false);

            setTimeout(() => {
                navigate(`/login?email=${encodeURIComponent(formData.email)}`);
            }, 1500);
        } catch (error) {
            setMessage(error.response?.data?.message || "Lỗi kết nối server");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-500"></div>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mb-4">
                            <UserPlus className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h1>
                        <p className="text-gray-500 text-sm">Tạo tài khoản mới để bắt đầu</p>
                    </div>

                    {message && (
                        <div className={`mb-6 p-3 rounded-md text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email<span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Nhập email"
                                    />
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số điện thoại<span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Nhập số điện thoại"
                                    />
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Họ và tên (tùy chọn)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg"
                                        placeholder="Nhập họ và tên"
                                    />
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Địa chỉ (tùy chọn)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg"
                                        placeholder="Nhập địa chỉ"
                                    />
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu<span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-10 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Nhập mật khẩu (6-32 ký tự)"
                                    />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Xác nhận mật khẩu<span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-10 py-2 border rounded-lg ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Nhập lại mật khẩu"
                                    />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang xử lý...
                                        </>
                                    ) : 'Đăng ký'}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-gray-600">
                            Đã có tài khoản?{' '}
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
