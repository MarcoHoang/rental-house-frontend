import React from "react";
import styled from "styled-components";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";

const SearchAndSortContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 1rem;
  height: 1rem;
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &.active {
    background: #10b981;
    color: white;
    border-color: #10b981;
  }
`;

const SearchAndSortBar = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  sortField,
  sortDirection,
  onSortChange,
  onFilterChange,
  showSort = true,
  showFilter = true,
  placeholder = "Tìm kiếm...",
  sortOptions = [],
  debounceMs = 500
}) => {
  const handleSearchChange = (value) => {
    onSearchChange(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  const handleSearchClick = () => {
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <SearchAndSortContainer>
      <SearchContainer>
        <SearchIcon />
        <form onSubmit={handleSearchSubmit}>
          <SearchInput
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </form>
        <SearchButton onClick={handleSearchClick}>
          Tìm
        </SearchButton>
      </SearchContainer>

      {showSort && sortOptions.length > 0 && (
        <SortContainer>
          <SortButton
            className={sortDirection === "asc" ? "active" : ""}
            onClick={() => onSortChange(sortField, "asc")}
          >
            <SortAsc size={16} />
            Tăng dần
          </SortButton>
          <SortButton
            className={sortDirection === "desc" ? "active" : ""}
            onClick={() => onSortChange(sortField, "desc")}
          >
            <SortDesc size={16} />
            Giảm dần
          </SortButton>
        </SortContainer>
      )}

      {showFilter && (
        <FilterButton onClick={onFilterChange}>
          <Filter size={16} />
          Lọc
        </FilterButton>
      )}
    </SearchAndSortContainer>
  );
};

export default SearchAndSortBar;
