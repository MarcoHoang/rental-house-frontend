import React, { useState } from 'react';
import styled from 'styled-components';
import { TestTube, Send, AlertCircle } from 'lucide-react';
import reviewApi from '../../api/reviewApi';

const DebugContainer = styled.div`
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin: 1rem 0;
`;

const Title = styled.h4`
  color: #1f2937;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-height: 80px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const Result = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  font-family: monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
  
  &.success {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }
  
  &.error {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fca5a5;
  }
`;

const ReviewDebugForm = () => {
  const [formData, setFormData] = useState({
    houseId: '',
    reviewerId: '',
    rating: '',
    comment: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      console.log('=== DEBUG FORM SUBMISSION ===');
      console.log('Form data:', formData);
      
      // Validation
      if (!formData.houseId || !formData.reviewerId || !formData.rating || !formData.comment) {
        throw new Error('Vui lòng điền đầy đủ thông tin');
      }

      if (formData.rating < 1 || formData.rating > 5) {
        throw new Error('Rating phải từ 1-5');
      }

      if (formData.comment.length < 1 || formData.comment.length > 1000) {
        throw new Error('Comment phải từ 1-1000 ký tự');
      }

      // Convert to proper types
      const reviewData = {
        houseId: Number(formData.houseId),
        reviewerId: Number(formData.reviewerId),
        rating: Number(formData.rating),
        comment: formData.comment.trim()
      };

      console.log('Converted review data:', reviewData);
      console.log('Data types:', {
        houseId: typeof reviewData.houseId,
        reviewerId: typeof reviewData.reviewerId,
        rating: typeof reviewData.rating,
        comment: typeof reviewData.comment
      });

      const response = await reviewApi.createReview(reviewData);
      
      setResult({
        type: 'success',
        data: {
          message: 'Review tạo thành công!',
          response: response,
          submittedData: reviewData
        }
      });
      
      console.log('=== SUCCESS ===');
      console.log('Response:', response);
      
    } catch (error) {
      console.error('=== ERROR ===');
      console.error('Error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      setResult({
        type: 'error',
        data: {
          message: 'Lỗi khi tạo review',
          error: error.message,
          status: error.response?.status,
          responseData: error.response?.data,
          submittedData: formData
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <DebugContainer>
      <Title>
        <TestTube size={20} />
        Debug Review Creation
      </Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>House ID:</Label>
          <Input
            type="number"
            name="houseId"
            value={formData.houseId}
            onChange={handleInputChange}
            placeholder="Nhập House ID (số)"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Reviewer ID:</Label>
          <Input
            type="number"
            name="reviewerId"
            value={formData.reviewerId}
            onChange={handleInputChange}
            placeholder="Nhập Reviewer ID (số)"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Rating (1-5):</Label>
          <Input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            min="1"
            max="5"
            placeholder="Nhập rating từ 1-5"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Comment:</Label>
          <Textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Nhập nội dung đánh giá"
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Đang gửi...' : (
            <>
              <Send size={16} />
              Test Tạo Review
            </>
          )}
        </Button>
      </Form>

      {result && (
        <Result className={result.type}>
          <strong>{result.data.message}</strong>
          {'\n\n'}
          <strong>Submitted Data:</strong>
          {JSON.stringify(result.data.submittedData, null, 2)}
          {'\n\n'}
          {result.type === 'success' ? (
            <>
              <strong>Response:</strong>
              {JSON.stringify(result.data.response, null, 2)}
            </>
          ) : (
            <>
              <strong>Error Details:</strong>
              {JSON.stringify(result.data, null, 2)}
            </>
          )}
        </Result>
      )}
    </DebugContainer>
  );
};

export default ReviewDebugForm;
