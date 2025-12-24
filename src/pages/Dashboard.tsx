import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popover,
} from '@mui/material';
import {
  Code,
  EmojiEvents,
  TrendingUp,
  Whatshot,
  PlayArrow,
} from '@mui/icons-material';
import { RootState, useAppDispatch } from '../store';
import { fetchUserProgress, fetchLeaderboard } from '../store/slices/userSlice';
import { fetchChallenges } from '../store/slices/codeSlice';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { progress, leaderboard } = useSelector((state: RootState) => state.user);
  const { challenges } = useSelector((state: RootState) => state.code);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load data sequentially to avoid rate limiting
        await dispatch(fetchUserProgress());
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
        await dispatch(fetchLeaderboard());
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
        await dispatch(fetchChallenges());
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [dispatch]);

  const xpToNextLevel = progress ? (progress.level * 1000) - (progress.totalXP % 1000) : 1000;
  const currentLevelXP = progress ? progress.totalXP % 1000 : 0;

  const topPerformers = leaderboard.slice(0, 5);
  const availableChallenges = challenges.filter(c => !progress?.completedChallenges?.includes(c.id)).slice(0, 3);

  // Onboarding tour state
  const tourSteps = useMemo(() => [
    { id: 'dashboard', title: 'Dashboard overview', desc: 'Track XP, streak, achievements, and quick links to what is next.' },
    { id: 'ask-tutor', title: 'Ask Tutor', desc: 'Chat with the AI tutor for quick explanations, code snippets, or debugging help.' },
    { id: 'tutorials', title: 'Tutorials', desc: 'Read guided lessons to learn concepts before tackling challenges.' },
    { id: 'game-learning', title: 'Game Learning', desc: 'Learn with interactive game-style content to reinforce concepts.' },
    { id: 'editor', title: 'Code Editor', desc: 'Open the built-in editor to practice or solve challenges in one place.' },
    { id: 'challenges', title: 'Challenges', desc: 'Work through progressive challenges by language with XP rewards and completion tracking.' },
    { id: 'leaderboard', title: 'Leaderboard', desc: 'See top performers and compare progress with other learners.' },
    { id: 'notes', title: 'Notes', desc: 'Browse curated concept bullets and add/edit your own notes per language.' },
    { id: 'profile', title: 'Profile', desc: 'Manage your info, avatar, and view your achievements and stats.' },
  ], []);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem('dashboardTourSeen');
    if (!seen) {
      setShowTour(true);
    }
  }, []);

  useEffect(() => {
    if (!showTour) {
      setAnchorEl(null);
      return;
    }
    const targetId = tourSteps[tourStep]?.id;
    if (!targetId) return;
    // Delay selection slightly to ensure the drawer items are mounted
    const timeout = setTimeout(() => {
      const el = document.querySelector(`[data-tour-id="${targetId}"]`) as HTMLElement | null;
      setAnchorEl(el);
    }, 50);
    return () => clearTimeout(timeout);
  }, [showTour, tourStep, tourSteps]);

  const closeTour = () => {
    localStorage.setItem('dashboardTourSeen', 'true');
    setShowTour(false);
    setAnchorEl(null);
  };

  const restartTour = () => {
    localStorage.removeItem('dashboardTourSeen');
    setTourStep(0);
    setShowTour(true);
  };

  const handleNext = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep((prev) => prev + 1);
    } else {
      closeTour();
    }
  };

  const handleBack = () => {
    setTourStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Box sx={{
      flexGrow: 1,
      minHeight: '100vh',
      backgroundColor: '#121212',
      color: 'white',
      p: 3,
      '& .MuiCard-root': {
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(144, 202, 249, 0.1)',
        color: 'white',
      },
      '& .MuiTypography-root': {
        color: 'white',
      },
      '@keyframes fadeInUp': {
        '0%': { transform: 'translateY(30px)', opacity: 0 },
        '100%': { transform: 'translateY(0)', opacity: 1 },
      },
    }}>
      <Typography variant="h4" gutterBottom sx={{
        mb: 4,
        fontWeight: 'bold',
        background: 'linear-gradient(45deg, #90caf9, #f48fb1)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 20px rgba(144, 202, 249, 0.3)',
        animation: 'fadeInUp 0.8s ease-out'
      }}>
        Welcome back, {user?.username}!
      </Typography>

      <Grid container spacing={3}>
        {/* Progress Overview */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Level {progress?.level || 1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentLevelXP} / 1000 XP to next level
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(currentLevelXP / 1000) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Total XP: {progress?.totalXP || 0}
              </Typography>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Code sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" color="primary">
                    {progress?.completedChallenges?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Challenges Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Whatshot sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                  <Typography variant="h4" color="error.main">
                    {progress?.streak || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Day Streak
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <EmojiEvents sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" color="warning.main">
                    {progress?.achievements?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Achievements
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Leaderboard Preview */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performers
              </Typography>
              <List>
                {topPerformers.map((performer, index) => (
                  <ListItem key={performer.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={performer.username}
                      secondary={`Level ${performer.level}`}
                    />
                  </ListItem>
                ))}
              </List>

            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Onboarding Tour Popover (points to sidebar items) */}
      <Popover
        open={showTour && Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closeTour}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        PaperProps={{
          sx: {
            maxWidth: 320,
            p: 2,
            bgcolor: 'rgba(30,30,30,0.95)',
            border: '1px solid rgba(144, 202, 249, 0.2)',
            color: 'white',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: -8,
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderRight: '8px solid rgba(30,30,30,0.95)',
            },
          },
        }}
      >
        <Typography variant="overline" color="primary.light">
          Quick Tour ({tourStep + 1} / {tourSteps.length})
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, mb: 1 }}>
          {tourSteps[tourStep].title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'grey.200' }}>
          {tourSteps[tourStep].desc}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
          <Button size="small" onClick={closeTour}>Skip</Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" onClick={handleBack} disabled={tourStep === 0}>Back</Button>
            <Button size="small" variant="contained" onClick={handleNext}>
              {tourStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Fallback dialog if no anchor is found */}
      <Dialog open={showTour && !anchorEl} onClose={closeTour} maxWidth="sm" fullWidth>
        <DialogTitle>
          Quick Tour ({tourStep + 1} / {tourSteps.length})
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>
            {tourSteps[tourStep].title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {tourSteps[tourStep].desc}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTour}>Skip</Button>
          <Button onClick={handleBack} disabled={tourStep === 0}>
            Back
          </Button>
          <Button variant="contained" onClick={handleNext}>
            {tourStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating help button to start tour */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={restartTour}
          sx={{
            minWidth: 48,
            width: 56,
            height: 56,
            borderRadius: '50%',
            p: 0,
            boxShadow: '0 6px 20px rgba(144, 202, 249, 0.35)',
            fontSize: 24,
            fontWeight: 'bold',
          }}
          aria-label="Start tour"
        >
          ?
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
