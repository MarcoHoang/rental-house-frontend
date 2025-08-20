import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Star, MessageCircle, Edit, Trash2, User, Calendar, AlertCircle, Eye, EyeOff } from 'lucide-react';
import reviewApi from '../../api/reviewApi';
import rentalApi from '../../api/rentalApi';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../common/Toast';
import ConfirmDialog from '../common/ConfirmDialog';

const ReviewSectionContainer = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ReviewTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const ReviewStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const AverageRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #f59e0b;
`;

const StarRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StarIcon = styled(Star)`
  color: ${props => props.filled ? '#f59e0b' : '#d1d5db'};
  fill: ${props => props.filled ? '#f59e0b' : 'none'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const AddReviewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
`;

const ReviewForm = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
`;

const RatingInput = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  .stars-container {
    display: flex;
    gap: 0.25rem;
  }
`;

const CommentInput = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  textarea {
    width: 100%;
    min-height: 100px;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-family: inherit;
    font-size: 0.875rem;
    resize: vertical;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  
  &.primary {
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  }
  
  &.secondary {
    background: white;
    color: #374151;
    border-color: #d1d5db;
    
    &:hover {
      background: #f9fafb;
    }
  }
  
  &.danger {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReviewItem = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ReviewHeaderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.875rem;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e5e7eb;
    color: #6b7280;
  }
`;

const UserDetails = styled.div`
  .username {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  
  .date {
    font-size: 0.75rem;
    color: #6b7280;
  }
`;

const ReviewActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
  
  &.edit:hover {
    color: #3b82f6;
  }
  
  &.delete:hover {
    color: #ef4444;
  }
  
  &.hide:hover {
    color: #8b5cf6;
  }
`;

const ReviewContent = styled.div`
  .rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .comment {
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
  }
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  .title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .description {
    font-size: 0.875rem;
  }
`;

const ReviewSection = ({ houseId, house }) => {
  const { user } = useAuthContext();
  const { showSuccess, showError } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [showHiddenReviews, setShowHiddenReviews] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });
  const [userReview, setUserReview] = useState(null);
  const [userRentalStatus, setUserRentalStatus] = useState(null);
  const [checkingRental, setCheckingRental] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHostDeleteConfirm, setShowHostDeleteConfirm] = useState(false);
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    fetchReviews();
    if (user) {
      checkUserReview();
      checkUserRentalStatus();
    }
  }, [houseId, user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log('fetchReviews - user:', user);
      console.log('fetchReviews - house:', house);
      console.log('fetchReviews - houseId:', houseId);
      
      // Chủ nhà và Admin có thể thấy tất cả reviews (bao gồm ẩn)
      if (user && ((user.roleName === 'HOST' && house && Number(house.hostId) === Number(user.id)) || user.roleName === 'ADMIN')) {
        console.log('Fetching all reviews for HOST/ADMIN');
        const response = await reviewApi.getAllHouseReviews(houseId);
        console.log('getAllHouseReviews response:', response);
        const list = response?.data || response || [];
        const normalized = Array.isArray(list) ? list : (list?.content || []);
        console.log('Normalized reviews for HOST/ADMIN:', normalized);
        setReviews(normalized);
      } else {
        console.log('Fetching visible reviews for regular user');
        const response = await reviewApi.getHouseReviews(houseId);
        console.log('getHouseReviews response:', response);
        const list = response?.data || response || [];
        const normalized = Array.isArray(list) ? list : (list?.content || []);
        console.log('Normalized reviews for regular user:', normalized);
        setReviews(normalized);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback to empty array
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const checkUserReview = async () => {
    try {
      const response = await reviewApi.checkUserReview(houseId, user.id);
      const exists = (response && typeof response === 'object') ? !!response.exists : (response === true || response === 'true');
      if (exists) {
        const userReviewData = await reviewApi.getUserReview(houseId, user.id);
        setUserReview(userReviewData?.data || userReviewData || null);
      } else {
        setUserReview(null);
      }
    } catch (error) {
      console.error('Error checking user review:', error);
    }
  };

  const checkUserRentalStatus = async () => {
    try {
      setCheckingRental(true);
      const myRentals = await rentalApi.getMyRentals();
      
      // Tìm rental của nhà này
      const houseRental = myRentals.find(rental => rental.houseId === parseInt(houseId));
      
      if (houseRental) {
        setUserRentalStatus({
          status: houseRental.status,
          startDate: houseRental.startDate,
          endDate: houseRental.endDate
        });
      } else {
        setUserRentalStatus(null);
      }
    } catch (error) {
      console.error('Error checking user rental status:', error);
      setUserRentalStatus(null);
    } finally {
      setCheckingRental(false);
    }
  };


  const handleStarClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form data before validation:', formData);
    console.log('House ID:', houseId, 'Type:', typeof houseId);
    console.log('User ID:', user?.id, 'Type:', typeof user?.id);
    
    if (formData.rating === 0) {
      showError('Lỗi đánh giá', 'Vui lòng chọn số sao đánh giá');
      return;
    }
    
    if (!formData.comment.trim()) {
      showError('Lỗi đánh giá', 'Vui lòng nhập nội dung đánh giá');
      return;
    }

    // Validation cơ bản
    if (!houseId || isNaN(houseId)) {
      showError('Lỗi dữ liệu', 'House ID không hợp lệ');
      return;
    }

    if (!user?.id || isNaN(user.id)) {
      showError('Lỗi dữ liệu', 'User ID không hợp lệ');
      return;
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      showError('Lỗi đánh giá', 'Vui lòng chọn số sao đánh giá (từ 1-5)');
      return;
    }

    try {
      // Đảm bảo dữ liệu hợp lệ trước khi gửi
      const houseIdNum = Number(houseId);
      const reviewerIdNum = Number(user.id);
      const ratingNum = Number(formData.rating);
      const commentTrimmed = formData.comment.trim();

      // Kiểm tra lại một lần nữa
      if (isNaN(houseIdNum) || houseIdNum <= 0) {
        console.error('Invalid house ID:', houseId, '->', houseIdNum);
        showError('Lỗi dữ liệu', 'House ID không hợp lệ');
        return;
      }

      if (isNaN(reviewerIdNum) || reviewerIdNum <= 0) {
        console.error('Invalid user ID:', user?.id, '->', reviewerIdNum);
        showError('Lỗi dữ liệu', 'User ID không hợp lệ');
        return;
      }

      // Đảm bảo cả hai ID đều là số nguyên
      if (!Number.isInteger(houseIdNum)) {
        console.error('House ID must be integer:', houseIdNum);
        showError('Lỗi dữ liệu', 'House ID phải là số nguyên');
        return;
      }

      if (!Number.isInteger(reviewerIdNum)) {
        console.error('User ID must be integer:', reviewerIdNum);
        showError('Lỗi dữ liệu', 'User ID phải là số nguyên');
        return;
      }

      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        console.error('Invalid rating:', formData.rating, '->', ratingNum);
        showError('Lỗi đánh giá', 'Rating không hợp lệ (phải từ 1-5)');
        return;
      }

      // Đảm bảo rating là số nguyên
      if (!Number.isInteger(ratingNum)) {
        console.error('Rating must be integer:', ratingNum);
        showError('Lỗi đánh giá', 'Rating phải là số nguyên từ 1-5');
        return;
      }

      if (!commentTrimmed || commentTrimmed.length === 0) {
        console.error('Invalid comment:', formData.comment, '->', commentTrimmed);
        showError('Lỗi đánh giá', 'Nội dung đánh giá không được để trống');
        return;
      }

      if (commentTrimmed.length > 1000) {
        console.error('Comment too long:', commentTrimmed.length);
        showError('Lỗi đánh giá', 'Nội dung đánh giá không được quá 1000 ký tự');
        return;
      }

      // Kiểm tra comment cơ bản
      if (typeof commentTrimmed !== 'string') {
        console.error('Comment is not a string:', typeof commentTrimmed);
        showError('Lỗi đánh giá', 'Nội dung đánh giá phải là chuỗi văn bản');
        return;
      }

      // Kiểm tra comment có chứa ký tự đặc biệt không mong muốn
      if (commentTrimmed.includes('\0') || commentTrimmed.includes('\r') || commentTrimmed.includes('\n') || commentTrimmed.includes('\t')) {
        console.error('Comment contains control characters');
        showError('Lỗi đánh giá', 'Nội dung đánh giá không được chứa ký tự đặc biệt');
        return;
      }

      const reviewData = {
        houseId: houseIdNum,
        reviewerId: reviewerIdNum,
        rating: ratingNum,
        comment: commentTrimmed
      };

      console.log('Sending review data:', reviewData);

      if (editingReview) {
        await reviewApi.updateReview(editingReview.id, reviewData);
        showSuccess('Cập nhật đánh giá thành công', 'Đánh giá đã được cập nhật thành công!');
      } else {
        await reviewApi.createReview(reviewData);
        showSuccess('Tạo đánh giá thành công', 'Đánh giá đã được tạo thành công!');
      }

      // Reset form and refresh reviews
      setFormData({ rating: 0, comment: '' });
      setShowForm(false);
      setEditingReview(null);
      await fetchReviews();
      await checkUserReview();

    } catch (error) {
      console.error('Error saving review:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      // Hiển thị thông báo lỗi chi tiết hơn
      let errorMessage = 'Có lỗi xảy ra khi lưu đánh giá. ';
      
      if (error.response?.status === 401) {
        errorMessage += 'Vui lòng đăng nhập lại.';
      } else if (error.response?.status === 400) {
        const errorData = error.response?.data;
        console.log('Error data from backend:', errorData);
        
        if (errorData?.message) {
          errorMessage += errorData.message;
        } else if (errorData?.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          errorMessage += 'Dữ liệu không hợp lệ: ' + errorMessages.join(', ');
        } else if (errorData?.data?.message) {
          errorMessage += errorData.data.message;
        } else {
          errorMessage += 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
        }
      } else if (error.response?.status === 404) {
        errorMessage += 'Không tìm thấy nhà hoặc user.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Lỗi server. Vui lòng thử lại sau.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage += 'Lỗi kết nối. Vui lòng kiểm tra mạng.';
      } else {
        errorMessage += `Chi tiết: ${error.message}`;
              }
        
        showError('Lỗi lưu đánh giá', errorMessage);
      }
    };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating,
      comment: review.comment
    });
    setShowForm(true);
  };

  const handleDelete = (reviewId) => {
    setPendingAction({ type: 'delete', reviewId });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!pendingAction || pendingAction.type !== 'delete') return;
    
    try {
      await reviewApi.deleteReview(pendingAction.reviewId);
      await fetchReviews();
      await checkUserReview();
      showSuccess('Xóa đánh giá thành công', 'Đã xóa đánh giá thành công!');
    } catch (error) {
      console.error('Error deleting review:', error);
      showError('Lỗi xóa đánh giá', 'Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại.');
    } finally {
      setShowDeleteConfirm(false);
      setPendingAction(null);
    }
  };

  const handleHostDelete = (reviewId) => {
    setPendingAction({ type: 'hostDelete', reviewId });
    setShowHostDeleteConfirm(true);
  };

  const confirmHostDelete = async () => {
    if (!pendingAction || pendingAction.type !== 'hostDelete') return;
    
    try {
      await reviewApi.deleteReviewAsHost(pendingAction.reviewId);
      await fetchReviews();
      await checkUserReview();
      showSuccess('Xóa đánh giá thành công', 'Đã xóa đánh giá thành công!');
    } catch (error) {
      console.error('Error deleting review:', error);
      showError('Lỗi xóa đánh giá', 'Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại.');
    } finally {
      setShowHostDeleteConfirm(false);
      setPendingAction(null);
    }
  };

  const handleToggleVisibility = (reviewId, isVisible) => {
    const action = isVisible ? 'hiện' : 'ẩn';
    setPendingAction({ type: 'toggle', reviewId, isVisible, action });
    setShowToggleConfirm(true);
  };

  const confirmToggleVisibility = async () => {
    if (!pendingAction || pendingAction.type !== 'toggle') return;
    
    try {
      await reviewApi.toggleReviewVisibility(pendingAction.reviewId);
      // Refresh reviews from server instead of updating state directly
      await fetchReviews();
      showSuccess(`${pendingAction.action === 'hiện' ? 'Hiển thị' : 'Ẩn'} đánh giá thành công`, `Đã ${pendingAction.action} đánh giá thành công!`);
    } catch (error) {
      console.error('Error toggling review visibility:', error);
      showError(`Lỗi ${pendingAction.action} đánh giá`, `Có lỗi xảy ra khi ${pendingAction.action} đánh giá. Vui lòng thử lại.`);
    } finally {
      setShowToggleConfirm(false);
      setPendingAction(null);
    }
  };

  const handleCancel = () => {
    setFormData({ rating: 0, comment: '' });
    setShowForm(false);
    setEditingReview(null);
  };

  const canReview = user && 
                   (user.roleName === 'ADMIN' || (user.roleName !== 'HOST' && userReview === null));

  const getReviewPermissionMessage = () => {
    if (!user) {
      return {
        type: 'info',
        message: 'Đăng nhập để đánh giá nhà này',
        icon: <AlertCircle size={16} />
      };
    }
    
    if (user.roleName === 'HOST') {
      return {
        type: 'info',
        message: 'Chủ nhà không thể đánh giá nhà của mình',
        icon: <AlertCircle size={16} />
      };
    }
    
    if (user.roleName === 'ADMIN') {
      return {
        type: 'success',
        message: 'Admin có thể tạo và quản lý tất cả đánh giá',
        icon: <MessageCircle size={16} />
      };
    }
    
    if (userReview) {
      return {
        type: 'success',
        message: 'Bạn đã đánh giá nhà này',
        icon: <MessageCircle size={16} />
      };
    }
    
    return {
      type: 'success',
      message: 'Bạn có thể đánh giá nhà này',
      icon: <MessageCircle size={16} />
    };
  };

  const permissionMessage = getReviewPermissionMessage();

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const visibleReviewsCount = reviews.filter(review => review.isVisible !== false).length;

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        size={interactive ? 24 : 16}
        filled={index < rating}
        onClick={interactive ? () => onStarClick(index + 1) : undefined}
      />
    ));
  };

  return (
    <ReviewSectionContainer>
      <ReviewHeader>
        <div>
          <ReviewTitle>Đánh giá từ người thuê</ReviewTitle>
          <ReviewStats>
            <AverageRating>
              {renderStars(Math.round(averageRating))}
              <span>{averageRating}/5</span>
            </AverageRating>
            <span>•</span>
            <span>{visibleReviewsCount} đánh giá hiển thị</span>
            {reviews.length > visibleReviewsCount && (
              <span style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={() => setShowHiddenReviews(!showHiddenReviews)}
              title="Click để xem/ẩn review ẩn"
              >
                ({reviews.length - visibleReviewsCount} ẩn)
              </span>
            )}
          </ReviewStats>
        </div>
        
        <div style={{ 
          padding: '0.75rem 1.5rem', 
          background: permissionMessage.type === 'success' ? '#d1fae5' : 
                     permissionMessage.type === 'warning' ? '#fef3c7' : '#f3f4f6',
          color: permissionMessage.type === 'success' ? '#065f46' : 
                 permissionMessage.type === 'warning' ? '#92400e' : '#6b7280',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          minWidth: '200px',
          justifyContent: 'center'
        }}>
          {permissionMessage.icon}
          {permissionMessage.message}
        </div>
      </ReviewHeader>

      {/* Form đánh giá - hiển thị khi user có thể đánh giá HOẶC khi đang edit review */}
      {((canReview && showForm) || (editingReview && showForm)) && (
        <ReviewForm>
          <FormTitle>
            {editingReview ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá của bạn'}
          </FormTitle>
          
          <form onSubmit={handleSubmit}>
            <RatingInput>
              <label>Đánh giá của bạn:</label>
              <div className="stars-container">
                {renderStars(formData.rating, true, handleStarClick)}
              </div>
            </RatingInput>
            
            <CommentInput>
              <label>Nhận xét:</label>
              <textarea
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Chia sẻ trải nghiệm của bạn về ngôi nhà này..."
                maxLength={500}
              />
            </CommentInput>
            
            <FormActions>
              <Button type="button" className="secondary" onClick={handleCancel}>
                Hủy
              </Button>
              <Button type="submit" className="primary">
                {editingReview ? 'Cập nhật' : 'Gửi đánh giá'}
              </Button>
            </FormActions>
          </form>
        </ReviewForm>
      )}

      {/* Nút viết đánh giá - chỉ hiển thị khi user có thể đánh giá và không đang edit */}
      {canReview && !showForm && !editingReview && (
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <AddReviewButton onClick={() => setShowForm(true)}>
            <MessageCircle size={16} />
            Viết đánh giá
          </AddReviewButton>
        </div>
      )}

             {/* Nút quản lý review cho chủ nhà và admin */}
       {user && ((user.roleName === 'HOST' && house && Number(house.hostId) === Number(user.id)) || user.roleName === 'ADMIN') && (
        <div style={{ 
          marginBottom: '1.5rem', 
          padding: '1rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#374151' }}>
            <strong>Quản lý đánh giá:</strong> {user.roleName === 'ADMIN' ? 'Admin có thể quản lý tất cả đánh giá' : 'Bạn có thể ẩn/hiện hoặc xóa đánh giá'}
          </div>
                     <button
             onClick={() => setShowHiddenReviews(!showHiddenReviews)}
            style={{
              padding: '0.5rem 1rem',
              background: showHiddenReviews ? '#ef4444' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            {showHiddenReviews ? 'Chỉ hiện review đang hiển thị' : 'Hiện tất cả review (kể cả ẩn)'}
          </button>
        </div>
      )}

                {/* Thông tin về trạng thái thuê nhà của user (tùy chọn) */}
          {user && user.roleName !== 'HOST' && userRentalStatus && (
            <div style={{ 
              marginBottom: '1.5rem',
              padding: '1rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                <Calendar size={16} />
                Thông tin thuê nhà của bạn (nếu có):
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: '#6b7280'
              }}>
                <span style={{ 
                  padding: '0.25rem 0.5rem',
                  background: userRentalStatus.status === 'CHECKED_OUT' ? '#d1fae5' : '#fef3c7',
                  color: userRentalStatus.status === 'CHECKED_OUT' ? '#065f46' : '#92400e',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {userRentalStatus.status === 'PENDING' && 'Chờ duyệt'}
                  {userRentalStatus.status === 'APPROVED' && 'Đã duyệt'}
                  {userRentalStatus.status === 'SCHEDULED' && 'Đã lên lịch'}
                  {userRentalStatus.status === 'CHECKED_IN' && 'Đang thuê'}
                  {userRentalStatus.status === 'CHECKED_OUT' && 'Đã trả phòng'}
                  {userRentalStatus.status === 'REJECTED' && 'Bị từ chối'}
                  {userRentalStatus.status === 'CANCELED' && 'Đã hủy'}
                </span>
                {userRentalStatus.startDate && userRentalStatus.endDate && (
                  <span>
                    • {new Date(userRentalStatus.startDate).toLocaleDateString('vi-VN')} - {new Date(userRentalStatus.endDate).toLocaleDateString('vi-VN')}
                  </span>
                )}
              </div>
              <div style={{ 
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: '#6b7280',
                fontStyle: 'italic'
              }}>
                💡 Bạn có thể đánh giá nhà này ngay cả khi chưa thuê
              </div>
            </div>
          )}

            {/* Danh sách đánh giá */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Đang tải đánh giá...
        </div>
      ) : reviews.length === 0 ? (
        <NoReviews>
          <div className="icon">⭐</div>
          <div className="title">Chưa có đánh giá nào</div>
          <div className="description">
            Hãy là người đầu tiên đánh giá ngôi nhà này
          </div>
        </NoReviews>
      ) : (
        <ReviewsList>
                     {reviews
             .filter(review => {
               // Chủ nhà của ngôi nhà này và Admin có thể toggle hiển thị review ẩn
               if (user && ((user.roleName === 'HOST' && house && Number(house.hostId) === Number(user.id)) || user.roleName === 'ADMIN')) {
                 return showHiddenReviews ? true : review.isVisible !== false;
               }
               // User thường chỉ thấy review visible
               return review.isVisible !== false;
             })
            .map((review) => (
            <ReviewItem key={review.id} style={{
              opacity: review.isVisible === false ? 0.6 : 1,
              background: review.isVisible === false ? '#f9fafb' : 'white'
            }}>
              <ReviewHeaderItem>
                <UserInfo>
                  <UserAvatar>
                    {review.reviewerAvatarUrl ? (
                      <img 
                        src={review.reviewerAvatarUrl} 
                        alt={review.reviewerFullName || review.reviewerName || 'User'}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span style={{ display: review.reviewerAvatarUrl ? 'none' : 'flex' }}>
                      {review.reviewerFullName ? review.reviewerFullName.charAt(0).toUpperCase() : 
                       review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </UserAvatar>
                  <UserDetails>
                    <div className="username">
                      {review.reviewerFullName || review.reviewerName || 'Người dùng'}
                      {review.isVisible === false && (
                        <span style={{
                          marginLeft: '0.5rem',
                          background: '#fef3c7',
                          color: '#92400e',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          ĐÃ ẨN
                        </span>
                      )}
                    </div>
                    <div className="date">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </UserDetails>
                </UserInfo>
                
                {user && (
                  <ReviewActions>
                    {/* User có thể edit/delete review của mình, Admin có thể edit/delete tất cả review */}
                    {(Number(user.id) === Number(review.reviewerId) || user.roleName === 'ADMIN') && (
                      <>
                        <ActionButton
                          className="edit"
                          onClick={() => handleEdit(review)}
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </ActionButton>
                        <ActionButton
                          className="delete"
                          onClick={() => handleDelete(review.id)}
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </ActionButton>
                      </>
                    )}
                    
                    {/* Chủ nhà và Admin có thể quản lý review */}
                    {((user.roleName === 'HOST' && house && Number(house.hostId) === Number(user.id)) || user.roleName === 'ADMIN') && (
                      <>
                        <ActionButton
                          className="hide"
                          onClick={() => handleToggleVisibility(review.id, !review.isVisible)}
                          title={review.isVisible ? "Ẩn đánh giá" : "Hiển thị đánh giá"}
                        >
                          {review.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </ActionButton>
                        <ActionButton
                          className="delete"
                          onClick={() => handleHostDelete(review.id)}
                          title="Xóa đánh giá"
                        >
                          <Trash2 size={16} />
                        </ActionButton>
                      </>
                    )}
                  </ReviewActions>
                )}
              </ReviewHeaderItem>
              
              <ReviewContent>
                <div className="rating">
                  {renderStars(review.rating)}
                </div>
                <p className="comment">{review.comment}</p>
              </ReviewContent>
            </ReviewItem>
          ))}
                 </ReviewsList>
       )}

       {/* Confirm Dialogs */}
       <ConfirmDialog
         isOpen={showDeleteConfirm}
         title="Xác nhận xóa đánh giá"
         message="Bạn có chắc chắn muốn xóa đánh giá này?"
         onConfirm={confirmDelete}
         onCancel={() => {
           setShowDeleteConfirm(false);
           setPendingAction(null);
         }}
         confirmText="Xóa"
         cancelText="Hủy"
         variant="danger"
       />

       <ConfirmDialog
         isOpen={showHostDeleteConfirm}
         title="Xác nhận xóa đánh giá"
         message="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này sẽ làm mất cả đánh giá và số sao."
         onConfirm={confirmHostDelete}
         onCancel={() => {
           setShowHostDeleteConfirm(false);
           setPendingAction(null);
         }}
         confirmText="Xóa"
         cancelText="Hủy"
         variant="danger"
       />

       <ConfirmDialog
         isOpen={showToggleConfirm}
         title={`Xác nhận ${pendingAction?.action || ''} đánh giá`}
         message={`Bạn có chắc chắn muốn ${pendingAction?.action || ''} đánh giá này?`}
         onConfirm={confirmToggleVisibility}
         onCancel={() => {
           setShowToggleConfirm(false);
           setPendingAction(null);
         }}
         confirmText={pendingAction?.action === 'hiện' ? 'Hiển thị' : 'Ẩn'}
         cancelText="Hủy"
         variant="warning"
       />
     </ReviewSectionContainer>
   );
 };

export default ReviewSection;
