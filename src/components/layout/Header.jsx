import styled from "styled-components";

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

const NavLink = styled.a`
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

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  white-space: nowrap;

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
          <Button className="login">Đăng nhập</Button>
          <Button className="signup">Đăng ký</Button>
        </AuthButtons>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header;
