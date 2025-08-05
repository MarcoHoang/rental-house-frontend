// src/components/house/HouseList.jsx
import React from "react";
import HouseCard from "./HouseCard";
import styled from "styled-components";

const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const HouseList = ({ houses }) => {
  if (!houses || houses.length === 0) {
    return (
      <p style={{ textAlign: "center" }}>Không tìm thấy nhà nào phù hợp.</p>
    );
  }

  return (
    <ListWrapper>
      {houses.map((house) => (
        <HouseCard key={house.id} house={house} />
      ))}
    </ListWrapper>
  );
};

export default HouseList;
