import React from 'react';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;
`;

const PageCard = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-content {
    flex: 1;
  }

  .back-button {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
    font-weight: 500;
    margin-right: 1rem;
    
    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-1px);
    }
  }

  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 1rem;
    margin: 0;
    opacity: 0.9;
  }
`;

const PageContent = styled.div`
  padding: 2rem;
`;

const HostPageWrapper = ({ 
  title, 
  subtitle, 
  children, 
  showBackButton = false, 
  backUrl = '/host',
  headerActions = null 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backUrl);
  };

  return (
    <PageContainer>
      <PageCard>
        <PageHeader>
          {showBackButton && (
            <button className="back-button" onClick={handleBack}>
              <ArrowLeft size={16} />
              Quay lại
            </button>
          )}
          <div className="header-content">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {headerActions && (
            <div className="header-actions">
              {headerActions}
            </div>
          )}
        </PageHeader>
        <PageContent>
          {children}
        </PageContent>
      </PageCard>
    </PageContainer>
  );
};

export default HostPageWrapper;
