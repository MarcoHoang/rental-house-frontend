import React from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const PaginationInfo = styled.div`
  color: #64748b;
  font-size: 0.875rem;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const PageButton = styled.button`
  padding: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background: #f1f5f9;
  }
  
  &:hover:not(:disabled) {
    background: #e2e8f0;
    border-color: #cbd5e0;
  }
  
  &.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
    
    &:hover {
      background: #2563eb;
    }
  }
`;

const PageNumber = styled.span`
  padding: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalElements, 
  pageSize, 
  onPageChange,
  showInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5
}) => {
  if (totalPages <= 1) return null;

  const startElement = (currentPage * pageSize) + 1;
  const endElement = Math.min((currentPage + 1) * pageSize, totalElements);

  // Tính toán các trang hiển thị
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(0, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Điều chỉnh nếu endPage quá gần cuối
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <PaginationContainer>
      {showInfo && (
        <PaginationInfo>
          Hiển thị {startElement}-{endElement} trong tổng số {totalElements} mục
        </PaginationInfo>
      )}
      
      <PaginationControls>
        {showFirstLast && (
          <PageButton
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 0}
            title="Trang đầu"
          >
            <ChevronsLeft size={16} />
          </PageButton>
        )}
        
        <PageButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          title="Trang trước"
        >
          <ChevronLeft size={16} />
        </PageButton>
        
        {visiblePages.map((page) => (
          <PageButton
            key={page}
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? 'active' : ''}
          >
            {page + 1}
          </PageButton>
        ))}
        
        <PageButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          title="Trang sau"
        >
          <ChevronRight size={16} />
        </PageButton>
        
        {showFirstLast && (
          <PageButton
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
            title="Trang cuối"
          >
            <ChevronsRight size={16} />
          </PageButton>
        )}
      </PaginationControls>
    </PaginationContainer>
  );
};

export default Pagination;
