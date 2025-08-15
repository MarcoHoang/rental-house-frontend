import React, { useState, useEffect } from "react";
import styled from "styled-components";
import rentalApi from "../../api/rentalApi";
import { useToast } from "../common/Toast";
import { useAuthContext } from "../../contexts/AuthContext";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s;

  &:hover {
    color: #374151;
  }
`;

const HouseInfo = styled.div`
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const HouseTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const HouseDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 1px #667eea;
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const PriceInfo = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const PriceTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const PriceDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.125rem;
  font-weight: 600;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 0.5rem;
  margin-top: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
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
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const AvailabilityStatus = styled.div`
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.available {
    background: #f0fdf4;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  &.unavailable {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  &.checking {
    background: #f0f9ff;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }
`;

const RentHouseModal = ({ isOpen, onClose, house, onSuccess }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [errors, setErrors] = useState({});
  const { showSuccess, showError } = useToast();
  const { user } = useAuthContext();

  // Tính toán ngày tối thiểu (hôm nay)
  const today = new Date().toISOString().split("T")[0];

  // Tính toán ngày tối thiểu cho endDate (startDate + 1 ngày)
  const minEndDate = startDate ? new Date(startDate) : new Date();
  minEndDate.setDate(minEndDate.getDate() + 1);
  const minEndDateString = minEndDate.toISOString().split("T")[0];

  // Tính toán tổng tiền theo tháng
  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !house?.price) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // Tính theo tháng (30 ngày = 1 tháng)
    const months = Math.ceil(days / 30);
    
    return months * house.price;
  };

  const totalPrice = calculateTotalPrice();
  const numberOfDays = startDate && endDate 
    ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    : 0;

  // Kiểm tra tính khả dụng khi ngày thay đổi
  useEffect(() => {
    if (startDate && endDate && house?.id) {
      checkAvailability();
    } else {
      setAvailability(null);
    }
  }, [startDate, endDate, house?.id]);

  const checkAvailability = async () => {
    if (!startDate || !endDate || !house?.id) return;

    setIsCheckingAvailability(true);
    try {
      const result = await rentalApi.checkAvailability(house.id, startDate, endDate);
      setAvailability(result);
    } catch (error) {
      console.error("Error checking availability:", error);
      setAvailability({
        available: false,
        message: "Không thể kiểm tra tính khả dụng. Vui lòng thử lại.",
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    }

    if (!endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    } else if (startDate && endDate <= startDate) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if (availability && !availability.available) {
      newErrors.availability = availability.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('RentHouseModal - handleSubmit called');
    console.log('RentHouseModal - user:', user);
    console.log('RentHouseModal - user exists:', !!user);
    console.log('RentHouseModal - user ID:', user?.id);

    if (!validateForm()) return;

    if (!user || !user.id) {
      showError("Lỗi", "Vui lòng đăng nhập để thuê nhà");
      return;
    }

    setIsSubmitting(true);
    try {
      const rentalData = {
        houseId: house.id,
        renterId: user.id,
        startDate: startDate + "T00:00:00",
        endDate: endDate + "T23:59:59",
        totalPrice: totalPrice,
      };

      const result = await rentalApi.createRental(rentalData);
      
      showSuccess("Thành công", result.message || "Đặt nhà thành công!");
      onSuccess && onSuccess(result.data);
      onClose();
    } catch (error) {
      console.error("Error creating rental:", error);
      
      let errorMessage = "Có lỗi xảy ra khi đặt nhà";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError("Lỗi", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !house) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Đặt nhà</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <HouseInfo>
          <HouseTitle>{house.title}</HouseTitle>
          <HouseDetails>
            <div>📍 {house.address}</div>
            <div>💰 {house.price?.toLocaleString()} VNĐ/tháng</div>
            <div>🏠 {house.houseType}</div>
            <div>📏 {house.area} m²</div>
          </HouseDetails>
        </HouseInfo>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="startDate">Ngày bắt đầu *</Label>
            <Input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={today}
              required
            />
            {errors.startDate && <ErrorText>{errors.startDate}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="endDate">Ngày kết thúc *</Label>
            <Input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={minEndDateString}
              required
            />
            {errors.endDate && <ErrorText>{errors.endDate}</ErrorText>}
          </FormGroup>

          {/* Hiển thị trạng thái khả dụng */}
          {isCheckingAvailability && (
            <AvailabilityStatus className="checking">
              <LoadingSpinner />
              Đang kiểm tra tính khả dụng...
            </AvailabilityStatus>
          )}

          {availability && !isCheckingAvailability && (
            <AvailabilityStatus className={availability.available ? "available" : "unavailable"}>
              {availability.available ? "✅" : "❌"} {availability.message}
            </AvailabilityStatus>
          )}

          {errors.availability && (
            <ErrorText>{errors.availability}</ErrorText>
          )}

          {/* Hiển thị thông tin giá */}
          {startDate && endDate && numberOfDays > 0 && (
            <PriceInfo>
              <PriceTitle>Chi tiết giá</PriceTitle>
              <PriceDetails>
                <span>Giá/tháng:</span>
                <span>{house.price?.toLocaleString()} VNĐ</span>
              </PriceDetails>
              <PriceDetails>
                <span>Số tháng:</span>
                <span>{Math.ceil(numberOfDays / 30)} tháng</span>
              </PriceDetails>
              <TotalPrice>
                <span>Tổng cộng:</span>
                <span>{totalPrice.toLocaleString()} VNĐ</span>
              </TotalPrice>
            </PriceInfo>
          )}

          <ButtonGroup>
            <Button type="button" className="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="primary" 
              disabled={isSubmitting || !availability?.available}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  Đang đặt...
                </>
              ) : (
                "Xác nhận đặt nhà"
              )}
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RentHouseModal; 