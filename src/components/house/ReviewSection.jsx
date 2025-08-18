import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Star, MessageCircle, Edit, Trash2, User, Calendar, AlertCircle } from 'lucide-react';
import reviewApi from '../../api/reviewApi';
import rentalApi from '../../api/rentalApi';
import { useAuthContext } from '../../contexts/AuthContext';

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

const ReviewSection = ({ houseId }) => {
  const { user } = useAuthContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });
  const [userReview, setUserReview] = useState(null);
  const [userRentalStatus, setUserRentalStatus] = useState(null);
  const [checkingRental, setCheckingRental] = useState(false);

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
      const response = await reviewApi.getHouseReviews(houseId);
      console.log('Reviews response:', response);
      const list = response?.data || response || [];
      // Accept both array and paged formats
      const normalized = Array.isArray(list) ? list : (list?.content || []);
      setReviews(normalized);
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
      console.log('User review check response:', response);
      const exists = (response && typeof response === 'object') ? !!response.exists : (response === true || response === 'true');
      if (exists) {
        const userReviewData = await reviewApi.getUserReview(houseId, user.id);
        console.log('User review data:', userReviewData);
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
      console.log('User rentals:', myRentals);
      
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
    
    if (formData.rating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }
    
    if (!formData.comment.trim()) {
      alert('Vui lòng nhập nội dung đánh giá');
      return;
    }

    try {
      const reviewData = {
        houseId,
        userId: user.id,
        userName: user.fullName || user.username || 'User',
        rating: formData.rating,
        comment: formData.comment.trim()
      };

      console.log('Submitting review data:', reviewData);
      console.log('User object:', user);
      console.log('User ID:', user?.id);
      console.log('User role:', user?.roleName);
      console.log('House ID:', houseId);
      console.log('House ID type:', typeof houseId);
      console.log('Rating:', formData.rating);
      console.log('Rating type:', typeof formData.rating);
      console.log('Comment:', formData.comment);
      console.log('Comment type:', typeof formData.comment);

      if (editingReview) {
        await reviewApi.updateReview(editingReview.id, reviewData);
      } else {
        const result = await reviewApi.createReview(reviewData);
        console.log('Review created successfully:', result);
      }

      // Reset form and refresh reviews
      setFormData({ rating: 0, comment: '' });
      setShowForm(false);
      setEditingReview(null);
      await fetchReviews();
      await checkUserReview();
      

    } catch (error) {
      console.error('Error saving review:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error config:', error.config);
      console.error('Error request:', error.request);
      
      // Hiển thị thông báo lỗi chi tiết hơn
      let errorMessage = 'Có lỗi xảy ra khi lưu đánh giá. ';
      
      if (error.response?.status === 401) {
        errorMessage += 'Vui lòng đăng nhập lại.';
      } else if (error.response?.status === 400) {
        errorMessage += 'Dữ liệu không hợp lệ.';
      } else if (error.response?.status === 404) {
        errorMessage += 'Không tìm thấy nhà hoặc user.';
      } else if (error.response?.status === 500) {
        errorMessage += 'Lỗi server. Vui lòng thử lại sau.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage += 'Lỗi kết nối. Vui lòng kiểm tra mạng.';
      } else {
        errorMessage += `Chi tiết: ${error.message}`;
      }
      
      alert(errorMessage);
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

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      return;
    }

    try {
      await reviewApi.deleteReview(reviewId);
      await fetchReviews();
      await checkUserReview();
      

    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại.');
    }
  };

  const handleCancel = () => {
    setFormData({ rating: 0, comment: '' });
    setShowForm(false);
    setEditingReview(null);
  };

  const canReview = user && 
                   user.roleName !== 'HOST' && 
                   userReview === null;

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

  // Debug log
  console.log('ReviewSection Debug:', {
    user: user?.id,
    userRole: user?.roleName,
    hasUserReview: !!userReview,
    canReview,
    userRentalStatus: userRentalStatus?.status
  });

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
            <span>{reviews.length} đánh giá</span>
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

      {/* Form đánh giá - chỉ hiển thị khi user có thể đánh giá */}
      {canReview && showForm && (
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

      {/* Nút viết đánh giá - chỉ hiển thị khi user có thể đánh giá */}
      {canReview && !showForm && (
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <AddReviewButton onClick={() => setShowForm(true)}>
            <MessageCircle size={16} />
            Viết đánh giá
          </AddReviewButton>
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
          {reviews.map((review) => (
            <ReviewItem key={review.id}>
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
                    </div>
                    <div className="date">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </UserDetails>
                </UserInfo>
                
                {user && (user.id === review.reviewerId || user.roleName === 'ADMIN') && (
                  <ReviewActions>
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
      

    </ReviewSectionContainer>
  );
};

export default ReviewSection;
