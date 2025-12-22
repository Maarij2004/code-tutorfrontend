import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { sendVerification, verifyEmail, clearVerification } from '../store/slices/authSlice';
import { Celebration, Email } from '@mui/icons-material';

interface EmailVerificationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EmailVerificationDialog: React.FC<EmailVerificationDialogProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const dispatch = useAppDispatch();
  const { isLoading, error, pendingVerificationEmail, fallbackOtp } = useSelector(
    (state: RootState) => state.auth
  );

  const [otp, setOtp] = useState(fallbackOtp || '');
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  // Update OTP if fallbackOtp changes
  useEffect(() => {
    if (fallbackOtp && !otp) {
      setOtp(fallbackOtp);
    }
  }, [fallbackOtp, otp]);

  const handleSendVerification = async () => {
    if (!pendingVerificationEmail) return;

    try {
      await dispatch(sendVerification(pendingVerificationEmail)).unwrap();
      setVerificationSent(true);
      setResendCountdown(60); // 60 seconds countdown

      // Start countdown timer
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleVerifyEmail = async () => {
    if (!pendingVerificationEmail || !otp.trim()) return;

    try {
      console.log('Verifying email:', pendingVerificationEmail, 'with OTP:', otp.trim());
      const result = await dispatch(verifyEmail({
        email: pendingVerificationEmail,
        otp: otp.trim()
      })).unwrap();

      console.log('Verification successful:', result);
      // Success - clear verification state
      dispatch(clearVerification());
      setOtp('');
      setVerificationSent(false);
      
      // Small delay to ensure state is updated before redirect
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 100);
    } catch (error: any) {
      console.error('Verification error:', error);
      // Error is handled by the slice and will be displayed in the error Alert
    }
  };

  const handleClose = () => {
    dispatch(clearVerification());
    setOtp('');
    setVerificationSent(false);
    setResendCountdown(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <Email />
        Verify Your Email
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {fallbackOtp ? (
          <>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Email service unavailable (Development Mode)
              </Typography>
              <Typography variant="body2">
                We couldn't send the verification email, but here's your verification code:
              </Typography>
            </Alert>
            <Box sx={{
              p: 2,
              bgcolor: 'primary.light',
              borderRadius: 2,
              textAlign: 'center',
              mb: 3
            }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                Your Verification Code:
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', letterSpacing: 2, color: 'primary.main' }}>
                {fallbackOtp}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Email: <strong>{pendingVerificationEmail}</strong>
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We've sent a verification code to:
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              {pendingVerificationEmail}
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Enter the 6-digit code from your email to verify your account.
            </Typography>
          </>
        )}

        <TextField
          fullWidth
          label="Verification Code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter 6-digit code"
          inputProps={{ maxLength: 6 }}
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {verificationSent && !error && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Verification code sent! Check your email.
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={handleSendVerification}
            disabled={isLoading || resendCountdown > 0}
            size="small"
          >
            {resendCountdown > 0
              ? `Resend in ${resendCountdown}s`
              : verificationSent
                ? 'Resend Code'
                : 'Send Code'
            }
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleVerifyEmail}
          disabled={isLoading || otp.length !== 6}
          startIcon={isLoading ? <CircularProgress size={16} /> : <Celebration />}
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailVerificationDialog;
