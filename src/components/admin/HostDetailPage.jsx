import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { hostApplicationsApi } from "../../api/adminApi";
import { RefreshCw, AlertTriangle, ArrowLeft, User } from "lucide-react";
import { getHouseTypeLabel, getHouseStatusLabel } from "../../utils/constants";

// === STYLED COMPONENTS (Đồng bộ 100% với UserDetailPage) ===
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
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background-color: #f7fafc;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 8rem;
  height: 8rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 4px solid #e2e8f0;
  background-color: #f7fafc;
  overflow: hidden;
`;

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
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
  font-weight: 500;
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

const HousesCard = styled.div`
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
  margin: 0;
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

const NoDataMessage = styled.div`
  padding: 3rem;
  text-align: center;
  color: #718096;
`;

// Helper để format tiền tệ
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const HostDetailPage = () => {
  const { userId } = useParams(); // Lấy userId từ URL
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const fetchHostDetails = async () => {
      if (!userId) return;
      setLoading(true);
      setAvatarError(false);
      try {
        const data = await hostApplicationsApi.getHostDetailsByUserId(userId);
        console.log("Host data from backend:", data);
        console.log("Houses data:", data.houses);
        setHost(data);
      } catch (err) {
        console.error("Error fetching host details:", err);
        setError("Không thể tải thông tin chi tiết chủ nhà.");
      } finally {
        setLoading(false);
      }
    };
    fetchHostDetails();
  }, [userId]);

  if (loading) {
    return (
      <PageWrapper>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "4rem",
          }}
        >
          <RefreshCw className="spinner" />{" "}
          <span style={{ marginLeft: "0.5rem" }}>Đang tải...</span>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <AlertTriangle /> {error}
      </PageWrapper>
    );
  }

  if (!host) {
    return <PageWrapper>Không tìm thấy thông tin chủ nhà.</PageWrapper>;
  }

  return (
    <PageWrapper>
      <PageHeader>
        <BackLink to="/admin/host-management">
          <ArrowLeft size={20} />
          <span style={{ marginLeft: "0.5rem" }}>
            Quay lại danh sách chủ nhà
          </span>
        </BackLink>
      </PageHeader>
      <Grid>
        <MainInfoCard>
          <AvatarContainer>
            {!avatarError && host.avatarUrl && host.avatarUrl !== "/images/default-avatar.png" ? (
              <Avatar
                src={host.avatarUrl}
                alt={`Avatar của ${host.fullName || host.username || host.email}`}
                onError={() => setAvatarError(true)}
                onLoad={() => setAvatarError(false)}
              />
            ) : (
              <AvatarFallback>
                {host.fullName
                  ? host.fullName.charAt(0)
                  : host.username
                  ? host.username.charAt(0)
                  : host.email.charAt(0)}
              </AvatarFallback>
            )}
          </AvatarContainer>
          <Title as="h2" style={{ margin: "0 0 1.5rem 0", border: "none" }}>
            {host.fullName || "Chưa cập nhật"}
          </Title>

          <InfoRow>
            <InfoLabel>Họ và tên</InfoLabel>
            <InfoValue>{host.fullName || "Chưa cập nhật"}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{host.email}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Số điện thoại</InfoLabel>
            <InfoValue>{host.phone || "Chưa cập nhật"}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Địa chỉ</InfoLabel>
            <InfoValue>{host.address || "Chưa cập nhật"}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Trạng thái</InfoLabel>
            <InfoValue>
              {host.active ? (
                <Badge className="active">Hoạt động</Badge>
              ) : (
                <Badge className="locked">Đã khóa</Badge>
              )}
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Tổng doanh thu</InfoLabel>
            <InfoValue>{formatCurrency(host.totalRevenue)}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Số nhà đang cho thuê</InfoLabel>
            <InfoValue>{host.houses?.length || 0} nhà</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Số CCCD/CMT</InfoLabel>
            <InfoValue>{host.nationalId || "Chưa cập nhật"}</InfoValue>
          </InfoRow>
        </MainInfoCard>

        <HousesCard>
          <CardHeader>
            Danh sách nhà cho thuê ({host.houses?.length || 0})
          </CardHeader>
          {host.houses && host.houses.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>Tên nhà</th>
                  <th>Địa chỉ</th>
                  <th>Loại nhà</th>
                  <th>Trạng thái</th>
                  <th>Giá / tháng</th>
                </tr>
              </thead>
              <tbody>
                {host.houses.map((house) => (
                  <tr key={house.id}>
                                         <td>{house.title || "Không có tên"}</td>
                     <td>{house.address || "Chưa cập nhật"}</td>
                     <td>{getHouseTypeLabel(house.houseType) || "Không xác định"}</td>
                     <td>
                       {getHouseStatusLabel(house.status) || "Không xác định"}
                     </td>
                    <td>{formatCurrency(house.price)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <NoDataMessage>Chủ nhà này chưa có nhà cho thuê.</NoDataMessage>
          )}
        </HousesCard>
      </Grid>
    </PageWrapper>
  );
};

export default HostDetailPage;
