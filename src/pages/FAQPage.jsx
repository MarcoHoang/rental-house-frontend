import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [openItems, setOpenItems] = useState(new Set([0])); // Mở item đầu tiên mặc định

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      question: "Làm thế nào để đăng tin cho thuê nhà?",
      answer: "Để đăng tin cho thuê nhà, bạn cần: 1) Đăng ký tài khoản chủ nhà, 2) Xác minh thông tin cá nhân, 3) Điền đầy đủ thông tin bất động sản, 4) Upload hình ảnh chất lượng cao, 5) Đặt giá và mô tả chi tiết. Tin đăng sẽ được duyệt trong vòng 24h."
    },
    {
      question: "Quy trình thuê nhà như thế nào?",
      answer: "Quy trình thuê nhà bao gồm: 1) Tìm kiếm nhà phù hợp, 2) Xem chi tiết và liên hệ chủ nhà, 3) Đặt lịch xem nhà, 4) Thỏa thuận giá và điều khoản, 5) Ký hợp đồng và thanh toán, 6) Nhận chìa khóa và bàn giao nhà."
    },
    {
      question: "Chính sách bảo mật thông tin như thế nào?",
      answer: "Chúng tôi cam kết bảo mật thông tin cá nhân của bạn. Mọi thông tin được mã hóa và lưu trữ an toàn. Chúng tôi không chia sẻ thông tin với bên thứ ba mà không có sự đồng ý của bạn. Xem chi tiết tại trang Chính sách bảo mật."
    },
    {
      question: "Hỗ trợ thanh toán trực tuyến không?",
      answer: "Có, chúng tôi hỗ trợ nhiều phương thức thanh toán: chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay), thẻ tín dụng/ghi nợ. Tất cả giao dịch đều được bảo mật và mã hóa SSL."
    },
    {
      question: "Phí dịch vụ là bao nhiêu?",
      answer: "Phí dịch vụ cho chủ nhà: 5% giá thuê cho tháng đầu tiên. Người thuê nhà: miễn phí. Chúng tôi cam kết minh bạch về mọi khoản phí và không có phí ẩn."
    },
    {
      question: "Làm sao để báo cáo vấn đề?",
      answer: "Bạn có thể báo cáo vấn đề qua: 1) Form liên hệ trên website, 2) Email support@rentalhouse.com, 3) Hotline 0123 456 789. Chúng tôi sẽ phản hồi trong vòng 24h."
    },
    {
      question: "Có hỗ trợ đa ngôn ngữ không?",
      answer: "Hiện tại website hỗ trợ tiếng Việt và tiếng Anh. Chúng tôi đang phát triển thêm các ngôn ngữ khác để phục vụ đa dạng người dùng."
    },
    {
      question: "Làm thế nào để hủy đặt phòng?",
      answer: "Bạn có thể hủy đặt phòng trong vòng 24h sau khi đặt mà không bị mất phí. Sau 24h, phí hủy sẽ được tính theo chính sách của từng chủ nhà. Liên hệ chúng tôi để được hỗ trợ."
    }
  ];

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
            ❓ Câu Hỏi Thường Gặp – RentalHouse
          </h1>
          <p className="text-gray-600 mt-2">
            Tìm câu trả lời cho những thắc mắc phổ biến về dịch vụ của chúng tôi
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          
          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  <span className="text-gray-500">
                    {openItems.has(index) ? '−' : '+'}
                  </span>
                </button>
                
                {openItems.has(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy câu trả lời?
            </h2>
            <p className="text-gray-700 mb-6">
              Nếu bạn vẫn có thắc mắc, đừng ngần ngại liên hệ với chúng tôi. Đội ngũ hỗ trợ sẽ sẵn sàng giúp đỡ bạn.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                📞 Liên Hệ Hỗ Trợ
              </Link>
              
              <a
                href="mailto:support@rentalhouse.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                📧 Gửi Email
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông Tin Hữu Ích
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/about" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                • Về chúng tôi
              </Link>
              <Link 
                to="/policy" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                • Chính sách bảo mật
              </Link>
              <Link 
                to="/terms" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                • Điều khoản sử dụng
              </Link>
              <Link 
                to="/contact" 
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                • Liên hệ hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
