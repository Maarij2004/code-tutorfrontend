import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

// Storage keys for persistence
const STORAGE_KEYS = {
  CURRENT_CODE: 'codeTutor_currentCode',
  LANGUAGE: 'codeTutor_language',
  THEME: 'codeTutor_theme',
  FONT_SIZE: 'codeTutor_fontSize',
};

// Helper functions for localStorage
const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

interface CodeExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  memoryUsed: number;
  status: 'success' | 'error' | 'timeout';
  htmlContent?: string; // For HTML execution results
  transpiledCode?: string; // For React transpilation results
}

interface AIAnalysis {
  suggestions: string[];
  improvements: string[];
  score: number;
  feedback: string;
  correctedCode?: string;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  starterCode: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  xpReward: number;
  userProgress?: {
    completed: boolean;
    attempts: number;
  };
}

interface CodeState {
  currentCode: string;
  language: string;
  theme: string;
  fontSize: number;
  isExecuting: boolean;
  executionResult: CodeExecutionResult | null;
  aiAnalysis: AIAnalysis | null;
  currentChallenge: Challenge | null;
  challenges: Challenge[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CodeState = {
  currentCode: loadFromStorage(STORAGE_KEYS.CURRENT_CODE, ''),
  language: loadFromStorage(STORAGE_KEYS.LANGUAGE, 'javascript'),
  theme: loadFromStorage(STORAGE_KEYS.THEME, 'vs-dark'),
  fontSize: loadFromStorage(STORAGE_KEYS.FONT_SIZE, 14),
  isExecuting: false,
  executionResult: null,
  aiAnalysis: null,
  currentChallenge: null,
  challenges: [],
  isLoading: false,
  error: null,
};

export const executeCode = createAsyncThunk(
  'code/execute',
  async ({ code, language, input }: { code: string; language: string; input?: string }) => {
    const response = await api.post('/api/code/execute', { code, language, input });
    return response.data;
  }
);

export const analyzeCode = createAsyncThunk(
  'code/analyze',
  async ({ code, language }: { code: string; language: string }) => {
    const response = await api.post('/api/ai/analyze', { code, language });
    return response.data;
  }
);

export const fetchChallenges = createAsyncThunk(
  'code/fetchChallenges',
  async () => {
    const response = await api.get('/api/challenges');
    return response.data;
  }
);

export const submitChallenge = createAsyncThunk(
  'code/submitChallenge',
  async ({ challengeId, code, executionTime, xpReward }: { challengeId: number; code: string; executionTime?: number; xpReward?: number }) => {
    const response = await api.post(`/api/challenges/${challengeId}/submit`, {
      code,
      executionTime,
      xpReward
    });
    return response.data;
  }
);

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setCurrentCode: (state, action: PayloadAction<string>) => {
      state.currentCode = action.payload;
      saveToStorage(STORAGE_KEYS.CURRENT_CODE, action.payload);
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      saveToStorage(STORAGE_KEYS.LANGUAGE, action.payload);
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
      saveToStorage(STORAGE_KEYS.THEME, action.payload);
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload;
      saveToStorage(STORAGE_KEYS.FONT_SIZE, action.payload);
    },
    setCurrentChallenge: (state, action: PayloadAction<Challenge | null>) => {
      state.currentChallenge = action.payload;
      if (action.payload) {
        state.currentCode = action.payload.starterCode;
        state.language = action.payload.language;
      }
    },
    clearExecutionResult: (state) => {
      state.executionResult = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeCode.pending, (state) => {
        state.isExecuting = true;
        state.error = null;
      })
      .addCase(executeCode.fulfilled, (state, action) => {
        state.isExecuting = false;
        state.executionResult = action.payload;
      })
      .addCase(executeCode.rejected, (state, action) => {
        state.isExecuting = false;
        state.error = action.error.message || 'Code execution failed';
      })
      .addCase(analyzeCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.aiAnalysis = action.payload;
      })
      .addCase(analyzeCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'AI analysis failed';
      })
      .addCase(fetchChallenges.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.isLoading = false;
        state.challenges = action.payload;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch challenges';
      })
      .addCase(submitChallenge.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitChallenge.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update challenge progress if completed
        if (action.payload.completed && state.currentChallenge) {
          const challengeIndex = state.challenges.findIndex(c => c.id === state.currentChallenge?.id);
          if (challengeIndex !== -1) {
            const currentProgress = state.challenges[challengeIndex].userProgress || { completed: false, attempts: 0 };
            state.challenges[challengeIndex].userProgress = {
              ...currentProgress,
              completed: true,
              attempts: currentProgress.attempts + 1
            };
          }
        }
      })
      .addCase(submitChallenge.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Challenge submission failed';
      });
  },
});

export const {
  setCurrentCode,
  setLanguage,
  setTheme,
  setFontSize,
  setCurrentChallenge,
  clearExecutionResult,
  clearError,
} = codeSlice.actions;

export default codeSlice.reducer;
