// src/components/layout/Footer.jsx
import React from "react";
import styled from "styled-components";

const FooterWrapper = styled.footer`
  background-color: #333;
  color: white;
  padding: 3rem 2rem; /* Thêm padding trái/phải trực tiếp */
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  max-width: 1280px; /* Vẫn giữ max-width để các cột không quá xa nhau trên màn hình lớn */
  margin: 0 auto; /* Căn giữa grid này */
`;

const FooterSection = styled.div`
  h4 {
    margin-bottom: 1rem;
    border-bottom: 1px solid #555;
    padding-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: #ccc;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #555;
  color: #aaa;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterSection>
          <h4>RentalHouse</h4>
          <p>Nền tảng tìm kiếm và cho thuê nhà uy tín hàng đầu Việt Nam.</p>
        </FooterSection>
        <FooterSection>
          <h4>Khám phá</h4>
          <ul>
            <li>
              <a href="/">Trang chủ</a>
            </li>
            <li>
              <a href="/about">Về chúng tôi</a>
            </li>
            <li>
              <a href="/contact">Liên hệ</a>
            </li>
          </ul>
        </FooterSection>
        <FooterSection>
          <h4>Hỗ trợ</h4>
          <ul>
            <li>
              <a href="/faq">Câu hỏi thường gặp</a>
            </li>
            <li>
              <a href="/policy">Chính sách bảo mật</a>
            </li>
            <li>
              <a href="/terms">Điều khoản sử dụng</a>
            </li>
          </ul>
        </FooterSection>
      </FooterContent>
      <Copyright>
        © {new Date().getFullYear()} RentalHouse. All rights reserved.
      </Copyright>
    </FooterWrapper>
  );
};

export default Footer;
