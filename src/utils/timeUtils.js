// Utility functions để format thời gian đăng bài
export const formatPostingTime = (createdAt) => {
  if (!createdAt) return '';
  
  const now = new Date();
  const postDate = new Date(createdAt);
  const diffInMs = now - postDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays === 0) {
    if (diffInHours === 0) {
      if (diffInMinutes === 0) {
        return 'Đăng vừa xong';
      }
      return `Đăng ${diffInMinutes} phút trước`;
    }
    return `Đăng ${diffInHours} giờ trước`;
  } else if (diffInDays === 1) {
    return 'Đăng hôm qua';
  } else if (diffInDays < 7) {
    return `Đăng ${diffInDays} ngày trước`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `Đăng ${weeks} tuần trước`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `Đăng ${months} tháng trước`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `Đăng ${years} năm trước`;
  }
};

// Utility function để format tiền tệ
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0 ₫';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
