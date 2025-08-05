// src/styles/GlobalStyles.js
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  /* Reset CSS và thiết lập box-sizing */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Thiết lập font chữ và màu sắc cơ bản cho toàn trang */
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8f9fa; /* Một màu nền xám rất nhạt thay vì trắng tinh */
    color: #212529; /* Màu chữ chính */
    line-height: 1.6;
  }

  /* Loại bỏ gạch chân mặc định của link và thiết lập màu */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Thiết lập cho hình ảnh */
  img {
    max-width: 100%;
    display: block;
  }
`;

export default GlobalStyles;
