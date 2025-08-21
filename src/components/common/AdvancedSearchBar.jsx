import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaHome, FaDollarSign, FaRulerCombined, FaSearch, FaFilter } from 'react-icons/fa';
import { HOUSE_STATUS_LABELS, HOUSE_TYPE_LABELS } from '../../utils/constants';

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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SearchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  align-items: end;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SearchField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
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
  color: #000000;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;

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
  white-space: nowrap;
  
  &:invalid {
    color: #9ca3af;
  }

  option {
    color: #000000;
    background-color: white;
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
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;

  svg {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: #000000;
    width: 20px;
    height: 20px;
    pointer-events: none;
    flex-shrink: 0;
  }
`;

const AdvancedSearchBar = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    searchTerm: '',
    statusFilter: 'ALL',
    typeFilter: 'ALL',
    minPrice: '',
    maxPrice: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Tạo query parameters cho URL
    const params = new URLSearchParams();
    
    if (searchData.searchTerm) {
      params.append('search', searchData.searchTerm);
    }
    if (searchData.statusFilter !== 'ALL') {
      params.append('status', searchData.statusFilter);
    }
    if (searchData.typeFilter !== 'ALL') {
      params.append('type', searchData.typeFilter);
    }
    if (searchData.minPrice) {
      params.append('minPrice', searchData.minPrice);
    }
    if (searchData.maxPrice) {
      params.append('maxPrice', searchData.maxPrice);
    }
    
    // Chuyển hướng đến trang "Tất cả nhà" với query parameters
    const queryString = params.toString();
    const url = queryString ? `/all-houses?${queryString}` : '/all-houses';
    navigate(url);
    
    // Gọi callback onSearch nếu được truyền vào (cho backward compatibility)
    if (onSearch) {
      onSearch(searchData);
    }
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
        <SearchRow>
          <SearchField>
            <Label><FaMapMarkerAlt /> Tìm kiếm</Label>
            <InputWrapper>
              <FaMapMarkerAlt />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên, địa chỉ, mô tả..."
                value={searchData.searchTerm}
                onChange={(e) => handleChange('searchTerm', e.target.value)}
              />
            </InputWrapper>
          </SearchField>

          <SearchButton type="submit">
            <FaSearch /> Tìm kiếm
          </SearchButton>
        </SearchRow>

        <FilterRow>
          <SearchField>
            <Label><FaFilter /> Trạng thái</Label>
            <InputWrapper>
              <FaFilter />
              <Select
                value={searchData.statusFilter}
                onChange={(e) => handleChange('statusFilter', e.target.value)}
              >
                <option value="ALL">Tất cả trạng thái</option>
                {Object.entries(HOUSE_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </InputWrapper>
          </SearchField>

          <SearchField>
            <Label><FaHome /> Loại nhà</Label>
            <InputWrapper>
              <FaHome />
              <Select
                value={searchData.typeFilter}
                onChange={(e) => handleChange('typeFilter', e.target.value)}
              >
                <option value="ALL">Tất cả loại nhà</option>
                {Object.entries(HOUSE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </InputWrapper>
          </SearchField>

          <SearchField>
            <Label><FaDollarSign /> Giá tối thiểu (VNĐ)</Label>
            <InputWrapper>
              <FaDollarSign />
              <Input
                type="number"
                placeholder="0"
                value={searchData.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
              />
            </InputWrapper>
          </SearchField>

          <SearchField>
            <Label><FaDollarSign /> Giá tối đa (VNĐ)</Label>
            <InputWrapper>
              <FaDollarSign />
              <Input
                type="number"
                placeholder="Không giới hạn"
                value={searchData.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
              />
            </InputWrapper>
          </SearchField>
        </FilterRow>
      </SearchForm>
    </SearchContainer>
  );
};

export default AdvancedSearchBar;
