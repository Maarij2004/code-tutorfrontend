import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch } from '../store';
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
} from '@mui/material';
import { loginSuccess, initializeAuth } from '../store/slices/authSlice';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const redirect = urlParams.get('redirect') || 'dashboard';
        const error = urlParams.get('error');

        if (error) {
          console.error('OAuth error:', error);
          navigate('/', { replace: true });
          return;
        }

        if (token) {
          // Store token and initialize auth state
          localStorage.setItem('token', token);

          // Initialize auth by fetching complete user profile
          try {
            await dispatch(initializeAuth()).unwrap();
            // Navigate to dashboard after successful auth initialization
            navigate(`/${redirect}`, { replace: true });
          } catch (error) {
            console.error('Failed to initialize auth:', error);
            localStorage.removeItem('token');
            navigate('/', { replace: true });
          }
        } else {
          console.error('No token received from OAuth');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, dispatch]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
      }}
    >
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(144, 202, 249, 0.2)',
        }}
      >
        <CircularProgress sx={{ mb: 2, color: '#90caf9' }} />
        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
          Signing you in...
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(176, 176, 176, 0.8)' }}>
          Please wait while we complete your authentication
        </Typography>
      </Paper>
    </Box>
  );
};

export default AuthCallback;
