import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
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
            🔒 Chính Sách Bảo Mật – RentalHouse
          </h1>
          <p className="text-gray-600 mt-2">
            Cập nhật lần cuối: 22/08/2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              RentalHouse ("chúng tôi", "nền tảng", "dịch vụ") tôn trọng và cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn khi bạn truy cập hoặc sử dụng dịch vụ của chúng tôi.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Bằng việc sử dụng RentalHouse, bạn đồng ý với các điều khoản trong chính sách này. Nếu bạn không đồng ý, vui lòng ngừng sử dụng dịch vụ.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Thông Tin Chúng Tôi Thu Thập
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Khi bạn sử dụng nền tảng, chúng tôi có thể thu thập các loại thông tin sau:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  1.1. Thông tin cá nhân
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Họ và tên</li>
                  <li>Số điện thoại</li>
                  <li>Email</li>
                  <li>Địa chỉ (nếu có)</li>
                  <li>Thông tin tài khoản (tên đăng nhập, mật khẩu – mật khẩu được mã hóa)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  1.2. Thông tin liên quan đến dịch vụ
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Tin đăng cho thuê/thuê nhà</li>
                  <li>Hình ảnh, mô tả bất động sản</li>
                  <li>Lịch sử tìm kiếm, tin nhắn, bình luận, đánh giá</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  1.3. Thông tin kỹ thuật
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Địa chỉ IP</li>
                  <li>Loại thiết bị, hệ điều hành, trình duyệt</li>
                  <li>Cookie và các công nghệ theo dõi khác</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Mục Đích Sử Dụng Thông Tin
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Chúng tôi sử dụng thông tin thu thập được cho các mục đích sau:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Cung cấp và duy trì dịch vụ của RentalHouse</li>
              <li>Hỗ trợ người dùng trong quá trình tìm kiếm và đăng tin bất động sản</li>
              <li>Gửi thông báo liên quan đến tài khoản, tin nhắn, giao dịch</li>
              <li>Nâng cao chất lượng dịch vụ, phân tích hành vi người dùng để tối ưu trải nghiệm</li>
              <li>Bảo mật hệ thống, ngăn chặn gian lận, vi phạm hoặc hành vi xấu</li>
              <li>Gửi thông tin khuyến mại, ưu đãi (nếu người dùng đồng ý)</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Chia Sẻ Thông Tin Với Bên Thứ Ba
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Chúng tôi cam kết không bán thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào. Tuy nhiên, chúng tôi có thể chia sẻ thông tin trong các trường hợp sau:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Khi có sự đồng ý từ bạn</li>
              <li>Theo yêu cầu của pháp luật hoặc cơ quan có thẩm quyền</li>
              <li>Đối tác dịch vụ: như nhà cung cấp dịch vụ lưu trữ dữ liệu (cloud), cổng thanh toán, dịch vụ email…</li>
              <li>Bảo vệ quyền lợi hợp pháp: khi cần thiết để bảo vệ RentalHouse hoặc người dùng khỏi gian lận, vi phạm hoặc nguy hiểm</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Bảo Mật Thông Tin
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Chúng tôi áp dụng nhiều biện pháp bảo mật để bảo vệ dữ liệu người dùng:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Sử dụng giao thức mã hóa SSL/HTTPS khi truyền tải dữ liệu</li>
              <li>Lưu trữ thông tin trong hệ thống cơ sở dữ liệu có bảo mật cao</li>
              <li>Giới hạn quyền truy cập chỉ cho những nhân viên/bộ phận cần thiết</li>
              <li>Mật khẩu người dùng được mã hóa và không thể đọc trực tiếp</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Tuy nhiên, không có hệ thống nào an toàn tuyệt đối. Chúng tôi không thể đảm bảo 100% dữ liệu sẽ không bị truy cập trái phép, nhưng cam kết luôn nỗ lực bảo vệ tốt nhất.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Quyền Lợi Của Người Dùng
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Bạn có các quyền sau đối với dữ liệu cá nhân của mình:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Truy cập và chỉnh sửa thông tin cá nhân trong tài khoản</li>
              <li>Yêu cầu xóa tài khoản và dữ liệu liên quan</li>
              <li>Từ chối nhận email quảng cáo/thông báo bằng cách hủy đăng ký (unsubscribe)</li>
              <li>Được thông báo nếu có sự cố rò rỉ dữ liệu nghiêm trọng</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Cookie và Công Nghệ Theo Dõi
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              RentalHouse sử dụng cookie và các công nghệ tương tự để:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Ghi nhớ thông tin đăng nhập</li>
              <li>Lưu trữ lịch sử tìm kiếm</li>
              <li>Cá nhân hóa nội dung và quảng cáo</li>
              <li>Phân tích hành vi truy cập để cải thiện dịch vụ</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Bạn có thể tắt cookie trong trình duyệt. Tuy nhiên, một số tính năng có thể không hoạt động đầy đủ.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Lưu Trữ Dữ Liệu
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Dữ liệu cá nhân sẽ được lưu trữ chừng nào bạn còn sử dụng dịch vụ</li>
              <li>Khi bạn yêu cầu xóa tài khoản, dữ liệu sẽ được xóa hoặc ẩn trong vòng 30 ngày</li>
              <li>Một số dữ liệu có thể được lưu trữ lâu hơn nếu pháp luật yêu cầu</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Dịch Vụ Của Bên Thứ Ba
            </h2>
            <p className="text-gray-700 leading-relaxed">
              RentalHouse có thể chứa liên kết đến website hoặc dịch vụ bên thứ ba (ví dụ: bản đồ Google Maps, cổng thanh toán). Chúng tôi không chịu trách nhiệm về chính sách bảo mật của các bên này. Bạn nên tham khảo chính sách riêng của họ.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Chính Sách Dành Cho Trẻ Em
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Dịch vụ của chúng tôi không dành cho trẻ em dưới 13 tuổi. Nếu phát hiện người dùng dưới 13 tuổi đăng ký tài khoản, chúng tôi có quyền xóa ngay lập tức.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Thay Đổi Chính Sách Bảo Mật
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi có thể cập nhật chính sách bảo mật theo thời gian. Mọi thay đổi sẽ được thông báo trên website. Người dùng nên kiểm tra định kỳ để nắm rõ phiên bản mới nhất.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Liên Hệ
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nếu có thắc mắc hoặc yêu cầu liên quan đến chính sách bảo mật, vui lòng liên hệ:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📧</span>
                <span className="text-gray-700">Email: <a href="mailto:support@rentalhouse.com" className="text-blue-600 hover:text-blue-800">support@rentalhouse.com</a></span>
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

export default PrivacyPolicyPage;
