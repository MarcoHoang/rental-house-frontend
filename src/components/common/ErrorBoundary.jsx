import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const ErrorCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const ErrorIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: #fed7d7;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  
  svg {
    color: #e53e3e;
    width: 2rem;
    height: 2rem;
  }
`;

const ErrorTitle = styled.h1`
  color: #1a202c;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
`;

const ErrorMessage = styled.p`
  color: #718096;
  font-size: 1rem;
  margin: 0 0 2rem 0;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin: 1.5rem 0;
  text-align: left;
  
  summary {
    color: #4a5568;
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem 0;
    
    &:hover {
      color: #2d3748;
    }
  }
  
  pre {
    background: #f7fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1rem;
    font-size: 0.875rem;
    color: #4a5568;
    overflow-x: auto;
    margin: 0.5rem 0 0 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  
  ${props => {
    if (props.variant === 'primary') {
      return `
        background: linear-gradient(135deg, #3182ce, #667eea);
        color: white;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
      `;
    } else {
      return `
        background: #e2e8f0;
        color: #4a5568;
        
        &:hover {
          background: #cbd5e0;
        }
      `;
    }
  }}
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('React Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>
              <AlertTriangle />
            </ErrorIcon>
            
            <ErrorTitle>Đã xảy ra lỗi</ErrorTitle>
            
            <ErrorMessage>
              Rất tiếc, đã xảy ra lỗi không mong muốn. 
              Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
            </ErrorMessage>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                <summary>Chi tiết lỗi (chỉ hiển thị trong development)</summary>
                <pre>
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </ErrorDetails>
            )}

            <ButtonGroup>
              <Button variant="primary" onClick={this.handleRetry}>
                <RefreshCw size={18} />
                Thử lại
              </Button>
              
              <Button onClick={this.handleGoHome}>
                <Home size={18} />
                Về trang chủ
              </Button>
            </ButtonGroup>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
