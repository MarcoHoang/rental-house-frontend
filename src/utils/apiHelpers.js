// Utility functions for API responses

export const isSuccessResponse = (response) => {
  if (!response) return false;
  
  // Check for all success codes: 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12
  const successCodes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  return successCodes.includes(response.code) && response.data;
};

export const extractDataFromResponse = (response) => {
  if (!response) {
    return null;
  }
  
  // Check for all success codes: 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12
  const successCodes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const isSuccess = successCodes.includes(response.code) && response.data;
  
  if (!isSuccess) {
    return null;
  }
  
  return response.data;
};

export const extractHousesFromResponse = (response) => {
  // Handle direct response from backend (when data is directly the houses array)
  if (response && Array.isArray(response)) {
    return response;
  }
  
  // Handle ApiResponse format from backend
  if (response && response.data && Array.isArray(response.data)) {
    return response.data;
  }
  
  const data = extractDataFromResponse(response);
  if (!data) {
    return [];
  }
  
  // Handle different response structures
  if (Array.isArray(data)) {
    return data;
  }
  
  if (data.content && Array.isArray(data.content)) {
    return data.content;
  }
  
  if (data.houses && Array.isArray(data.houses)) {
    return data.houses;
  }
  
  return [];
};

export const extractHouseFromResponse = (response) => {
  // Handle direct response from backend (when data is directly the house object)
  if (response && response.id) {
    return response;
  }
  
  // Handle ApiResponse format from backend
  if (response && response.data && response.data.id) {
    return response.data;
  }
  
  const data = extractDataFromResponse(response);
  if (!data) {
    return null;
  }
  
  // Handle different response structures
  if (data.id) {
    return data;
  }
  
  return null;
};

export const extractConversationsFromResponse = (response) => {
  const data = extractDataFromResponse(response);
  if (!data) return [];
  
  // Handle different response structures
  if (Array.isArray(data)) {
    return data;
  }
  
  if (data.content && Array.isArray(data.content)) {
    return data.content;
  }
  
  return [];
};

export const extractMessagesFromResponse = (response) => {
  const data = extractDataFromResponse(response);
  if (!data) return [];
  
  // Handle different response structures
  if (Array.isArray(data)) {
    return data;
  }
  
  if (data.content && Array.isArray(data.content)) {
    return data.content;
  }
  
  return [];
};

// House formatting functions
export const formatHouseForApi = (houseData) => {
  return {
    title: houseData.title?.trim(),
    description: houseData.description?.trim(),
    address: houseData.address?.trim(),
    price: parseFloat(houseData.price) || 0,
    area: parseFloat(houseData.area) || 0,
    latitude: parseFloat(houseData.latitude) || 0,
    longitude: parseFloat(houseData.longitude) || 0,
    status: houseData.status || 'AVAILABLE',
    houseType: houseData.houseType || 'APARTMENT',
    imageUrls: Array.isArray(houseData.imageUrls) ? houseData.imageUrls : []
  };
};

export const formatHouseForDisplay = (house) => {
  if (!house) return null;
  
  return {
    id: house.id,
    hostId: house.hostId,
    hostName: house.hostName,
    hostPhone: house.hostPhone,
    title: house.title || '',
    description: house.description || '',
    address: house.address || '',
    price: parseFloat(house.price) || 0,
    area: parseFloat(house.area) || 0,
    latitude: parseFloat(house.latitude) || 0,
    longitude: parseFloat(house.longitude) || 0,
    status: house.status || 'INACTIVE',
    houseType: house.houseType || 'APARTMENT',
    imageUrls: Array.isArray(house.imageUrls) ? house.imageUrls : [],
    createdAt: house.createdAt,
    updatedAt: house.updatedAt
  };
};

// Error handling functions
export const getApiErrorMessage = (error) => {
  if (!error) return 'Có lỗi xảy ra';
  
  // Nếu có response từ server
  if (error.response?.data) {
    const serverError = error.response.data;
    
    // Check theo cấu trúc ApiResponse
    if (serverError.message) {
      return serverError.message;
    }
    
    // Check validation errors
    if (serverError.errors) {
      return Object.values(serverError.errors).flat().join(', ');
    }
  }
  
  // Nếu có message từ client
  if (error.message) {
    return error.message;
  }
  
  return 'Có lỗi xảy ra khi kết nối với server';
};

export const isApiResponseSuccess = (response) => {
  if (!response) return false;
  
  // Check theo cấu trúc ApiResponse của backend
  if (response.data && response.data.success !== undefined) {
    return response.data.success === true;
  }
  
  // Check HTTP status
  return response.status >= 200 && response.status < 300;
};
