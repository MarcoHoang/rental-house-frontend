// Test file để kiểm tra API favorite
const API_BASE_URL = 'http://localhost:8080/api';

// Hàm test API
async function testFavoriteAPI() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('Không có token, vui lòng đăng nhập trước');
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Test 1: Lấy danh sách nhà yêu thích
    console.log('=== Test 1: Lấy danh sách nhà yêu thích ===');
    const favoritesResponse = await fetch(`${API_BASE_URL}/favorites/my-favorites`, {
      method: 'GET',
      headers
    });
    const favoritesData = await favoritesResponse.json();
    console.log('Favorites response:', favoritesData);

    // Test 2: Kiểm tra yêu thích một nhà cụ thể
    console.log('=== Test 2: Kiểm tra yêu thích ===');
    const houseId = 1; // Thay đổi ID nhà để test
    const checkResponse = await fetch(`${API_BASE_URL}/favorites/check/${houseId}`, {
      method: 'GET',
      headers
    });
    const checkData = await checkResponse.json();
    console.log('Check favorite response:', checkData);

    // Test 3: Toggle yêu thích
    console.log('=== Test 3: Toggle yêu thích ===');
    const toggleResponse = await fetch(`${API_BASE_URL}/favorites/${houseId}/toggle`, {
      method: 'POST',
      headers
    });
    const toggleData = await toggleResponse.json();
    console.log('Toggle favorite response:', toggleData);

    // Test 4: Kiểm tra lại sau khi toggle
    console.log('=== Test 4: Kiểm tra lại sau khi toggle ===');
    const checkAgainResponse = await fetch(`${API_BASE_URL}/favorites/check/${houseId}`, {
      method: 'GET',
      headers
    });
    const checkAgainData = await checkAgainResponse.json();
    console.log('Check favorite again response:', checkAgainData);

  } catch (error) {
    console.error('Error testing favorite API:', error);
  }
}

// Chạy test
testFavoriteAPI();
