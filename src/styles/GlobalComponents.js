// src/styles/GlobalComponents.js
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 1280px; /* Chiều rộng tối đa phổ biến cho website */
  margin-left: auto;
  margin-right: auto;
  padding-left: 2rem; /* Khoảng đệm an toàn 2 bên */
  padding-right: 2rem;

  /* Cho màn hình nhỏ hơn thì giảm padding */
  @media (max-width: 768px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;
