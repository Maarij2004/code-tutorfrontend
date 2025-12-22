import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Modal,
  TextField,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  Code,
  EmojiEvents,
  MenuBook,
  PlayArrow,
  CheckCircle,
  Star,
  SmartToy,
  Code as CodeIcon,
  Email,
  Lock,
  Person,
  Close,
  ArrowForward,
  TrendingUp,
  School,
  Build,
  Speed,
  Security,
} from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import { login, register, clearVerification } from '../store/slices/authSlice';
import EmailVerificationDialog from '../components/EmailVerificationDialog';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { requiresVerification, pendingVerificationEmail } = useSelector((state: RootState) => state.auth);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartNow = () => {
    setAuthModalOpen(true);
    setIsSignUp(true);
  };

  const handleSignIn = () => {
    setAuthModalOpen(true);
    setIsSignUp(false);
  };

  const handleCloseModal = () => {
    setAuthModalOpen(false);
    setError('');
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (!formData.username || !formData.email || !formData.password) {
          setError('All fields are required');
          setIsLoading(false);
          return;
        }

        // Handle signup
        try {
          const result = await dispatch(register({
            username: formData.username,
            email: formData.email,
            password: formData.password
          })).unwrap();

          if (result.requiresVerification) {
            // Email verification required - keep modal open for verification
            setError('');
          } else {
            // Direct login (fallback)
            setAuthModalOpen(false);
            navigate('/dashboard');
          }
        } catch (error: any) {
          // Extract error message from rejectWithValue payload
          const errorMessage = error?.error || error?.message || error?.toString() || 'Registration failed';
          setError(errorMessage);
        }
      } else {
        if (!formData.email || !formData.password) {
          setError('Email and password are required');
          setIsLoading(false);
          return;
        }

        // Handle signin
        try {
          await dispatch(login({
            email: formData.email,
            password: formData.password
          })).unwrap();
          setAuthModalOpen(false);
          navigate('/dashboard');
        } catch (error: any) {
          setError(error?.message || 'Login failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <SmartToy sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI-Powered Tutor',
      description: 'Get instant help from our advanced AI coding tutor. Ask questions, get explanations, and learn at your own pace.',
    },
    {
      icon: <Code sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Interactive Challenges',
      description: 'Solve coding challenges with increasing difficulty. Track your progress and earn XP as you improve.',
    },
    {
      icon: <PlayArrow sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Live Code Compiler',
      description: 'Write, run, and debug code in real-time. Support for multiple programming languages with instant feedback.',
    },
    {
      icon: <MenuBook sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Comprehensive Tutorials',
      description: 'Learn from structured tutorials covering everything from basics to advanced concepts in multiple languages.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed statistics, achievements, and personalized recommendations.',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Gamified Learning',
      description: 'Stay motivated with levels, streaks, badges, and a competitive leaderboard system.',
    },
  ];


  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <AppBar position="static" sx={{
        backgroundColor: '#0d0d0d',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              animation: 'slideInLeft 0.8s ease-out'
            }}>
              <Code sx={{
                fontSize: 32,
                color: 'primary.main',
                mr: 1,
                animation: 'glow 2s ease-in-out infinite alternate'
              }} />
              <Typography variant="h6" sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                textShadow: '0 0 10px rgba(144, 202, 249, 0.5)'
              }}>
                Code Tutor AI
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button variant="contained" onClick={handleStartNow}>
                Start Now
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        color: 'white',
        py: 12,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(144, 202, 249, 0.05) 0%, transparent 70%)',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        '@keyframes slideInLeft': {
          '0%': { transform: 'translateX(-50px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        '@keyframes glow': {
          '0%': { filter: 'drop-shadow(0 0 5px rgba(144, 202, 249, 0.5))' },
          '100%': { filter: 'drop-shadow(0 0 15px rgba(144, 202, 249, 0.8))' },
        },
        '@keyframes fadeInUp': {
          '0%': { transform: 'translateY(30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        '@keyframes pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(144, 202, 249, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(144, 202, 249, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(144, 202, 249, 0)' },
        },
        '@keyframes bounce': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        '@keyframes modalFadeIn': {
          '0%': { opacity: 0, transform: 'scale(0.8) translateY(-20px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
      }}
    >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} sx={{
              animation: 'fadeInUp 1s ease-out 0.2s both'
            }}>
              <Typography variant="h2" gutterBottom sx={{
                fontWeight: 'bold',
                mb: 3,
                color: '#90caf9',
              }}>
                Master Coding with AI-Powered Learning
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Learn to code faster with personalized AI tutoring, interactive challenges,
                and real-time code compilation. Join thousands of developers on their coding journey.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleStartNow}
                sx={{
                  backgroundColor: '#90caf9',
                  color: '#0a0a0a',
                  '&:hover': {
                    backgroundColor: '#64b5f6',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(144, 202, 249, 0.3)',
                  },
                  px: 4,
                  py: 1.5,
                  animation: 'pulse 2s infinite',
                }}
                endIcon={<ArrowForward />}
              >
                Start Learning Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#90caf9',
                  color: '#90caf9',
                  '&:hover': {
                    borderColor: '#64b5f6',
                    backgroundColor: 'rgba(144, 202, 249, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  px: 4,
                  py: 1.5,
                  ml: 2,
                }}
              >
                Watch Demo
              </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{
              animation: 'fadeInUp 1s ease-out 0.4s both'
            }}>
              <Box
                sx={{
                  backgroundColor: 'rgba(26, 26, 26, 0.8)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(144, 202, 249, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  maxWidth: 400,
                  mx: 'auto',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  🚀 What You'll Learn
                </Typography>
                <List>
                  {['Html & CSS', 'Python', 'JS', 'C++', 'React', 'Typescript'].map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                        <CheckCircle sx={{ color: '#4caf50' }} />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8, backgroundColor: '#0a0a0a' }}>
        <Typography variant="h3" align="center" gutterBottom sx={{
          fontWeight: 'bold',
          mb: 6,
          color: '#90caf9',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          Why Choose Code Tutor AI?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index} sx={{
              animation: `fadeInUp 0.8s ease-out ${0.2 * index}s both`
            }}>
              <Card sx={{
                height: '100%',
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(144, 202, 249, 0.1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(144, 202, 249, 0.2)',
                  borderColor: '#90caf9',
                }
              }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2, animation: 'bounce 2s infinite' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(176, 176, 176, 0.8)' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Challenges Preview */}
      <Box sx={{
        backgroundColor: '#1a1a1a',
        py: 8,
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{
            fontWeight: 'bold',
            mb: 6,
            color: '#90caf9',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            Interactive Coding Challenges
          </Typography>
          <Grid container spacing={3}>
            {[
              { level: 'Beginner', title: 'Hello World', language: 'JavaScript', difficulty: 'Easy', xp: 25 },
              { level: 'Intermediate', title: 'Binary Search', language: 'Python', difficulty: 'Medium', xp: 75 },
              { level: 'Advanced', title: 'React Todo App', language: 'React', difficulty: 'Hard', xp: 150 },
            ].map((challenge, index) => (
              <Grid item xs={12} md={4} key={index} sx={{
                animation: `fadeInUp 0.8s ease-out ${0.2 * index}s both`
              }}>
                <Card sx={{
                  height: '100%',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid rgba(144, 202, 249, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(144, 202, 249, 0.2)',
                    borderColor: '#90caf9',
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip
                        label={challenge.level}
                        sx={{
                          backgroundColor: 'rgba(144, 202, 249, 0.2)',
                          color: '#90caf9',
                          border: '1px solid rgba(144, 202, 249, 0.3)'
                        }}
                        size="small"
                      />
                      <Chip
                        label={challenge.difficulty}
                        sx={{
                          backgroundColor:
                            challenge.difficulty === 'Easy' ? 'rgba(76, 175, 80, 0.2)' :
                            challenge.difficulty === 'Medium' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                          color:
                            challenge.difficulty === 'Easy' ? '#4caf50' :
                            challenge.difficulty === 'Medium' ? '#ff9800' : '#f44336',
                          border: `1px solid ${
                            challenge.difficulty === 'Easy' ? 'rgba(76, 175, 80, 0.3)' :
                            challenge.difficulty === 'Medium' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(244, 67, 54, 0.3)'
                          }`
                        }}
                        size="small"
                      />
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                      {challenge.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(176, 176, 176, 0.8)', mb: 2 }}>
                      {challenge.language}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Star sx={{ color: '#ff9800', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" sx={{ color: '#90caf9' }}>
                        +{challenge.xp} XP
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      {/* Pricing Section */}
      <Box sx={{
        backgroundColor: '#0a0a0a',
        py: 8,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(144, 202, 249, 0.03) 0%, transparent 70%)',
        }
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{
            fontWeight: 'bold',
            mb: 2,
            color: '#90caf9',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            Choose Your Learning Plan
          </Typography>
          <Typography variant="h6" align="center" sx={{
            mb: 6,
            color: 'rgba(176, 176, 176, 0.8)',
            animation: 'fadeInUp 0.8s ease-out 0.1s both'
          }}>
            Start free and upgrade as you grow. All plans include AI tutoring and interactive challenges.
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {[
              {
                name: 'Starter',
                price: 'Free',
                period: '',
                description: 'Perfect for beginners',
                features: [
                  '5 AI tutoring sessions',
                  'Basic challenges',
                  'Code execution (limited)',
                  'Progress tracking',
                  'Community access'
                ],
                buttonText: 'Get Started',
                popular: false
              },
              {
                name: 'Pro',
                price: '$9.99',
                period: '/month',
                description: 'For serious learners',
                features: [
                  'Unlimited AI tutoring',
                  'All challenges unlocked',
                  'Advanced code execution',
                  'Detailed analytics',
                  'Priority support',
                  'Certificate generation'
                ],
                buttonText: 'Start Pro Trial',
                popular: true
              },
              {
                name: 'Premium',
                price: '$19.99',
                period: '/month',
                description: 'For professionals',
                features: [
                  'Everything in Pro',
                  '1-on-1 mentoring sessions',
                  'Custom learning paths',
                  'Advanced AI insights',
                  'Team collaboration',
                  'White-label solutions'
                ],
                buttonText: 'Go Premium',
                popular: false
              }
            ].map((plan, index) => (
              <Grid item xs={12} md={4} key={index} sx={{
                animation: `fadeInUp 0.8s ease-out ${0.2 * index}s both`
              }}>
                <Card sx={{
                  height: '100%',
                  backgroundColor: plan.popular ? 'rgba(144, 202, 249, 0.05)' : '#1a1a1a',
                  border: plan.popular ? '2px solid #90caf9' : '1px solid rgba(144, 202, 249, 0.1)',
                  position: 'relative',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: plan.popular ? 'scale(1.07)' : 'scale(1.02)',
                    boxShadow: '0 15px 35px rgba(144, 202, 249, 0.2)',
                  }
                }}>
                  {plan.popular && (
                    <Box sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#90caf9',
                      color: '#0a0a0a',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      animation: 'pulse 2s infinite'
                    }}>
                      Most Popular
                    </Box>
                  )}

                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom sx={{
                      fontWeight: 'bold',
                      color: 'white',
                      mb: 1
                    }}>
                      {plan.name}
                    </Typography>

                    <Typography variant="body2" sx={{
                      color: 'rgba(176, 176, 176, 0.8)',
                      mb: 3
                    }}>
                      {plan.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h3" sx={{
                        fontWeight: 'bold',
                        color: '#90caf9',
                        display: 'inline'
                      }}>
                        {plan.price}
                      </Typography>
                      <Typography variant="h6" sx={{
                        color: 'rgba(176, 176, 176, 0.8)',
                        display: 'inline',
                        ml: 1
                      }}>
                        {plan.period}
                      </Typography>
                    </Box>

                    <List sx={{ mb: 4 }}>
                      {plan.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                            <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            sx={{
                              '& .MuiTypography-root': {
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.9rem'
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Button
                      variant={plan.popular ? "contained" : "outlined"}
                      size="large"
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        backgroundColor: plan.popular ? '#90caf9' : 'transparent',
                        borderColor: '#90caf9',
                        color: plan.popular ? '#0a0a0a' : '#90caf9',
                        '&:hover': {
                          backgroundColor: plan.popular ? '#64b5f6' : 'rgba(144, 202, 249, 0.1)',
                          borderColor: '#64b5f6',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: '#0d0d0d',
          color: 'white',
          py: 8,
          textAlign: 'center',
          borderTop: '1px solid rgba(144, 202, 249, 0.1)',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom sx={{
            fontWeight: 'bold',
            color: '#90caf9',
            animation: 'fadeInUp 0.8s ease-out'
          }}>
            Ready to Start Your Coding Journey?
          </Typography>
          <Typography variant="h6" sx={{
            mb: 4,
            opacity: 0.9,
            animation: 'fadeInUp 0.8s ease-out 0.2s both'
          }}>
            Join thousands of developers who are learning to code with AI-powered tutoring.
            Start with your first challenge today!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartNow}
            sx={{
              backgroundColor: '#90caf9',
              color: '#0a0a0a',
              '&:hover': {
                backgroundColor: '#64b5f6',
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 30px rgba(144, 202, 249, 0.3)',
              },
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              animation: 'pulse 2s infinite',
            }}
            endIcon={<ArrowForward />}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{
        backgroundColor: '#0a0a0a',
        color: 'white',
        py: 6,
        borderTop: '1px solid rgba(144, 202, 249, 0.1)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', animation: 'fadeInUp 0.8s ease-out' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Code sx={{
                fontSize: 32,
                color: 'primary.main',
                mr: 1,
                animation: 'glow 2s ease-in-out infinite alternate'
              }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Code Tutor AI
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
              Empowering developers worldwide with AI-powered coding education.
              Learn faster, code better, build amazing things.
            </Typography>
          </Box>
          <Divider sx={{ my: 4, backgroundColor: 'rgba(144, 202, 249, 0.2)' }} />
          <Typography variant="body2" align="center" sx={{
            opacity: 0.7,
            animation: 'fadeInUp 0.8s ease-out 0.4s both'
          }}>
            © 2025 Code Tutor AI. All rights reserved. Built with ❤️ for developers worldwide.
          </Typography>
        </Container>
      </Box>

      {/* Auth Modal */}
      <Modal
        open={authModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="auth-modal-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Paper
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 2.5,
            borderRadius: 3,
            position: 'relative',
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(144, 202, 249, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            animation: 'modalFadeIn 0.3s ease-out',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <Close />
          </IconButton>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Code sx={{
              fontSize: 36,
              color: 'primary.main',
              mb: 1,
              animation: 'glow 2s ease-in-out infinite alternate'
            }} />
            <Typography variant="h5" id="auth-modal-title" sx={{
              fontWeight: 'bold',
              color: 'white',
              mb: 0.5,
              fontSize: '1.5rem'
            }}>
              {isSignUp ? 'Join Code Tutor AI' : 'Welcome Back'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(176, 176, 176, 0.8)', fontSize: '0.8rem' }}>
              {isSignUp ? 'Create your account to start learning' : 'Sign in to continue your learning journey'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="outlined"
            size="medium"
            onClick={handleGoogleLogin}
            sx={{
              mb: 2,
              py: 1,
              borderColor: '#4285f4',
              color: '#4285f4',
              '&:hover': {
                borderColor: '#3367d6',
                backgroundColor: 'rgba(66, 133, 244, 0.04)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
            startIcon={
              <GoogleIcon sx={{ color: '#4285f4' }} />
            }
          >
            Continue with Google
          </Button>

          <Divider sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              or
            </Typography>
          </Divider>

          <Box component="form" onSubmit={handleSubmit}>
            {isSignUp && (
              <TextField
                fullWidth
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
                size="small"
                sx={{ mb: 1.5 }}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'action.active', fontSize: '1.2rem' }} />,
                }}
              />
            )}

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              size="small"
              sx={{ mb: 1.5 }}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: 'action.active', fontSize: '1.2rem' }} />,
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              size="small"
              sx={{ mb: isSignUp ? 1.5 : 2 }}
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'action.active', fontSize: '1.2rem' }} />,
              }}
            />

            {isSignUp && (
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                size="small"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'action.active', fontSize: '1.2rem' }} />,
                }}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="medium"
              disabled={isLoading}
              sx={{
                mb: 1.5,
                py: 1,
                backgroundColor: '#90caf9',
                color: '#0a0a0a',
                '&:hover': {
                  backgroundColor: '#64b5f6',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
              startIcon={isLoading ? <CircularProgress size={18} /> : null}
            >
              {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Button
                onClick={() => setIsSignUp(!isSignUp)}
                sx={{ p: 0, minWidth: 'auto', textTransform: 'none', fontSize: '0.8rem' }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Modal>

      <EmailVerificationDialog
        open={requiresVerification}
        onClose={() => {
          dispatch(clearVerification());
          setAuthModalOpen(false);
        }}
        onSuccess={() => {
          // After successful verification, redirect to dashboard
          setAuthModalOpen(false);
          setIsSignUp(false);
          setError('');
          // Small delay to ensure token is set in state
          setTimeout(() => {
            navigate('/dashboard');
          }, 200);
        }}
      />
    </Box>
  );
};

export default LandingPage;
