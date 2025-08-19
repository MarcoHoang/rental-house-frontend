import { publicApiClient } from './apiClient';

const chatApi = {
  // Get user conversations
  getUserConversations: async () => {
    try {
      const response = await publicApiClient.get('/chat/conversations');
      console.log('getUserConversations response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting user conversations:', error);
      throw error;
    }
  },

  // Get conversation by ID
  getConversationById: async (conversationId) => {
    try {
      const response = await publicApiClient.get(`/chat/conversations/${conversationId}`);
      console.log('getConversationById response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting conversation by ID:', error);
      throw error;
    }
  },

  // Create or get conversation
  createOrGetConversation: async (hostId, houseId) => {
    try {
      console.log('Creating/getting conversation with hostId:', hostId, 'houseId:', houseId);
      const response = await publicApiClient.post('/chat/conversations', {
        hostId: Number(hostId),
        houseId: Number(houseId)
      });
      console.log('createOrGetConversation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating/getting conversation:', error);
      if (error.response?.data) {
        console.error('Error response data:', error.response.data);
      }
      throw error;
    }
  },

  // Send message
  sendMessage: async (messageData) => {
    try {
      console.log('Sending message with data:', messageData);
      const response = await publicApiClient.post('/chat/messages', {
        houseId: Number(messageData.houseId),
        receiverId: Number(messageData.receiverId),
        content: messageData.content
      });
      console.log('sendMessage response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.data) {
        console.error('Error response data:', error.response.data);
      }
      throw error;
    }
  },

  // Get conversation messages
  getConversationMessages: async (conversationId, page = 0, size = 20) => {
    try {
      console.log('Getting messages for conversation:', conversationId, 'page:', page, 'size:', size);
      const response = await publicApiClient.get(`/chat/conversations/${conversationId}/messages`, {
        params: { page, size }
      });
      console.log('getConversationMessages response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      throw error;
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (conversationId) => {
    try {
      console.log('Marking messages as read for conversation:', conversationId);
      const response = await publicApiClient.post(`/chat/conversations/${conversationId}/read`);
      console.log('markMessagesAsRead response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Get unread message count
  getUnreadMessageCount: async () => {
    try {
      const response = await publicApiClient.get('/chat/unread-count');
      console.log('getUnreadMessageCount response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting unread message count:', error);
      throw error;
    }
  },

  // Get unread message count for specific conversation
  getUnreadMessageCountForConversation: async (conversationId) => {
    try {
      const response = await publicApiClient.get(`/chat/conversations/${conversationId}/unread-count`);
      console.log('getUnreadMessageCountForConversation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting unread message count for conversation:', error);
      throw error;
    }
  }
};

export default chatApi; 