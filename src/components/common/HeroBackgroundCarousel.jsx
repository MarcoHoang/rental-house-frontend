import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const BackgroundSlide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${props => props.active ? 1 : 0};
  transition: opacity 1s ease-in-out;
  z-index: 1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.5)
  );
  z-index: 2;
`;

const CarouselIndicator = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 3;
`;

const IndicatorDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  transition: all 0.3s ease;
`;

const HeroBackgroundCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Debug: log current index để kiểm tra carousel có hoạt động không
  console.log('Current background index:', currentIndex);
  
  // Dữ liệu 5 ảnh nhà đẹp cho background
  const backgroundImages = [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/189333/pexels-photo-189333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/7031408/pexels-photo-7031408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  ];

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Đơn giản hóa preload để tránh lỗi
        const imgPromises = backgroundImages.map((src, index) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              console.log(`Image ${index + 1} loaded successfully:`, src);
              resolve();
            };
            img.onerror = () => {
              console.error(`Failed to load image ${index + 1}:`, src);
              resolve(); // Không reject, chỉ resolve để tiếp tục
            };
            img.src = src;
          });
        });
        
        await Promise.all(imgPromises);
        setImagesLoaded(true);
        console.log('Background images preload completed');
      } catch (error) {
        console.error('Error in image preload:', error);
        setImagesLoaded(true); // Vẫn set true để carousel hoạt động
      }
    };
    
    loadImages();
  }, []);

  // Tự động chuyển background sau 4 giây
  useEffect(() => {
    if (!imagesLoaded) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [backgroundImages.length, imagesLoaded]);

  return (
    <HeroBackground>
      {backgroundImages.map((image, index) => (
        <BackgroundSlide
          key={index}
          image={image}
          active={index === currentIndex}
        />
      ))}
      <Overlay />
      <CarouselIndicator>
        {backgroundImages.map((_, index) => (
          <IndicatorDot key={index} active={index === currentIndex} />
        ))}
      </CarouselIndicator>
    </HeroBackground>
  );
};

export default HeroBackgroundCarousel;
