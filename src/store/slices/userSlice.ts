import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  xpReward: number;
}

interface UserProgress {
  totalXP: number;
  level: number;
  streak: number;
  completedChallenges: (number | string)[]; // Can contain both integer tutorial IDs and string challenge ObjectIds
  achievements: Achievement[];
  learningPath: string[];
  weakAreas: string[];
}

interface LeaderboardEntry {
  id: number;
  username: string;
  avatar?: string;
  level: number;
  totalXP: number;
  rank: number;
}

interface UserState {
  progress: UserProgress | null;
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  progress: null,
  leaderboard: [],
  isLoading: false,
  error: null,
};

export const fetchUserProgress = createAsyncThunk(
  'user/fetchProgress',
  async () => {
    const response = await api.get('/api/user/progress');
    return response.data;
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'user/fetchLeaderboard',
  async () => {
    const response = await api.get('/api/user/leaderboard');
    return response.data;
  }
);

export const updateXP = createAsyncThunk(
  'user/updateXP',
  async (xpGained: number) => {
    const response = await api.post('/api/user/xp', { xpGained });
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.progress = action.payload;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch progress';
      })
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch leaderboard';
      })
      .addCase(updateXP.fulfilled, (state, action) => {
        if (state.progress) {
          state.progress.totalXP = action.payload.totalXP;
          state.progress.level = action.payload.level;
        }
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
