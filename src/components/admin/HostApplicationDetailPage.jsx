// Tạo file mới: src/components/admin/HostApplicationDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { hostApplicationsApi } from "../../api/adminApi";
import { RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react";

// === STYLED COMPONENTS (Lấy cảm hứng từ UserDetailPage) ===
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
const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  width: 100%;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const InfoCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.875rem 0;
  border-bottom: 1px solid #edf2f7;
  &:first-of-type {
    padding-top: 1rem;
  }
  &:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }
`;
const InfoLabel = styled.span`
  font-weight: 500;
  color: #4a5568;
`;
const InfoValue = styled.span`
  color: #1a202c;
  text-align: right;
  font-weight: 600;
`;
const ImageViewer = styled.div`
  margin-top: 1rem;
  border: 2px dashed #cbd5e0;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  background-color: #f7fafc;

  img {
    max-width: 100%;
    max-height: 400px;
    border-radius: 0.5rem;
    object-fit: contain;
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.02);
    }
  }
`;

const HostApplicationDetailPage = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!requestId) return;
      setLoading(true);
      try {
        const data = await hostApplicationsApi.getRequestDetails(requestId);
        setRequest(data);
      } catch (err) {
        setError("Không thể tải chi tiết đơn đăng ký.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequestDetails();
  }, [requestId]);

  if (loading)
    return (
      <PageWrapper>
        <RefreshCw className="spinner" /> Đang tải...
      </PageWrapper>
    );
  if (error)
    return (
      <PageWrapper>
        <AlertTriangle /> {error}
      </PageWrapper>
    );
  if (!request) return <PageWrapper>Không tìm thấy đơn đăng ký.</PageWrapper>;

  return (
    <PageWrapper>
      <PageHeader>
        <BackLink to="/admin/host-applications">
          <ArrowLeft size={20} />
          <span style={{ marginLeft: "0.5rem" }}>Quay lại danh sách đơn</span>
        </BackLink>
      </PageHeader>

      <Grid>
        <InfoCard>
          <Title>Thông tin người gửi</Title>
          <InfoRow>
            <InfoLabel>Họ và Tên</InfoLabel>
            <InfoValue>{request.fullName || request.username}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{request.userEmail}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Số điện thoại</InfoLabel>
            <InfoValue>{request.phone || "Chưa cung cấp"}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Số CCCD/CMT</InfoLabel>
            <InfoValue>{request.nationalId || "Chưa cung cấp"}</InfoValue>
          </InfoRow>
        </InfoCard>

        <InfoCard>
          <Title>Giấy tờ sở hữu</Title>
          {request.proofOfOwnershipUrl ? (
            <ImageViewer>
              <a
                href={request.proofOfOwnershipUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Mở ảnh trong tab mới"
              >
                <img src={request.proofOfOwnershipUrl} alt="Giấy tờ sở hữu" />
              </a>
            </ImageViewer>
          ) : (
            <p
              style={{
                color: "#718096",
                textAlign: "center",
                marginTop: "1rem",
              }}
            >
              Người dùng chưa cung cấp giấy tờ.
            </p>
          )}
        </InfoCard>
      </Grid>
    </PageWrapper>
  );
};

export default HostApplicationDetailPage;
