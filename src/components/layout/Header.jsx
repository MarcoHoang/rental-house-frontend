import styled from "styled-components";
import { Link } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import { useState } from "react";

// HeaderWrapper với flexbox để căn chỉnh các phần tử
const HeaderWrapper = styled.header`
  background-color: #fff;
  border-bottom: 1px solid #eaeaea;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

// Container để giới hạn chiều rộng và căn giữa nội dung
const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  flex-shrink: 0;

  &:hover {
    color: #007bff;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  flex: 1;
  justify-content: center;

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #555;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #f0f0f0;
    color: #007bff;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Button = styled(Link)`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: none;
  text-align: center;

  &:hover {
    transform: translateY(-1px);
  }

  &.login {
    background-color: transparent;
    border: 1px solid #007bff;
    color: #007bff;

    &:hover {
      background-color: #007bff;
      color: white;
    }
  }

  &.signup {
    background-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
    }
  }
`;




const Header = () => {

  // 1. Thêm state để quản lý hiển thị dialog xác nhận
// eslint-disable-next-line no-undef,react-hooks/rules-of-hooks
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

// 2. Thêm hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xóa token hoặc thông tin đăng nhập trong localStorage
    localStorage.removeItem('token');
    // Chuyển hướng về trang chủ
    window.location.href = '/';
  };

  return (


  <HeaderWrapper>
      <HeaderContainer>
        <Logo href="/">RentalHouse</Logo>
        <Nav>
          <NavLink href="/cho-thue-can-ho">Căn hộ</NavLink>
          <NavLink href="/cho-thue-nha-pho">Nhà phố</NavLink>
          <NavLink href="/blog">Blog</NavLink>
        </Nav>
        <AuthButtons>
          <Link to="/login" className="login">Đăng nhập</Link>
          <Link to="/register" className="signup">Đăng ký</Link>

          <button
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
          >
            Đăng xuất
          </button>

        </AuthButtons>
        {/*3. Thêm dialog xác nhận*/}
        {showLogoutConfirm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p>Bạn có chắc chắn muốn đăng xuất?</p>
                <div style={{ marginTop: '20px' }}>
                  <button
                      onClick={handleLogout}
                      style={{
                        padding: '8px 16px',
                        margin: '0 10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                  >
                    Có
                  </button>
                  <button
                      onClick={() => setShowLogoutConfirm(false)}
                      style={{
                        padding: '8px 16px',
                        margin: '0 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
        )}

      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header;
