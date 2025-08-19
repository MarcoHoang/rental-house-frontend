import React, { useState } from 'react';
import styled from 'styled-components';
import { Star, AlertCircle, CheckCircle } from 'lucide-react';
import reviewApi from '../../api/reviewApi';
import { useAuthContext } from '../../contexts/AuthContext';

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button`
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
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const Result = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  font-family: monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
`;

const SuccessResult = styled(Result)`
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  color: #065f46;
`;

const ErrorResult = styled(Result)`
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #991b1b;
`;

const InfoResult = styled(Result)`
  background: #dbeafe;
  border: 1px solid #93c5fd;
  color: #1e40af;
`;

const ReviewDebugComponent = () => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    houseId: '14',
    rating: 5,
    comment: 'Test review from debug component'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      console.log('=== REVIEW DEBUG START ===');
      console.log('User:', user);
      console.log('Token:', localStorage.getItem('token'));
      console.log('Form data:', formData);

      const reviewData = {
        houseId: parseInt(formData.houseId),
        userId: user?.id,
        rating: formData.rating,
        comment: formData.comment
      };

      console.log('Review data to send:', reviewData);

      const response = await reviewApi.createReview(reviewData);
      
      console.log('API Response:', response);
      setResult({
        type: 'success',
        message: 'Review created successfully!',
        data: response
      });
      
    } catch (error) {
      console.error('Review creation error:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error config:', error.config);
      console.error('Error request:', error.request);
      
      setResult({
        type: 'error',
        message: 'Failed to create review',
        error: {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
          request: error.request,
          type: error.constructor.name
        }
      });
    } finally {
      setLoading(false);
      console.log('=== REVIEW DEBUG END ===');
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (result.type === 'success') {
      return (
        <SuccessResult>
          <strong>✅ {result.message}</strong>
          {'\n\n'}
          Response Data:
          {'\n'}
          {JSON.stringify(result.data, null, 2)}
        </SuccessResult>
      );
    }

    if (result.type === 'error') {
      return (
        <ErrorResult>
          <strong>❌ {result.message}</strong>
          {'\n\n'}
          Error Details:
          {'\n'}
          Type: {result.error.type || 'N/A'}
          {'\n'}
          Message: {result.error.message}
          {'\n'}
          Status: {result.error.status || 'N/A'}
          {'\n\n'}
          Response Data: {JSON.stringify(result.error.data, null, 2)}
          {'\n\n'}
          Request Config: {JSON.stringify(result.error.config, null, 2)}
          {'\n\n'}
          Request Details: {JSON.stringify(result.error.request, null, 2)}
        </ErrorResult>
      );
    }

    return null;
  };

  if (!user) {
    return (
      <Container>
        <Title>Review Debug Component</Title>
        <InfoResult>
          <strong>⚠️ Vui lòng đăng nhập để test tính năng review</strong>
          {'\n\n'}
          User context: {JSON.stringify(user, null, 2)}
        </InfoResult>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Review Debug Component</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>House ID:</Label>
          <Input
            type="number"
            name="houseId"
            value={formData.houseId}
            onChange={handleInputChange}
            placeholder="Nhập ID nhà"
          />
        </FormGroup>

        <FormGroup>
          <Label>Rating:</Label>
          <Input
            type="number"
            name="rating"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleInputChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Comment:</Label>
          <Textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Nhập nội dung đánh giá"
          />
        </FormGroup>

        <Button type="submit" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Test Tạo Review'}
        </Button>
      </Form>

      {renderResult()}

      <InfoResult style={{ marginTop: '1rem' }}>
        <strong>Debug Info:</strong>
        {'\n'}
        User ID: {user?.id || 'N/A'}
        {'\n'}
        User Role: {user?.roleName || 'N/A'}
        {'\n'}
        Token: {localStorage.getItem('token') ? '✅ Có token' : '❌ Không có token'}
        {'\n'}
        House ID: {formData.houseId}
      </InfoResult>
    </Container>
  );
};

export default ReviewDebugComponent;
