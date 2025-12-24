import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Grid,
  Paper,
  LinearProgress,
  Badge,
} from '@mui/material';
import {
  EmojiEvents,
  Whatshot,
  TrendingUp,
  Star,
  MilitaryTech,
} from '@mui/icons-material';
import { RootState, useAppDispatch } from '../store';
import { fetchLeaderboard, fetchUserProgress } from '../store/slices/userSlice';

const Leaderboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { leaderboard } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const { progress } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchLeaderboard());
    dispatch(fetchUserProgress());
  }, [dispatch]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <MilitaryTech sx={{ color: '#FFD700', fontSize: 24 }} />;
      case 2:
        return <MilitaryTech sx={{ color: '#C0C0C0', fontSize: 20 }} />;
      case 3:
        return <MilitaryTech sx={{ color: '#CD7F32', fontSize: 18 }} />;
      default:
        return <Typography variant="h6" sx={{ color: 'text.secondary', minWidth: 24 }}>
          {rank}
        </Typography>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return 'text.primary';
    }
  };

  const userEntry = leaderboard.find(entry => entry.id === user?.id);
  const userRank = userEntry?.rank || 0;

  // Calculate level progress
  const getLevelProgress = (xp: number) => {
    const level = Math.floor(xp / 1000) + 1;
    const currentLevelXP = xp % 1000;
    return { level, progress: (currentLevelXP / 1000) * 100 };
  };

  // Get total XP from entry (handle both totalXP and total_xp)
  const getTotalXP = (entry: any) => entry.totalXP || entry.total_xp || 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Leaderboard 🏆
      </Typography>

      <Grid container spacing={3}>
        {/* Top 3 Podium */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Top Performers
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'end', gap: 4, py: 4 }}>
                {/* 2nd Place */}
                {leaderboard[1] && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <Avatar
                        src={leaderboard[1].avatar ? `${process.env.REACT_APP_API_URL || 'https://tgeazxxujp.ap-south-1.awsapprunner.com'}/uploads/avatars/${leaderboard[1].avatar}` : undefined}
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          border: '4px solid #C0C0C0',
                          bgcolor: 'grey.300'
                        }}
                      >
                        {leaderboard[1].username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        bgcolor: '#C0C0C0',
                        borderRadius: '50%',
                        width: 30,
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                          2
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6">{leaderboard[1].username}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Level {getLevelProgress(getTotalXP(leaderboard[1])).level}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                      {getTotalXP(leaderboard[1])} XP
                    </Typography>
                  </Box>
                )}

                {/* 1st Place */}
                {leaderboard[0] && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <Avatar
                        src={leaderboard[0].avatar ? `${process.env.REACT_APP_API_URL || 'hhttps://tgeazxxujp.ap-south-1.awsapprunner.com'}/uploads/avatars/${leaderboard[0].avatar}` : undefined}
                        sx={{
                          width: 100,
                          height: 100,
                          mx: 'auto',
                          border: '4px solid #FFD700',
                          bgcolor: 'grey.300'
                        }}
                      >
                        {leaderboard[0].username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{
                        position: 'absolute',
                        top: -15,
                        right: -15,
                        bgcolor: '#FFD700',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <EmojiEvents sx={{ color: 'white' }} />
                      </Box>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {leaderboard[0].username}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Level {getLevelProgress(getTotalXP(leaderboard[0])).level}
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
                      {getTotalXP(leaderboard[0])} XP
                    </Typography>
                  </Box>
                )}

                {/* 3rd Place */}
                {leaderboard[2] && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <Avatar
                        src={leaderboard[2].avatar ? `${process.env.REACT_APP_API_URL || 'https://tgeazxxujp.ap-south-1.awsapprunner.com'}/uploads/avatars/${leaderboard[2].avatar}` : undefined}
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          border: '4px solid #CD7F32',
                          bgcolor: 'grey.300'
                        }}
                      >
                        {leaderboard[2].username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        bgcolor: '#CD7F32',
                        borderRadius: '50%',
                        width: 30,
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                          3
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6">{leaderboard[2].username}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Level {getLevelProgress(getTotalXP(leaderboard[2])).level}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                      {getTotalXP(leaderboard[2])} XP
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Full Leaderboard */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Full Rankings
              </Typography>
              <List>
                {leaderboard.map((entry, index) => {
                  const rank = entry.rank || index + 1;
                  const isCurrentUser = entry.id === user?.id;
                  const totalXP = getTotalXP(entry);
                  const levelInfo = getLevelProgress(totalXP);

                  return (
                    <ListItem
                      key={entry.id}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        backgroundColor: isCurrentUser ? 'action.selected' : 'transparent',
                        border: isCurrentUser ? '2px solid' : 'none',
                        borderColor: 'primary.main',
                      }}
                    >
                      <ListItemAvatar>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getRankIcon(rank)}
                        </Box>
                      </ListItemAvatar>
                      <ListItemAvatar>
                        <Avatar
                          src={entry.avatar ? `${process.env.REACT_APP_API_URL || 'https://tgeazxxujp.ap-south-1.awsapprunner.com'}/uploads/avatars/${entry.avatar}` : undefined}
                          sx={{
                            bgcolor: isCurrentUser ? 'primary.main' : 'grey.300',
                            border: rank <= 3 ? `2px solid ${getRankColor(rank)}` : 'none'
                          }}
                        >
                          {entry.username.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: isCurrentUser ? 'bold' : 'normal' }}>
                              {entry.username}
                              {isCurrentUser && (
                                <Chip
                                  label="You"
                                  size="small"
                                  color="primary"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Level {levelInfo.level} • {totalXP} XP
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={levelInfo.progress}
                              sx={{ height: 4, mt: 0.5, borderRadius: 2 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Your Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Stats
              </Typography>

              {userEntry && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ mr: 1 }}>
                      Rank #{userRank}
                    </Typography>
                    {userRank <= 3 && (
                      <Badge badgeContent={<EmojiEvents sx={{ color: getRankColor(userRank) }} />} />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Whatshot sx={{ color: 'error.main' }} />
                    <Typography variant="body1">
                      {progress?.streak || 0} day streak
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Star sx={{ color: 'warning.main' }} />
                    <Typography variant="body1">
                      {progress?.achievements?.length || 0} achievements
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp sx={{ color: 'success.main' }} />
                    <Typography variant="body1">
                      {progress?.completedChallenges?.length || 0} challenges completed
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

         
        </Grid>
      </Grid>
    </Box>
  );
};

export default Leaderboard;
