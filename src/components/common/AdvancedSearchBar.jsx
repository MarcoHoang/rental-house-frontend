import React, { useState } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaHome, FaDollarSign, FaRulerCombined, FaSearch } from 'react-icons/fa';

const SearchContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 1100px;
  margin: 0 auto;
  width: 95%;

  @media (max-width: 768px) {
    padding: 1.5rem;
    width: calc(100% - 2rem);
    margin: 0 1rem;
  }
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SearchField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const baseInputStyles = `
  width: 100%;
  height: 48px;
  padding: 0 1rem 0 2.75rem;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 1rem;
  background-color: white;
  color: #1f2937;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  
  display: flex;
  align-items: center;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }
`;

const Input = styled.input`
  ${baseInputStyles}
  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  ${baseInputStyles}
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.25em 1.25em;
  padding-right: 2.5rem;
  
  &:invalid {
    color: #9ca3af;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  height: 48px;
  padding: 0 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
  }
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 1200px) {
    grid-column: 1 / -1;
    margin-top: 0.5rem;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  svg {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    width: 20px;
    height: 20px;
    pointer-events: none;
  }
`;

const AdvancedSearchBar = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    location: '',
    houseType: '',
    priceRange: '',
    area: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const handleChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchField>
          <Label><FaMapMarkerAlt /> Địa điểm</Label>
          <InputWrapper>
            <FaMapMarkerAlt />
            <Input
              type="text"
              placeholder="Quận, thành phố, dự án..."
              value={searchData.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </InputWrapper>
        </SearchField>

        <SearchField>
          <Label><FaHome /> Loại nhà</Label>
          <InputWrapper>
            <FaHome />
            <Select
              required
              value={searchData.houseType}
              onChange={(e) => handleChange('houseType', e.target.value)}
            >
              <option value="" disabled hidden>Chọn loại nhà</option>
              <option value="APARTMENT">Căn hộ</option>
              <option value="VILLA">Biệt thự</option>
              <option value="TOWNHOUSE">Nhà phố</option>
              <option value="HOUSE">Nhà nguyên căn</option>
              <option value="STUDIO">Nhà trọ</option>
            </Select>
          </InputWrapper>
        </SearchField>

        <SearchField>
          <Label><FaDollarSign /> Mức giá</Label>
          <InputWrapper>
            <FaDollarSign />
            <Select
              required
              value={searchData.priceRange}
              onChange={(e) => handleChange('priceRange', e.target.value)}
            >
              <option value="" disabled hidden>Chọn mức giá</option>
              <option value="0-2000000">Dưới 2 triệu</option>
              <option value="2000000-5000000">2 - 5 triệu</option>
              <option value="5000000-10000000">5 - 10 triệu</option>
              <option value="10000000-20000000">10 - 20 triệu</option>
              <option value="20000000+">Trên 20 triệu</option>
            </Select>
          </InputWrapper>
        </SearchField>

        <SearchField>
          <Label><FaRulerCombined /> Diện tích</Label>
          <InputWrapper>
            <FaRulerCombined />
            <Select 
              required 
              value={searchData.area} 
              onChange={e => handleChange('area', e.target.value)}
            >
              <option value="" disabled hidden>Chọn diện tích</option>
              <option value="0-30">Dưới 30m²</option>
              <option value="30-50">30 - 50m²</option>
              <option value="50-80">50 - 80m²</option>
              <option value="80-120">80 - 120m²</option>
              <option value="120+">Trên 120m²</option>
            </Select>
          </InputWrapper>
        </SearchField>

        <SearchButton type="submit">
          <FaSearch /> Tìm kiếm
        </SearchButton>
      </SearchForm>
    </SearchContainer>
  );
};

export default AdvancedSearchBar;
