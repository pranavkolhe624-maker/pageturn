import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const GoogleSignInButton = ({ variant = 'default' }) => {
  const googleButtonRef = useRef(null);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Wait for Google SDK to be loaded
    const initializeGoogle = () => {
      if (window.google && googleButtonRef.current && !isInitialized) {
        try {
          // Clear previous button
          googleButtonRef.current.innerHTML = '';
          
          google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
          });

          // Render button with proper width settings
          google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              theme: 'outline',
              size: 'large',
              locale: 'en_US',
            }
          );
          
          setIsInitialized(true);
        } catch (error) {
          console.error('Google Sign-In initialization error:', error);
        }
      } else if (!window.google && !isInitialized) {
        // Retry if Google SDK not loaded yet
        setTimeout(initializeGoogle, 500);
      }
    };

    initializeGoogle();
  }, [isInitialized]);

  const handleGoogleResponse = async (response) => {
    try {
      setIsLoading(true);
      const result = await loginWithGoogle(response.credential);
      if (result) {
        toast.success('Google sign-in successful!');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to authenticate with Google. Make sure localhost:5173 is authorized in Google Cloud Console.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={googleButtonRef}
      className="flex justify-center w-full"
      style={{ minHeight: '44px' }}
    />
  );
};

export default GoogleSignInButton;

