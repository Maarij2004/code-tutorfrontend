import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Code,
} from '@mui/icons-material';
import { RootState, useAppDispatch } from '../store';
import { register, clearError, clearVerification } from '../store/slices/authSlice';
import EmailVerificationDialog from '../components/EmailVerificationDialog';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, token, requiresVerification, pendingVerificationEmail } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeToTerms' ? checked : value,
    });

    // Clear password error when user types
    if (name === 'confirmPassword' || name === 'password') {
      setPasswordError('');
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }

    if (!formData.agreeToTerms) {
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 2.5,
          width: '100%',
          maxWidth: 450,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
            <Code sx={{ fontSize: 36, color: 'primary.main', mr: 1 }} />
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.5rem' }}>
              Code Tutor AI
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
            Start Your Coding Journey
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2, fontSize: '1.25rem' }}>
          Create Your Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            size="small"
            sx={{ mb: 1.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            size="small"
            sx={{ mb: 1.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            size="small"
            sx={{ mb: 1.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={!!passwordError}
            helperText={passwordError}
            size="small"
            sx={{ mb: 1.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                color="primary"
                size="small"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                I agree to the{' '}
                <Link
                  to="#"
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                  }}
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="#"
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                  }}
                >
                  Privacy Policy
                </Link>
              </Typography>
            }
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="medium"
            disabled={isLoading || !formData.agreeToTerms}
            sx={{
              mb: 1.5,
              py: 1,
              borderRadius: 2,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
              },
            }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            or
          </Typography>
        </Divider>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#1976d2',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Sign in here
            </Link>
          </Typography>
        </Box>

        <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: '0.8rem' }}>
            🎓 Join thousands of developers learning with AI-powered tutoring and interactive challenges!
          </Typography>
        </Box>
      </Paper>

      <EmailVerificationDialog
        open={requiresVerification}
        onClose={() => {
          dispatch(clearVerification());
        }}
        onSuccess={() => {
          // After successful verification, redirect to dashboard
          // The token is set in authSlice, and useEffect will also trigger redirect
          setTimeout(() => {
            navigate('/dashboard');
          }, 200);
        }}
      />
    </Box>
  );
};

export default Register;
