import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

const GalleryContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #f8fafc;
`;

const MainImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const PlaceholderImage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #64748b;
  font-size: 1.1rem;
  
  svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translateY(-50%) scale(1);
  }
  
  svg {
    color: #374151;
    width: 24px;
    height: 24px;
  }
`;

const PrevButton = styled(NavigationButton)`
  left: 16px;
`;

const NextButton = styled(NavigationButton)`
  right: 16px;
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  z-index: 10;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0 0.5rem;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const ImageGallery = ({ images = [], title = 'Ảnh nhà' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  // Nếu không có ảnh
  if (!images || images.length === 0) {
    return (
      <GalleryContainer>
        <MainImageContainer>
          <PlaceholderImage>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            Không có ảnh
          </PlaceholderImage>
        </MainImageContainer>
      </GalleryContainer>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <GalleryContainer onKeyDown={handleKeyDown} tabIndex={0}>
      <MainImageContainer>
        <MainImage
          src={currentImage}
          alt={`${title} - Ảnh ${currentIndex + 1}`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <PlaceholderImage style={{ display: 'none' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
          Không thể tải ảnh
        </PlaceholderImage>
        
        {images.length > 1 && (
          <>
            <PrevButton onClick={handlePrevious} disabled={images.length <= 1}>
              <ChevronLeft />
            </PrevButton>
            <NextButton onClick={handleNext} disabled={images.length <= 1}>
              <ChevronRight />
            </NextButton>
            <ImageCounter>
              {currentIndex + 1} / {images.length}
            </ImageCounter>
          </>
        )}
      </MainImageContainer>
      
      {images.length > 1 && (
        <ThumbnailGrid>
          {images.map((image, index) => (
            <Thumbnail
              key={index}
              src={image}
              alt={`${title} - Thumbnail ${index + 1}`}
              $active={index === currentIndex}
              onClick={() => handleThumbnailClick(index)}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ))}
        </ThumbnailGrid>
      )}
    </GalleryContainer>
  );
};

export default ImageGallery;
