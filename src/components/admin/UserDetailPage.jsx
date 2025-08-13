// Tạo file mới: src/pages/admin/UserDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { usersApi } from "../../api/adminApi";
import { RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react";

// === STYLED COMPONENTS (có thể tách ra file riêng nếu muốn) ===
const PageWrapper = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  &:hover {
    color: #2c5282;
  }
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: #2d3748;
  margin-left: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MainInfoCard = styled.div`
  grid-column: span 1;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.img`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
  border: 4px solid #e2e8f0;
`;

const InfoRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #edf2f7;
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #4a5568;
`;

const InfoValue = styled.span`
  color: #2d3748;
  text-align: right;
`;

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  &.active {
    background-color: #c6f6d5;
    color: #22543d;
  }
  &.locked {
    background-color: #fed7d7;
    color: #742a2a;
  }
`;

const HistoryCard = styled.div`
  grid-column: span 1;
  @media (min-width: 1024px) {
    grid-column: span 2;
  }
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  th {
    background-color: #f7fafc;
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const NoHistory = styled.div`
  padding: 3rem;
  text-align: center;
  color: #718096;
`;

// Helper để format tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper để format ngày
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const UserDetailPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await usersApi.getById(userId);
        setUser(data);
      } catch (err) {
        setError("Không thể tải thông tin chi tiết người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return (
      <div>
        <RefreshCw className="spinner" /> Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AlertTriangle /> {error}
      </div>
    );
  }

  if (!user) {
    return <div>Không tìm thấy người dùng.</div>;
  }

  return (
    <PageWrapper>
      <PageHeader>
        <BackLink to="/admin/user-management">
          <ArrowLeft size={20} />
          <span style={{ marginLeft: "0.5rem" }}>Quay lại danh sách</span>
        </BackLink>
      </PageHeader>
      <Grid>
        <MainInfoCard>
          <Avatar
            src={user.avatarUrl || "/images/default-avatar.png"}
            alt="Avatar"
          />
          <Title style={{ margin: "0 0 1.5rem 0" }}>
            {user.fullName || "Chưa cập nhật"}
          </Title>

          <InfoRow>
            <InfoLabel>Username</InfoLabel>
            <InfoValue>{user.username}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{user.email}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Số điện thoại</InfoLabel>
            <InfoValue>{user.phone || "Chưa cập nhật"}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Trạng thái</InfoLabel>
            <InfoValue>
              {user.active ? (
                <Badge className="active">Hoạt động</Badge>
              ) : (
                <Badge className="locked">Khóa</Badge>
              )}
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Tổng chi tiêu</InfoLabel>
            <InfoValue>{formatCurrency(user.totalSpent || 0)}</InfoValue>
          </InfoRow>
        </MainInfoCard>

        <HistoryCard>
          <CardHeader>Lịch sử thuê nhà</CardHeader>
          {user.rentalHistory && user.rentalHistory.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>Tên nhà</th>
                  <th>Ngày nhận</th>
                  <th>Ngày trả</th>
                  <th>Chi phí</th>
                </tr>
              </thead>
              <tbody>
                {user.rentalHistory.map((rental, index) => (
                  <tr key={index}>
                    <td>{rental.houseName}</td>
                    <td>{formatDate(rental.checkinDate)}</td>
                    <td>{formatDate(rental.checkoutDate)}</td>
                    <td>{formatCurrency(rental.price)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <NoHistory>Chưa có lịch sử thuê nhà.</NoHistory>
          )}
        </HistoryCard>
      </Grid>
    </PageWrapper>
  );
};

export default UserDetailPage;
