import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Eye, EyeOff, Trash2, Star, User, Calendar, AlertTriangle, Home } from 'lucide-react';
import reviewApi from '../../api/reviewApi';
import propertyApi from '../../api/propertyApi';
import { useToast } from '../common/Toast';
import ConfirmDialog from '../common/ConfirmDialog';
import { useAuth } from '../../hooks/useAuth';

const ReviewManagementContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReviewItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background: ${props => props.isHidden ? '#f9fafb' : 'white'};
  opacity: ${props => props.isHidden ? 0.7 : 1};
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
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
  
  &.hide:hover {
    color: #8b5cf6;
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

const HiddenBadge = styled.span`
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
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

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      size={16}
      fill={index < rating ? '#fbbf24' : 'none'}
      stroke="#d1d5db"
      strokeWidth={1}
      filled={index < rating}
    />
  ));
};

const ReviewManagement = ({ houseId }) => {
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [houses, setHouses] = useState([]);
  const [selectedHouseId, setSelectedHouseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    fetchHouses();
  }, []);

  useEffect(() => {
    if (selectedHouseId) {
      fetchReviews();
    } else {
      setReviews([]);
    }
  }, [selectedHouseId]);

  const fetchHouses = async () => {
    try {
      console.log('ReviewManagement - Fetching houses...');
      const response = await propertyApi.getMyHouses();
      console.log('ReviewManagement - Houses API response:', response);
      let housesData = [];
      if (Array.isArray(response)) {
        housesData = response;
      } else if (response && Array.isArray(response.data)) {
        housesData = response.data;
      } else if (response && Array.isArray(response.content)) {
        housesData = response.content;
      }
      console.log('ReviewManagement - Processed houses data:', housesData);
      setHouses(housesData);
      if (housesData.length > 0) {
        console.log('ReviewManagement - Setting selected house ID:', housesData[0].id);
        setSelectedHouseId(housesData[0].id);
      }
    } catch (error) {
      console.error('ReviewManagement - Error fetching houses:', error);
    }
  };

  const fetchReviews = async () => {
    if (!selectedHouseId) return;
    
    setLoading(true);
    try {
      console.log('ReviewManagement - Fetching reviews for houseId:', selectedHouseId);
      const response = await reviewApi.getAllHouseReviews(selectedHouseId);
      console.log('ReviewManagement - API response:', response);
      const reviewsData = response.data || [];
      console.log('ReviewManagement - Reviews data:', reviewsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('ReviewManagement - Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = (reviewId, currentIsVisible) => {
    const newIsVisible = !currentIsVisible; // Toggle trạng thái
    const action = newIsVisible ? 'hiện' : 'ẩn';
    setPendingAction({ type: 'toggle', reviewId, newIsVisible, action });
    setShowToggleConfirm(true);
  };

  const confirmToggleVisibility = async () => {
    if (!pendingAction || pendingAction.type !== 'toggle') return;
    
    console.log('confirmToggleVisibility - pendingAction:', pendingAction);
    
    try {
      console.log('confirmToggleVisibility - Calling toggleReviewVisibility for reviewId:', pendingAction.reviewId);
      await reviewApi.toggleReviewVisibility(pendingAction.reviewId);
      console.log('confirmToggleVisibility - Toggle successful, fetching reviews again');
      
             // Gọi lại API để lấy dữ liệu mới thay vì cập nhật state local
       await fetchReviews();
       // Reset showAllReviews về false sau khi toggle visibility
       setShowAllReviews(false);
       showSuccess(`Đã ${pendingAction.action} đánh giá thành công!`, `Đánh giá đã được ${pendingAction.action} thành công.`);
    } catch (error) {
      console.error('Error toggling review visibility:', error);
      showError(`Có lỗi xảy ra khi ${pendingAction.action} đánh giá.`, `Có lỗi xảy ra khi ${pendingAction.action} đánh giá. Vui lòng thử lại.`);
    } finally {
      setShowToggleConfirm(false);
      setPendingAction(null);
    }
  };

  const handleDelete = (reviewId) => {
    setPendingAction({ type: 'delete', reviewId });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!pendingAction || pendingAction.type !== 'delete') return;
    
    try {
      await reviewApi.deleteReviewAsHost(pendingAction.reviewId);
      // Gọi lại API để lấy dữ liệu mới thay vì cập nhật state local
      await fetchReviews();
      showSuccess('Đã xóa đánh giá thành công!', 'Đánh giá đã được xóa thành công.');
    } catch (error) {
      console.error('Error deleting review:', error);
      showError('Có lỗi xảy ra khi xóa đánh giá.', 'Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại.');
    } finally {
      setShowDeleteConfirm(false);
      setPendingAction(null);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const visibleReviewsCount = reviews.filter(review => review.isVisible !== false).length;
  const hiddenReviewsCount = reviews.length - visibleReviewsCount;
  
  const displayedReviews = showAllReviews 
    ? reviews 
    : reviews.filter(review => review.isVisible !== false);

  const selectedHouse = houses.find(house => house.id === selectedHouseId);

  console.log('ReviewManagement - Render state:', {
    houses: houses.length,
    selectedHouseId,
    reviews: reviews.length,
    loading,
    showAllReviews
  });

  if (houses.length === 0) {
    return (
      <ReviewManagementContainer>
        <NoReviews>
          <div className="icon">🏠</div>
          <div className="title">Chưa có nhà nào</div>
          <div className="description">
            Bạn cần đăng nhà trước khi có thể quản lý đánh giá
          </div>
        </NoReviews>
      </ReviewManagementContainer>
    );
  }

  if (loading) {
    return (
      <ReviewManagementContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Đang tải đánh giá...
        </div>
      </ReviewManagementContainer>
    );
  }

  return (
    <ReviewManagementContainer>
      <Header>
        <Title>Quản lý đánh giá</Title>
        <Stats>
          <span>⭐ {averageRating}/5</span>
          <span>•</span>
          <span>{visibleReviewsCount} hiển thị</span>
          {hiddenReviewsCount > 0 && (
            <>
              <span>•</span>
              <span>{hiddenReviewsCount} ẩn</span>
            </>
          )}
        </Stats>
      </Header>

      {/* House selector */}
      <div style={{ 
        marginBottom: '1rem',
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '0.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: '600', 
          color: '#374151' 
        }}>
          Chọn nhà để xem đánh giá:
        </label>
        <select
          value={selectedHouseId || ''}
          onChange={(e) => setSelectedHouseId(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}
        >
          {houses.map(house => (
            <option key={house.id} value={house.id}>
              {house.title || house.name} - {house.address}
            </option>
          ))}
        </select>
      </div>
      
      {/* Nút toggle hiển thị tất cả reviews */}
      {hiddenReviewsCount > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: showAllReviews ? '#3b82f6' : '#f1f5f9',
              color: showAllReviews ? 'white' : '#475569',
              border: '1px solid #cbd5e1',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            {showAllReviews ? <EyeOff size={16} /> : <Eye size={16} />}
            {showAllReviews ? 'Chỉ hiển thị reviews đang hiển thị' : 'Hiển thị tất cả reviews (bao gồm ẩn)'}
          </button>
        </div>
      )}

      {reviews.length === 0 ? (
        <NoReviews>
          <div className="icon">⭐</div>
          <div className="title">Chưa có đánh giá nào</div>
          <div className="description">
            Khi có đánh giá cho nhà "{selectedHouse?.title || selectedHouse?.name}", bạn có thể quản lý chúng tại đây
          </div>
        </NoReviews>
      ) : (
        <ReviewList>
          {displayedReviews.map((review) => (
            <ReviewItem key={review.id} isHidden={review.isVisible === false}>
              <ReviewHeader>
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

                <ReviewActions>
                  <ActionButton
                    className="hide"
                    onClick={() => handleToggleVisibility(review.id, review.isVisible)}
                    title={review.isVisible ? "Ẩn đánh giá" : "Hiện đánh giá"}
                  >
                    {review.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </ActionButton>
                  <ActionButton
                    className="delete"
                    onClick={() => handleDelete(review.id)}
                    title="Xóa đánh giá"
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </ReviewActions>
              </ReviewHeader>

              {review.isVisible === false && (
                <HiddenBadge style={{ marginBottom: '0.75rem' }}>
                  <EyeOff size={12} />
                  Đánh giá đã bị ẩn
                </HiddenBadge>
              )}
              
              <ReviewContent>
                <div className="rating">
                  {renderStars(review.rating)}
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {review.rating}/5
                  </span>
                </div>
                <p className="comment">{review.comment}</p>
              </ReviewContent>
            </ReviewItem>
          ))}
        </ReviewList>
      )}

      {/* Confirm Dialogs */}
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

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Xác nhận xóa đánh giá"
        message="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này sẽ làm mất cả đánh giá và số sao."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setPendingAction(null);
        }}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
    </ReviewManagementContainer>
  );
};

export default ReviewManagement;
