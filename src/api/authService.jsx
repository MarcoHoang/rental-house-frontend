// src/api/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Đăng nhập thất bại' };
        }
    },

    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Đăng ký thất bại' };
        }
    }
};