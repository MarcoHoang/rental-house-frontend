import React from 'react';
import styled from 'styled-components';
import { getAvatarUrl, loadAuthenticatedImage, requiresAuthentication } from '../../utils/avatarHelper';

const AvatarContainer = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$bgColor || '#e5e7eb'};
  color: white;
  font-weight: 600;
  font-size: ${props => {
    const size = parseInt(props.size) || 40;
    return `${Math.max(12, size * 0.4)}px`;
  }};
  border: 2px solid ${props => props.borderColor || 'transparent'};
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => props.$clickable ? 'scale(1.05)' : 'none'};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    position: relative;
    z-index: 1;
  }
`;

// Hàm tạo màu từ string
const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

// Hàm lấy ký tự đầu tiên của tên
const getInitials = (name) => {
  if (!name) return 'U';
  const names = name.split(' ').filter(n => n.trim());
  if (names.length === 0) return 'U';
  if (names.length === 1) return names[0][0].toUpperCase();
  return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
};

const Avatar = ({ 
  src, 
  alt, 
  size = '40px', 
  name, 
  clickable = false, 
  borderColor,
  onClick,
  className 
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [authenticatedImageUrl, setAuthenticatedImageUrl] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const avatarUrl = getAvatarUrl(src);
  const displayName = name || alt || 'User';
  const bgColor = stringToColor(displayName);
  const initials = getInitials(displayName);

  // Load authenticated image if needed
  React.useEffect(() => {
    // Reset states when avatarUrl changes
    setImageLoaded(false);
    setImageError(false);
    
    // Nếu không có avatar URL, hiển thị chữ cái đầu
    if (!avatarUrl) {
      setAuthenticatedImageUrl(null);
      setIsLoading(false);
      return;
    }

    // Nếu là blob URL (preview từ file được chọn), hiển thị ngay lập tức
    if (avatarUrl && avatarUrl.startsWith('blob:')) {
      setAuthenticatedImageUrl(avatarUrl);
      setIsLoading(false);
      return;
    }

    if (avatarUrl && requiresAuthentication(avatarUrl)) {
      setIsLoading(true);
      
      // This is a backend image URL that needs authentication
      loadAuthenticatedImage(avatarUrl).then(blobUrl => {
        setIsLoading(false);
        if (blobUrl) {
          setAuthenticatedImageUrl(blobUrl);
        } else {
          setImageError(true);
          setAuthenticatedImageUrl(null);
        }
      }).catch(error => {
        setIsLoading(false);
        setImageError(true);
        setAuthenticatedImageUrl(null);
      });
    } else {
      // This is a public image URL, no need for authentication
      setAuthenticatedImageUrl(avatarUrl);
      setIsLoading(false);
    }

    // Cleanup function to revoke blob URL
    return () => {
      if (authenticatedImageUrl && authenticatedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(authenticatedImageUrl);
      }
    };
  }, [avatarUrl]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  // Determine which image URL to use
  const imageUrlToUse = authenticatedImageUrl || avatarUrl;

  return (
    <AvatarContainer
      size={size}
      $bgColor={bgColor}
      borderColor={borderColor}
      $clickable={clickable}
      onClick={handleClick}
      className={className}
    >
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          {!imageError && imageUrlToUse ? (
            <img
              src={imageUrlToUse}
              alt={alt || displayName}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : null}
          
          {(imageError || !imageUrlToUse) && (
            <span>{initials}</span>
          )}
        </>
      )}
    </AvatarContainer>
  );
};

export default Avatar;
