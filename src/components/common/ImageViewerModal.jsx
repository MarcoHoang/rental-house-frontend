import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${props => `scale(${props.scale}) rotate(${props.rotation}deg)`};
  transition: transform 0.3s ease;
`;

const MainImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  svg {
    color: white;
    width: 24px;
    height: 24px;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translateY(-50%) scale(1);
  }
  
  svg {
    color: white;
    width: 28px;
    height: 28px;
  }
  
  &.prev {
    left: 20px;
  }
  
  &.next {
    right: 20px;
  }
`;

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  border-radius: 50px;
  backdrop-filter: blur(10px);
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  svg {
    color: white;
    width: 20px;
    height: 20px;
  }
`;

const ImageCounter = styled.div`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 1rem;
`;

const ThumbnailContainer = styled.div`
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  max-width: 80vw;
  overflow-x: auto;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

const Thumbnail = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  
  &:hover {
    transform: scale(1.1);
    border-color: #3b82f6;
  }
`;

const ImageViewerModal = ({ isOpen, onClose, images = [], initialIndex = 0, title = 'Ảnh nhà' }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setRotation(0);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case 'r':
          e.preventDefault();
          handleRotate();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, scale, rotation]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setScale(1);
    setRotation(0);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setScale(1);
    setRotation(0);
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    setScale(1);
    setRotation(0);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X />
        </CloseButton>

        <ImageContainer scale={scale} rotation={rotation}>
          <MainImage
            src={currentImage}
            alt={`${title} - Ảnh ${currentIndex + 1}`}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </ImageContainer>

        {images.length > 1 && (
          <>
            <NavigationButton 
              className="prev" 
              onClick={handlePrevious}
              disabled={images.length <= 1}
            >
              <ChevronLeft />
            </NavigationButton>
            
            <NavigationButton 
              className="next" 
              onClick={handleNext}
              disabled={images.length <= 1}
            >
              <ChevronRight />
            </NavigationButton>
          </>
        )}

        <ControlsContainer>
          <ControlButton onClick={handleZoomOut} title="Thu nhỏ (Phím -)">
            <ZoomOut />
          </ControlButton>
          
          <ControlButton onClick={handleZoomIn} title="Phóng to (Phím +)">
            <ZoomIn />
          </ControlButton>
          
          <ControlButton onClick={handleRotate} title="Xoay 90° (Phím R)">
            <RotateCw />
          </ControlButton>
          
          <ControlButton onClick={handleReset} title="Đặt lại">
            <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>R</span>
          </ControlButton>
          
          <ImageCounter>
            {currentIndex + 1} / {images.length}
          </ImageCounter>
        </ControlsContainer>

        {images.length > 1 && (
          <ThumbnailContainer>
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
          </ThumbnailContainer>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default ImageViewerModal;
