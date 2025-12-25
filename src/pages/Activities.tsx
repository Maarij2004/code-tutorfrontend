import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from '@mui/material';
import {
  PlayArrow,
  Close,
  Star,
  EmojiEvents,
  Code,
  Lightbulb,
  Gamepad,
  School,
  Extension,
  RestartAlt,
  CheckCircle,
  VolumeUp,
  Timer,
  Score,
} from '@mui/icons-material';
import { keyframes, styled } from '@mui/material/styles';
import Confetti from 'react-confetti';
import { useDispatch } from 'react-redux';
import { updateXP } from '../store/slices/userSlice';

interface Activity {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  estimatedTime: string;
  points: number;
  completed: boolean;
  content: React.ReactNode;
}

// Animation Keyframes
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const moveLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
`;

// Styled Components
const AnimatedBox = styled(Box)({
  animation: `${bounce} 2s infinite`,
});

const Robot = styled('div')({
  width: '60px',
  height: '80px',
  backgroundColor: '#666', // Changed from #2196f3 to dark grey
  borderRadius: '10px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '40px',
    height: '40px',
    backgroundColor: '#999', // Changed from #fff to light grey
    borderRadius: '50%',
    top: '10px',
    left: '10px',
    animation: `${pulse} 1s infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '20px',
    height: '20px',
    backgroundColor: '#ff5722',
    borderRadius: '50%',
    bottom: '10px',
    left: '20px',
  },
});

const StarShape = styled('div')({
  width: '50px',
  height: '50px',
  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  animation: `${spin} 3s linear infinite`,
});

const GameContainer = styled(Paper)({
  padding: '20px',
  borderRadius: '15px',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
  minHeight: '300px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(144, 202, 249, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(144, 202, 249, 0.05) 1px, transparent 1px)',
    backgroundSize: '30px 30px',
    animation: `${moveLeft} 20s linear infinite`,
  },
});
// Game Components
const RobotMovementGame: React.FC<{ level: number }> = ({ level }) => {
  const [position, setPosition] = useState(0);
  const [commands, setCommands] = useState<string[]>(['forward', 'right', 'forward', 'left']);
  const [currentCommand, setCurrentCommand] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const handleMove = (direction: string) => {
    setCommands([...commands, direction]);
  };

  const executeCommands = () => {
    setIsMoving(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < commands.length) {
        const cmd = commands[step];
        if (cmd === 'forward') setPosition(prev => prev + 50);
        if (cmd === 'backward') setPosition(prev => prev - 50);
        setCurrentCommand(step);
        step++;
      } else {
        clearInterval(interval);
        setIsMoving(false);
      }
    }, 1000);
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white', mb: 3 }}>
        🤖 Robot Movement Challenge
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={() => handleMove('forward')}
          disabled={isMoving}
          startIcon=""
        >
          Forward
        </Button>
        <Button 
          variant="contained" 
          onClick={() => handleMove('backward')}
          disabled={isMoving}
          startIcon=""
        >
          Backward
        </Button>
        <Button 
          variant="contained" 
          onClick={() => handleMove('down')}
          disabled={isMoving}
          startIcon=""
        >
          Left
        </Button>
        <Button 
          variant="contained" 
          onClick={() => handleMove('up')}
          disabled={isMoving}
          startIcon=""
        >
          Right
        </Button>
      </Box>

      <Box sx={{ position: 'relative', width: '100%', height: '100px', backgroundColor: '#333', borderRadius: '10px', mb: 2 }}>
        <Box sx={{ position: 'absolute', left: `${position}px`, transition: 'left 1s ease' }}>
          <Robot />
        </Box>
        <Box sx={{ position: 'absolute', right: '50px', top: '25px' }}>
          <StarShape />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {commands.map((cmd, idx) => (
          <Chip
            key={idx}
            label={cmd}
            color={idx === currentCommand && isMoving ? 'primary' : 'default'}
            sx={{ animation: idx === currentCommand && isMoving ? `${pulse} 0.5s infinite` : 'none' }}
          />
        ))}
      </Box>

      <Button 
        variant="contained" 
        color="success" 
        onClick={executeCommands}
        disabled={isMoving}
        startIcon={<PlayArrow />}
      >
        Execute Commands
      </Button>
    </GameContainer>
  );
};
// Replace the ColorMatchingGame with this working version:
const ColorMatchingGame: React.FC = () => {
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
  const colorNames = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Cyan'];
  const [targetColor, setTargetColor] = useState(colors[0]);
  const [targetColorName, setTargetColorName] = useState(colorNames[0]);
  const [selectedColor, setSelectedColor] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && gameStarted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted) {
      setGameStarted(false);
    }
  }, [timeLeft, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    setSelectedColor('');
    const randomIndex = Math.floor(Math.random() * colors.length);
    setTargetColor(colors[randomIndex]);
    setTargetColorName(colorNames[randomIndex]);
  };

  const handleColorClick = (color: string, colorName: string) => {
    if (!gameStarted || timeLeft === 0) return;
    
    setSelectedColor(color);
    console.log('Clicked:', colorName, 'Target:', targetColorName);
    
    if (color === targetColor) {
      setScore(prev => prev + 10);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        setTargetColor(colors[randomIndex]);
        setTargetColorName(colorNames[randomIndex]);
        setSelectedColor('');
      }, 1000);
    } else {
      setTimeout(() => setSelectedColor(''), 1000);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🎨 Color Matching Game
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 3 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Score: {score}
        </Typography>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Time: {timeLeft}s
        </Typography>
      </Box>

      {!gameStarted ? (
        <Button variant="contained" onClick={startGame} size="large">
          Start Game
        </Button>
      ) : (
        <>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Match this color: <strong>{targetColorName}</strong>
            </Typography>
            <Box
              sx={{
                width: '100px',
                height: '100px',
                backgroundColor: targetColor,
                margin: '0 auto',
                borderRadius: '50%',
                animation: `${pulse} 1s infinite`,
                boxShadow: '0 0 20px rgba(255,255,255,0.3)',
              }}
            />
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {colors.map((color, index) => (
              <Grid item xs={4} key={color}>
                <Box
                  onClick={() => handleColorClick(color, colorNames[index])}
                  sx={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: color,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    transform: selectedColor === color ? 
                      (selectedColor === targetColor ? 'scale(1.2)' : 'scale(0.9)') : 'scale(1)',
                    boxShadow: selectedColor === color ? 
                      (selectedColor === targetColor ? '0 0 20px #4caf50' : '0 0 20px #f44336') : 'none',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 0 15px rgba(255,255,255,0.5)',
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {selectedColor === targetColor && (
            <Typography variant="h6" sx={{ color: '#4caf50', animation: `${bounce} 0.5s` }}>
              ✓ Correct! +10 points
            </Typography>
          )}
          
          {selectedColor && selectedColor !== targetColor && (
            <Typography variant="h6" sx={{ color: '#f44336', animation: `${bounce} 0.5s` }}>
              ❌ Wrong! Try again
            </Typography>
          )}
        </>
      )}
    </GameContainer>
  );
};
// Replace the ShapeSortingGame with this corrected version:
const ShapeSortingGame: React.FC = () => {
  const shapes = ['circle', 'square', 'triangle', 'star'];
  const [draggedShape, setDraggedShape] = useState<string | null>(null);
  const [bins, setBins] = useState<Record<string, string[]>>({
    circle: [],
    square: [],
    triangle: [],
    star: [],
  });
  const [completed, setCompleted] = useState(false);
  const [shapesAvailable, setShapesAvailable] = useState<string[]>([]);
  const [dragOverBin, setDragOverBin] = useState<string | null>(null);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const initialShapes: string[] = [];
    shapes.forEach(shape => {
      for (let i = 0; i < 3; i++) {
        initialShapes.push(shape);
      }
    });
    setShapesAvailable(initialShapes.sort(() => Math.random() - 0.5));
    setBins({
      circle: [],
      square: [],
      triangle: [],
      star: [],
    });
    setCompleted(false);
    setDraggedShape(null);
    setDragOverBin(null);
  };

  const handleDragStart = (e: React.DragEvent, shape: string) => {
    setDraggedShape(shape);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', shape);
    console.log('Started dragging:', shape);
  };

  const handleDragOver = (e: React.DragEvent, binType: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverBin(binType);
  };

  const handleDragLeave = () => {
    setDragOverBin(null);
  };

  const handleDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault();
    const shape = e.dataTransfer.getData('text/plain');
    
    console.log('Dropped shape:', shape, 'into bin:', binType);
    
    if (shape && shapesAvailable.includes(shape)) {
      // Only allow correct drops
      if (shape === binType) {
        setBins(prev => {
          const newBins = {
            ...prev,
            [binType]: [...prev[binType], shape],
          };
          
          // Check if all shapes are correctly sorted after updating
          const allBins = Object.values(newBins);
          const totalShapes = allBins.reduce((sum, arr) => sum + arr.length, 0);
          
          console.log('Total shapes placed:', totalShapes);
          
          if (totalShapes === 12) { // 3 shapes × 4 types = 12
            setTimeout(() => setCompleted(true), 500);
          }
          
          return newBins;
        });
        
        setShapesAvailable(prev => prev.filter(s => s !== shape));
        console.log('Shape successfully placed!');
      } else {
        console.log('Wrong bin! Shape:', shape, 'Bin:', binType);
        // Could add visual feedback for wrong drop here
      }
    } else {
      console.log('Shape not available or invalid drop');
    }
    
    setDraggedShape(null);
    setDragOverBin(null);
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🔺 Shape Sorting Challenge
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Shapes available: {shapesAvailable.length}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        {shapesAvailable.map((shape, index) => (
          <Box
            key={`${shape}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, shape)}
            onDragEnd={() => setDraggedShape(null)}
            sx={{
              width: '60px',
              height: '60px',
              backgroundColor: draggedShape === shape ? '#999' : '#666',
              borderRadius: shape === 'circle' ? '50%' : '10px',
              clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                        shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none',
              cursor: 'grab',
              animation: `${bounce} 2s infinite`,
              animationDelay: `${index * 0.2}s`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 0 10px rgba(255,255,255,0.5)',
              },
              '&:active': {
                cursor: 'grabbing',
              },
            }}
          >
            {shape === 'circle' ? '●' : shape === 'square' ? '■' : shape === 'triangle' ? '▲' : '★'}
          </Box>
        ))}
      </Box>

      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Drag shapes to their matching bins:
      </Typography>

      <Grid container spacing={2}>
        {shapes.map(binType => (
          <Grid item xs={3} key={binType}>
            <Box
              onDragOver={(e) => handleDragOver(e, binType)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, binType)}
              sx={{
                minHeight: '150px',
                border: `2px dashed ${dragOverBin === binType ? '#90caf9' : '#666'}`,
                borderRadius: '10px',
                padding: '10px',
                backgroundColor: dragOverBin === binType ? 'rgba(144, 202, 249, 0.1)' : 'rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.3s',
                position: 'relative',
              }}
            >
              <Typography sx={{ color: 'white', textAlign: 'center', mb: 1, fontSize: '24px' }}>
                {binType === 'circle' ? '●' : binType === 'square' ? '■' : binType === 'triangle' ? '▲' : '★'}
              </Typography>
              <Typography sx={{ color: 'white', textAlign: 'center', mb: 1 }}>
                {binType}s ({bins[binType].length}/3)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', flex: 1 }}>
                {bins[binType].map((shape, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#666',
                      borderRadius: shape === 'circle' ? '50%' : '3px',
                      clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                                shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={resetGame} sx={{ color: 'white', borderColor: '#666' }}>
          Reset
        </Button>
        {completed && (
          <Box sx={{ animation: `${bounce} 1s` }}>
            <Typography variant="h6" sx={{ color: '#4caf50' }}>
              🎉 All shapes sorted! Well done!
            </Typography>
          </Box>
        )}
      </Box>
    </GameContainer>
  );
};
// Game Components
const NumberLineGame: React.FC = () => {
  const [numbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [target, setTarget] = useState(7);
  const [score, setScore] = useState(0);

  const handleNumberClick = (num: number) => {
    setSelectedNumber(num);
    if (num === target) {
      setScore(score + 1);
      setTarget(Math.floor(Math.random() * 10) + 1);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🔢 Number Line Challenge
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        Find number: <Box component="span" sx={{ fontSize: '2rem', color: '#FFD700' }}>{target}</Box>
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        {numbers.map(num => (
          <Box
            key={num}
            onClick={() => handleNumberClick(num)}
            sx={{
              width: '50px',
              height: '50px',
              backgroundColor: selectedNumber === num ? 
                (num === target ? '#4caf50' : '#f44336') : 
                'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              animation: num === target ? `${pulse} 1s infinite` : 'none',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            {num}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Score: {score}
        </Typography>
        {selectedNumber === target && selectedNumber !== null && (
          <Typography variant="h6" sx={{ color: '#4caf50', animation: `${bounce} 0.5s` }}>
            ✓ Correct!
          </Typography>
        )}
      </Box>
    </GameContainer>
  );
};

const WordBuilderGame: React.FC = () => {
  const words = ['CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'FISH'];
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [letters, setLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const shuffled = currentWord.split('').sort(() => Math.random() - 0.5);
    setLetters(shuffled);
    setSelectedLetters([]);
    setMessage('');
  }, [currentWord]);

  const handleLetterClick = (letter: string, index: number) => {
    setSelectedLetters([...selectedLetters, letter]);
    const newLetters = [...letters];
    newLetters.splice(index, 1);
    setLetters(newLetters);
  };

  const checkWord = () => {
    const word = selectedLetters.join('');
    if (word === currentWord) {
      setMessage('🎉 Correct! Well done!');
      setTimeout(() => {
        const nextWord = words[(words.indexOf(currentWord) + 1) % words.length];
        setCurrentWord(nextWord);
      }, 1500);
    } else {
      setMessage('Try again!');
      // Reset
      const shuffled = currentWord.split('').sort(() => Math.random() - 0.5);
      setLetters(shuffled);
      setSelectedLetters([]);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        📝 Word Builder
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        Build the word: {currentWord.split('').map((_, i) => i < selectedLetters.length ? currentWord[i] : '_').join(' ')}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center' }}>
        {selectedLetters.map((letter, index) => (
          <Box
            key={index}
            sx={{
              width: '60px',
              height: '60px',
              backgroundColor: '#4caf50',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              animation: `${bounce} 0.5s`,
            }}
          >
            {letter}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
        {letters.map((letter, index) => (
          <Box
            key={index}
            onClick={() => handleLetterClick(letter, index)}
            sx={{
              width: '50px',
              height: '50px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: 'rgba(255,255,255,0.3)',
              },
              animation: `${bounce} 2s infinite`,
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {letter}
          </Box>
        ))}
      </Box>

      <Button 
        variant="contained" 
        color="success" 
        onClick={checkWord}
        disabled={selectedLetters.length !== currentWord.length}
        sx={{ mb: 2 }}
      >
        Check Word
      </Button>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Correct') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};
// Replace the PatternGame with this corrected version that fixes the state update issue:
const PatternGame: React.FC = () => {
  const patterns = [
    [1, 0, 1, 0, 1], // Alternating pattern
    [1, 1, 0, 1, 1], // Two, skip one, two
    [0, 1, 0, 1, 0], // Every other one
    [1, 0, 0, 0, 1]  // First and last
  ];
  const [currentPattern, setCurrentPattern] = useState<number[]>(patterns[0]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [message, setMessage] = useState('Memorize the highlighted squares...');
  const [level, setLevel] = useState(0);
  const [gamePhase, setGamePhase] = useState<'showing' | 'input' | 'feedback'>('showing');
  const [showPatternTime, setShowPatternTime] = useState(2000); // 2 seconds

  // Get the correct sequence of squares to click
  const highlightedSquares = currentPattern
    .map((val, idx) => val === 1 ? idx : -1)
    .filter(idx => idx !== -1);

  useEffect(() => {
    if (gamePhase === 'showing') {
      const timer = setTimeout(() => {
        setGamePhase('input');
        setMessage('Now click the squares that were highlighted (in order)');
      }, showPatternTime);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, showPatternTime]);

  // Check pattern completion whenever userPattern changes
  useEffect(() => {
    if (gamePhase === 'input' && userPattern.length > 0) {
      const currentPosition = userPattern.length - 1;
      const expectedIndex = highlightedSquares[currentPosition];
      const actualIndex = userPattern[currentPosition];
      
      // Check if this click was wrong
      if (actualIndex !== expectedIndex) {
        setGamePhase('feedback');
        setMessage(`Wrong! You clicked square ${actualIndex + 1}, but expected square ${expectedIndex + 1}`);
        setTimeout(() => {
          setUserPattern([]);
          setGamePhase('showing');
          setMessage('Memorize the highlighted squares...');
        }, 2500);
        return;
      }
      
      // Check if pattern is complete
      if (userPattern.length === highlightedSquares.length) {
        setGamePhase('feedback');
        setMessage('🎉 Perfect! Level completed!');
        setTimeout(() => {
          startNewLevel();
        }, 2000);
      }
    }
  }, [userPattern, gamePhase, highlightedSquares]);

  const startNewLevel = () => {
    const nextLevel = (level + 1) % patterns.length;
    setLevel(nextLevel);
    setCurrentPattern(patterns[nextLevel]);
    setUserPattern([]);
    setGamePhase('showing');
    setMessage('Memorize the highlighted squares...');
    setShowPatternTime(Math.max(1500, showPatternTime - 200)); // Get faster each level
  };

  const handleSquareClick = (index: number) => {
    if (gamePhase !== 'input') return;
    
    // Don't allow clicking already clicked squares
    if (userPattern.includes(index)) return;
    
    // Add this square to the pattern
    setUserPattern(prev => [...prev, index]);
  };

  const resetGame = () => {
    setLevel(0);
    setCurrentPattern(patterns[0]);
    setUserPattern([]);
    setGamePhase('showing');
    setMessage('Memorize the highlighted squares...');
    setShowPatternTime(2000);
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🔍 Pattern Recognition
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Level {level + 1} - {message}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
        {[0, 1, 2, 3, 4].map(index => {
          const isHighlighted = highlightedSquares.includes(index);
          const isClicked = userPattern.includes(index);
          const clickOrder = userPattern.indexOf(index);
          
          return (
            <Box
              key={index}
              onClick={() => handleSquareClick(index)}
              sx={{
                width: '60px',
                height: '60px',
                backgroundColor: gamePhase === 'showing' ? 
                  (isHighlighted ? '#FFD700' : 'rgba(255,255,255,0.2)') :
                  isClicked ? '#4caf50' : 'rgba(255,255,255,0.2)',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: gamePhase === 'input' && !isClicked ? 'pointer' : 'default',
                transition: 'all 0.3s',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                position: 'relative',
                '&:hover': gamePhase === 'input' && !isClicked ? {
                  transform: 'scale(1.1)',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                } : {},
                animation: gamePhase === 'showing' && isHighlighted ? `${pulse} 0.5s infinite` : 'none',
              }}
            >
              <Box sx={{ fontSize: '12px', position: 'absolute', top: '2px', right: '2px' }}>
                {index + 1}
              </Box>
              {isClicked && (
                <Box sx={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  color: '#FFD700'
                }}>
                  {clickOrder + 1}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      <Typography variant="body1" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
        Progress: {userPattern.length} / {highlightedSquares.length} squares clicked
      </Typography>
      
      {gamePhase === 'input' && (
        <Typography variant="body2" sx={{ color: '#ccc', mb: 2, textAlign: 'center' }}>
          Expected sequence: {highlightedSquares.map(i => i + 1).join(' → ')}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="outlined" onClick={resetGame} sx={{ color: 'white', borderColor: '#666' }}>
          Reset Game
        </Button>
      </Box>
    </GameContainer>
  );
};
const MemoryGame: React.FC = () => {
  const cards = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
  const [gameCards, setGameCards] = useState<string[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'playing' | 'completed'>('waiting');
  const [canFlip, setCanFlip] = useState(true);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2 && gamePhase === 'playing') {
      setCanFlip(false);
      const [first, second] = flippedCards;
      
      if (gameCards[first] === gameCards[second]) {
        // Match found
        setMatchedCards(prev => [...prev, first, second]);
        setFlippedCards([]);
        setCanFlip(true);
        
        // Check if game is complete
        if (matchedCards.length + 2 === gameCards.length) {
          setGamePhase('completed');
        }
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setFlippedCards([]);
          setCanFlip(true);
        }, 1500);
      }
    }
  }, [flippedCards, gameCards, matchedCards.length, gamePhase]);

  const initializeGame = () => {
    const shuffled = [...cards, ...cards].sort(() => Math.random() - 0.5);
    setGameCards(shuffled);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setGamePhase('playing');
    setCanFlip(true);
  };

  const handleCardClick = (index: number) => {
    if (!canFlip || gamePhase !== 'playing') return;
    if (flippedCards.includes(index) || matchedCards.includes(index)) return;
    if (flippedCards.length >= 2) return;
    
    setFlippedCards(prev => [...prev, index]);
    if (flippedCards.length === 0) {
      // First card flipped
      setMoves(prev => prev + 1);
    }
  };

  const resetGame = () => {
    initializeGame();
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🧠 Memory Card Game
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Moves: {moves} | Matches: {matchedCards.length / 2} / {cards.length}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3, maxWidth: '400px' }}>
        {gameCards.map((card, index) => {
          const isFlipped = flippedCards.includes(index);
          const isMatched = matchedCards.includes(index);
          
          return (
            <Grid item xs={3} key={index}>
              <Box
                onClick={() => handleCardClick(index)}
                sx={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: isFlipped || isMatched ? 
                    (isMatched ? '#4caf50' : '#2196f3') : '#666',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canFlip && gamePhase === 'playing' && !isFlipped && !isMatched ? 'pointer' : 'default',
                  fontSize: '2rem',
                  transition: 'all 0.3s',
                  transform: isFlipped || isMatched ? 'rotateY(0deg)' : 'rotateY(180deg)',
                  '&:hover': canFlip && gamePhase === 'playing' && !isFlipped && !isMatched ? {
                    transform: 'scale(1.05) rotateY(180deg)',
                    boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                  } : {},
                }}
              >
                {isFlipped || isMatched ? card : '?'}
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {gamePhase === 'completed' && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#4caf50', animation: `${bounce} 1s` }}>
            🎉 Congratulations! Completed in {moves} moves!
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="outlined" onClick={resetGame} sx={{ color: 'white', borderColor: '#666' }}>
          New Game
        </Button>
      </Box>
    </GameContainer>
  );
};

const MazeGame: React.FC = () => {
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [targetPos] = useState({ x: 4, y: 4 });
  const [completed, setCompleted] = useState(false);
  
  const maze = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
  ];

  const movePlayer = (dx: number, dy: number) => {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    if (newX >= 0 && newX < 5 && newY >= 0 && newY < 5 && maze[newY][newX] === 0) {
      setPlayerPos({ x: newX, y: newY });
      if (newX === targetPos.x && newY === targetPos.y) {
        setCompleted(true);
      }
    }
  };

  const resetGame = () => {
    setPlayerPos({ x: 0, y: 0 });
    setCompleted(false);
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🌀 Maze Navigation
      </Typography>
      
      <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(5, 60px)', gap: 1 }}>
        {maze.map((row, y) => 
          row.map((cell, x) => (
            <Box
              key={`${x}-${y}`}
              sx={{
                width: '60px',
                height: '60px',
                backgroundColor: cell === 1 ? '#333' : 
                  (x === playerPos.x && y === playerPos.y) ? '#4caf50' :
                  (x === targetPos.x && y === targetPos.y) ? '#FFD700' : 
                  'rgba(255,255,255,0.1)',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: x === playerPos.x && y === playerPos.y ? '2rem' : 
                          x === targetPos.x && y === targetPos.y ? '2rem' : '1rem',
              }}
            >
              {x === playerPos.x && y === playerPos.y ? '🤖' : 
               x === targetPos.x && y === targetPos.y ? '🏁' : ''}
            </Box>
          ))
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={() => movePlayer(0, -1)}>⬆️ Up</Button>
        <Button variant="contained" onClick={() => movePlayer(0, 1)}>⬇️ Down</Button>
        <Button variant="contained" onClick={() => movePlayer(-1, 0)}>⬅️ Left</Button>
        <Button variant="contained" onClick={() => movePlayer(1, 0)}>➡️ Right</Button>
      </Box>

      <Button variant="outlined" onClick={resetGame} sx={{ color: 'white', borderColor: '#666' }}>
        Reset
      </Button>

      {completed && (
        <Box sx={{ mt: 2, animation: `${bounce} 1s` }}>
          <Typography variant="h6" sx={{ color: '#4caf50' }}>
            🎉 Maze completed! Well done!
          </Typography>
        </Box>
      )}
    </GameContainer>
  );
};
// Replace the SequenceGame with this corrected version:
const SequenceGame: React.FC = () => {
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
  const colorNames = ['Red', 'Green', 'Blue', 'Yellow'];
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'showing' | 'input' | 'success' | 'failure'>('waiting');
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState('Click Start to begin!');
  const [currentShowingIndex, setCurrentShowingIndex] = useState(0);

  const startGame = () => {
    setLevel(1);
    setSequence([Math.floor(Math.random() * colors.length)]);
    setUserSequence([]);
    setGamePhase('showing');
    setMessage('Watch the sequence...');
    setCurrentShowingIndex(0);
  };

  const startNewRound = () => {
    const newSequence = [...sequence, Math.floor(Math.random() * colors.length)];
    setSequence(newSequence);
    setUserSequence([]);
    setGamePhase('showing');
    setMessage('Watch the sequence...');
    setCurrentShowingIndex(0);
    setLevel(prev => prev + 1);
  };

  useEffect(() => {
    if (gamePhase === 'showing' && sequence.length > 0) {
      const showNextColor = () => {
        if (currentShowingIndex < sequence.length) {
          setTimeout(() => {
            setCurrentShowingIndex(prev => prev + 1);
          }, 800);
        } else {
          // Finished showing sequence
          setTimeout(() => {
            setGamePhase('input');
            setMessage('Now repeat the sequence!');
            setCurrentShowingIndex(0);
          }, 500);
        }
      };
      
      if (currentShowingIndex < sequence.length) {
        showNextColor();
      }
    }
  }, [gamePhase, currentShowingIndex, sequence.length]);

  const handleColorClick = (colorIndex: number) => {
    if (gamePhase !== 'input') return;
    
    const newUserSequence = [...userSequence, colorIndex];
    setUserSequence(newUserSequence);
    
    const currentStep = newUserSequence.length - 1;
    const expectedColor = sequence[currentStep];
    
    if (colorIndex !== expectedColor) {
      // Wrong color clicked
      setGamePhase('failure');
      setMessage(`❌ Wrong! Expected ${colorNames[expectedColor]}, got ${colorNames[colorIndex]}`);
      setTimeout(() => {
        setGamePhase('waiting');
        setSequence([]);
        setUserSequence([]);
        setMessage('Click Start to begin!');
      }, 2000);
      return;
    }
    
    // Correct color clicked
    if (newUserSequence.length === sequence.length) {
      // Sequence completed successfully
      setGamePhase('success');
      setMessage(`✅ Perfect! Level ${level} completed!`);
      setTimeout(() => {
        startNewRound();
      }, 2000);
    }
  };

  const getCurrentShowingColor = () => {
    if (gamePhase === 'showing' && currentShowingIndex > 0 && currentShowingIndex <= sequence.length) {
      return sequence[currentShowingIndex - 1];
    }
    return null;
  };

  const showingColorIndex = getCurrentShowingColor();

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🎵 Sequence Builder
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Level {level} - {message}
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 100px)', gap: 2, mb: 3 }}>
        {colors.map((color, index) => (
          <Box
            key={index}
            onClick={() => handleColorClick(index)}
            sx={{
              width: '100px',
              height: '100px',
              backgroundColor: gamePhase === 'showing' && showingColorIndex === index ? 
                colors[index] : color,
              borderRadius: '50%',
              cursor: gamePhase === 'input' ? 'pointer' : 'default',
              transition: 'all 0.3s',
              transform: gamePhase === 'showing' && showingColorIndex === index ? 'scale(1.2)' : 'scale(1)',
              boxShadow: gamePhase === 'showing' && showingColorIndex === index ? 
                '0 0 20px rgba(255,255,255,0.8)' : 'none',
              opacity: gamePhase === 'showing' && showingColorIndex !== null && showingColorIndex !== index ? 0.3 : 1,
              '&:hover': gamePhase === 'input' ? {
                transform: 'scale(1.1)',
                boxShadow: '0 0 15px rgba(255,255,255,0.5)',
              } : {},
            }}
          />
        ))}
      </Box>

      {gamePhase === 'input' && (
        <Typography variant="body1" sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
          Progress: {userSequence.length} / {sequence.length}
        </Typography>
      )}

      {gamePhase === 'waiting' && (
        <Button variant="contained" onClick={startGame} size="large">
          Start Game
        </Button>
      )}
    </GameContainer>
  );
};


const MathGame: React.FC = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState('+');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const operations = ['+', '-', '*'];
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setOperation(operations[Math.floor(Math.random() * operations.length)]);
    setAnswer('');
    setMessage('');
  };

  const calculateAnswer = () => {
    switch (operation) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '*': return num1 * num2;
      default: return 0;
    }
  };

  const checkAnswer = () => {
    const correctAnswer = calculateAnswer();
    const userAnswer = parseInt(answer);
    
    if (userAnswer === correctAnswer) {
      setScore(score + 10);
      setMessage('✅ Correct!');
      setTimeout(generateQuestion, 1500);
    } else {
      setMessage('❌ Try again!');
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🔢 Math Operations
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        Score: {score}
      </Typography>

      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
          {num1} {operation} {num2} = ?
        </Typography>
        
        <TextField
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          type="number"
          sx={{
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiOutlinedInput-root': { 
              '& fieldset': { borderColor: '#666' },
              '&:hover fieldset': { borderColor: '#666' },
              '&.Mui-focused fieldset': { borderColor: '#666' },
            },
          }}
          placeholder="Enter answer"
        />
      </Box>

      <Button variant="contained" onClick={checkAnswer} disabled={!answer}>
        Check Answer
      </Button>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Correct') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
          mt: 2,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};
const LogicGatesGame: React.FC = () => {
  const [input1, setInput1] = useState(false);
  const [input2, setInput2] = useState(false);
  const [selectedGate, setSelectedGate] = useState('AND');
  const [userOutput, setUserOutput] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  const calculateOutput = (gate: string, a: boolean, b: boolean) => {
    switch (gate) {
      case 'AND': return a && b;
      case 'OR': return a || b;
      case 'NOT': return !a;
      case 'XOR': return a !== b;
      default: return false;
    }
  };

  const checkAnswer = (output: boolean) => {
    const correct = calculateOutput(selectedGate, input1, input2);
    setUserOutput(output);
    
    if (output === correct) {
      setScore(score + 1);
      setMessage('✅ Correct!');
      // Generate new inputs after a delay
      setTimeout(() => {
        setInput1(Math.random() > 0.5);
        setInput2(Math.random() > 0.5);
        setUserOutput(null);
        setMessage('');
      }, 1500);
    } else {
      setMessage('❌ Wrong! The correct answer was ' + (correct ? 'TRUE' : 'FALSE'));
      setTimeout(() => {
        setUserOutput(null);
        setMessage('');
      }, 2000);
    }
  };

  const resetGame = () => {
    setInput1(false);
    setInput2(false);
    setUserOutput(null);
    setMessage('');
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🔌 Logic Gates
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ mb: 2 }}>
          <InputLabel sx={{ color: 'white' }}>Logic Gate</InputLabel>
          <Select
            value={selectedGate}
            onChange={(e) => setSelectedGate(e.target.value)}
            sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#666' } }}
          >
            <MenuItem value="AND">AND</MenuItem>
            <MenuItem value="OR">OR</MenuItem>
            <MenuItem value="NOT">NOT</MenuItem>
            <MenuItem value="XOR">XOR</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
        <Button 
          variant={input1 ? 'contained' : 'outlined'} 
          onClick={() => setInput1(!input1)}
          sx={{ minWidth: '80px' }}
        >
          Input 1: {input1 ? '1' : '0'}
        </Button>
        {selectedGate !== 'NOT' && (
          <Button 
            variant={input2 ? 'contained' : 'outlined'} 
            onClick={() => setInput2(!input2)}
            sx={{ minWidth: '80px' }}
          >
            Input 2: {input2 ? '1' : '0'}
          </Button>
        )}
      </Box>

      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        What is the output of {selectedGate}?
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
        <Button 
          variant="contained" 
          color="success"
          onClick={() => checkAnswer(true)}
          disabled={userOutput !== null}
        >
          TRUE (1)
        </Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={() => checkAnswer(false)}
          disabled={userOutput !== null}
        >
          FALSE (0)
        </Button>
      </Box>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Correct') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
          textAlign: 'center',
        }}>
          {message}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="outlined" onClick={resetGame} sx={{ color: 'white', borderColor: '#666' }}>
          Reset Inputs
        </Button>
      </Box>
    </GameContainer>
  );
};
const QuizGame: React.FC = () => {
  const questions = [
    { question: "What does 'if' do in programming?", answers: ["Makes coffee", "Tests a condition", "Creates a loop", "Defines a variable"], correct: 1 },
    { question: "What is a variable?", answers: ["A type of loop", "A container for data", "A math operation", "A comment"], correct: 1 },
    { question: "What does 'for' create?", answers: ["A condition", "A loop", "A function", "A variable"], correct: 1 },
    { question: "What is an array?", answers: ["A single value", "A collection of values", "A math operation", "A comment"], correct: 1 },
  ];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerClick = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        ❓ Coding Quiz
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}/{questions.length}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        {questions[currentQuestion].question}
      </Typography>

      <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
        {questions[currentQuestion].answers.map((answer, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => handleAnswerClick(index)}
            disabled={showResult}
            sx={{
              justifyContent: 'flex-start',
              color: 'white',
              borderColor: '#666',
              backgroundColor: showResult ? 
                (index === questions[currentQuestion].correct ? '#4caf50' : 
                 selectedAnswer === index && index !== questions[currentQuestion].correct ? '#f44336' : 
                 'transparent') : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(144, 202, 249, 0.1)',
              },
            }}
          >
            {answer}
          </Button>
        ))}
      </Box>

      {showResult && (
        <Typography variant="h6" sx={{ 
          color: selectedAnswer === questions[currentQuestion].correct ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
        }}>
          {selectedAnswer === questions[currentQuestion].correct ? '✅ Correct!' : '❌ Incorrect!'}
        </Typography>
      )}

      {currentQuestion === questions.length - 1 && showResult && (
        <Button variant="contained" onClick={resetQuiz} sx={{ mt: 2 }}>
          Play Again
        </Button>
      )}
    </GameContainer>
  );
};

const AlgorithmGame: React.FC = () => {
  const [array, setArray] = useState([5, 3, 8, 1, 9, 2]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSorting, setIsSorting] = useState(false);
  const [message, setMessage] = useState('Click Bubble Sort to see the algorithm in action!');

  const bubbleSortStep = () => {
    if (isSorting) return;
    
    setIsSorting(true);
    let arr = [...array];
    let i = 0;
    let j = 0;
    let swapped = false;
    
    const interval = setInterval(() => {
      if (j < arr.length - i - 1) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
          setArray([...arr]);
          setMessage(`Swapping ${arr[j]} and ${arr[j + 1]}`);
        }
        j++;
      } else {
        if (!swapped) {
          clearInterval(interval);
          setIsSorting(false);
          setMessage('Array is sorted! 🎉');
          return;
        }
        i++;
        j = 0;
        swapped = false;
        if (i >= arr.length - 1) {
          clearInterval(interval);
          setIsSorting(false);
          setMessage('Sorting complete! 🎉');
        }
      }
    }, 1000);
  };

  const resetArray = () => {
    setArray([5, 3, 8, 1, 9, 2]);
    setMessage('Click Bubble Sort to see the algorithm in action!');
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🔄 Algorithm Visualization
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        {message}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center' }}>
        {array.map((num, index) => (
          <Box
            key={index}
            sx={{
              width: '50px',
              height: `${num * 20}px`,
              backgroundColor: '#4caf50',
              borderRadius: '5px 5px 0 0',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              minHeight: '20px',
              transition: 'all 0.5s',
            }}
          >
            {num}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={bubbleSortStep} disabled={isSorting}>
          Bubble Sort
        </Button>
        <Button variant="outlined" onClick={resetArray} sx={{ color: 'white', borderColor: '#666' }}>
          Reset
        </Button>
      </Box>
    </GameContainer>
  );
};

const DebuggingGame: React.FC = () => {
  const bugs = [
    { code: 'if (x = 5) { console.log("Hello"); }', error: 'Assignment instead of comparison', fix: 'if (x == 5) { console.log("Hello"); }' },
    { code: 'for (i = 0; i < 10; i--) { sum += i; }', error: 'Wrong increment direction', fix: 'for (i = 0; i < 10; i++) { sum += i; }' },
    { code: 'function add(a, b) { return a - b; }', error: 'Wrong operation', fix: 'function add(a, b) { return a + b; }' },
    { code: 'let arr = [1, 2, 3]; console.log(arr[3]);', error: 'Array index out of bounds', fix: 'let arr = [1, 2, 3]; console.log(arr[2]);' },
  ];
  
  const [currentBug, setCurrentBug] = useState(0);
  const [userFix, setUserFix] = useState('');
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const checkFix = () => {
    const correct = bugs[currentBug].fix.toLowerCase().replace(/\s+/g, '');
    const userAnswer = userFix.toLowerCase().replace(/\s+/g, '');
    
    if (userAnswer === correct) {
      setScore(score + 1);
      setShowAnswer(true);
      setTimeout(() => {
        if (currentBug < bugs.length - 1) {
          setCurrentBug(currentBug + 1);
          setUserFix('');
          setShowAnswer(false);
        }
      }, 2000);
    } else {
      setShowAnswer(true);
    }
  };

  const nextBug = () => {
    if (currentBug < bugs.length - 1) {
      setCurrentBug(currentBug + 1);
      setUserFix('');
      setShowAnswer(false);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🐛 Debugging Challenge
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}/{bugs.length}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#f44336', mb: 2 }}>
          Bug: {bugs[currentBug].error}
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', fontFamily: 'monospace', mb: 2 }}>
          {bugs[currentBug].code}
        </Typography>
        
        <TextField
          fullWidth
          value={userFix}
          onChange={(e) => setUserFix(e.target.value)}
          placeholder="Enter the corrected code..."
          sx={{
            mb: 2,
            '& .MuiInputBase-input': { color: 'white', fontFamily: 'monospace' },
            '& .MuiOutlinedInput-root': { 
              '& fieldset': { borderColor: '#666' },
              '&:hover fieldset': { borderColor: '#666' },
              '&.Mui-focused fieldset': { borderColor: '#666' },
            },
          }}
        />

        {showAnswer && (
          <Typography variant="body2" sx={{ color: '#4caf50', fontFamily: 'monospace' }}>
            Correct: {bugs[currentBug].fix}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={checkFix} disabled={!userFix || showAnswer}>
          Check Fix
        </Button>
        {showAnswer && currentBug < bugs.length - 1 && (
          <Button variant="outlined" onClick={nextBug} sx={{ color: 'white', borderColor: '#666' }}>
            Next Bug
          </Button>
        )}
      </Box>
    </GameContainer>
  );
};

const VariableGame: React.FC = () => {
  const [variables, setVariables] = useState<Record<string, number>>({ x: 0, y: 0, z: 0 });
  const [currentTask, setCurrentTask] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const tasks = [
    { description: 'Set x to 5', check: (vars: Record<string, number>) => vars.x === 5, hint: 'x = 5;' },
    { description: 'Set y to x + 3', check: (vars: Record<string, number>) => vars.y === 8, hint: 'y = x + 3;' },
    { description: 'Set z to x * y', check: (vars: Record<string, number>) => vars.z === 40, hint: 'z = x * y;' },
    { description: 'Swap x and y values', check: (vars: Record<string, number>) => vars.x === 8 && vars.y === 5, hint: 'temp = x; x = y; y = temp;' },
  ];

  const executeCode = () => {
    try {
      let vars = { ...variables };
      // Simple code execution simulation
      const lines = userCode.split(';').map(line => line.trim()).filter(line => line);
      
      lines.forEach(line => {
        if (line.includes('=')) {
          const [varName, expression] = line.split('=').map(s => s.trim());
          if (expression.includes('+')) {
            const [a, b] = expression.split('+').map(s => s.trim());
            vars[varName] = (vars[a] || parseInt(a) || 0) + (vars[b] || parseInt(b) || 0);
          } else if (expression.includes('*')) {
            const [a, b] = expression.split('*').map(s => s.trim());
            vars[varName] = (vars[a] || parseInt(a) || 0) * (vars[b] || parseInt(b) || 0);
          } else if (expression.includes('-')) {
            const [a, b] = expression.split('-').map(s => s.trim());
            vars[varName] = (vars[a] || parseInt(a) || 0) - (vars[b] || parseInt(b) || 0);
          } else {
            vars[varName] = vars[expression] || parseInt(expression) || 0;
          }
        }
      });
      
      setVariables(vars);
      
      if (tasks[currentTask].check(vars)) {
        setScore(score + 1);
        setMessage('✅ Correct!');
        setTimeout(() => {
          if (currentTask < tasks.length - 1) {
            setCurrentTask(currentTask + 1);
            setUserCode('');
            setMessage('');
          }
        }, 1500);
      } else {
        setMessage('❌ Try again!');
      }
    } catch (error) {
      setMessage('❌ Syntax error!');
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        📊 Variable Assignment
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}/{tasks.length}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Task: {tasks[currentTask].description}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
          Current variables:
        </Typography>
        {Object.entries(variables).map(([name, value]) => (
          <Typography key={name} variant="body2" sx={{ color: '#4caf50', fontFamily: 'monospace' }}>
            {name} = {value}
          </Typography>
        ))}
      </Box>

      <TextField
        fullWidth
        value={userCode}
        onChange={(e) => setUserCode(e.target.value)}
        placeholder="Enter code (e.g., x = 5; y = x + 3;)"
        sx={{
          mb: 2,
          '& .MuiInputBase-input': { color: 'white', fontFamily: 'monospace' },
          '& .MuiOutlinedInput-root': { 
            '& fieldset': { borderColor: '#666' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#666' },
          },
        }}
      />

      <Button variant="contained" onClick={executeCode} disabled={!userCode}>
        Execute Code
      </Button>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Correct') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
          mt: 2,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

const LoopGame: React.FC = () => {
  const [target, setTarget] = useState(10);
  const [userLoop, setUserLoop] = useState('');
  const [result, setResult] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const executeLoop = () => {
    try {
      let output: number[] = [];
      // Simple loop execution simulation
      const loopMatch = userLoop.match(/for\s*\(\s*let\s+(\w+)\s*=\s*(\d+)\s*;\s*\w+\s*<\s*(\d+)\s*;\s*\w+\+\+\s*\)\s*{\s*(\w+)\.push\(\w+\)\s*}/);
      
      if (loopMatch) {
        const start = parseInt(loopMatch[2]);
        const end = parseInt(loopMatch[3]);
        
        for (let i = start; i < end; i++) {
          output.push(i);
        }
        
        setResult(output);
        
        if (output.length === target && output.every((num, idx) => num === idx)) {
          setScore(score + 1);
          setMessage('✅ Perfect loop!');
          setTimeout(() => {
            setTarget(Math.floor(Math.random() * 10) + 5);
            setUserLoop('');
            setResult([]);
            setMessage('');
          }, 1500);
        } else {
          setMessage('❌ Loop doesn\'t produce the right sequence!');
        }
      } else {
        setMessage('❌ Invalid loop syntax!');
      }
    } catch (error) {
      setMessage('❌ Execution error!');
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🔄 Loop Control
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Create a loop that generates numbers from 0 to {target - 1}
      </Typography>

      <TextField
        fullWidth
        value={userLoop}
        onChange={(e) => setUserLoop(e.target.value)}
        placeholder="for (let i = 0; i < 10; i++) { result.push(i); }"
        sx={{
          mb: 2,
          '& .MuiInputBase-input': { color: 'white', fontFamily: 'monospace' },
          '& .MuiOutlinedInput-root': { 
            '& fieldset': { borderColor: '#666' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#666' },
          },
        }}
      />

      <Button variant="contained" onClick={executeLoop} disabled={!userLoop}>
        Run Loop
      </Button>

      {result.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
            Output: [{result.join(', ')}]
          </Typography>
        </Box>
      )}

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Perfect') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
          mt: 2,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

const FunctionGame: React.FC = () => {
  const [functions, setFunctions] = useState<Record<string, any>>({});
  const [currentTask, setCurrentTask] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const tasks = [
    { 
      description: 'Create a function that adds two numbers', 
      test: 'add(3, 5)', 
      expected: 8,
      hint: 'function add(a, b) { return a + b; }' 
    },
    { 
      description: 'Create a function that multiplies by 2', 
      test: 'double(4)', 
      expected: 8,
      hint: 'function double(x) { return x * 2; }' 
    },
    { 
      description: 'Create a function that checks if even', 
      test: 'isEven(6)', 
      expected: true,
      hint: 'function isEven(n) { return n % 2 === 0; }' 
    },
  ];

  const executeCode = () => {
    try {
      let funcs: Record<string, any> = {};
      
      // Simple function definition parsing
      const funcMatch = userCode.match(/function\s+(\w+)\s*\(([^)]*)\)\s*{\s*return\s+([^;]+);\s*}/);
      
      if (funcMatch) {
        const funcName = funcMatch[1];
        const params = funcMatch[2].split(',').map(p => p.trim());
        const body = funcMatch[3].trim();
        
        // Create function
        funcs[funcName] = new Function(...params, `return ${body};`);
        
        setFunctions(funcs);
        
        // Test the function
        const task = tasks[currentTask];
        let result;
        
        if (task.test.includes('add')) {
          result = funcs.add ? funcs.add(3, 5) : null;
        } else if (task.test.includes('double')) {
          result = funcs.double ? funcs.double(4) : null;
        } else if (task.test.includes('isEven')) {
          result = funcs.isEven ? funcs.isEven(6) : null;
        }
        
        if (result === task.expected) {
          setScore(score + 1);
          setMessage('✅ Function works correctly!');
          setTimeout(() => {
            if (currentTask < tasks.length - 1) {
              setCurrentTask(currentTask + 1);
              setUserCode('');
              setMessage('');
            }
          }, 1500);
        } else {
          setMessage('❌ Function doesn\'t work as expected!');
        }
      } else {
        setMessage('❌ Invalid function syntax!');
      }
    } catch (error) {
      setMessage('❌ Execution error!');
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        ⚙️ Function Calling
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}/{tasks.length}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        {tasks[currentTask].description}
      </Typography>

      <Typography variant="body2" sx={{ color: '#4caf50', mb: 2 }}>
        Test: {tasks[currentTask].test} should return {tasks[currentTask].expected}
      </Typography>

      <TextField
        fullWidth
        value={userCode}
        onChange={(e) => setUserCode(e.target.value)}
        placeholder="function add(a, b) { return a + b; }"
        sx={{
          mb: 2,
          '& .MuiInputBase-input': { color: 'white', fontFamily: 'monospace' },
          '& .MuiOutlinedInput-root': { 
            '& fieldset': { borderColor: '#666' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#666' },
          },
        }}
      />

      <Button variant="contained" onClick={executeCode} disabled={!userCode}>
        Create Function
      </Button>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('correctly') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
          mt: 2,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

// Additional Game Components (18-31) - these were missing from the original file
const BinaryConversionGame: React.FC = () => {
  const [decimal, setDecimal] = useState(5);
  const [userBinary, setUserBinary] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const checkAnswer = () => {
    const correctBinary = decimal.toString(2);
    if (userBinary === correctBinary) {
      setScore(score + 1);
      setMessage('✅ Correct!');
      setTimeout(() => {
        setDecimal(Math.floor(Math.random() * 16) + 1);
        setUserBinary('');
        setMessage('');
      }, 1500);
    } else {
      setMessage('❌ Try again!');
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🔢 Binary Conversion
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Convert {decimal} to binary:
      </Typography>

      <TextField
        value={userBinary}
        onChange={(e) => setUserBinary(e.target.value)}
        placeholder="Enter binary (e.g., 101)"
        sx={{
          mb: 2,
          '& .MuiInputBase-input': { color: 'white' },
          '& .MuiOutlinedInput-root': { 
            '& fieldset': { borderColor: '#666' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#666' },
          },
        }}
      />

      <Button variant="contained" onClick={checkAnswer} disabled={!userBinary}>
        Check Answer
      </Button>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Correct') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
          mt: 2,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

const CodeCompletionGame: React.FC = () => {
  const snippets = [
    { code: 'for (let i = 0; ___; i++)', answer: 'i < 10', explanation: 'Loop condition' },
    { code: 'if (___) { console.log("Hello"); }', answer: 'x > 5', explanation: 'Conditional statement' },
    { code: 'function add(a, ___) { return a + b; }', answer: 'b', explanation: 'Parameter declaration' },
  ];

  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const checkAnswer = () => {
    if (userAnswer.toLowerCase().replace(/\s+/g, '') === snippets[currentSnippet].answer.toLowerCase().replace(/\s+/g, '')) {
      setScore(score + 1);
      setMessage('✅ Correct!');
      setTimeout(() => {
        if (currentSnippet < snippets.length - 1) {
          setCurrentSnippet(currentSnippet + 1);
          setUserAnswer('');
          setMessage('');
        }
      }, 1500);
    } else {
      setMessage('❌ Try again!');
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        💻 Code Completion
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}/{snippets.length}
      </Typography>

      <Box sx={{ mb: 3, p: 2, backgroundColor: '#333', borderRadius: '8px' }}>
        <Typography variant="body1" sx={{ color: 'white', fontFamily: 'monospace', mb: 1 }}>
          {snippets[currentSnippet].code}
        </Typography>
        <Typography variant="caption" sx={{ color: '#ccc' }}>
          {snippets[currentSnippet].explanation}
        </Typography>
      </Box>

      <TextField
        fullWidth
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Fill in the blank..."
        sx={{
          mb: 2,
          '& .MuiInputBase-input': { color: 'white', fontFamily: 'monospace' },
          '& .MuiOutlinedInput-root': { 
            '& fieldset': { borderColor: '#666' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#666' },
          },
        }}
      />

      <Button variant="contained" onClick={checkAnswer} disabled={!userAnswer}>
        Check Answer
      </Button>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Correct') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
          mt: 2,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

const DataTypesGame: React.FC = () => {
  const questions = [
    { value: '"Hello"', type: 'string', options: ['string', 'number', 'boolean', 'undefined'] },
    { value: '42', type: 'number', options: ['string', 'number', 'boolean', 'undefined'] },
    { value: 'true', type: 'boolean', options: ['string', 'number', 'boolean', 'undefined'] },
    { value: 'null', type: 'object', options: ['string', 'number', 'boolean', 'object'] },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestion].type) {
      setScore(score + 1);
      setMessage('✅ Correct!');
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer('');
          setMessage('');
        }
      }, 1500);
    } else {
      setMessage('❌ Incorrect!');
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        📋 Data Types Quiz
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        Score: {score}/{questions.length}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        What type is: <code style={{ color: '#4caf50', fontSize: '1.2em' }}>{questions[currentQuestion].value}</code>
      </Typography>

      <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
        {questions[currentQuestion].options.map((option) => (
          <Button
            key={option}
            variant="outlined"
            onClick={() => handleAnswer(option)}
            sx={{
              color: 'white',
              borderColor: '#666',
              '&:hover': {
                backgroundColor: 'rgba(144, 202, 249, 0.1)',
                borderColor: '#90caf9',
              },
            }}
          >
            {option}
          </Button>
        ))}
      </Box>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Correct') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

const SyntaxErrorGame: React.FC = () => {
  const errors = [
    { code: 'console.log("Hello World)', error: 'Missing closing quote', fix: 'console.log("Hello World")' },
    { code: 'if (x > 5 { console.log("Hi"); }', error: 'Missing closing parenthesis', fix: 'if (x > 5) { console.log("Hi"); }' },
    { code: 'function test( { return true; }', error: 'Missing parameter name', fix: 'function test(param) { return true; }' },
  ];

  const [currentError, setCurrentError] = useState(0);
  const [userFix, setUserFix] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const checkFix = () => {
    if (userFix.replace(/\s+/g, '') === errors[currentError].fix.replace(/\s+/g, '')) {
      setScore(score + 1);
      setShowAnswer(true);
      setTimeout(() => {
        if (currentError < errors.length - 1) {
          setCurrentError(currentError + 1);
          setUserFix('');
          setShowAnswer(false);
        }
      }, 2000);
    } else {
      setShowAnswer(true);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🚨 Syntax Error Fix
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}/{errors.length}
      </Typography>

      <Typography variant="body2" sx={{ color: '#f44336', mb: 2 }}>
        Error: {errors[currentError].error}
      </Typography>

      <Box sx={{ mb: 3, p: 2, backgroundColor: '#333', borderRadius: '8px' }}>
        <Typography variant="body1" sx={{ color: 'white', fontFamily: 'monospace' }}>
          {errors[currentError].code}
        </Typography>
      </Box>

      <TextField
        fullWidth
        value={userFix}
        onChange={(e) => setUserFix(e.target.value)}
        placeholder="Enter the corrected code..."
        sx={{
          mb: 2,
          '& .MuiInputBase-input': { color: 'white', fontFamily: 'monospace' },
          '& .MuiOutlinedInput-root': { 
            '& fieldset': { borderColor: '#666' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#666' },
          },
        }}
      />

      {showAnswer && (
        <Typography variant="body2" sx={{ color: '#4caf50', fontFamily: 'monospace', mb: 2 }}>
          Correct: {errors[currentError].fix}
        </Typography>
      )}

      <Button variant="contained" onClick={checkFix} disabled={!userFix || showAnswer}>
        Check Fix
      </Button>
    </GameContainer>
  );
};

const FlowchartGame: React.FC = () => {
  const problems = [
    {
      question: 'Calculate sum of numbers 1 to 10',
      steps: ['Initialize sum = 0', 'Initialize i = 1', 'Add i to sum', 'Increment i', 'Check if i <= 10'],
      correctOrder: [1, 0, 2, 3, 4]
    }
  ];

  const [currentProblem, setCurrentProblem] = useState(0);
  const [userOrder, setUserOrder] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const handleStepClick = (stepIndex: number) => {
    if (!userOrder.includes(stepIndex)) {
      setUserOrder([...userOrder, stepIndex]);
    }
  };

  const checkOrder = () => {
    const isCorrect = userOrder.every((step, index) => step === problems[currentProblem].correctOrder[index]);
    if (isCorrect && userOrder.length === problems[currentProblem].correctOrder.length) {
      setScore(score + 1);
      setMessage('✅ Perfect flow!');
      setTimeout(() => {
        setUserOrder([]);
        setMessage('');
      }, 2000);
    } else {
      setMessage('❌ Incorrect order!');
      setTimeout(() => {
        setUserOrder([]);
        setMessage('');
      }, 1500);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        📊 Flowchart Logic
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        Arrange the steps in correct order:
      </Typography>

      <Typography variant="body1" sx={{ color: '#90caf9', mb: 3 }}>
        {problems[currentProblem].question}
      </Typography>

      <Box sx={{ mb: 3, width: '100%' }}>
        <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
          Your order:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {userOrder.map((stepIndex, index) => (
            <Chip
              key={index}
              label={`${index + 1}. ${problems[currentProblem].steps[stepIndex]}`}
              sx={{ backgroundColor: '#666', color: 'white' }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, mb: 3, width: '100%' }}>
        {problems[currentProblem].steps.map((step, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => handleStepClick(index)}
            disabled={userOrder.includes(index)}
            sx={{
              color: 'white',
              borderColor: '#666',
              justifyContent: 'flex-start',
              '&:hover': {
                backgroundColor: 'rgba(144, 202, 249, 0.1)',
              },
            }}
          >
            {step}
          </Button>
        ))}
      </Box>

      <Button variant="contained" onClick={checkOrder} disabled={userOrder.length !== problems[currentProblem].steps.length}>
        Check Order
      </Button>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Perfect') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
          mt: 2,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

const ConditionalGame: React.FC = () => {
  const scenarios = [
    { condition: 'x > 10', result: 'High', options: ['Low', 'Medium', 'High'] },
    { condition: 'age < 18', result: 'Minor', options: ['Adult', 'Senior', 'Minor'] },
    { condition: 'score >= 90', result: 'Excellent', options: ['Good', 'Average', 'Excellent'] },
  ];

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === scenarios[currentScenario].result) {
      setScore(score + 1);
      setMessage('✅ Correct logic!');
      setTimeout(() => {
        if (currentScenario < scenarios.length - 1) {
          setCurrentScenario(currentScenario + 1);
          setSelectedAnswer('');
          setMessage('');
        }
      }, 1500);
    } else {
      setMessage('❌ Wrong outcome!');
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🔀 Conditional Logic
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        Score: {score}/{scenarios.length}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        If <code style={{ color: '#4caf50' }}>{scenarios[currentScenario].condition}</code>, what should happen?
      </Typography>

      <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
        {scenarios[currentScenario].options.map((option) => (
          <Button
            key={option}
            variant="outlined"
            onClick={() => handleAnswer(option)}
            sx={{
              color: 'white',
              borderColor: '#666',
              '&:hover': {
                backgroundColor: 'rgba(144, 202, 249, 0.1)',
                borderColor: '#90caf9',
              },
            }}
          >
            {option}
          </Button>
        ))}
      </Box>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Correct') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

const ArrayMethodsGame: React.FC = () => {
  const problems = [
    { array: '[1, 2, 3, 4, 5]', method: 'get length', answer: '5', hint: '.length' },
    { array: '[1, 2, 3]', method: 'add 4 to end', answer: '[1, 2, 3, 4]', hint: '.push(4)' },
    { array: '[1, 2, 3]', method: 'remove last element', answer: '[1, 2]', hint: '.pop()' },
  ];

  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const checkAnswer = () => {
    if (userAnswer.replace(/\s+/g, '') === problems[currentProblem].answer.replace(/\s+/g, '')) {
      setScore(score + 1);
      setMessage('✅ Correct!');
      setTimeout(() => {
        if (currentProblem < problems.length - 1) {
          setCurrentProblem(currentProblem + 1);
          setUserAnswer('');
          setMessage('');
        }
      }, 1500);
    } else {
      setMessage('❌ Try again!');
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        📚 Array Methods
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}/{problems.length}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Array: <code style={{ color: '#4caf50' }}>{problems[currentProblem].array}</code>
      </Typography>

      <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
        {problems[currentProblem].method}
      </Typography>

      <TextField
        fullWidth
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Result after operation..."
        sx={{
          mb: 2,
          '& .MuiInputBase-input': { color: 'white' },
          '& .MuiOutlinedInput-root': { 
            '& fieldset': { borderColor: '#666' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#666' },
          },
        }}
      />

      <Button variant="contained" onClick={checkAnswer} disabled={!userAnswer}>
        Check Answer
      </Button>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Correct') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
          mt: 2,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

const InheritanceGame: React.FC = () => {
  const questions = [
    {
      question: 'What does a child class inherit from a parent class?',
      options: ['Methods and properties', 'Only methods', 'Only properties', 'Nothing'],
      correct: 0
    },
    {
      question: 'What keyword is used to extend a class?',
      options: ['extends', 'inherits', 'implements', 'uses'],
      correct: 0
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
      setMessage('✅ Correct!');
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setMessage('');
        }
      }, 1500);
    } else {
      setMessage('❌ Incorrect!');
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🏗️ OOP Inheritance
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        Score: {score}/{questions.length}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        {questions[currentQuestion].question}
      </Typography>

      <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
        {questions[currentQuestion].options.map((option, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => handleAnswer(index)}
            sx={{
              color: 'white',
              borderColor: '#666',
              '&:hover': {
                backgroundColor: 'rgba(144, 202, 249, 0.1)',
                borderColor: '#90caf9',
              },
            }}
          >
            {option}
          </Button>
        ))}
      </Box>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Correct') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

const RecursionGame: React.FC = () => {
  const [number, setNumber] = useState(5);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  const checkAnswer = () => {
    const correct = factorial(number);
    if (parseInt(userAnswer) === correct) {
      setScore(score + 1);
      setMessage('✅ Correct!');
      setTimeout(() => {
        setNumber(Math.floor(Math.random() * 7) + 1);
        setUserAnswer('');
        setMessage('');
      }, 1500);
    } else {
      setMessage('❌ Try again!');
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🔄 Recursion Mastery
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Calculate factorial of {number} recursively:
      </Typography>

      <Typography variant="body2" sx={{ color: '#ccc', mb: 2 }}>
        Factorial: n! = n × (n-1) × (n-2) × ... × 1
      </Typography>

      <TextField
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        type="number"
        placeholder="Enter result..."
        sx={{
          mb: 2,
          '& .MuiInputBase-input': { color: 'white' },
          '& .MuiOutlinedInput-root': { 
            '& fieldset': { borderColor: '#666' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#666' },
          },
        }}
      />

      <Button variant="contained" onClick={checkAnswer} disabled={!userAnswer}>
        Check Answer
      </Button>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Correct') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
          mt: 2,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

const EventHandlingGame: React.FC = () => {
  const [events, setEvents] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Click buttons in order: Click, Double Click, Right Click');

  const handleClick = () => {
    if (events.length === 0) {
      setEvents(['click']);
      setMessage('Good! Now double-click...');
    }
  };

  const handleDoubleClick = () => {
    if (events.length === 1 && events[0] === 'click') {
      setEvents(['click', 'dblclick']);
      setMessage('Excellent! Now right-click...');
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (events.length === 2 && events[1] === 'dblclick') {
      setScore(score + 1);
      setMessage('🎉 Perfect sequence!');
      setTimeout(() => {
        setEvents([]);
        setMessage('Click buttons in order: Click, Double Click, Right Click');
      }, 2000);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🖱️ Event Handling
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}
      </Typography>

      <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>
        {message}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onContextMenu={handleRightClick}
          sx={{
            width: '200px',
            height: '200px',
            fontSize: '1.2rem',
            backgroundColor: '#666',
            '&:hover': {
              backgroundColor: '#777',
            },
          }}
        >
          🎯
        </Button>
      </Box>

      <Typography variant="caption" sx={{ color: '#ccc' }}>
        Progress: {events.length}/3 events
      </Typography>
    </GameContainer>
  );
};

const AsyncGame: React.FC = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Start the async operation');

  const steps = [
    'Start async operation',
    'Make API call',
    'Wait for response',
    'Process data',
    'Update UI'
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      setMessage(steps[step + 1]);
    } else {
      setScore(score + 1);
      setMessage('🎉 Async operation complete!');
      setTimeout(() => {
        setStep(0);
        setMessage('Start the async operation');
      }, 2000);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        ⚡ Async Programming
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        {message}
      </Typography>

      <Box sx={{ mb: 3 }}>
        {steps.map((stepText, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              mb: 1,
              borderRadius: '8px',
              backgroundColor: index <= step ? '#4caf50' : '#333',
              color: 'white',
              transition: 'all 0.3s',
            }}
          >
            {index + 1}. {stepText}
          </Box>
        ))}
      </Box>

      <Button variant="contained" onClick={handleNext}>
        Next Step
      </Button>
    </GameContainer>
  );
};

const APIGame: React.FC = () => {
  const endpoints = [
    { method: 'GET', path: '/users', description: 'Retrieve all users' },
    { method: 'POST', path: '/users', description: 'Create new user' },
    { method: 'PUT', path: '/users/:id', description: 'Update user' },
    { method: 'DELETE', path: '/users/:id', description: 'Delete user' },
  ];

  const [currentEndpoint, setCurrentEndpoint] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const checkAnswer = () => {
    if (selectedMethod === endpoints[currentEndpoint].method) {
      setScore(score + 1);
      setMessage('✅ Correct HTTP method!');
      setTimeout(() => {
        if (currentEndpoint < endpoints.length - 1) {
          setCurrentEndpoint(currentEndpoint + 1);
          setSelectedMethod('');
          setMessage('');
        }
      }, 1500);
    } else {
      setMessage('❌ Wrong method!');
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🌐 API Methods
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}/{endpoints.length}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        {endpoints[currentEndpoint].description}
      </Typography>

      <Typography variant="body1" sx={{ color: '#90caf9', mb: 3 }}>
        Endpoint: <code>{endpoints[currentEndpoint].path}</code>
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel sx={{ color: 'white' }}>HTTP Method</InputLabel>
        <Select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
          sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#666' } }}
        >
          <MenuItem value="GET">GET</MenuItem>
          <MenuItem value="POST">POST</MenuItem>
          <MenuItem value="PUT">PUT</MenuItem>
          <MenuItem value="DELETE">DELETE</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" onClick={checkAnswer} disabled={!selectedMethod}>
        Check Method
      </Button>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('Correct') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
          mt: 2,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

const SecurityGame: React.FC = () => {
  const questions = [
    {
      question: 'What should you NEVER do with user passwords?',
      options: ['Store them in plain text', 'Hash them with salt', 'Use HTTPS', 'Validate length'],
      correct: 0
    },
    {
      question: 'What helps prevent SQL injection?',
      options: ['Using old drivers', 'Prepared statements', 'Plain SQL strings', 'No validation'],
      correct: 1
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
      setMessage('✅ Security best practice!');
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setMessage('');
        }
      }, 1500);
    } else {
      setMessage('❌ Security vulnerability!');
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🔒 Security Awareness
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        Score: {score}/{questions.length}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
        {questions[currentQuestion].question}
      </Typography>

      <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
        {questions[currentQuestion].options.map((option, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => handleAnswer(index)}
            sx={{
              color: 'white',
              borderColor: '#666',
              justifyContent: 'flex-start',
              '&:hover': {
                backgroundColor: 'rgba(144, 202, 249, 0.1)',
              },
            }}
          >
            {option}
          </Button>
        ))}
      </Box>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('practice') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

const TestingGame: React.FC = () => {
  const [testCase, setTestCase] = useState(0);
  const [userResult, setUserResult] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const testCases = [
    { input: 'add(2, 3)', expected: '5', description: 'Test basic addition' },
    { input: 'multiply(4, 5)', expected: '20', description: 'Test multiplication' },
    { input: 'isEven(6)', expected: 'true', description: 'Test even number check' },
  ];

  const checkResult = () => {
    if (userResult === testCases[testCase].expected) {
      setScore(score + 1);
      setMessage('✅ Test passed!');
      setTimeout(() => {
        if (testCase < testCases.length - 1) {
          setTestCase(testCase + 1);
          setUserResult('');
          setMessage('');
        }
      }, 1500);
    } else {
      setMessage('❌ Test failed!');
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <GameContainer elevation={6}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        🧪 Unit Testing
      </Typography>
      
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Score: {score}/{testCases.length}
      </Typography>

      <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
        {testCases[testCase].description}
      </Typography>

      <Typography variant="h6" sx={{ color: '#90caf9', mb: 2 }}>
        Input: {testCases[testCase].input}
      </Typography>

      <Typography variant="body2" sx={{ color: '#ccc', mb: 3 }}>
        Expected: {testCases[testCase].expected}
      </Typography>

      <TextField
        value={userResult}
        onChange={(e) => setUserResult(e.target.value)}
        placeholder="Function result..."
        sx={{
          mb: 2,
          '& .MuiInputBase-input': { color: 'white' },
          '& .MuiOutlinedInput-root': { 
            '& fieldset': { borderColor: '#666' },
            '&:hover fieldset': { borderColor: '#666' },
            '&.Mui-focused fieldset': { borderColor: '#666' },
          },
        }}
      />

      <Button variant="contained" onClick={checkResult} disabled={!userResult}>
        Run Test
      </Button>

      {message && (
        <Typography variant="h6" sx={{ 
          color: message.includes('passed') ? '#4caf50' : '#f44336',
          animation: `${bounce} 0.5s`,
          mt: 2,
        }}>
          {message}
        </Typography>
      )}
    </GameContainer>
  );
};

const Activities: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [completedActivities, setCompletedActivities] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const dispatch = useDispatch();

  const activities: Activity[] = [
    {
      id: 1,
      title: "Robot Movement Basics",
      description: "Learn to move a robot using simple commands",
      difficulty: "Beginner",
      category: "Movement",
      estimatedTime: "5 mins",
      points: 10,
      completed: false,
      content: <RobotMovementGame level={1} />
    },
    {
      id: 2,
      title: "Color Recognition",
      description: "Identify and match different colors programmatically",
      difficulty: "Beginner",
      category: "Logic",
      estimatedTime: "7 mins",
      points: 15,
      completed: false,
      content: <ColorMatchingGame />
    },
    {
      id: 3,
      title: "Shape Sorting",
      description: "Sort shapes by type, size, and color",
      difficulty: "Beginner",
      category: "Sorting",
      estimatedTime: "8 mins",
      points: 20,
      completed: false,
      content: <ShapeSortingGame />
    },
    {
      id: 4,
      title: "Number Line Jump",
      description: "Help the character jump to the correct numbers",
      difficulty: "Beginner",
      category: "Math",
      estimatedTime: "6 mins",
      points: 12,
      completed: false,
      content: <NumberLineGame />
    },
    {
      id: 5,
      title: "Word Builder",
      description: "Build words by arranging letters in order",
      difficulty: "Beginner",
      category: "Strings",
      estimatedTime: "9 mins",
      points: 18,
      completed: false,
      content: <WordBuilderGame />
    },
    {
      id: 6,
      title: "Pattern Recognition",
      description: "Identify and repeat visual patterns",
      difficulty: "Beginner",
      category: "Logic",
      estimatedTime: "6 mins",
      points: 15,
      completed: false,
      content: <PatternGame />
    },
    {
      id: 7,
      title: "Memory Card Game",
      description: "Find matching pairs of cards",
      difficulty: "Beginner",
      category: "Memory",
      estimatedTime: "8 mins",
      points: 20,
      completed: false,
      content: <MemoryGame />
    },
    {
      id: 8,
      title: "Maze Navigation",
      description: "Guide a character through a maze",
      difficulty: "Intermediate",
      category: "Logic",
      estimatedTime: "10 mins",
      points: 25,
      completed: false,
      content: <MazeGame />
    },

    {
      id: 10,
      title: "Math Operations",
      description: "Solve mathematical problems",
      difficulty: "Beginner",
      category: "Math",
      estimatedTime: "8 mins",
      points: 15,
      completed: false,
      content: <MathGame />
    },
    {
      id: 11,
      title: "Logic Gates",
      description: "Learn about logical operations",
      difficulty: "Intermediate",
      category: "Logic",
      estimatedTime: "10 mins",
      points: 22,
      completed: false,
      content: <LogicGatesGame />
    },
    {
      id: 12,
      title: "Coding Quiz",
      description: "Test your programming knowledge",
      difficulty: "Intermediate",
      category: "Knowledge",
      estimatedTime: "6 mins",
      points: 16,
      completed: false,
      content: <QuizGame />
    },
    {
      id: 13,
      title: "Algorithm Visualization",
      description: "Watch sorting algorithms in action",
      difficulty: "Advanced",
      category: "Algorithms",
      estimatedTime: "12 mins",
      points: 30,
      completed: false,
      content: <AlgorithmGame />
    },
    {
      id: 14,
      title: "Debugging Challenge",
      description: "Find and fix bugs in code",
      difficulty: "Intermediate",
      category: "Debugging",
      estimatedTime: "9 mins",
      points: 20,
      completed: false,
      content: <DebuggingGame />
    },
    {
      id: 15,
      title: "Variable Assignment",
      description: "Learn about variables and assignments",
      difficulty: "Beginner",
      category: "Variables",
      estimatedTime: "8 mins",
      points: 14,
      completed: false,
      content: <VariableGame />
    },
    {
      id: 16,
      title: "Loop Control",
      description: "Master loop constructs",
      difficulty: "Intermediate",
      category: "Loops",
      estimatedTime: "10 mins",
      points: 24,
      completed: false,
      content: <LoopGame />
    },
    {
      id: 17,
      title: "Function Calling",
      description: "Create and use functions",
      difficulty: "Advanced",
      category: "Functions",
      estimatedTime: "12 mins",
      points: 28,
      completed: false,
      content: <FunctionGame />
    },
    {
      id: 18,
      title: "Binary Conversion",
      description: "Convert decimal numbers to binary",
      difficulty: "Intermediate",
      category: "Math",
      estimatedTime: "7 mins",
      points: 18,
      completed: false,
      content: <BinaryConversionGame />
    },
    {
      id: 19,
      title: "Code Completion",
      description: "Fill in the missing code parts",
      difficulty: "Beginner",
      category: "Syntax",
      estimatedTime: "6 mins",
      points: 12,
      completed: false,
      content: <CodeCompletionGame />
    },
    {
      id: 20,
      title: "Data Types Quiz",
      description: "Identify JavaScript data types",
      difficulty: "Beginner",
      category: "Types",
      estimatedTime: "5 mins",
      points: 10,
      completed: false,
      content: <DataTypesGame />
    },
    {
      id: 21,
      title: "Syntax Error Fix",
      description: "Find and correct syntax errors",
      difficulty: "Beginner",
      category: "Debugging",
      estimatedTime: "8 mins",
      points: 16,
      completed: false,
      content: <SyntaxErrorGame />
    },
    {
      id: 22,
      title: "Flowchart Logic",
      description: "Arrange programming steps logically",
      difficulty: "Intermediate",
      category: "Logic",
      estimatedTime: "9 mins",
      points: 20,
      completed: false,
      content: <FlowchartGame />
    },
    {
      id: 23,
      title: "Conditional Logic",
      description: "Master if-else statements",
      difficulty: "Beginner",
      category: "Conditionals",
      estimatedTime: "7 mins",
      points: 14,
      completed: false,
      content: <ConditionalGame />
    },
    {
      id: 24,
      title: "Array Methods",
      description: "Learn array manipulation methods",
      difficulty: "Intermediate",
      category: "Arrays",
      estimatedTime: "10 mins",
      points: 22,
      completed: false,
      content: <ArrayMethodsGame />
    },
    {
      id: 25,
      title: "OOP Inheritance",
      description: "Understand class inheritance",
      difficulty: "Advanced",
      category: "OOP",
      estimatedTime: "12 mins",
      points: 26,
      completed: false,
      content: <InheritanceGame />
    },
    {
      id: 26,
      title: "Recursion Mastery",
      description: "Master recursive functions",
      difficulty: "Advanced",
      category: "Recursion",
      estimatedTime: "15 mins",
      points: 32,
      completed: false,
      content: <RecursionGame />
    },
    {
      id: 27,
      title: "Event Handling",
      description: "Handle user interactions",
      difficulty: "Intermediate",
      category: "Events",
      estimatedTime: "8 mins",
      points: 18,
      completed: false,
      content: <EventHandlingGame />
    },
    {
      id: 28,
      title: "Async Programming",
      description: "Understand asynchronous operations",
      difficulty: "Advanced",
      category: "Async",
      estimatedTime: "12 mins",
      points: 28,
      completed: false,
      content: <AsyncGame />
    },
    {
      id: 29,
      title: "API Methods",
      description: "Learn REST API methods",
      difficulty: "Intermediate",
      category: "API",
      estimatedTime: "9 mins",
      points: 20,
      completed: false,
      content: <APIGame />
    },
    {
      id: 30,
      title: "Security Awareness",
      description: "Learn web security best practices",
      difficulty: "Advanced",
      category: "Security",
      estimatedTime: "10 mins",
      points: 25,
      completed: false,
      content: <SecurityGame />
    },
    {
      id: 31,
      title: "Unit Testing",
      description: "Write and run unit tests",
      difficulty: "Advanced",
      category: "Testing",
      estimatedTime: "12 mins",
      points: 27,
      completed: false,
      content: <TestingGame />
    }
  ];

  const handleActivityComplete = async (activityId: number) => {
    setCompletedActivities(prev => [...prev, activityId]);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    // Find the activity to get its points
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      try {
        await dispatch(updateXP(activity.points) as any);
      } catch (error) {
        console.error('Failed to update XP:', error);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  const filteredActivities = activities.map(activity => ({
    ...activity,
    completed: completedActivities.includes(activity.id)
  }));

  const totalPoints = filteredActivities.reduce((sum, a) => sum + (a.completed ? a.points : 0), 0);
  const completedCount = filteredActivities.filter(a => a.completed).length;

  return (
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      {showConfetti && <Confetti />}
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <AnimatedBox>🎯</AnimatedBox>
          Coding Activities
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Interactive coding challenges to master programming concepts
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Chip 
            icon={<Extension />} 
            label={`${filteredActivities.length} Activities`} 
            color="primary" 
            sx={{ animation: `${pulse} 2s infinite` }}
          />
          <Chip 
            icon={<Star />} 
            label={`${completedCount} Completed`} 
            color="success" 
          />
          <Chip 
            icon={<EmojiEvents />} 
            label={`${totalPoints} Total Points`} 
            color="warning" 
          />
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress: {Math.round((completedCount / filteredActivities.length) * 100)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {completedCount}/{filteredActivities.length}
            </Typography>
          </Box>
          <Box sx={{ 
            height: 10, 
            backgroundColor: 'rgba(144, 202, 249, 0.1)', 
            borderRadius: 5,
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              height: '100%', 
              width: `${(completedCount / filteredActivities.length) * 100}%`,
              background: 'linear-gradient(90deg, #90caf9 0%, #64b5f6 100%)',
              transition: 'width 0.5s ease',
              animation: `${pulse} 2s infinite`,
            }} />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredActivities.map((activity) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={activity.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 35px rgba(144, 202, 249, 0.3)'
                },
                opacity: activity.completed ? 0.9 : 1,
                border: activity.completed ? '2px solid #4caf50' : '1px solid rgba(144, 202, 249, 0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onClick={() => setSelectedActivity(activity)}
            >
              {activity.completed && (
                <Box sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  animation: `${spin} 2s linear infinite`,
                }}>
                  <Star sx={{ color: '#ffd700', fontSize: 30 }} />
                </Box>
              )}
              
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip 
                    size="small" 
                    label={activity.difficulty} 
                    color={getDifficultyColor(activity.difficulty) as any}
                    sx={{ fontWeight: 'bold' }}
                  />
                  {activity.completed && (
                    <CheckCircle sx={{ color: '#4caf50' }} />
                  )}
                </Box>
                
                <Typography variant="h6" component="h3" sx={{ 
                  mb: 1, 
                  fontWeight: 'bold',
                  minHeight: '3em'
                }}>
                  {activity.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 60 }}>
                  {activity.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    size="small" 
                    label={activity.category} 
                    variant="outlined"
                    icon={<Code sx={{ fontSize: 14 }} />}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmojiEvents sx={{ color: '#ff9800', fontSize: 16 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                      {activity.points} pts
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Timer sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {activity.estimatedTime}
                    </Typography>
                  </Box>
                  <Button 
                    size="small" 
                    variant="contained" 
                    startIcon={<PlayArrow />}
                    sx={{ 
                      minWidth: 'auto', 
                      px: 2,
                      background: 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  >
                    Play
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Activity Dialog */}
      <Dialog 
        open={!!selectedActivity} 
        onClose={() => setSelectedActivity(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            overflow: 'hidden',
          }
        }}
      >
        {selectedActivity && (
          <>
            <DialogTitle sx={{ 
              pb: 1,
              borderBottom: '1px solid rgba(144, 202, 249, 0.2)',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {selectedActivity.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      size="small" 
                      label={selectedActivity.difficulty} 
                      color={getDifficultyColor(selectedActivity.difficulty) as any}
                      sx={{ color: 'white', fontWeight: 'bold' }}
                    />
                    <Chip 
                      size="small" 
                      label={selectedActivity.category} 
                      variant="outlined"
                      sx={{ color: 'white', borderColor: '#666' }}
                      icon={<Code sx={{ color: 'white' }} />}
                    />
                    <Chip 
                      size="small" 
                      label={`${selectedActivity.points} points`} 
                      sx={{ background: '#FFD700', color: 'black', fontWeight: 'bold' }}
                      icon={<Star sx={{ color: 'black' }} />}
                    />
                  </Box>
                </Box>
                <IconButton onClick={() => setSelectedActivity(null)} sx={{ color: 'white' }}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', fontStyle: 'italic' }}>
                  {selectedActivity.description}
                </Typography>
                {selectedActivity.content}
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ 
              p: 3, 
              borderTop: '1px solid rgba(144, 202, 249, 0.2)',
              backgroundColor: '#f5f5f5'
            }}>
              <Button 
                onClick={() => setSelectedActivity(null)}
                variant="outlined"
              >
                Close
              </Button>
              {!selectedActivity.completed && (
                <Button 
                  variant="contained" 
                  onClick={() => handleActivityComplete(selectedActivity.id)}
                  startIcon={<EmojiEvents />}
                  sx={{
                    background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  Complete Activity
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Activities;