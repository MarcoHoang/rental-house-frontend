import React, { useState } from "react";
import styled from "styled-components";
import authService from "../api/authService";
import { useToast } from "../components/common/Toast";
import Avatar from "../components/common/Avatar";
import { testAvatarUpload } from "../utils/uploadTest";

const TestContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TestSection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const Title = styled.h2`
  color: #1f2937;
  margin-bottom: 1rem;
`;

const FileInput = styled.input`
  margin: 1rem 0;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  margin: 0.5rem 0.5rem 0.5rem 0;

  &:hover {
    background-color: #4338ca;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const AvatarDisplay = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  align-items: center;
`;

const AvatarTestPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedAvatar, setUploadedAvatar] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showError("Lỗi", "Vui lòng chọn file trước khi upload");
      return;
    }

    setIsUploading(true);
    try {
      // Thử test upload trước
      console.log("=== STARTING UPLOAD TEST ===");
      const testResult = await testAvatarUpload(selectedFile);

      if (testResult) {
        console.log("Test upload successful:", testResult);
        // Nếu test thành công, thử upload chính thức
        const result = await authService.uploadAvatar(selectedFile);

        if (result.success) {
          setUploadedAvatar(result.data.fileUrl);
          showSuccess(
            "Upload thành công!",
            `File đã được upload: ${result.data.fileName}`
          );
        } else {
          throw new Error(result.message || "Upload thất bại");
        }
      } else {
        throw new Error(
          "Test upload thất bại - kiểm tra console để xem chi tiết"
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      showError(
        "Upload thất bại!",
        error.message || "Có lỗi xảy ra khi upload file"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const testAvatars = [
    null,
    "https://via.placeholder.com/150/cccccc/666666?text=User",
    "avatar/test.jpg",
    "http://localhost:8080/api/files/avatar/test.jpg",
    "https://via.placeholder.com/150",
    "invalid-url",
  ];

  return (
    <TestContainer>
      <Title>Test Avatar Upload & Display</Title>

      <TestSection>
        <h3>Upload Avatar</h3>
        <FileInput type="file" accept="image/*" onChange={handleFileSelect} />
        <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
          {isUploading ? "Đang upload..." : "Upload Avatar"}
        </Button>
        <Button
          onClick={async () => {
            if (!selectedFile) {
              showError("Lỗi", "Vui lòng chọn file trước khi test");
              return;
            }
            console.log("=== TESTING UPLOAD ONLY ===");
            await testAvatarUpload(selectedFile);
          }}
          disabled={!selectedFile}
          style={{ backgroundColor: "#10b981" }}
        >
          Test Upload Only
        </Button>

        {selectedFile && (
          <div>
            <p>File đã chọn: {selectedFile.name}</p>
            <p>Kích thước: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}

        {uploadedAvatar && (
          <div>
            <p>Avatar đã upload: {uploadedAvatar}</p>
            <Avatar
              src={uploadedAvatar}
              alt="Uploaded Avatar"
              size="100px"
              name="Test User"
            />
          </div>
        )}
      </TestSection>

      <TestSection>
        <h3>Test Avatar Display</h3>
        <p>Test các trường hợp hiển thị avatar khác nhau:</p>

        {testAvatars.map((avatar, index) => (
          <AvatarDisplay key={index}>
            <span style={{ minWidth: "120px" }}>{avatar || "null"}:</span>
            <Avatar
              src={avatar}
              alt={`Test ${index}`}
              size="50px"
              name={`User ${index + 1}`}
            />
          </AvatarDisplay>
        ))}
      </TestSection>

      <TestSection>
        <h3>Test Avatar với tên khác nhau</h3>
        <AvatarDisplay>
          <span>Nguyễn Văn A:</span>
          <Avatar
            src={null}
            alt="Nguyễn Văn A"
            size="50px"
            name="Nguyễn Văn A"
          />
        </AvatarDisplay>
        <AvatarDisplay>
          <span>John Doe:</span>
          <Avatar src={null} alt="John Doe" size="50px" name="John Doe" />
        </AvatarDisplay>
        <AvatarDisplay>
          <span>Maria Garcia:</span>
          <Avatar
            src={null}
            alt="Maria Garcia"
            size="50px"
            name="Maria Garcia"
          />
        </AvatarDisplay>
      </TestSection>
    </TestContainer>
  );
};

export default AvatarTestPage;
