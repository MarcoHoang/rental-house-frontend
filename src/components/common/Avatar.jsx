import React from 'react';
import styled from 'styled-components';
import { getAvatarUrl, loadAuthenticatedImage, requiresAuthentication, debugImageLoading } from '../../utils/avatarHelper';

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
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => props.clickable ? 'scale(1.05)' : 'none'};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
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
  
  const avatarUrl = getAvatarUrl(src);
  const displayName = name || alt || 'User';
  const bgColor = stringToColor(displayName);
  const initials = getInitials(displayName);

  // Load authenticated image if needed
  React.useEffect(() => {
    if (avatarUrl && avatarUrl !== 'https://via.placeholder.com/150/cccccc/666666?text=User' && requiresAuthentication(avatarUrl)) {
      // Debug image loading if in development
      if (process.env.NODE_ENV === 'development') {
        debugImageLoading(avatarUrl);
      }
      
      // This is a backend image URL that needs authentication
      loadAuthenticatedImage(avatarUrl).then(blobUrl => {
        if (blobUrl) {
          setAuthenticatedImageUrl(blobUrl);
        } else {
          console.warn('Failed to load authenticated image, falling back to initials');
          setImageError(true);
        }
      });
    } else {
      // This is a public image URL, no need for authentication
      setAuthenticatedImageUrl(avatarUrl);
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
      clickable={clickable}
      onClick={handleClick}
      className={className}
    >
      {!imageError && imageUrlToUse && imageUrlToUse !== 'https://via.placeholder.com/150/cccccc/666666?text=User' ? (
        <img
          src={imageUrlToUse}
          alt={alt || displayName}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ 
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease'
          }}
        />
      ) : null}
      
      {(!imageUrlToUse || imageUrlToUse === 'https://via.placeholder.com/150/cccccc/666666?text=User' || imageError) && (
        <span>{initials}</span>
      )}
    </AvatarContainer>
  );
};

export default Avatar;
