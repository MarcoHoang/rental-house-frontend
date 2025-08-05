// src/components/common/LoadingSpinner.jsx
import React from "react";
import styled, { keyframes } from "styled-components";

// 1. Định nghĩa animation quay tròn bằng keyframes
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// 2. Tạo component spinner
const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #007bff; /* Màu của phần quay */

  animation: ${rotate} 1s ease infinite;
`;

// 3. (Tùy chọn) Tạo một lớp bọc để căn giữa spinner
const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const LoadingSpinner = () => {
  return (
    <SpinnerWrapper>
      <Spinner />
    </SpinnerWrapper>
  );
};

export default LoadingSpinner;
