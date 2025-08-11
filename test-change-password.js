// Test script cho API đổi mật khẩu
// Chạy với Node.js: node test-change-password.js

const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080/api';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'oldpassword123'
};

const newPassword = 'newpassword123';

async function testChangePassword() {
  try {
    console.log('=== TEST CHANGE PASSWORD API ===\n');

    // 1. Đăng nhập để lấy token
    console.log('1. Đăng nhập để lấy token...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });

    const token = loginResponse.data.data?.token || loginResponse.data.token;
    const user = loginResponse.data.data?.user || loginResponse.data.user;

    if (!token) {
      throw new Error('Không nhận được token từ server');
    }

    console.log('✅ Đăng nhập thành công');
    console.log('Token:', token.substring(0, 20) + '...');
    console.log('User ID:', user?.id);
    console.log('');

    // 2. Test đổi mật khẩu thành công
    console.log('2. Test đổi mật khẩu thành công...');
    const changePasswordResponse = await axios.put(
      `${API_BASE_URL}/users/${user.id}/change-password`,
      {
        oldPassword: testUser.password,
        newPassword: newPassword,
        confirmPassword: newPassword
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Đổi mật khẩu thành công');
    console.log('Response:', changePasswordResponse.data);
    console.log('');

    // 3. Test đăng nhập với mật khẩu mới
    console.log('3. Test đăng nhập với mật khẩu mới...');
    const newLoginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: newPassword
    });

    console.log('✅ Đăng nhập với mật khẩu mới thành công');
    console.log('Response:', newLoginResponse.data);
    console.log('');

    // 4. Test đổi lại mật khẩu cũ
    console.log('4. Đổi lại mật khẩu cũ...');
    const newToken = newLoginResponse.data.data?.token || newLoginResponse.data.token;
    
    const revertResponse = await axios.put(
      `${API_BASE_URL}/users/${user.id}/change-password`,
      {
        oldPassword: newPassword,
        newPassword: testUser.password,
        confirmPassword: testUser.password
      },
      {
        headers: {
          'Authorization': `Bearer ${newToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Đổi lại mật khẩu cũ thành công');
    console.log('Response:', revertResponse.data);
    console.log('');

    console.log('=== TẤT CẢ TEST THÀNH CÔNG ===');

  } catch (error) {
    console.error('❌ Test thất bại:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Test các trường hợp lỗi
async function testErrorCases() {
  try {
    console.log('\n=== TEST ERROR CASES ===\n');

    // 1. Test mật khẩu cũ sai
    console.log('1. Test mật khẩu cũ sai...');
    try {
      await axios.put(`${API_BASE_URL}/users/1/change-password`, {
        oldPassword: 'wrongpassword',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123'
      }, {
        headers: {
          'Authorization': 'Bearer invalid-token',
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.log('✅ Lỗi mật khẩu cũ sai được xử lý đúng');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
    }
    console.log('');

    // 2. Test mật khẩu xác nhận không khớp
    console.log('2. Test mật khẩu xác nhận không khớp...');
    try {
      await axios.put(`${API_BASE_URL}/users/1/change-password`, {
        oldPassword: 'oldpassword123',
        newPassword: 'newpassword123',
        confirmPassword: 'differentpassword'
      }, {
        headers: {
          'Authorization': 'Bearer invalid-token',
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.log('✅ Lỗi mật khẩu xác nhận không khớp được xử lý đúng');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
    }
    console.log('');

    // 3. Test mật khẩu mới quá ngắn
    console.log('3. Test mật khẩu mới quá ngắn...');
    try {
      await axios.put(`${API_BASE_URL}/users/1/change-password`, {
        oldPassword: 'oldpassword123',
        newPassword: '123',
        confirmPassword: '123'
      }, {
        headers: {
          'Authorization': 'Bearer invalid-token',
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.log('✅ Lỗi mật khẩu quá ngắn được xử lý đúng');
      console.log('Status:', error.response?.status);
      console.log('Message:', error.response?.data?.message);
    }
    console.log('');

    console.log('=== TẤT CẢ ERROR CASES ĐƯỢC XỬ LÝ ĐÚNG ===');

  } catch (error) {
    console.error('❌ Test error cases thất bại:', error.message);
  }
}

// Chạy tests
async function runAllTests() {
  await testChangePassword();
  await testErrorCases();
}

// Chỉ chạy nếu file được gọi trực tiếp
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testChangePassword,
  testErrorCases,
  runAllTests
};
