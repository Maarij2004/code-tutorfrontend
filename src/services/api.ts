import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://tgeazxxujp.ap-south-1.awsapprunner.com/';

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Ask tutor a question
  askTutor: async (question: string, context?: string, language?: string) => {
    const response = await axios.post('/api/ai/tutor', {
      question,
      context,
      language,
    });
    return response.data;
  },

  // Analyze code
  analyzeCode: async (code: string, language: string) => {
    const response = await axios.post('/api/ai/analyze', {
      code,
      language,
    });
    return response.data;
  },

  // Get AI recommendations
  getRecommendations: async () => {
    const response = await axios.get('/api/ai/recommendations');
    return response.data;
  },

  // Evaluate challenge code
  evaluateChallenge: async (challengeId: number, code: string, language: string, title?: string, description?: string, difficulty?: string) => {
    const response = await axios.post('/api/code/evaluate-challenge', {
      challengeId,
      code,
      language,
      title,
      description,
      difficulty,
    });
    return response.data;
  },

  // Email verification methods
  sendVerification: async (email: string) => {
    const response = await axios.post('/api/auth/send-verification', { email });
    return response.data;
  },

  verifyEmail: async (email: string, otp: string) => {
    const response = await axios.post('/api/auth/verify-email', { email, otp });
    return response.data;
  },

  // Password reset methods
  forgotPassword: async (email: string) => {
    const response = await axios.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const response = await axios.post('/api/auth/reset-password', {
      email,
      otp,
      newPassword
    });
    return response.data;
  },

  // Game Learning API methods
  gameLearning: {
    // Get list of available tutorials
    getTutorials: async () => {
      const response = await axios.get('/api/learn/tutorials');
      return response.data;
    },

    // Get tutorial data for specific tutorial and language
    getTutorial: async (tutorialId: string, language: string) => {
      const response = await axios.get(`/api/learn/tutorial/${tutorialId}?language=${language}`);
      return response.data;
    },

    // Execute game code
    executeGameCode: async (code: string, language: string) => {
      const response = await axios.post('/api/learn/execute-game-code', {
        code,
        language,
      });
      return response.data;
    },

    // Mark tutorial step as completed
    completeTutorialStep: async (tutorialId: string, stepNumber: number, language: string) => {
      const response = await axios.post(`/api/learn/tutorial/${tutorialId}/step/${stepNumber}/complete?language=${language}`);
      return response.data;
    },
  },
};

export default axios;
