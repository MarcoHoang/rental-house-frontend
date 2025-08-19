import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Eye, EyeOff, Trash2, Star, User, Calendar, AlertTriangle } from 'lucide-react';
import reviewApi from '../../api/reviewApi';

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
    />
  ));
};

const ReviewManagement = ({ houseId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [houseId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewApi.getHouseReviews(houseId);
      setReviews(response.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (reviewId, isVisible) => {
    const action = isVisible ? 'hiện' : 'ẩn';
    if (window.confirm(`Bạn có chắc chắn muốn ${action} đánh giá này?`)) {
      try {
        await reviewApi.toggleReviewVisibility(reviewId);
        setReviews(reviews.map(review => 
          review.id === reviewId 
            ? { ...review, isVisible: isVisible }
            : review
        ));
        alert(`Đã ${action} đánh giá thành công!`);
      } catch (error) {
        console.error('Error toggling review visibility:', error);
        alert(`Có lỗi xảy ra khi ${action} đánh giá. Vui lòng thử lại.`);
      }
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này? Hành động này sẽ làm mất cả đánh giá và số sao.')) {
      try {
        await reviewApi.deleteReview(reviewId);
        setReviews(reviews.filter(review => review.id !== reviewId));
        alert('Đã xóa đánh giá thành công!');
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại.');
      }
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const visibleReviewsCount = reviews.filter(review => review.isVisible !== false).length;
  const hiddenReviewsCount = reviews.length - visibleReviewsCount;

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

      {reviews.length === 0 ? (
        <NoReviews>
          <div className="icon">⭐</div>
          <div className="title">Chưa có đánh giá nào</div>
          <div className="description">
            Khi có đánh giá, bạn có thể quản lý chúng tại đây
          </div>
        </NoReviews>
      ) : (
        <ReviewList>
          {reviews.map((review) => (
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
                    onClick={() => handleToggleVisibility(review.id, !review.isVisible)}
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
    </ReviewManagementContainer>
  );
};

export default ReviewManagement;
