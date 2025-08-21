import React, { useState, useEffect } from "react";
import styled from "styled-components";
import rentalApi from "../../api/rentalApi";
import { useToast } from "../common/Toast";
import { useAuthContext } from "../../contexts/AuthContext";
import { ClockIcon } from "@heroicons/react/24/outline";

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

const UserInfo = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const UserInfoTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
`;

const UserInfoDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
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
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const CharacterCount = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
  margin-top: 0.25rem;
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

const TimeInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const TimeInput = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* Ẩn icon đồng hồ mặc định của trình duyệt */
  &::-webkit-calendar-picker-indicator {
    display: none;
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const TimeIconButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s;

  &:hover {
    color: #374151;
  }
`;

const TimePickerModal = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 0.25rem;
`;

const TimePickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.25rem;
  padding: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
`;

const TimeOption = styled.button`
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  background: white;
  color: #374151;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    border-color: #3b82f6;
  }

  &.selected {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
`;

const RentHouseModal = ({ isOpen, onClose, house, onSuccess }) => {
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("14:00"); // Mặc định 14:00
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("12:00"); // Mặc định 12:00
  const [guestCount, setGuestCount] = useState(1);
  const [messageToHost, setMessageToHost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [errors, setErrors] = useState({});
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const { showSuccess, showError } = useToast();
  const { user } = useAuthContext();

  // Tạo danh sách các giờ từ 00:00 đến 23:59
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) { // 30 phút một
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Tính toán ngày tối thiểu (hôm nay)
  const today = new Date().toISOString().split("T")[0];

  // Đóng time picker khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStartTimePicker || showEndTimePicker) {
        const timePickers = document.querySelectorAll('.time-picker-modal');
        let clickedInside = false;
        
        timePickers.forEach(picker => {
          if (picker.contains(event.target)) {
            clickedInside = true;
          }
        });
        
        if (!clickedInside) {
          setShowStartTimePicker(false);
          setShowEndTimePicker(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStartTimePicker, showEndTimePicker]);

  // Tính toán ngày tối thiểu cho endDate
  const getMinEndDate = () => {
    if (!startDate) return today;
    return startDate; // Cho phép chọn cùng ngày với startDate
  };
  
  const minEndDateString = getMinEndDate();

  // Tính toán tổng tiền theo ngày
  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !house?.price) return 0;
    
    const start = new Date(startDate + "T" + startTime);
    const end = new Date(endDate + "T" + endTime);
    const hours = (end - start) / (1000 * 60 * 60);
    
    // Tính số ngày, nếu ít hơn hoặc bằng 24 giờ thì tính 1 ngày, nếu nhiều hơn thì làm tròn lên
    const days = hours <= 24 ? 1 : Math.ceil(hours / 24);
    return days * house.price;
  };

  const totalPrice = calculateTotalPrice();
  const numberOfHours = startDate && endDate 
    ? Math.ceil((new Date(endDate + "T" + endTime) - new Date(startDate + "T" + startTime)) / (1000 * 60 * 60))
    : 0;

  // Kiểm tra tính khả dụng khi ngày hoặc giờ thay đổi
  useEffect(() => {
    if (startDate && endDate && startTime && endTime && house?.id) {
      checkAvailability();
    } else {
      setAvailability(null);
    }
  }, [startDate, endDate, startTime, endTime, house?.id]);

  const checkAvailability = async () => {
    if (!startDate || !endDate || !startTime || !endTime || !house?.id) return;

    setIsCheckingAvailability(true);
    try {
      const startDateTime = startDate + "T" + startTime + ":00";
      const endDateTime = endDate + "T" + endTime + ":00";
      const result = await rentalApi.checkAvailability(house.id, startDateTime, endDateTime);
      setAvailability(result);
    } catch (error) {
      console.error("Error checking availability:", error);
      // Không set availability khi có lỗi, để không hiển thị thông báo lỗi
      setAvailability(null);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    } else {
      // Kiểm tra thời gian bắt đầu phải lớn hơn 2 giờ so với hiện tại
      const startDateTime = new Date(startDate + "T" + startTime);
      const now = new Date();
      const minimumStartTime = new Date(now.getTime() + (2 * 60 * 60 * 1000)); // Hiện tại + 2 giờ
      
      if (startDateTime <= minimumStartTime) {
        newErrors.startDate = "Thời gian bắt đầu phải vượt qua thời gian hiện tại ít nhất 2 giờ";
      }
    }

    if (!endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    }

    // Kiểm tra thời gian trả tối thiểu (ít nhất 2 giờ sau thời gian đặt)
    if (startDate && endDate && startTime && endTime) {
      const start = new Date(startDate + "T" + startTime);
      const end = new Date(endDate + "T" + endTime);
      const hours = (end - start) / (1000 * 60 * 60);
      if (hours < 2) {
        newErrors.endDate = "Thời gian trả phải ít nhất 2 giờ sau thời gian đặt";
      }
    }

    if (guestCount < 1 || guestCount > 20) {
      newErrors.guestCount = "Số lượng khách phải từ 1 đến 20 người";
    }

    if (messageToHost && messageToHost.length > 1000) {
      newErrors.messageToHost = "Lời nhắn không được vượt quá 1000 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('=== RENT HOUSE MODAL DEBUG ===');
    console.log('RentHouseModal - handleSubmit called');
    console.log('RentHouseModal - user:', user);
    console.log('RentHouseModal - user exists:', !!user);
    console.log('RentHouseModal - user ID:', user?.id);
    console.log('RentHouseModal - house:', house);
    console.log('RentHouseModal - house ID:', house?.id);
    console.log('RentHouseModal - form data:', {
      startDate,
      startTime,
      endDate,
      endTime,
      guestCount,
      messageToHost
    });

    if (!validateForm()) {
      console.log('RentHouseModal - Form validation failed');
      return;
    }

    if (!user || !user.id) {
      console.log('RentHouseModal - User not logged in');
      showError("Lỗi", "Vui lòng đăng nhập để thuê nhà");
      return;
    }

    setIsSubmitting(true);
    try {
      // Format ngày và giờ theo format LocalDateTime để backend có thể parse (không có timezone)
      const startDateTime = startDate + "T" + startTime + ":00";
      const endDateTime = endDate + "T" + endTime + ":00";
      
      console.log('Frontend - datetime format:', { startDateTime, endDateTime });
      
      const rentalRequestData = {
        houseId: house.id,
        startDate: startDateTime,
        endDate: endDateTime,
        guestCount: guestCount,
        messageToHost: messageToHost,
      };

      console.log('Sending rental request data:', rentalRequestData);
      console.log('Calling rentalApi.createRequest...');
      
      const result = await rentalApi.createRequest(rentalRequestData);
      
      console.log('Rental request result:', result);
      
      showSuccess("Thành công", result.message || "Đã gửi yêu cầu thuê nhà thành công! Chủ nhà sẽ xem xét và phản hồi sớm.");
      onSuccess && onSuccess(result.data);
      onClose();
    } catch (error) {
      console.error("=== RENTAL REQUEST ERROR ===");
      console.error("Error creating rental:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      
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

  const handleTimeSelect = (time, isStartTime) => {
    if (isStartTime) {
      setStartTime(time);
      setShowStartTimePicker(false);
    } else {
      setEndTime(time);
      setShowEndTimePicker(false);
    }
  };

  if (!isOpen || !house) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Gửi yêu cầu thuê nhà</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <HouseInfo>
          <HouseTitle>{house.title}</HouseTitle>
                     <HouseDetails>
             <div>📍 {house.address}</div>
             <div>💰 {house.price?.toLocaleString()} VNĐ/ngày</div>
             <div>🏠 {house.houseType}</div>
             <div>📏 {house.area} m²</div>
           </HouseDetails>
        </HouseInfo>

        {/* Thông tin người thuê */}
        <UserInfo>
          <UserInfoTitle>Thông tin người thuê</UserInfoTitle>
          <UserInfoDetails>
            <div>👤 <strong>{user?.fullName || user?.username || 'Chưa có tên'}</strong></div>
            <div>📧 {user?.email || 'Chưa có email'}</div>
            <div>📱 {user?.phone || 'Chưa có số điện thoại'}</div>
          </UserInfoDetails>
        </UserInfo>

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
            <Label htmlFor="startTime">Giờ nhận phòng *</Label>
            <TimeInputWrapper>
              <TimeInput
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
                step="1800" // 30 phút
              />
              <TimeIconButton
                type="button"
                onClick={() => setShowStartTimePicker(!showStartTimePicker)}
              >
                <ClockIcon className="w-5 h-5" />
              </TimeIconButton>
              {showStartTimePicker && (
                <TimePickerModal className="time-picker-modal">
                  <TimePickerGrid>
                    {timeOptions.map((time) => (
                      <TimeOption
                        key={time}
                        className={time === startTime ? 'selected' : ''}
                        onClick={() => handleTimeSelect(time, true)}
                      >
                        {time}
                      </TimeOption>
                    ))}
                  </TimePickerGrid>
                </TimePickerModal>
              )}
            </TimeInputWrapper>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Thời gian nhận phòng thường từ 14:00. Thời gian bắt đầu phải vượt qua hiện tại ít nhất 2 giờ.
            </div>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="endDate">Ngày trả phòng *</Label>
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

          <FormGroup>
            <Label htmlFor="endTime">Giờ trả phòng *</Label>
            <TimeInputWrapper>
              <TimeInput
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
                step="1800" // 30 phút
              />
              <TimeIconButton
                type="button"
                onClick={() => setShowEndTimePicker(!showEndTimePicker)}
              >
                <ClockIcon className="w-5 h-5" />
              </TimeIconButton>
              {showEndTimePicker && (
                <TimePickerModal className="time-picker-modal">
                  <TimePickerGrid>
                    {timeOptions.map((time) => (
                      <TimeOption
                        key={time}
                        className={time === endTime ? 'selected' : ''}
                        onClick={() => handleTimeSelect(time, false)}
                      >
                        {time}
                      </TimeOption>
                    ))}
                  </TimePickerGrid>
                </TimePickerModal>
              )}
            </TimeInputWrapper>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Thời gian trả phòng thường trước 12:00
            </div>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="guestCount">Số lượng khách *</Label>
            <Input
              type="number"
              id="guestCount"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
              min="1"
              max="20"
              required
            />
            {errors.guestCount && <ErrorText>{errors.guestCount}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="messageToHost">Lời nhắn cho chủ nhà</Label>
            <Textarea
              id="messageToHost"
              value={messageToHost}
              onChange={(e) => setMessageToHost(e.target.value)}
              placeholder="Nhập lời nhắn cho chủ nhà (tùy chọn)..."
              rows="3"
              maxLength="1000"
            />
            <CharacterCount>
              {messageToHost.length}/1000 ký tự
            </CharacterCount>
            {errors.messageToHost && <ErrorText>{errors.messageToHost}</ErrorText>}
          </FormGroup>

          {/* Hiển thị trạng thái khả dụng */}
          {startDate && endDate && startTime && endTime && isCheckingAvailability && (
            <AvailabilityStatus className="checking">
              <LoadingSpinner />
              Đang kiểm tra tính khả dụng...
            </AvailabilityStatus>
          )}

          {startDate && endDate && startTime && endTime && availability && !isCheckingAvailability && (
            <AvailabilityStatus className={availability.available ? "available" : "unavailable"}>
              {availability.available ? "✅" : "❌"} {availability.message}
            </AvailabilityStatus>
          )}

          {/* Hiển thị thông báo khi chưa có thông tin khả dụng */}
          {startDate && endDate && startTime && endTime && !availability && !isCheckingAvailability && (
            <AvailabilityStatus className="checking">
              ℹ️ Nhà khả dụng vào thời gian này để thuê
            </AvailabilityStatus>
          )}

          {/* Hiển thị thông tin giá */}
          {startDate && endDate && startTime && endTime && numberOfHours > 0 && (
            <PriceInfo>
              <PriceTitle>Chi tiết giá</PriceTitle>
              <PriceDetails>
                <span>Giá/ngày:</span>
                <span>{house.price?.toLocaleString()} VNĐ</span>
              </PriceDetails>
              <PriceDetails>
                <span>Thời gian:</span>
                <span>{startDate} {startTime} - {endDate} {endTime}</span>
              </PriceDetails>
              <PriceDetails>
                <span>Số ngày:</span>
                <span>{numberOfHours <= 24 ? 1 : Math.ceil(numberOfHours / 24)} ngày</span>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  Đang gửi yêu cầu...
                </>
              ) : (
                "Gửi yêu cầu thuê nhà"
              )}
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RentHouseModal; 