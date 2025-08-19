import React from 'react';
import UserChatManager from '../components/chat/UserChatManager';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const ChatPage = () => {
  return (
    <>
      <Header />
      <UserChatManager />
      <Footer />
    </>
  );
};

export default ChatPage;
