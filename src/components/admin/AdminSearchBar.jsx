import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "../common/Toast";

const SearchContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const SearchHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-bottom: ${props => props.$showFilters ? '1px solid #e2e8f0' : 'none'};
`;

const SearchInputContainer = styled.div`
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
  transition: all 0.2s;

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



const FilterToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
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

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fef2f2;
    border-color: #ef4444;
  }
`;

const FilterSection = styled.div`
  padding: 1rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: ${props => props.$show ? 'block' : 'none'};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const FilterTag = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

const RemoveFilterButton = styled.button`
  background: none;
  border: none;
  color: #3730a3;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: #1e1b4b;
  }
`;

const AdminSearchBar = ({
  searchTerm,
  setSearchTerm,
  filters = {},
  setFilters,
  onSearch,
  onClear,
  placeholder = "Tìm kiếm theo tên, email, số điện thoại...",
  filterOptions = {},
  $showFilters = true,
  debounceMs = 300 // Thêm debounce để tránh gọi API quá nhiều
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [showFilters, setShowFilters] = useState(false);
  const { showSuccess, showError } = useToast();

  // Sync local search term with prop
  useEffect(() => {
    setLocalSearchTerm(searchTerm || "");
  }, [searchTerm]);

  // Chỉ sync searchTerm, KHÔNG tự động gọi onSearch (tránh load liên tục)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Chỉ cập nhật searchTerm global, không gọi API
      if (localSearchTerm !== searchTerm) {
        setSearchTerm(localSearchTerm);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearchTerm, debounceMs, setSearchTerm, searchTerm]);



  const handleClearSearch = useCallback(() => {
    setLocalSearchTerm("");
    onClear();
    // Không cần showSuccess cho clear
  }, [onClear]);



  const toggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  // Kiểm tra có filter nào đang active không
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== '' && value !== 'ALL'
  );

  // Tạo danh sách active filters để hiển thị
  const activeFilterTags = Object.entries(filters)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '' && value !== 'ALL')
    .map(([key, value]) => {
      // Xử lý cả array và object format cho filterOptions
      let label = value;
      
      if (filterOptions[key]) {
        if (Array.isArray(filterOptions[key])) {
          const option = filterOptions[key].find(option => option.value === value);
          label = option?.label || value;
        } else if (typeof filterOptions[key] === 'object' && filterOptions[key] !== null) {
          label = filterOptions[key][value] || value;
        }
      }
      
      return {
        key,
        value,
        label
      };
    });

  const removeFilter = useCallback((filterKey) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: 'ALL'
    }));
  }, [setFilters]);

  return (
    <SearchContainer>
      <SearchHeader $showFilters={$showFilters}>
        <SearchInputContainer>
          <SearchIcon />
                      <SearchInput
              type="text"
              placeholder={placeholder}
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
        </SearchInputContainer>



        {$showFilters && (
          <FilterToggleButton
            onClick={toggleFilters}
            className={showFilters ? 'active' : ''}
          >
            <Filter size={16} />
            Bộ lọc
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </FilterToggleButton>
        )}

        {(localSearchTerm || hasActiveFilters) && (
          <ClearButton onClick={handleClearSearch}>
            <X size={16} />
            Xóa
          </ClearButton>
        )}
      </SearchHeader>

      {showFilters && $showFilters && (
        <FilterSection $show={showFilters}>
          <FilterGrid>
            {Object.entries(filterOptions).map(([key, options]) => {
              // Xử lý cả array và object format
              let optionsArray = [];
              
              if (Array.isArray(options)) {
                optionsArray = options;
              } else if (typeof options === 'object' && options !== null) {
                // Chuyển đổi object thành array
                optionsArray = Object.entries(options).map(([value, label]) => ({
                  value,
                  label
                }));
              }
              
              return (
                <FilterGroup key={key}>
                  <FilterLabel>{key}</FilterLabel>
                  <FilterSelect
                    value={filters[key] || 'ALL'}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                  >
                    {optionsArray.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FilterSelect>
                </FilterGroup>
              );
            })}
          </FilterGrid>

          <FilterActions>
            <ActiveFilters>
              {activeFilterTags.map(({ key, value, label }) => (
                <FilterTag key={key}>
                  {label}
                  <RemoveFilterButton onClick={() => removeFilter(key)}>
                    <X size={12} />
                  </RemoveFilterButton>
                </FilterTag>
              ))}
            </ActiveFilters>

            {hasActiveFilters && (
              <ClearButton onClick={() => {
                setFilters(Object.keys(filters).reduce((acc, key) => {
                  acc[key] = 'ALL';
                  return acc;
                }, {}));
              }}>
                <X size={16} />
                Xóa tất cả bộ lọc
              </ClearButton>
            )}
          </FilterActions>
        </FilterSection>
      )}
    </SearchContainer>
  );
};

export default AdminSearchBar;
