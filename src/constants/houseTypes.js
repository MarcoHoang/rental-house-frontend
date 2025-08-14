// HouseType enum values matching the backend DTO
export const HOUSE_TYPES = {
  APARTMENT: 'APARTMENT',
  HOUSE: 'HOUSE',
  ROOM: 'ROOM'
};

// Vietnamese labels for house types
export const HOUSE_TYPE_LABELS = {
  [HOUSE_TYPES.APARTMENT]: 'Chung cư',
  [HOUSE_TYPES.HOUSE]: 'Nhà riêng',
  [HOUSE_TYPES.ROOM]: 'Phòng trọ'
};

// Validation constraints matching backend DTO
export const HOUSE_CONSTRAINTS = {
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 500,
  ADDRESS_MAX_LENGTH: 300,
  PRICE_MAX_VALUE: 1000000000, // 1 tỷ VNĐ
  AREA_MAX_VALUE: 10000, // 10,000 m²
  MIN_IMAGES: 1,
  MAX_IMAGES: 10
};
