import React, { useState, useEffect } from "react";
import styled from "styled-components";
import rentalApi from "../../api/rentalApi";
import { useToast } from "../common/Toast";
import { useAuthContext } from "../../contexts/AuthContext";
import { ClockIcon, MapPinIcon, CurrencyDollarIcon, HomeIcon, UserIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f1f5f9;
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const CloseButton = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 1.25rem;
  cursor: pointer;
  color: #64748b;
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  &:hover {
    background: #e2e8f0;
    color: #475569;
    transform: scale(1.05);
  }
`;

const HouseInfo = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
`;

const HouseTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
`;

const HouseDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #475569;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  font-weight: 500;
  border: 1px solid rgba(226, 232, 240, 0.5);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  svg {
    color: #667eea;
    flex-shrink: 0;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #374151;
  min-width: 80px;
`;

const DetailValue = styled.span`
  color: #475569;
  flex: 1;
`;

const UserInfo = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const UserInfoTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #0c4a6e;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserInfoDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #0c4a6e;
`;

const UserDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  font-weight: 500;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s ease;
  background: #f8fafc;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const CharacterCount = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const PriceInfo = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.3);
`;

const PriceTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PriceDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  padding: 0.5rem 0;
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 700;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  padding-top: 1rem;
  margin-top: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }

  &.secondary {
    background: #f8fafc;
    color: #374151;
    border: 2px solid #e2e8f0;

    &:hover {
      background: #e2e8f0;
      border-color: #cbd5e1;
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
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const AvailabilityStatus = styled.div`
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;

  &.available {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  &.unavailable {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  &.checking {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
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
  padding: 0.875rem 3rem 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }

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
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #475569;
  }
`;

const TimePickerModal = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 0.5rem;
`;

const TimePickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  padding: 1rem;
  max-height: 200px;
  overflow-y: auto;
`;

const TimeOption = styled.button`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: #f3f4f6;
    border-color: #667eea;
  }

  &.selected {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: #667eea;
  }
`;

const InfoText = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #667eea;
  font-weight: 500;
`;

const RentHouseModal = ({ isOpen, onClose, house, onSuccess }) => {
  // Lấy ngày hiện tại và format thành YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];
  
  const [startDate, setStartDate] = useState(today);
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

  // Tính toán ngày tối thiểu (hôm nay) - đã được định nghĩa ở trên

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
            <DetailItem>
              <MapPinIcon className="w-5 h-5" />
              <DetailLabel>Địa chỉ:</DetailLabel>
              <DetailValue>{house.address}</DetailValue>
            </DetailItem>
            <DetailItem>
              <CurrencyDollarIcon className="w-5 h-5" />
              <DetailLabel>Giá:</DetailLabel>
              <DetailValue>{house.price?.toLocaleString()} VNĐ/ngày</DetailValue>
            </DetailItem>
            <DetailItem>
              <HomeIcon className="w-5 h-5" />
              <DetailLabel>Loại nhà:</DetailLabel>
              <DetailValue>{house.houseType}</DetailValue>
            </DetailItem>
            <DetailItem>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <DetailLabel>Diện tích:</DetailLabel>
              <DetailValue>{house.area} m²</DetailValue>
            </DetailItem>
          </HouseDetails>
        </HouseInfo>

        {/* Thông tin người thuê */}
        <UserInfo>
          <UserInfoTitle>
            <UserIcon className="w-5 h-5" />
            Thông tin người thuê
          </UserInfoTitle>
          <UserInfoDetails>
            <UserDetailItem>
              <UserIcon className="w-4 h-4" />
              <strong>{user?.fullName || user?.username || 'Chưa có tên'}</strong>
            </UserDetailItem>
            <UserDetailItem>
              <EnvelopeIcon className="w-4 h-4" />
              {user?.email || 'Chưa có email'}
            </UserDetailItem>
            <UserDetailItem>
              <PhoneIcon className="w-4 h-4" />
              {user?.phone || 'Chưa có số điện thoại'}
            </UserDetailItem>
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
            <InfoText>
              Thời gian nhận phòng thường từ 14:00. Thời gian bắt đầu phải vượt qua hiện tại ít nhất 2 giờ.
            </InfoText>
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
            <InfoText>
              Thời gian trả phòng thường trước 12:00
            </InfoText>
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
              {availability.available ? (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {availability.message}
            </AvailabilityStatus>
          )}

          {/* Hiển thị thông báo khi chưa có thông tin khả dụng */}
          {startDate && endDate && startTime && endTime && !availability && !isCheckingAvailability && (
            <AvailabilityStatus className="checking">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              Nhà khả dụng vào thời gian này để thuê
            </AvailabilityStatus>
          )}

          {/* Hiển thị thông tin giá */}
          {startDate && endDate && startTime && endTime && numberOfHours > 0 && (
            <PriceInfo>
              <PriceTitle>
                <CurrencyDollarIcon className="w-5 h-5" />
                Chi tiết giá
              </PriceTitle>
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Gửi yêu cầu thuê nhà
                </>
              )}
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RentHouseModal; 