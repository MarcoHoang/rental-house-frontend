import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const GoogleButtonContainer = styled.div`
  width: 100%;
  margin: 1rem 0;
`;

const GoogleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .google-icon {
    width: 18px;
    height: 18px;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #6b7280;
  font-size: 0.875rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }

  span {
    padding: 0 1rem;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const GoogleLoginButton = ({ onSuccess, onError, disabled = false }) => {
  const googleButtonRef = useRef(null);
  const [googleError, setGoogleError] = useState(null);

  useEffect(() => {
    // Load Google Identity Services script
    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleSignIn();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
        setGoogleError('Không thể tải Google Sign-In. Vui lòng thử lại sau.');
        onError?.(new Error('Failed to load Google Sign-In script'));
      };
      document.head.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      if (!window.google || !googleButtonRef.current) {
        console.error('Google API not available or button ref not ready');
        return;
      }

      try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ||
          '733951522739-l866o9ncig1ipqa5p15j5lod8l605m08.apps.googleusercontent.com';

        // Check if we're in development or production
        const currentOrigin = window.location.origin;
        const isLocalhost = currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1');
        
        console.log('Current origin:', currentOrigin);
        console.log('Is localhost:', isLocalhost);

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          // Add proper origin validation
          allowed_parent_origin: isLocalhost ? 'http://localhost:5173' : currentOrigin,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: '100%',
        });

        setGoogleError(null);
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        setGoogleError('Không thể khởi tạo Google Sign-In. Vui lòng thử lại sau.');
        onError?.(error);
      }
    };

    const handleCredentialResponse = (response) => {
      try {
        if (!response || !response.credential) {
          const error = new Error('Missing Google credential');
          setGoogleError('Không nhận được thông tin đăng nhập từ Google.');
          onError?.(error);
          return;
        }
        
        setGoogleError(null);
        onSuccess?.({ credential: response.credential });
      } catch (error) {
        console.error('Error handling Google credential:', error);
        setGoogleError('Có lỗi xảy ra khi xử lý thông tin đăng nhập.');
        onError?.(error);
      }
    };

    loadGoogleScript();

    // Cleanup
    return () => {
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.cancel();
        } catch (error) {
          console.error('Error during Google Sign-In cleanup:', error);
        }
      }
    };
  }, [onSuccess, onError]);

  return (
    <>
      <Divider>
        <span>hoặc</span>
      </Divider>
      <GoogleButtonContainer>
        <div ref={googleButtonRef}></div>
        {googleError && <ErrorMessage>{googleError}</ErrorMessage>}
      </GoogleButtonContainer>
    </>
  );
};

export default GoogleLoginButton; 