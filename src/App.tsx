import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import AskTutor from './pages/AskTutor';
import CodeEditor from './pages/CodeEditor';
import Challenges from './pages/Challenges';
import Tutorials from './pages/Tutorials';
import GameLearning from './pages/GameLearning';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Activities from './pages/Activities'; // Add this import

import Notes from './pages/Notes';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#64b5f6',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(144, 202, 249, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(144, 202, 249, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: '#90caf9',
            boxShadow: '0 8px 25px rgba(144, 202, 249, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
  },
});
function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard", { replace: true });
  }, []);

  return null;
}
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="ask-tutor" element={<AskTutor />} />
              <Route path="activities" element={<Activities />} /> {/* Add Activities route */}
              <Route path="tutorials" element={<Tutorials />} />
              <Route path="game-learning" element={<GameLearning />} />
              <Route path="editor" element={<CodeEditor />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="notes" element={<Notes />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
