import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDownIcon, UserIcon, ArrowRightOnRectangleIcon, PlusIcon } from '@heroicons/react/24/outline';
import authService from '../../api/authService';
import styled from 'styled-components';

// Styled components (giống với Header.jsx)
const HeaderWrapper = styled.header`
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2563eb;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f3f4f6;
  }
`;

const UserAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: ${props => props.$bgColor || '#e5e7eb'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 12rem;
  z-index: 10;
  overflow: hidden;
`;

const UserMenuHeader = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const UserName = styled.p`
  font-weight: 500;
  color: #111827;
`;

const UserEmail = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const UserMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.875rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #fef2f2;
  }
`;

const PostButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

// Hàm tạo màu ngẫu nhiên dựa trên tên
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  
  return color;
};

// Hàm lấy ký tự đầu tiên của tên
const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : name[0].toUpperCase();
};

const HostHeader = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        fullName: '',
        avatar: null,
        email: '',
        role: ''
    });
    const navigate = useNavigate();

    // Hàm xử lý đăng xuất
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserData({ username: '', fullName: '', avatar: null, email: '', role: '' });
        setShowDropdown(false);
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    }, [navigate]);

    // Tải thông tin người dùng
    const loadUserProfile = useCallback(async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        try {
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUserData({
                    username: userData.username || '',
                    fullName: userData.fullName || userData.username || '',
                    avatar: userData.avatar || null,
                    email: userData.email || '',
                    role: userData.role || ''
                });
                setIsLoggedIn(true);
            }

            const profile = await authService.getProfile();
            if (profile) {
                const userData = {
                    username: profile.username || '',
                    fullName: profile.fullName || profile.username || '',
                    avatar: profile.avatar || null,
                    email: profile.email || '',
                    role: profile.role || ''
                };
                setUserData(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error('Lỗi khi tải thông tin người dùng:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    }, [handleLogout]);

    // Kiểm tra đăng nhập khi component mount
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            
            if (token && user) {
                try {
                    const userData = JSON.parse(user);
                    setUserData({
                        username: userData.username || '',
                        fullName: userData.fullName || userData.username || '',
                        avatar: userData.avatar || null,
                        email: userData.email || '',
                        role: userData.role || ''
                    });
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error('Lỗi khi đọc dữ liệu người dùng:', error);
                    handleLogout();
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        checkAuth();
        
        const handleStorageChange = (e) => {
            if (e.key === 'token' || e.key === 'user') {
                checkAuth();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [handleLogout]);

    // Tải thông tin người dùng khi đã đăng nhập
    useEffect(() => {
        if (isLoggedIn) {
            loadUserProfile();
        }
    }, [isLoggedIn, loadUserProfile]);

    return (
        <HeaderWrapper>
            <HeaderContainer>
                <Logo to="/">RentalHouse</Logo>
                
                <Nav>
                    <NavLink to="/cho-thue-can-ho">Căn hộ</NavLink>
                    <NavLink to="/cho-thue-nha-pho">Nhà phố</NavLink>
                    <NavLink to="/blog">Blog</NavLink>
                </Nav>

                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <div className="flex items-center space-x-3">
                            {/* Nút Đăng dành cho chủ nhà */}
                            <PostButton to="/post">
                                <PlusIcon className="w-4 h-4" />
                                <span>Đăng</span>
                            </PostButton>
                            
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center space-x-2 focus:outline-none hover:bg-gray-100 px-3 py-1 rounded-full transition-colors"
                                aria-haspopup="true"
                                aria-expanded={showDropdown}
                            >
                                <UserAvatar 
                                    $bgColor={stringToColor(userData.fullName || userData.username || 'User')}
                                >
                                    {userData.avatar ? (
                                        <img 
                                            src={userData.avatar} 
                                            alt={userData.fullName || userData.username} 
                                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                                        />
                                    ) : (
                                        getInitials(userData.fullName || userData.username)
                                    )}
                                </UserAvatar>
                                <div className="user-name">
                                    {userData?.fullName || userData?.username || 'Người dùng'}
                                </div>
                                <ChevronDownIcon className="w-4 h-4 text-gray-500 hidden md:block" />
                            </button>

                            {showDropdown && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowDropdown(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {userData.fullName || userData.username}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {userData.email}
                                            </p>
                                        </div>
                                        <Link 
                                            to="/profile" 
                                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                                            Thông tin cá nhân
                                        </Link>
                                        
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                                        >
                                            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-gray-400" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link 
                                to="/login" 
                                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Đăng nhập
                            </Link>
                            <Link 
                                to="/register" 
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>
            </HeaderContainer>
        </HeaderWrapper>
    );
};

export default HostHeader;
