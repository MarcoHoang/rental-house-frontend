import React, { useState, useEffect } from "react";
import styled from "styled-components";
import rentalApi from "../../api/rentalApi";
import { useToast } from "../common/Toast";
import { useAuthContext } from "../../contexts/AuthContext";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const RentalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const RentalCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const RentalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const HouseTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  
  &.scheduled {
    background: #fef3c7;
    color: #92400e;
  }
  
  &.pending {
    background: #dbeafe;
    color: #1e40af;
  }
  
  &.approved {
    background: #d1fae5;
    color: #065f46;
  }
  
  &.checked-in {
    background: #e0e7ff;
    color: #3730a3;
  }
  
  &.checked-out {
    background: #f3f4f6;
    color: #374151;
  }
  
  &.canceled {
    background: #fee2e2;
    color: #dc2626;
  }
  
  &.rejected {
    background: #fef2f2;
    color: #991b1b;
  }
`;

const RentalDetails = styled.div`
  margin-bottom: 1rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  
  .label {
    color: #6b7280;
    font-weight: 500;
  }
  
  .value {
    color: #1f2937;
    font-weight: 600;
  }
`;

const PriceInfo = styled.div`
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  
  &.total {
    font-weight: 600;
    font-size: 1rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5a67d8;
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #e5e7eb;
    }
  }
  
  &.danger {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
  
  &.success {
    background: #10b981;
    color: white;
    
    &:hover {
      background: #059669;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  &::after {
    content: '';
    width: 2rem;
    height: 2rem;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.875rem;
  }
`;

const RentalManagement = ({ userRole = "user" }) => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const { showSuccess, showError } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    loadRentals();
  }, [userRole]);

  const loadRentals = async () => {
    try {
      setLoading(true);
      let data;
      
      if (userRole === "host") {
        data = await rentalApi.getHostRentals(user?.id);
      } else {
        data = await rentalApi.getMyRentals();
      }
      
      setRentals(data || []);
    } catch (error) {
      console.error("Error loading rentals:", error);
      showError("Lỗi", "Không thể tải danh sách đơn thuê");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, rentalId, reason = "") => {
    try {
      let result;
      
      switch (action) {
        case "approve":
          result = await rentalApi.approveRental(rentalId);
          break;
        case "reject":
          result = await rentalApi.rejectRental(rentalId, reason);
          break;
        case "cancel":
          result = await rentalApi.cancelRental(rentalId, reason);
          break;
        case "checkin":
          result = await rentalApi.checkin(rentalId);
          break;
        case "checkout":
          result = await rentalApi.checkout(rentalId);
          break;
        default:
          return;
      }
      
      showSuccess("Thành công", result.message);
      loadRentals(); // Reload data
    } catch (error) {
      console.error(`Error ${action} rental:`, error);
      showError("Lỗi", `Không thể ${action} đơn thuê`);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      SCHEDULED: "scheduled",
      PENDING: "pending",
      APPROVED: "approved",
      CHECKED_IN: "checked-in",
      CHECKED_OUT: "checked-out",
      CANCELED: "canceled",
      REJECTED: "rejected"
    };
    return statusMap[status] || "scheduled";
  };

  const getStatusText = (status) => {
    const statusMap = {
      SCHEDULED: "Đã đặt",
      PENDING: "Chờ xác nhận",
      APPROVED: "Đã xác nhận",
      CHECKED_IN: "Đã nhận phòng",
      CHECKED_OUT: "Đã trả phòng",
      CANCELED: "Đã hủy",
      REJECTED: "Bị từ chối"
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price) => {
    return price?.toLocaleString("vi-VN") + " VNĐ" || "0 VNĐ";
  };

  const filteredRentals = rentals.filter(rental => {
    if (statusFilter === "all") return true;
    return rental.status === statusFilter;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Header>
        <Title>
          {userRole === "host" ? "Quản lý đơn thuê" : "Lịch sử thuê nhà"}
        </Title>
      </Header>

      <FilterSection>
        <FilterSelect 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="SCHEDULED">Đã đặt</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="APPROVED">Đã xác nhận</option>
          <option value="CHECKED_IN">Đã nhận phòng</option>
          <option value="CHECKED_OUT">Đã trả phòng</option>
          <option value="CANCELED">Đã hủy</option>
          <option value="REJECTED">Bị từ chối</option>
        </FilterSelect>
      </FilterSection>

      {filteredRentals.length === 0 ? (
        <EmptyState>
          <h3>Không có đơn thuê nào</h3>
          <p>
            {userRole === "host" 
              ? "Chưa có đơn thuê nào cho nhà của bạn"
              : "Bạn chưa có đơn thuê nào"
            }
          </p>
        </EmptyState>
      ) : (
        <RentalGrid>
          {filteredRentals.map((rental) => (
            <RentalCard key={rental.id}>
              <RentalHeader>
                <HouseTitle>{rental.houseTitle}</HouseTitle>
                <StatusBadge className={getStatusBadgeClass(rental.status)}>
                  {getStatusText(rental.status)}
                </StatusBadge>
              </RentalHeader>

              <RentalDetails>
                <DetailRow>
                  <span className="label">Địa chỉ:</span>
                  <span className="value">{rental.houseAddress}</span>
                </DetailRow>
                <DetailRow>
                  <span className="label">Ngày bắt đầu:</span>
                  <span className="value">{formatDate(rental.startDate)}</span>
                </DetailRow>
                <DetailRow>
                  <span className="label">Ngày kết thúc:</span>
                  <span className="value">{formatDate(rental.endDate)}</span>
                </DetailRow>
                <DetailRow>
                  <span className="label">Số ngày:</span>
                  <span className="value">{rental.numberOfDays} ngày</span>
                </DetailRow>
                {userRole === "user" && (
                  <DetailRow>
                    <span className="label">Chủ nhà:</span>
                    <span className="value">{rental.hostName}</span>
                  </DetailRow>
                )}
                {userRole === "host" && (
                  <DetailRow>
                    <span className="label">Người thuê:</span>
                    <span className="value">{rental.renterName}</span>
                  </DetailRow>
                )}
              </RentalDetails>

              <PriceInfo>
                <PriceRow>
                  <span>Giá/ngày:</span>
                  <span>{formatPrice(rental.pricePerDay)}</span>
                </PriceRow>
                {rental.depositAmount && (
                  <PriceRow>
                    <span>Đặt cọc:</span>
                    <span>{formatPrice(rental.depositAmount)}</span>
                  </PriceRow>
                )}
                <PriceRow className="total">
                  <span>Tổng tiền:</span>
                  <span>{formatPrice(rental.totalPrice)}</span>
                </PriceRow>
              </PriceInfo>

              {rental.specialRequests && (
                <DetailRow>
                  <span className="label">Yêu cầu đặc biệt:</span>
                  <span className="value">{rental.specialRequests}</span>
                </DetailRow>
              )}

              <ActionButtons>
                {userRole === "host" && rental.status === "SCHEDULED" && (
                  <>
                    <Button 
                      className="success" 
                      onClick={() => handleAction("approve", rental.id)}
                    >
                      Xác nhận
                    </Button>
                    <Button 
                      className="danger" 
                      onClick={() => {
                        const reason = prompt("Lý do từ chối:");
                        if (reason !== null) {
                          handleAction("reject", rental.id, reason);
                        }
                      }}
                    >
                      Từ chối
                    </Button>
                  </>
                )}

                {userRole === "host" && rental.status === "APPROVED" && (
                  <Button 
                    className="primary" 
                    onClick={() => handleAction("checkin", rental.id)}
                  >
                    Check-in
                  </Button>
                )}

                {userRole === "host" && rental.status === "CHECKED_IN" && (
                  <Button 
                    className="primary" 
                    onClick={() => handleAction("checkout", rental.id)}
                  >
                    Check-out
                  </Button>
                )}

                {rental.canBeCancelled && (
                  <Button 
                    className="danger" 
                    onClick={() => {
                      const reason = prompt("Lý do hủy:");
                      if (reason !== null) {
                        handleAction("cancel", rental.id, reason);
                      }
                    }}
                  >
                    Hủy đơn
                  </Button>
                )}
              </ActionButtons>
            </RentalCard>
          ))}
        </RentalGrid>
      )}
    </Container>
  );
};

export default RentalManagement; 