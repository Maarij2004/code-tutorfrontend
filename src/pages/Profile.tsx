import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Edit,
  Email,
  EmojiEvents,
  Code,
  Whatshot,
  Star,
  CalendarToday,
  Delete,
  Logout,
} from '@mui/icons-material';
import { RootState, useAppDispatch } from '../store';
import { fetchUserProgress } from '../store/slices/userSlice';
import { updateUser, logout } from '../store/slices/authSlice';

const demoAvatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&backgroundColor=ffd93d',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Dusty&backgroundColor=ffb3ba',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Fluffy&backgroundColor=bae1ff',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Garfield&backgroundColor=a8e6cf',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=ffd1dc',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Simba&backgroundColor=b19cd9',
];

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { progress } = useSelector((state: RootState) => state.user);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', email: '' });
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileAvatarSrc, setProfileAvatarSrc] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://tgeazxxujp.ap-south-1.awsapprunner.com/';

  useEffect(() => {
    dispatch(fetchUserProgress());
  }, [dispatch]);

  const getDefaultAvatarUrl = (username: string = 'User') => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}&backgroundColor=b6e3f4`;
  };

  const loadAvatarSrc = (avatar: string | null | undefined, username: string = 'User') => {
    if (!avatar) return getDefaultAvatarUrl(username);
    if (avatar.startsWith('http')) return avatar; // demo/external avatar
    return `${API_URL}/uploads/avatars/${avatar}`;
  };

  useEffect(() => {
    if (user) {
      setProfileAvatarSrc(loadAvatarSrc(user.avatar, user.username));
    }
  }, [user?.avatar, user?.username]);

  const handleEditProfile = () => {
    if (!user) {
      alert('You must be logged in to edit your profile');
      return;
    }
    setEditForm({ username: user.username || '', email: user.email || '' });
    const currentAvatar = user.avatar || null;
    setSelectedAvatar(currentAvatar);
    setAvatarPreview(loadAvatarSrc(currentAvatar, user.username));
    setEditDialogOpen(true);
  };

  const handleRemoveAvatar = () => {
    setSelectedAvatar(null);
    setAvatarPreview(getDefaultAvatarUrl(editForm.username));
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/');
  };

  // Convert SVG to PNG before uploading
  const svgToPngFile = async (svgUrl: string): Promise<File> => {
    const response = await fetch(svgUrl);
    const svgText = await response.text();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width || 256;
        canvas.height = img.height || 256;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'avatar.png', { type: 'image/png' });
            resolve(file);
          }
        }, 'image/png');
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  };

  const handleSaveProfile = async () => {
    if (!editForm.username.trim() || !editForm.email.trim()) {
      alert('Username and email are required');
      return;
    }

    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append('username', editForm.username.trim());
      formData.append('email', editForm.email.trim());

      const originalAvatar = user?.avatar || null;
      if (selectedAvatar !== originalAvatar) {
        if (selectedAvatar === null) {
          formData.append('avatar', '');
        } else if (selectedAvatar.startsWith('http')) {
          const file = await svgToPngFile(selectedAvatar);
          formData.append('avatar', file);
        }
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token missing. Please log in again.');
        setIsUpdating(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.user) {
        dispatch(updateUser({
          username: result.user.username,
          email: result.user.email,
          avatar: result.user.avatar || null,
          level: result.user.level,
          totalXP: result.user.total_xp || result.user.totalXP,
          streak: result.user.streak,
        }));
        setEditDialogOpen(false);
        alert('Profile updated successfully!');
        setProfileAvatarSrc(loadAvatarSrc(result.user.avatar, result.user.username));
      } else {
        const errorMsg = result.error || result.message || 'Failed to update profile';
        alert(errorMsg);
      }
    } catch (error: any) {
      console.error('Update error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getLevelProgress = () => {
    if (!progress) return { level: 1, progress: 0, xpToNext: 1000 };
    const level = progress.level;
    const currentLevelXP = progress.totalXP % 1000;
    const progressPercent = (currentLevelXP / 1000) * 100;
    const xpToNext = 1000 - currentLevelXP;
    return { level, progress: progressPercent, xpToNext };
  };

  const levelInfo = getLevelProgress();
  const weakAreas = progress?.weakAreas || [];
  const learningPath = progress?.learningPath || [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>Profile 👤</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  src={profileAvatarSrc || undefined}
                  sx={{ width: 100, height: 100 }}
                >
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h5">{user?.username || 'User'}</Typography>
                    <Chip label={`Level ${levelInfo.level}`} color="primary" size="small" />
                    <Button variant="outlined" size="small" startIcon={<Edit />} onClick={handleEditProfile}>Edit Profile</Button>
                    <Button variant="outlined" color="error" size="small" startIcon={<Logout />} onClick={handleSignOut}>Sign Out</Button>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{user?.email || 'Not set'}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Star sx={{ color: 'warning.main', fontSize: 16 }} />
                      <Typography variant="body2">{progress?.totalXP || 0} XP</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Whatshot sx={{ color: 'error.main', fontSize: 16 }} />
                      <Typography variant="body2">{progress?.streak || 0} day streak</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday sx={{ color: 'info.main', fontSize: 16 }} />
                      <Typography variant="body2">Joined recently</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Level Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Level Progress</Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Level {levelInfo.level}</Typography>
                  <Typography variant="body2">{levelInfo.xpToNext} XP to next level</Typography>
                </Box>
                <LinearProgress variant="determinate" value={levelInfo.progress} sx={{ height: 12, borderRadius: 6 }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Keep solving challenges and analyzing code with AI to earn more XP!
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Statistics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Code sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" color="primary">{progress?.completedChallenges?.length || 0}</Typography>
                    <Typography variant="body2" color="text.secondary">Challenges Completed</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <EmojiEvents sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h4" color="warning.main">{progress?.achievements?.length || 0}</Typography>
                    <Typography variant="body2" color="text.secondary">Achievements</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Learning Insights */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Learning Insights</Typography>
              {weakAreas.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'error.main' }}>Areas to Focus On</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {weakAreas.map((area, index) => (
                      <Chip key={index} label={area} size="small" color="error" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
              {learningPath.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'success.main' }}>Recommended Learning Path</Typography>
                  <List dense>
                    {learningPath.slice(0, 3).map((topic, index) => (
                      <ListItem key={index}><ListItemText primary={topic} /></ListItem>
                    ))}
                  </List>
                </Box>
              )}
              {weakAreas.length === 0 && learningPath.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Complete more challenges to get personalized learning insights!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>Choose Your Avatar</Typography>

              <Avatar
                src={avatarPreview || undefined}
                sx={{
                  width: 120,
                  height: 120,
                  mb: 3,
                  border: '4px solid',
                  borderColor: 'primary.light',
                }}
              >
                {editForm.username.charAt(0).toUpperCase() || 'U'}
              </Avatar>

              <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 360 }}>
                {demoAvatars.map((url, index) => (
                  <Grid item key={index}>
                    <Avatar
                      src={url}
                      onClick={() => {
                        setSelectedAvatar(url);
                        setAvatarPreview(url);
                      }}
                      sx={{
                        width: 70,
                        height: 70,
                        cursor: 'pointer',
                        border: selectedAvatar === url ? '4px solid' : '2px solid',
                        borderColor: selectedAvatar === url ? 'primary.main' : 'grey.300',
                        transition: 'all 0.2s',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Button
                variant="text"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={handleRemoveAvatar}
                sx={{ mt: 2 }}
                disabled={selectedAvatar === null}
              >
                Use Default Avatar
              </Button>
            </Box>

            <TextField
              fullWidth
              label="Username"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={isUpdating}>Cancel</Button>
          <Button
            onClick={handleSaveProfile}
            variant="contained"
            disabled={isUpdating || !editForm.username.trim() || !editForm.email.trim()}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
