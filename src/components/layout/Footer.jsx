// src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom"; // Dùng Link để điều hướng tốt hơn

const Footer = () => {
  return (
    // Thay thế <FooterWrapper>
    <footer className="bg-gray-800 text-white py-12 px-8 mt-16">
      {/* Thay thế <FooterContent> */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Thay thế <FooterSection> */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-4">
            RentalHouse
          </h4>
          <p className="text-gray-400">
            Nền tảng tìm kiếm và cho thuê nhà uy tín hàng đầu Việt Nam.
          </p>
        </div>

        {/* Thay thế <FooterSection> */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-4">
            Khám phá
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-gray-400 hover:text-white hover:underline"
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-gray-400 hover:text-white hover:underline"
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-white hover:underline"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        {/* Thay thế <FooterSection> */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold border-b border-gray-600 pb-2 mb-4">
            Hỗ trợ
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/faq"
                className="text-gray-400 hover:text-white hover:underline"
              >
                Câu hỏi thường gặp
              </Link>
            </li>
            <li>
              <Link
                to="/policy"
                className="text-gray-400 hover:text-white hover:underline"
              >
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white hover:underline"
              >
                Điều khoản sử dụng
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Thay thế <Copyright> */}
      <div className="text-center mt-12 pt-8 border-t border-gray-700 text-gray-500">
        © {new Date().getFullYear()} RentalHouse. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
