import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
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
            🏠 Về Chúng Tôi – RentalHouse
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Giới Thiệu
            </h2>
            <p className="text-gray-700 leading-relaxed">
              RentalHouse là nền tảng tìm kiếm và cho thuê nhà uy tín hàng đầu Việt Nam. Chúng tôi cam kết mang đến trải nghiệm thuê nhà thuận tiện, an toàn và minh bạch cho cả người thuê và chủ nhà.
            </p>
          </section>

          {/* Mission */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sứ Mệnh
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi mong muốn trở thành cầu nối tin cậy giữa người có nhu cầu thuê nhà và chủ nhà, góp phần giải quyết vấn đề nhà ở và tạo ra một cộng đồng thuê nhà văn minh, hiện đại.
            </p>
          </section>

          {/* Vision */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tầm Nhìn
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Trở thành nền tảng số 1 về dịch vụ thuê nhà tại Việt Nam, ứng dụng công nghệ tiên tiến để mang lại trải nghiệm tốt nhất cho người dùng.
            </p>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">🔒 Uy Tín</h3>
                <p className="text-blue-800">Cam kết cung cấp thông tin chính xác, minh bạch</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">🤝 Hợp Tác</h3>
                <p className="text-green-800">Xây dựng mối quan hệ bền vững với đối tác</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">💡 Sáng Tạo</h3>
                <p className="text-purple-800">Liên tục cải tiến và phát triển dịch vụ</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">❤️ Tận Tâm</h3>
                <p className="text-orange-800">Đặt lợi ích khách hàng lên hàng đầu</p>
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thông Tin Liên Hệ
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📧</span>
                <span className="text-gray-700">Email: <a href="mailto:info@rentalhouse.com" className="text-blue-600 hover:text-blue-800">info@rentalhouse.com</a></span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xl">📞</span>
                <span className="text-gray-700">Hotline: <a href="tel:0123456789" className="text-blue-600 hover:text-blue-800">0123 456 789</a></span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-xl mt-1">🏢</span>
                <span className="text-gray-700">Địa chỉ: số 23, lô TT-01, khu đô thị HD Mon, Mỹ Đình 2, Hà Nội</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
