import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form liên hệ ở đây
    console.log('Form data:', formData);
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
          >
            ← Quay lại trang chủ
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            📞 Liên Hệ – RentalHouse
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Gửi Tin Nhắn Cho Chúng Tôi
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ đề *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập chủ đề tin nhắn"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung tin nhắn *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập nội dung tin nhắn của bạn"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Gửi Tin Nhắn
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Direct Contact */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Thông Tin Liên Hệ Trực Tiếp
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <a href="mailto:info@rentalhouse.com" className="text-blue-600 hover:text-blue-800">
                      info@rentalhouse.com
                    </a>
                    <p className="text-sm text-gray-600 mt-1">Phản hồi trong vòng 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Hotline</h3>
                    <a href="tel:0123456789" className="text-blue-600 hover:text-blue-800 text-lg font-medium">
                      0123 456 789
                    </a>
                    <p className="text-sm text-gray-600 mt-1">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Văn phòng</h3>
                    <p className="text-gray-700">
                      Số 23, lô TT-01, khu đô thị HD Mon,<br />
                      Mỹ Đình 2, Hà Nội
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Câu Hỏi Thường Gặp
              </h2>
              
              <div className="space-y-3">
                <Link 
                  to="/faq" 
                  className="block text-blue-600 hover:text-blue-800 hover:underline"
                >
                  • Làm thế nào để đăng tin cho thuê nhà?
                </Link>
                <Link 
                  to="/faq" 
                  className="block text-blue-600 hover:text-blue-800 hover:underline"
                >
                  • Quy trình thuê nhà như thế nào?
                </Link>
                <Link 
                  to="/faq" 
                  className="block text-blue-600 hover:text-blue-800 hover:underline"
                >
                  • Chính sách bảo mật thông tin?
                </Link>
                <Link 
                  to="/faq" 
                  className="block text-blue-600 hover:text-blue-800 hover:underline"
                >
                  • Hỗ trợ thanh toán trực tuyến?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
