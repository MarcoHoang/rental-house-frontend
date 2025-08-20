// Test file để kiểm tra API tìm kiếm admin
import { hostApplicationsApi, usersApi, housesApi } from './src/api/adminApi.js';

// Test tìm kiếm host requests
async function testHostRequestsSearch() {
  try {
    console.log('Testing host requests search...');
    const result = await hostApplicationsApi.searchRequests('test', 'PENDING', { page: 0, size: 5 });
    console.log('Host requests search result:', result);
  } catch (error) {
    console.error('Host requests search error:', error);
  }
}

// Test tìm kiếm hosts
async function testHostsSearch() {
  try {
    console.log('Testing hosts search...');
    const result = await hostApplicationsApi.searchHosts('test', true, { page: 0, size: 5 });
    console.log('Hosts search result:', result);
  } catch (error) {
    console.error('Hosts search error:', error);
  }
}

// Test tìm kiếm users
async function testUsersSearch() {
  try {
    console.log('Testing users search...');
    const result = await usersApi.searchUsers('test', 'USER', true);
    console.log('Users search result:', result);
  } catch (error) {
    console.error('Users search error:', error);
  }
}

// Test tìm kiếm houses
async function testHousesSearch() {
  try {
    console.log('Testing houses search...');
    const result = await housesApi.searchHouses('test', 'ACTIVE', 'HOUSE', undefined);
    console.log('Houses search result:', result);
  } catch (error) {
    console.error('Houses search error:', error);
  }
}

// Chạy tất cả tests
async function runAllTests() {
  console.log('=== Testing Admin Search APIs ===');
  await testHostRequestsSearch();
  await testHostsSearch();
  await testUsersSearch();
  await testHousesSearch();
  console.log('=== Tests completed ===');
}

// Export để có thể chạy từ command line
if (typeof window === 'undefined') {
  runAllTests();
}
