import { publicApiClient } from './apiClient';

const googleAuthApi = {
  // Login with Google OAuth
  loginWithGoogle: async (googleData) => {
    try {
      const response = await publicApiClient.post('/auth/google', {
        idToken: googleData.credential
      });
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  // Verify Google token
  verifyGoogleToken: async (idToken) => {
    try {
      const response = await publicApiClient.post('/auth/google/verify', {
        idToken: idToken
      });
      return response.data;
    } catch (error) {
      console.error('Google token verification error:', error);
      throw error;
    }
  }
};

export default googleAuthApi; 