
export const mockUsers = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    fullName: "John Doe",
    phone: "0123456789",
    address: "123 Main St, City",
    avatar: "https://via.placeholder.com/150/cccccc/666666?text=User",
    role: "user"
  },
  {
    id: 2,
    username: "jane_smith",
    email: "jane@example.com",
    fullName: "Jane Smith",
    phone: "0987654321",
    address: "456 Oak Ave, Town",
    avatar: "https://via.placeholder.com/150/cccccc/666666?text=User",
    role: "host"
  }
];

// Common amenities for houses
const commonAmenities = [
  'Wifi miễn phí',
  'Điều hòa nhiệt độ',
  'Tủ lạnh',
  'Máy giặt',
  'Truyền hình cáp',
  'Nhà bếp đầy đủ',
  'Bể bơi',
  'Phòng tập gym',
  'Chỗ đậu xe',
  'Bảo vệ 24/7',
  'Thang máy',
  'Ban công/sân thượng',
  'Hệ thống an ninh',
  'Giường ngủ thoải mái',
  'Khu vực làm việc'
];

// Generate a random subset of amenities
const getRandomAmenities = () => {
  const shuffled = [...commonAmenities].sort(() => 0.5 - Math.random());
  // Return between 5 to 10 random amenities
  return shuffled.slice(0, Math.floor(Math.random() * 6) + 5);
};

// Generate random images for a house
const getRandomImages = (count = 5, seed) => {
  return Array.from(
    { length: count }, 
    (_, i) => `https://picsum.photos/seed/${seed}-${i}/800/600`
  );
};

// Main mock data for houses
export const mockHouses = [
  {
    id: 1,
    name: "Căn hộ cao cấp The Gold View, view sông Sài Gòn",
    address: "346 Bến Vân Đồn, Phường 1, Quận 4, TP.HCM",
    price: 15000000,
    images: getRandomImages(8, 1),
    bedrooms: 2,
    bathrooms: 2,
    area: 65,
    description: "Căn hộ cao cấp nằm ngay trung tâm Quận 4 với tầm nhìn bao quát sông Sài Gòn. Thiết kế hiện đại, nội thất cao cấp, đầy đủ tiện nghi. Gần trung tâm thương mại, trường học, bệnh viện và các tiện ích khác.",
    amenities: getRandomAmenities(8),
    host: {
      id: 101,
      name: "Nguyễn Văn A",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      phone: "0901234567",
      joinDate: "2022-01-15"
    },
    rating: 4.8,
    reviewCount: 24,
    isAvailable: true,
    type: "Căn hộ",
    floor: 15,
    maxGuests: 4,
    createdAt: "2023-05-10T10:30:00Z",
    updatedAt: "2023-10-15T14:20:00Z"
  },
  {
    id: 2,
    name: "Nhà nguyên căn hẻm xe hơi, nội thất đầy đủ",
    address: "288 Nam Kỳ Khởi Nghĩa, Phường 8, Quận 3, TP.HCM",
    price: 22000000,
    images: getRandomImages(6, 2),
    bedrooms: 4,
    bathrooms: 3,
    area: 120,
    description: "Nhà nguyên căn mới xây, nằm trong hẻm rộng thông thoáng, có thể để được 2 ô tô. Nội thất đầy đủ, thiết kế hiện đại, phù hợp cho gia đình hoặc nhóm bạn. Gần các trường học, bệnh viện và trung tâm thương mại.",
    amenities: getRandomAmenities(10),
    host: {
      id: 102,
      name: "Trần Thị B",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      phone: "0912345678",
      joinDate: "2021-11-20"
    },
    rating: 4.9,
    reviewCount: 18,
    isAvailable: true,
    type: "Nhà nguyên căn",
    floor: 2,
    maxGuests: 8,
    createdAt: "2023-03-15T09:15:00Z",
    updatedAt: "2023-10-10T16:45:00Z"
  },
  {
    id: 3,
    name: "Studio tiện nghi gần Sân bay Tân Sơn Nhất",
    address: "123 Hồng Hà, Phường 2, Quận Tân Bình, TP.HCM",
    price: 8500000,
    images: getRandomImages(5, 3),
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    description: "Studio mới xây, thiết kế tối ưu không gian, đầy đủ tiện nghi. Chỉ cách sân bay Tân Sơn Nhất 5 phút lái xe, phù hợp cho khách công tác ngắn hạn hoặc dài hạn. Xung quanh có nhiều nhà hàng, quán cà phê, siêu thị.",
    amenities: getRandomAmenities(6),
    host: {
      id: 103,
      name: "Lê Văn C",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      phone: "0923456789",
      joinDate: "2022-02-28"
    },
    rating: 4.6,
    reviewCount: 32,
    isAvailable: true,
    type: "Studio",
    floor: 8,
    maxGuests: 2,
    createdAt: "2023-07-05T14:20:00Z",
    updatedAt: "2023-10-18T10:15:00Z"
  },
  {
    id: 4,
    name: "Villa sân vườn có hồ bơi tại Thảo Điền",
    address: "99 Nguyễn Văn Hưởng, Thảo Điền, Quận 2, TP.HCM",
    price: 80000000,
    images: getRandomImages(10, 4),
    bedrooms: 5,
    bathrooms: 6,
    area: 350,
    description: "Biệt thự sang trọng tại khu Thảo Điền đẳng cấp, có hồ bơi riêng, sân vườn rộng. Thiết kế tinh tế, nội thất cao cấp, đầy đủ tiện nghi. Phù hợp cho gia đình đa thế hệ hoặc các sự kiện đặc biệt.",
    amenities: getRandomAmenities(12),
    host: {
      id: 104,
      name: "Phạm Thị D",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      phone: "0934567890",
      joinDate: "2020-09-12"
    },
    rating: 4.9,
    reviewCount: 15,
    isAvailable: true,
    type: "Biệt thự",
    floor: 2,
    maxGuests: 12,
    createdAt: "2023-01-20T11:00:00Z",
    updatedAt: "2023-10-17T09:30:00Z"
  },
  {
    id: 5,
    name: "Căn hộ dịch vụ tiện nghi, trung tâm Quận 1",
    address: "15 Lê Thánh Tôn, Bến Nghé, Quận 1, TP.HCM",
    price: 18000000,
    images: getRandomImages(7, 5),
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    description: "Căn hộ dịch vụ cao cấp ngay trung tâm Quận 1, view đẹp, nội thất hiện đại, đầy đủ tiện nghi. Thuận tiện di chuyển đến các địa điểm du lịch, mua sắm và ẩm thực nổi tiếng của Sài Gòn.",
    amenities: getRandomAmenities(9),
    host: {
      id: 105,
      name: "Hoàng Văn E",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      phone: "0945678901",
      joinDate: "2022-05-18"
    },
    rating: 4.7,
    reviewCount: 28,
    isAvailable: true,
    type: "Căn hộ dịch vụ",
    floor: 12,
    maxGuests: 3,
    createdAt: "2023-04-22T13:45:00Z",
    updatedAt: "2023-10-16T17:20:00Z"
  },
  {
    id: 6,
    name: "Penthouse Vincom Center, tầm nhìn panorama",
    address: "72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP.HCM",
    price: 120000000,
    images: getRandomImages(9, 6),
    bedrooms: 3,
    bathrooms: 4,
    area: 280,
    description: "Penthouse đẳng cấp 5 sao với tầm nhìn toàn cảnh thành phố, nằm trong tòa nhà Vincom Center. Nội thất sang trọng, đẳng cấp, đầy đủ tiện nghi cao cấp. Dịch vụ đẳng cấp thượng lưu, view đẹp nhất Sài Gòn.",
    amenities: getRandomAmenities(14),
    host: {
      id: 106,
      name: "Vũ Thị F",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
      phone: "0956789012",
      joinDate: "2021-08-25"
    },
    rating: 5.0,
    reviewCount: 12,
    isAvailable: true,
    type: "Penthouse",
    floor: 35,
    maxGuests: 6,
    createdAt: "2023-02-10T10:00:00Z",
    updatedAt: "2023-10-18T08:45:00Z"
  },
  {
    id: 7,
    name: "Nhà phố mặt tiền kinh doanh sầm uất",
    address: "553 Sư Vạn Hạnh, Phường 13, Quận 10, TP.HCM",
    price: 45000000,
    images: getRandomImages(7, 7),
    bedrooms: 6,
    bathrooms: 5,
    area: 180,
    description: "Nhà phố mặt tiền đẹp, vị trí đắc địa, phù hợp kinh doanh đa ngành nghề. Thiết kế hiện đại, không gian rộng rãi, thoáng mát. Mặt tiền rộng, thuận tiện cho việc kinh doanh, buôn bán.",
    amenities: getRandomAmenities(8),
    host: {
      id: 107,
      name: "Đặng Văn G",
      avatar: "https://randomuser.me/api/portraits/men/7.jpg",
      phone: "0967890123",
      joinDate: "2021-12-05"
    },
    rating: 4.5,
    reviewCount: 20,
    isAvailable: true,
    type: "Nhà phố",
    floor: 3,
    maxGuests: 10,
    createdAt: "2023-06-15T09:30:00Z",
    updatedAt: "2023-10-17T15:10:00Z"
  },
  {
    id: 8,
    name: "Chung cư mini giá rẻ cho sinh viên gần Làng Đại học",
    address: "Đường Vành đai, Dĩ An, Bình Dương",
    price: 3500000,
    images: getRandomImages(5, 8),
    bedrooms: 1,
    bathrooms: 1,
    area: 25,
    description: "Phòng trọ giá rẻ dành cho sinh viên, gần các trường đại học trong khu vực Làng Đại học. Phòng có đầy đủ nội thất cơ bản, an ninh đảm bảo, khu vực để xe rộng rãi. Gần chợ, siêu thị và các dịch vụ tiện ích khác.",
    amenities: getRandomAmenities(5),
    host: {
      id: 108,
      name: "Bùi Thị H",
      avatar: "https://randomuser.me/api/portraits/women/8.jpg",
      phone: "0978901234",
      joinDate: "2022-03-22"
    },
    rating: 4.2,
    reviewCount: 45,
    isAvailable: true,
    type: "Phòng trọ",
    floor: 3,
    maxGuests: 2,
    createdAt: "2023-08-01T08:00:00Z",
    updatedAt: "2023-10-18T11:20:00Z"
  }
];
