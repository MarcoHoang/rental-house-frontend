import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Star, MessageCircle, AlertCircle, CheckCircle, Clock, User } from 'lucide-react';
import reviewApi from '../../api/reviewApi';
import rentalApi from '../../api/rentalApi';
import { useAuthContext } from '../../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f9fafb;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const StatusIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  
  &.success {
    background: #10b981;
  }
  
  &.warning {
    background: #f59e0b;
  }
  
  &.info {
    background: #3b82f6;
  }
  
  &.error {
    background: #ef4444;
  }
`;

const StatusInfo = styled.div`
  flex: 1;
  
  .label {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.25rem;
  }
  
  .value {
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  
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

const Form = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  margin-top: 1rem;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;
`;

const Star = styled.div`
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.filled ? '#f59e0b' : '#d1d5db'};
  
  &:hover {
    color: #f59e0b;
  }
`;

const ReviewTestComponent = () => {
  const { user } = useAuthContext();
  const [userRentals, setUserRentals] = useState([]);
  const [houseReviews, setHouseReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: ''
  });
  const [testHouseId, setTestHouseId] = useState('1');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user rentals
      const rentals = await rentalApi.getMyRentals();
      setUserRentals(rentals || []);
      
      // Load reviews for test house
      const reviews = await reviewApi.getHouseReviews(testHouseId);
      setHouseReviews(reviews?.data || []);
      
      // Check if user has reviewed this house
      if (user) {
        const userReviewCheck = await reviewApi.checkUserReview(testHouseId, user.id);
        if (userReviewCheck.exists) {
          const userReviewData = await reviewApi.getUserReview(testHouseId, user.id);
          setUserReview(userReviewData?.data || null);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async () => {
    try {
      const reviewData = {
        houseId: parseInt(testHouseId),
        userId: user.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      };

      await reviewApi.createReview(reviewData);
      setShowReviewForm(false);
      setReviewForm({ rating: 0, comment: '' });
      await loadUserData();
      alert('Đánh giá đã được tạo thành công!');
    } catch (error) {
      console.error('Error creating review:', error);
      alert('Lỗi khi tạo đánh giá: ' + error.message);
    }
  };

  const handleUpdateReview = async () => {
    try {
      await reviewApi.updateReview(userReview.id, {
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setShowReviewForm(false);
      setReviewForm({ rating: 0, comment: '' });
      await loadUserData();
      alert('Đánh giá đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Lỗi khi cập nhật đánh giá: ' + error.message);
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      return;
    }

    try {
      await reviewApi.deleteReview(userReview.id);
      setUserReview(null);
      await loadUserData();
      alert('Đánh giá đã được xóa thành công!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Lỗi khi xóa đánh giá: ' + error.message);
    }
  };

  const canReview = user && 
                   user.roleName !== 'HOST' && 
                   !userReview;

  const getRentalStatusForHouse = () => {
    const houseRental = userRentals.find(rental => rental.houseId === parseInt(testHouseId));
    return houseRental ? houseRental.status : null;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'PENDING':
        return { icon: <Clock size={20} />, color: 'warning', label: 'Chờ duyệt' };
      case 'APPROVED':
        return { icon: <CheckCircle size={20} />, color: 'info', label: 'Đã duyệt' };
      case 'SCHEDULED':
        return { icon: <CheckCircle size={20} />, color: 'info', label: 'Đã lên lịch' };
      case 'CHECKED_IN':
        return { icon: <CheckCircle size={20} />, color: 'warning', label: 'Đang thuê' };
      case 'CHECKED_OUT':
        return { icon: <CheckCircle size={20} />, color: 'success', label: 'Đã trả phòng' };
      case 'REJECTED':
        return { icon: <AlertCircle size={20} />, color: 'error', label: 'Bị từ chối' };
      case 'CANCELED':
        return { icon: <AlertCircle size={20} />, color: 'error', label: 'Đã hủy' };
      default:
        return { icon: <AlertCircle size={20} />, color: 'info', label: 'Không xác định' };
    }
  };

  if (!user) {
    return (
      <Container>
        <Title>Review Test Component</Title>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          Vui lòng đăng nhập để sử dụng tính năng này
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Review Test Component</Title>
      
      {/* User Info */}
      <Section>
        <SectionTitle>
          <CheckCircle size={20} />
          Thông tin người dùng
        </SectionTitle>
        <StatusCard>
          <StatusIcon className="info">
            <User size={20} />
          </StatusIcon>
          <StatusInfo>
            <div className="label">{user.fullName || user.username}</div>
            <div className="value">Role: {user.roleName} | ID: {user.id}</div>
          </StatusInfo>
        </StatusCard>
      </Section>

      {/* Test House ID */}
      <Section>
        <SectionTitle>
          <MessageCircle size={20} />
          Test House ID
        </SectionTitle>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="number"
            value={testHouseId}
            onChange={(e) => setTestHouseId(e.target.value)}
            placeholder="Nhập House ID để test"
            style={{ flex: 1 }}
          />
          <Button className="secondary" onClick={loadUserData}>
            Tải dữ liệu
          </Button>
        </div>
      </Section>

      {/* User Rentals */}
      <Section>
        <SectionTitle>
          <Clock size={20} />
          Danh sách thuê nhà của bạn
        </SectionTitle>
        {userRentals.length === 0 ? (
          <div style={{ color: '#6b7280', textAlign: 'center' }}>
            Bạn chưa có lịch thuê nhà nào
          </div>
        ) : (
          userRentals.map(rental => {
            const statusInfo = getStatusInfo(rental.status);
            return (
              <StatusCard key={rental.id}>
                <StatusIcon className={statusInfo.color}>
                  {statusInfo.icon}
                </StatusIcon>
                <StatusInfo>
                  <div className="label">{rental.houseTitle}</div>
                  <div className="value">
                    House ID: {rental.houseId} | Status: {statusInfo.label} | 
                    {new Date(rental.startDate).toLocaleDateString('vi-VN')} - {new Date(rental.endDate).toLocaleDateString('vi-VN')}
                  </div>
                </StatusCard>
              </StatusCard>
            );
          })
        )}
      </Section>

      {/* House Reviews */}
      <Section>
        <SectionTitle>
          <Star size={20} />
          Đánh giá của nhà (ID: {testHouseId})
        </SectionTitle>
        {houseReviews.length === 0 ? (
          <div style={{ color: '#6b7280', textAlign: 'center' }}>
            Chưa có đánh giá nào cho nhà này
          </div>
        ) : (
          houseReviews.map(review => (
            <StatusCard key={review.id}>
              <StatusIcon className="info">
                <Star size={20} />
              </StatusIcon>
              <StatusInfo>
                <div className="label">
                  {review.reviewerName} - {review.rating}/5 sao
                </div>
                <div className="value">{review.comment}</div>
              </StatusInfo>
            </StatusCard>
          ))
        )}
      </Section>

      {/* Review Actions */}
      <Section>
        <SectionTitle>
          <MessageCircle size={20} />
          Hành động đánh giá
        </SectionTitle>
        
        <StatusCard>
          <StatusIcon className={canReview ? 'success' : 'warning'}>
            {canReview ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          </StatusIcon>
          <StatusInfo>
            <div className="label">
              {canReview ? 'Có thể đánh giá' : 'Không thể đánh giá'}
            </div>
            <div className="value">
              {canReview ? 'Bạn có thể đánh giá nhà này' : 
               user?.roleName === 'HOST' ? 'Chủ nhà không thể đánh giá' :
               userReview ? 'Bạn đã đánh giá nhà này' :
               'Vui lòng đăng nhập để đánh giá'}
            </div>
          </StatusInfo>
        </StatusCard>

        {userReview && (
          <StatusCard>
            <StatusIcon className="success">
              <CheckCircle size={20} />
            </StatusCard>
            <StatusInfo>
              <div className="label">Bạn đã đánh giá nhà này</div>
              <div className="value">
                Rating: {userReview.rating}/5 | Comment: {userReview.comment}
              </div>
            </StatusInfo>
          </StatusCard>
        )}

        <div style={{ marginTop: '1rem' }}>
          {!userReview && canReview && (
            <Button className="primary" onClick={() => setShowReviewForm(true)}>
              Viết đánh giá
            </Button>
          )}
          
          {userReview && (
            <>
              <Button className="secondary" onClick={() => {
                setReviewForm({ rating: userReview.rating, comment: userReview.comment });
                setShowReviewForm(true);
              }}>
                Sửa đánh giá
              </Button>
              <Button className="danger" onClick={handleDeleteReview}>
                Xóa đánh giá
              </Button>
            </>
          )}
        </div>
      </Section>

      {/* Review Form */}
      {showReviewForm && (
        <Section>
          <SectionTitle>
            <MessageCircle size={20} />
            {userReview ? 'Sửa đánh giá' : 'Viết đánh giá mới'}
          </SectionTitle>
          
          <Form>
            <FormField>
              <label>Rating:</label>
              <StarRating>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    filled={star <= reviewForm.rating}
                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                  >
                    ★
                  </Star>
                ))}
              </StarRating>
              <div style={{ marginTop: '0.5rem', color: '#6b7280' }}>
                Đã chọn: {reviewForm.rating}/5 sao
              </div>
            </FormField>
            
            <FormField>
              <label>Comment:</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Viết nhận xét của bạn..."
              />
            </FormField>
            
            <div>
              <Button 
                className="primary" 
                onClick={userReview ? handleUpdateReview : handleCreateReview}
                disabled={!reviewForm.rating || !reviewForm.comment.trim()}
              >
                {userReview ? 'Cập nhật' : 'Gửi đánh giá'}
              </Button>
              <Button className="secondary" onClick={() => {
                setShowReviewForm(false);
                setReviewForm({ rating: 0, comment: '' });
              }}>
                Hủy
              </Button>
            </div>
          </Form>
        </Section>
      )}
    </Container>
  );
};

export default ReviewTestComponent;
