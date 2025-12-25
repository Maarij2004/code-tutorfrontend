import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Code,
  EmojiEvents,
  Leaderboard,
  Person,
  Brightness4,
  Brightness7,
  MenuBook,
  SmartToy,
  Games,
  Notes as NotesIcon,
  Extension,
} from '@mui/icons-material';
import { RootState, useAppDispatch } from '../store';
import { initializeAuth } from '../store/slices/authSlice';
import { fetchUserProgress } from '../store/slices/userSlice';
import { fetchChallenges } from '../store/slices/codeSlice';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { progress } = useSelector((state: RootState) => state.user);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const styles = {
    '@keyframes slideInLeft': {
      '0%': { transform: 'translateX(-50px)', opacity: 0 },
      '100%': { transform: 'translateX(0)', opacity: 1 },
    },
    '@keyframes pulse': {
      '0%': { opacity: 0.6 },
      '50%': { opacity: 1 },
      '100%': { opacity: 0.6 },
    },
  };

  // Initialize auth on app load
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (!user && localStorage.getItem('token')) {
      // Token exists but user not loaded yet, wait for initialization
      return;
    }
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogoClick = () => {
    // Navigate to home page
    navigate('/');
    
    // Re-initialize auth to update login status
    dispatch(initializeAuth());
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '' },
    { text: 'Activities', icon: <Extension />, path: 'activities' }, 
    { text: 'Ask Tutor', icon: <SmartToy />, path: 'ask-tutor' },
    { text: 'Tutorials', icon: <MenuBook />, path: 'tutorials' },
    { text: 'Game Learning', icon: <Games />, path: 'game-learning' },
    { text: 'Code Editor', icon: <Code />, path: 'editor' },
    { text: 'Challenges', icon: <EmojiEvents />, path: 'challenges' },
    { text: 'Leaderboard', icon: <Leaderboard />, path: 'leaderboard' },
    { text: 'Notes', icon: <NotesIcon />, path: 'notes' },
    { text: 'Profile', icon: <Person />, path: 'profile' },
  ];

  const drawer = (
    <Box sx={{
      backgroundColor: '#0f0f0f',
      height: '100%',
      color: 'white',
    }}>
      <Toolbar sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderBottom: '1px solid rgba(144, 202, 249, 0.1)',
      }}>
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(144, 202, 249, 0.5)',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            }
          }}
          onClick={handleLogoClick}
        >
          Code Tutor AI
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            data-tour-id={item.path || 'dashboard'}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(144, 202, 249, 0.1)',
                transform: 'translateX(5px)',
                transition: 'all 0.3s ease',
              },
              borderRadius: '0 25px 25px 0',
              mx: 1,
              my: 0.5,
              animation: `slideInLeft 0.6s ease-out ${index * 0.1}s both`,
            }}
          >
            <ListItemIcon sx={{
              color: 'primary.main',
              minWidth: '40px',
              animation: 'pulse 2s infinite',
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: 500,
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', ...styles }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'rgba(18, 18, 18, 0.95)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(144, 202, 249, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Welcome back, {user?.username}!
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            

            <Typography variant="body2">
              Level {progress?.level || 1} • {progress?.totalXP || 0} XP
            </Typography>

            <Avatar
              src={user?.avatar ? `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000'}/uploads/avatars/${user.avatar}` : undefined}
              sx={{ 
                width: 32, 
                height: 32,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 0 10px rgba(144, 202, 249, 0.5)'
                }
              }}
              onClick={() => navigate('/dashboard/profile')}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;