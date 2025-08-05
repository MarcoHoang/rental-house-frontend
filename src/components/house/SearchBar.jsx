// src/components/house/SearchBar.jsx
import React, { useState } from "react";
import styled from "styled-components";

const SearchWrapper = styled.div`
  display: flex;
  background: white;
  border-radius: 50px;
  padding: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 2rem auto;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0 1rem;
  background: transparent;
`;

const SearchButton = styled.button`
  background-color: #ff5a5f;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0484c;
  }
`;

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      alert(`Đang tìm kiếm với từ khóa: "${query}"`);
      // Trong thực tế, bạn sẽ gọi API ở đây hoặc điều hướng đến trang kết quả tìm kiếm
      // Ví dụ: navigate(`/search?q=${query}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <SearchWrapper>
      <SearchInput
        type="text"
        placeholder="Tìm kiếm theo địa điểm, quận, tên đường..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <SearchButton onClick={handleSearch}>Tìm kiếm</SearchButton>
    </SearchWrapper>
  );
};

export default SearchBar;
