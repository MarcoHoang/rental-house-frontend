import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const CarouselTrack = styled.div`
  display: flex;
  width: 500%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
  transform: translateX(-${props => props.currentIndex * 20}%);
`;

const CarouselSlide = styled.div`
  width: 20%;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 0.6) 100%
    );
    z-index: 1;
  }
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SlideContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  z-index: 2;
  padding: 2rem;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    
    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    opacity: 0.9;
    max-width: 600px;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    color: white;
    width: 24px;
    height: 24px;
  }
  
  &.prev {
    left: 20px;
  }
  
  &.next {
    right: 20px;
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const CarouselDots = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 3;
`;

const Dot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    transform: scale(1.2);
  }
`;

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Dữ liệu 5 ảnh nhà đẹp
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Biệt thự sang trọng',
      description: 'Khám phá những ngôi nhà đẹp với thiết kế hiện đại và tiện nghi cao cấp'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Căn hộ cao cấp',
      description: 'Trải nghiệm cuộc sống đẳng cấp với những căn hộ view đẹp và tiện nghi đầy đủ'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
      title: 'Nhà phố hiện đại',
      description: 'Những ngôi nhà phố với thiết kế tối ưu, phù hợp cho gia đình Việt Nam'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80',
      title: 'Căn hộ studio',
      description: 'Giải pháp hoàn hảo cho người trẻ với không gian sống tiện nghi và giá cả hợp lý'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Nhà vườn yên bình',
      description: 'Tận hưởng không gian sống gần gũi với thiên nhiên, lý tưởng cho gia đình'
    }
  ];

  // Tự động chuyển slide sau 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <CarouselContainer>
      <CarouselTrack currentIndex={currentIndex}>
        {slides.map((slide, index) => (
          <CarouselSlide key={slide.id}>
            <SlideImage src={slide.image} alt={slide.title} />
            <SlideContent>
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </SlideContent>
          </CarouselSlide>
        ))}
      </CarouselTrack>

      <CarouselButton className="prev" onClick={goToPrevious}>
        <ChevronLeft />
      </CarouselButton>
      
      <CarouselButton className="next" onClick={goToNext}>
        <ChevronRight />
      </CarouselButton>

      <CarouselDots>
        {slides.map((_, index) => (
          <Dot
            key={index}
            active={index === currentIndex}
            onClick={() => goToSlide(index)}
          />
        ))}
      </CarouselDots>
    </CarouselContainer>
  );
};

export default ImageCarousel;
