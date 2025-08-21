// src/components/house/SearchBar.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { Search, MapPin } from "lucide-react";
import { useToast } from "../common/Toast";

const SearchWrapper = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  max-width: 700px;
  margin: 2rem auto;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 1.1rem;
  padding: 0 1.5rem;
  background: transparent;
  color: #1e293b;
  font-weight: 500;

  &::placeholder {
    color: #64748b;
    font-weight: 400;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(238, 90, 36, 0.3);

  &:hover {
    background: linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(238, 90, 36, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const { showSuccess } = useToast();

  const handleSearch = () => {
    if (query.trim()) {
      showSuccess('Tìm kiếm', `Đang tìm kiếm với từ khóa: "${query}"`);
      
      // Gọi callback onSearch nếu được truyền vào
      if (onSearch && typeof onSearch === 'function') {
        onSearch(query);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <SearchWrapper>
      <MapPin size={20} style={{ marginLeft: '1rem', color: '#64748b' }} />
      <SearchInput
        type="text"
        placeholder="Tìm kiếm theo địa điểm, quận, tên đường..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <SearchButton onClick={handleSearch}>
        <Search size={18} />
        Tìm kiếm
      </SearchButton>
    </SearchWrapper>
  );
};

export default SearchBar;
