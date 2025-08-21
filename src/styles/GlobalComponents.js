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

// Global styled components for house-related components
export const HouseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  align-items: stretch;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  
  @media (min-width: 1025px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
`;

export const HouseGridItem = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const HouseCardWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

// Featured houses specific styles
export const FeaturedHousesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  align-items: stretch;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const FeaturedHouseItem = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const FeaturedHouseCard = styled.div`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  .featured-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.75rem;
    font-weight: 700;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;
