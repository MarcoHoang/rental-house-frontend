import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
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
            📋 Điều Khoản Sử Dụng – RentalHouse
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
              Bằng việc truy cập và sử dụng website RentalHouse, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Định Nghĩa
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong>"RentalHouse"</strong> hoặc <strong>"chúng tôi"</strong> đề cập đến nền tảng trực tuyến cung cấp dịch vụ kết nối người thuê nhà và chủ nhà.
              </p>
              <p className="text-gray-700">
                <strong>"Người dùng"</strong> hoặc <strong>"bạn"</strong> đề cập đến bất kỳ cá nhân hoặc tổ chức nào truy cập hoặc sử dụng dịch vụ của chúng tôi.
              </p>
              <p className="text-gray-700">
                <strong>"Dịch vụ"</strong> đề cập đến tất cả các tính năng, chức năng và nội dung có sẵn trên website RentalHouse.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Đăng Ký Tài Khoản
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">Để sử dụng một số tính năng của dịch vụ, bạn cần đăng ký tài khoản. Bạn cam kết:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
                <li>Bảo mật thông tin đăng nhập của mình</li>
                <li>Chịu trách nhiệm về mọi hoạt động diễn ra dưới tài khoản của bạn</li>
                <li>Thông báo ngay lập tức nếu phát hiện vi phạm bảo mật</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Sử Dụng Dịch Vụ
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">Bạn được phép sử dụng dịch vụ của chúng tôi cho mục đích cá nhân và hợp pháp. Bạn không được:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                <li>Vi phạm quyền sở hữu trí tuệ của chúng tôi hoặc bên thứ ba</li>
                <li>Gây quá tải hoặc làm gián đoạn hoạt động của hệ thống</li>
                <li>Thu thập thông tin cá nhân của người dùng khác</li>
                <li>Đăng tải nội dung xấu, phản cảm hoặc vi phạm pháp luật</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Nội Dung Người Dùng
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                Bạn giữ quyền sở hữu đối với nội dung bạn đăng tải lên RentalHouse. Tuy nhiên, bạn cấp cho chúng tôi quyền sử dụng, sao chép và phân phối nội dung đó trong phạm vi cung cấp dịch vụ.
              </p>
              <p className="text-gray-700">
                Bạn cam kết rằng nội dung bạn đăng tải không vi phạm quyền của bên thứ ba và tuân thủ các quy định pháp luật hiện hành.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Quyền Sở Hữu Trí Tuệ
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                RentalHouse và tất cả nội dung, thiết kế, giao diện, logo, thương hiệu và phần mềm liên quan đều thuộc quyền sở hữu của chúng tôi hoặc được cấp phép sử dụng.
              </p>
              <p className="text-gray-700">
                Bạn không được sao chép, phân phối, hiển thị hoặc tạo ra các tác phẩm phái sinh từ nội dung của chúng tôi mà không có sự cho phép bằng văn bản.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Giới Hạn Trách Nhiệm
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                RentalHouse hoạt động như một nền tảng trung gian kết nối người thuê nhà và chủ nhà. Chúng tôi không chịu trách nhiệm về:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Chất lượng hoặc tình trạng thực tế của bất động sản</li>
                <li>Hành vi của người dùng khác</li>
                <li>Kết quả của các giao dịch giữa người thuê và chủ nhà</li>
                <li>Thiệt hại phát sinh từ việc sử dụng dịch vụ</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Bảo Mật
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo chính sách bảo mật. Tuy nhiên, không có hệ thống nào an toàn tuyệt đối.
              </p>
              <p className="text-gray-700">
                Bạn cũng có trách nhiệm bảo vệ thông tin cá nhân của mình và không chia sẻ thông tin đăng nhập với người khác.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Chấm Dứt Dịch Vụ
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700">
                Chúng tôi có quyền tạm ngừng hoặc chấm dứt tài khoản của bạn nếu:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Bạn vi phạm các điều khoản sử dụng</li>
                <li>Bạn thực hiện hành vi gian lận hoặc bất hợp pháp</li>
                <li>Bạn không hoạt động trong thời gian dài</li>
                <li>Theo yêu cầu của cơ quan có thẩm quyền</li>
              </ul>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Thay Đổi Điều Khoản
            </h2>
            <p className="text-gray-700">
              Chúng tôi có quyền thay đổi các điều khoản sử dụng này vào bất kỳ lúc nào. Những thay đổi sẽ có hiệu lực ngay khi được đăng tải trên website. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được coi là bạn đã chấp nhận các điều khoản mới.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Luật Áp Dụng
            </h2>
            <p className="text-gray-700">
              Các điều khoản sử dụng này được điều chỉnh và giải thích theo luật pháp Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Liên Hệ
            </h2>
            <p className="text-gray-700 mb-4">
              Nếu bạn có thắc mắc về các điều khoản sử dụng này, vui lòng liên hệ với chúng tôi:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📧</span>
                <span className="text-gray-700">Email: <a href="mailto:legal@rentalhouse.com" className="text-blue-600 hover:text-blue-800">legal@rentalhouse.com</a></span>
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

export default TermsPage;
