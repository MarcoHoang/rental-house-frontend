import React from "react";
import styled from "styled-components";

const CardWrapper = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardBody = styled.div`
  padding: 1rem;
`;

const HouseCard = ({ house }) => {
  // Giả sử DTO của bạn có các thuộc tính này
  const { name, address, price, imageUrl } = house;

  return (
    <CardWrapper>
      <CardImage
        src={imageUrl || "https://via.placeholder.com/300x200"}
        alt={name}
      />
      <CardBody>
        <h3>{name}</h3>
        <p>{address}</p>
        <h4>{price.toLocaleString("vi-VN")} VNĐ/tháng</h4>
      </CardBody>
    </CardWrapper>
  );
};

export default HouseCard;
