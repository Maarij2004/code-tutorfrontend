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
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  Edit,
  Email,
  Person,
  EmojiEvents,
  Code,
  Whatshot,
  TrendingUp,
  Star,
  CalendarToday,
  PhotoCamera,
  Delete,
  Logout,
} from '@mui/icons-material';
import { RootState, useAppDispatch } from '../store';
import { fetchUserProgress } from '../store/slices/userSlice';
import { updateUser, logout } from '../store/slices/authSlice';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { progress } = useSelector((state: RootState) => state.user);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProgress());
  }, [dispatch]);

  const handleEditProfile = () => {
    setEditForm({
      username: user?.username || '',
      email: user?.email || '',
    });
    setAvatarFile(null);
    setAvatarPreview(user?.avatar ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/avatars/${user.avatar}` : null);
    setEditDialogOpen(true);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(user?.avatar ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/avatars/${user.avatar}` : null);
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/');
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

      if (avatarFile) {
        // Validate file size (16MB max)
        if (avatarFile.size > 16 * 1024 * 1024) {
          alert('File size must be less than 16MB');
          setIsUpdating(false);
          return;
        }
        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        if (!validTypes.includes(avatarFile.type)) {
          alert('Invalid file type. Please use PNG, JPG, JPEG, or GIF');
          setIsUpdating(false);
          return;
        }
        formData.append('avatar', avatarFile);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to update your profile');
        setIsUpdating(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - let browser set it with boundary for FormData
        },
        body: formData
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        // If response is not JSON, get text
        const text = await response.text();
        console.error('Non-JSON response:', text);
        alert(`Failed to update profile: ${response.status} ${response.statusText}`);
        setIsUpdating(false);
        return;
      }

      if (response.ok) {
        // Update the user state with the new data
        if (result.user) {
          dispatch(updateUser({
            username: result.user.username,
            email: result.user.email,
            avatar: result.user.avatar,
            level: result.user.level,
            totalXP: result.user.total_xp || result.user.totalXP,
            streak: result.user.streak
          }));
        }
        
        // Close dialog and reset form
        setEditDialogOpen(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        alert('Profile updated successfully!');
      } else {
        const errorMessage = result.error || result.message || `Failed to update profile (${response.status})`;
        console.error('Profile update error:', errorMessage, result);
        alert(errorMessage);
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      const errorMessage = error?.message || 'Failed to update profile. Please check your connection and try again.';
      alert(errorMessage);
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
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Profile 👤
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  src={user?.avatar ? `${process.env.REACT_APP_API_URL || 'https://tgeazxxujp.ap-south-1.awsapprunner.com/'}/uploads/avatars/${user.avatar}` : undefined}
                  sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h5">{user?.username}</Typography>
                    <Chip
                      label={`Level ${levelInfo.level}`}
                      color="primary"
                      size="small"
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Logout />}
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Star sx={{ color: 'warning.main', fontSize: 16 }} />
                      <Typography variant="body2">
                        {progress?.totalXP || 0} XP
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Whatshot sx={{ color: 'error.main', fontSize: 16 }} />
                      <Typography variant="body2">
                        {progress?.streak || 0} day streak
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday sx={{ color: 'info.main', fontSize: 16 }} />
                      <Typography variant="body2">
                        Joined recently
                      </Typography>
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
              <Typography variant="h6" gutterBottom>
                Level Progress
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Level {levelInfo.level}</Typography>
                  <Typography variant="body2">{levelInfo.xpToNext} XP to next level</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={levelInfo.progress}
                  sx={{ height: 12, borderRadius: 6 }}
                />
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
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Code sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" color="primary">
                      {progress?.completedChallenges?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Challenges Completed
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <EmojiEvents sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h4" color="warning.main">
                      {progress?.achievements?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Achievements
                    </Typography>
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
              <Typography variant="h6" gutterBottom>
                Learning Insights
              </Typography>

              {weakAreas.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'error.main' }}>
                    Areas to Focus On
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {weakAreas.map((area, index) => (
                      <Chip key={index} label={area} size="small" color="error" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              {learningPath.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'success.main' }}>
                    Recommended Learning Path
                  </Typography>
                  <List dense>
                    {learningPath.slice(0, 3).map((topic, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={topic} />
                      </ListItem>
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
            {/* Avatar Upload Section */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Avatar
                src={avatarPreview || undefined}
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  bgcolor: avatarPreview ? 'transparent' : 'primary.main'
                }}
              >
                {!avatarPreview && editForm.username.charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  size="small"
                >
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </Button>

                {avatarPreview && avatarPreview !== (user?.avatar ? `${process.env.REACT_APP_API_URL || 'https://tgeazxxujp.ap-south-1.awsapprunner.com/'}/uploads/avatars/${user.avatar}` : null) && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    size="small"
                    onClick={handleRemoveAvatar}
                  >
                    Remove
                  </Button>
                )}
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Supported formats: PNG, JPG, JPEG, GIF (max 16MB)
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Username"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={isUpdating}>
            Cancel
          </Button>
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
