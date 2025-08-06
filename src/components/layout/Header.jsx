import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
`;

const HeaderContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Logo = styled(Link)`
    font-size: 1.5rem;
    font-weight: bold;
    color: #4f46e5;
    text-decoration: none;
    &:hover {
        color: #4338ca;
    }
`;

const Nav = styled.nav`
    display: flex;
    gap: 2rem;
    margin-left: 2rem;
`;

const NavLink = styled(Link)`
    color: #4b5563;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    &:hover {
        color: #4f46e5;
    }
`;

const AuthButtons = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;

    .login {
        color: #4f46e5;
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        transition: background-color 0.2s;

        &:hover {
            background-color: #eef2ff;
        }
    }

    .signup {
        background-color: #4f46e5;
        color: white;
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        transition: background-color 0.2s;

        &:hover {
            background-color: #4338ca;
        }
    }
`;

const UserMenu = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e0e7ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 200px;
  z-index: 50;
  margin-top: 0.5rem;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: #4b5563;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
    color: #4f46e5;
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

  &:hover {
    background-color: #fef2f2;
  }
`;

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setShowDropdown(false);
        navigate('/');
    };

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    return (
        <HeaderWrapper>
            <HeaderContainer>
                <Logo to="/">RentalHouse</Logo>
                <Nav>
                    <NavLink to="/cho-thue-can-ho">Căn hộ</NavLink>
                    <NavLink to="/cho-thue-nha-pho">Nhà phố</NavLink>
                    <NavLink to="/blog">Blog</NavLink>
                </Nav>

                {isLoggedIn ? (
                    <UserMenu>
                        <UserAvatar onClick={() => setShowDropdown(!showDropdown)}>
                            {getInitials(username)}
                        </UserAvatar>
                        <DropdownMenu isOpen={showDropdown}>
                            <DropdownItem to="/profile" onClick={() => setShowDropdown(false)}>
                                Thông tin cá nhân
                            </DropdownItem>
                            <DropdownItem to="/my-properties" onClick={() => setShowDropdown(false)}>
                                Tin đăng của tôi
                            </DropdownItem>
                            <DropdownItem to="/saved" onClick={() => setShowDropdown(false)}>
                                Đã lưu
                            </DropdownItem>
                            <div style={{ borderTop: '1px solid #e5e7eb' }}></div>
                            <LogoutButton onClick={handleLogout}>Đăng xuất</LogoutButton>
                        </DropdownMenu>
                    </UserMenu>
                ) : (
                    <AuthButtons>
                        <Link to="/login" className="login">
                            Đăng nhập
                        </Link>
                        <Link to="/register" className="signup">
                            Đăng ký
                        </Link>
                    </AuthButtons>
                )}
            </HeaderContainer>
        </HeaderWrapper>
    );
};

export default Header;