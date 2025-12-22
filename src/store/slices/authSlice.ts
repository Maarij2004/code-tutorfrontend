import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api, { apiService } from '../../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  totalXP: number;
  streak: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  requiresVerification: boolean;
  pendingVerificationEmail: string | null;
  fallbackOtp: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  requiresVerification: false,
  pendingVerificationEmail: null,
  fallbackOtp: null,
};

export const sendVerification = createAsyncThunk(
  'auth/sendVerification',
  async (email: string) => {
    const response = await apiService.sendVerification(email);
    return response.data;
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.verifyEmail(email, otp);
      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || 'Email verification failed';
      return rejectWithValue({ error: errorMessage });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/register', { username, email, password });
      return response.data;
    } catch (error: any) {
      // Extract error message from response
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      console.log('Registration catch error:', {
        response: error.response?.data,
        message: errorMessage,
        fullError: error
      });
      return rejectWithValue({ error: errorMessage });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string) => {
    const response = await apiService.forgotPassword(email);
    return response.data;
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, otp, newPassword }: { email: string; otp: string; newPassword: string }) => {
    const response = await apiService.resetPassword(email, otp, newPassword);
    return response.data;
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await api.get('/api/user/profile');
      return response.data;
    } catch (error: any) {
      localStorage.removeItem('token');
      return rejectWithValue('Invalid token');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    clearVerification: (state) => {
      state.requiresVerification = false;
      state.pendingVerificationEmail = null;
      state.fallbackOtp = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.requiresVerification) {
          // Email verification required
          state.requiresVerification = true;
          state.pendingVerificationEmail = action.payload.email;
          // Store OTP if email failed (development mode)
          state.fallbackOtp = action.payload.otp || null;
          state.error = null;
        } else {
          // Direct login (fallback for Google OAuth or other flows)
          state.user = action.payload.user;
          state.token = action.payload.token;
          if (action.payload.token) {
            localStorage.setItem('token', action.payload.token);
          }
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        // Extract error message from response if available
        // When using rejectWithValue, payload contains the error
        // When not using rejectWithValue, error.message contains the error
        const errorMessage = (action.payload as any)?.error || 
                           (action.error as any)?.message || 
                           action.error?.toString() ||
                           'Registration failed';
        state.error = errorMessage;
        console.log('Registration error:', { payload: action.payload, error: action.error, message: errorMessage });
      })
      .addCase(sendVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendVerification.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send verification email';
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requiresVerification = false;
        state.pendingVerificationEmail = null;
        state.error = null;
        
        // Auto-login if token is provided
        if (action.payload.token && action.payload.user) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        const errorMessage = (action.payload as any)?.error || action.error.message || 'Email verification failed';
        state.error = errorMessage;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = localStorage.getItem('token');
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const { logout, clearError, loginSuccess, clearVerification, updateUser } = authSlice.actions;
export default authSlice.reducer;
