// Constants cho House Types và Status - thống nhất với backend
export const HOUSE_TYPES = {
  APARTMENT: 'APARTMENT',
  VILLA: 'VILLA',
  TOWNHOUSE: 'TOWNHOUSE',
  BOARDING_HOUSE: 'BOARDING_HOUSE',
  WHOLE_HOUSE: 'WHOLE_HOUSE'
};

export const HOUSE_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RENTED: 'RENTED',
  INACTIVE: 'INACTIVE'
};

// Labels cho hiển thị UI
export const HOUSE_TYPE_LABELS = {
  [HOUSE_TYPES.APARTMENT]: 'Căn hộ',
  [HOUSE_TYPES.VILLA]: 'Biệt thự',
  [HOUSE_TYPES.TOWNHOUSE]: 'Nhà phố',
  [HOUSE_TYPES.BOARDING_HOUSE]: 'Nhà trọ',
  [HOUSE_TYPES.WHOLE_HOUSE]: 'Nhà nguyên căn'
};

export const HOUSE_STATUS_LABELS = {
  [HOUSE_STATUS.AVAILABLE]: 'Còn sẵn',
  [HOUSE_STATUS.RENTED]: 'Đã thuê',
  [HOUSE_STATUS.INACTIVE]: 'Không hoạt động'
};

// Colors cho status badges
export const HOUSE_STATUS_COLORS = {
  [HOUSE_STATUS.AVAILABLE]: 'bg-green-100 text-green-800',
  [HOUSE_STATUS.RENTED]: 'bg-blue-100 text-blue-800',
  [HOUSE_STATUS.INACTIVE]: 'bg-red-100 text-red-800'
};

// Helper functions
export const getHouseTypeLabel = (type) => {
  return HOUSE_TYPE_LABELS[type] || type;
};

export const getHouseStatusLabel = (status) => {
  return HOUSE_STATUS_LABELS[status] || status;
};

export const getHouseStatusColor = (status) => {
  return HOUSE_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};

// Validation constants
export const VALIDATION_RULES = {
  MIN_IMAGES: 3,
  MAX_IMAGES: 10,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MIN_PRICE: 0,
  MIN_AREA: 0
};

// API Response structure constants (theo backend ApiResponse)
export const API_RESPONSE_STRUCTURE = {
  SUCCESS: 'success',
  DATA: 'data',
  MESSAGE: 'message',
  STATUS_CODE: 'statusCode'
};

// House DTO structure (theo backend HouseDTO)
export const HOUSE_DTO_FIELDS = {
  ID: 'id',
  HOST_ID: 'hostId',
  HOST_NAME: 'hostName',
  TITLE: 'title',
  DESCRIPTION: 'description',
  ADDRESS: 'address',
  PRICE: 'price',
  AREA: 'area',
  LATITUDE: 'latitude',
  LONGITUDE: 'longitude',
  STATUS: 'status',
  HOUSE_TYPE: 'houseType',
  IMAGE_URLS: 'imageUrls',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt'
};
