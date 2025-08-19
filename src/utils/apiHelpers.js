// Utility functions for API responses

export const isSuccessResponse = (response) => {
  if (!response) return false;
  
  // Check for all success codes: 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12
  const successCodes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  return successCodes.includes(response.code) && response.data;
};

export const extractDataFromResponse = (response) => {
  if (!isSuccessResponse(response)) {
    return null;
  }
  return response.data;
};

export const extractHousesFromResponse = (response) => {
  const data = extractDataFromResponse(response);
  if (!data) return [];
  
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
