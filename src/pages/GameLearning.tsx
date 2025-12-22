import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  LinearProgress,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  NavigateNext,
  NavigateBefore,
  Games,
  Language,
  School,
  Star,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import axios from '../services/api';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  languages: string[];
}

interface Step {
  step: number;
  title: string;
  description: string;
  code: string;
  instructions: string;
  expected_output: string;
  game_state: any;
}

interface TutorialData {
  tutorial: {
    id: string;
    title: string;
    description: string;
    language: string;
    totalSteps: number;
  };
  steps: Step[];
  userProgress: any[];
}

const GameLearning: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [selectedGame, setSelectedGame] = useState<string>('movement');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [gameState, setGameState] = useState<any>({});
  const [keys, setKeys] = useState<{[key: string]: boolean}>({});
  const [playerPos, setPlayerPos] = useState({ x: 350, y: 200 });
  const [collectedItems, setCollectedItems] = useState<boolean[]>([false, false]); // Track which items are collected
  const [animationTime, setAnimationTime] = useState<number>(0);

  // Snake game state
  const [snakeGameState, setSnakeGameState] = useState({
    snake: [{x: 200, y: 200}, {x: 180, y: 200}, {x: 160, y: 200}],
    direction: 'RIGHT',
    food: {x: 400, y: 200},
    score: 0,
    gameOver: false,
    speed: 150 // milliseconds between moves
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const languages = [
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'cpp', label: 'C++', icon: '⚡' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  ];

  const games = [
    { value: 'movement', label: 'Movement Game', description: 'Learn game development basics with player movement' },
    { value: 'snake', label: 'Snake Game', description: 'Classic Snake game with advanced programming concepts' },
  ];

  // Comprehensive step-by-step tutorial data
  const tutorialSteps = [
    {
      title: "Welcome to Movement Game!",
      description: "We're going to build an interactive movement game step by step, learning programming concepts along the way.",
      concept: "Introduction",
      gameUpdate: { showWelcome: true },
      languageNotes: {
        python: "We'll use Python with pygame library",
        javascript: "We'll use HTML5 Canvas and JavaScript",
        cpp: "We'll use SFML library for C++ graphics",
        typescript: "We'll use TypeScript with HTML5 Canvas"
      } as Record<string, string>
    },
    {
      title: "Setting up Variables",
      description: "First, we need to define variables for our game: screen size, colors, and player properties.",
      concept: "Variables & Data Types",
      gameUpdate: { showVariables: true },
      languageNotes: {
        python: "Using variables like WIDTH = 800, player_x = 400",
        javascript: "Using const/let: const WIDTH = 800; let playerX = 400;",
        cpp: "Using variables: int WIDTH = 800; float playerX = 400.0f;",
        typescript: "Using typed variables: const WIDTH: number = 800;"
      } as Record<string, string>
    },
    {
      title: "Creating the Game Window",
      description: "Now we'll create the game window/canvas where our game will be displayed.",
      concept: "Graphics Setup",
      gameUpdate: { showWindow: true },
      languageNotes: {
        python: "pygame.display.set_mode((WIDTH, HEIGHT))",
        javascript: "canvas.getContext('2d')",
        cpp: "sf::RenderWindow window(sf::VideoMode(WIDTH, HEIGHT), \"Game\")",
        typescript: "const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!"
      } as Record<string, string>
    },
    {
      title: "Drawing Basic Shapes",
      description: "Let's draw basic shapes like rectangles and circles for our game elements.",
      concept: "Basic Drawing",
      gameUpdate: { showShapes: true },
      languageNotes: {
        python: "pygame.draw.rect(screen, BLUE, (x, y, width, height))",
        javascript: "ctx.fillRect(x, y, width, height)",
        cpp: "window.draw(rectangleShape)",
        typescript: "ctx.fillRect(x, y, width, height)"
      } as Record<string, string>
    },
    {
      title: "Adding a Player Character",
      description: "We'll add a player character that can be controlled in our game.",
      concept: "Objects & Classes",
      gameUpdate: { showPlayer: true },
      languageNotes: {
        python: "Creating a player object with x, y, width, height properties",
        javascript: "Using object literal: const player = {x: 400, y: 300, ...}",
        cpp: "Creating a player struct or class with member variables",
        typescript: "Interface Player { x: number; y: number; ... }"
      } as Record<string, string>
    },
    {
      title: "Understanding Game Loops",
      description: "Games run in loops that continuously update and render the game state.",
      concept: "Game Loop",
      gameUpdate: { showGameLoop: true },
      languageNotes: {
        python: "while running: handle_events(), update(), draw()",
        javascript: "function gameLoop() { update(); draw(); requestAnimationFrame(gameLoop); }",
        cpp: "while (window.isOpen()) { handleEvents(); update(); draw(); }",
        typescript: "const gameLoop = (): void => { update(); draw(); requestAnimationFrame(gameLoop); }"
      } as Record<string, string>
    },
    {
      title: "Keyboard Input Basics",
      description: "Learn how to detect when keys are pressed to control the player.",
      concept: "Input Handling",
      gameUpdate: { showInput: true },
      languageNotes: {
        python: "pygame.key.get_pressed() to check key states",
        javascript: "document.addEventListener('keydown', handleKeyPress)",
        cpp: "sf::Keyboard::isKeyPressed(sf::Keyboard::Right)",
        typescript: "document.addEventListener('keydown', (e: KeyboardEvent) => { ... })"
      } as Record<string, string>
    },
    {
      title: "Basic Movement Logic",
      description: "Implement simple movement: when right arrow is pressed, move player right. Try pressing the RIGHT ARROW key!",
      concept: "Conditional Logic",
      gameUpdate: { enableBasicMovement: true },
      languageNotes: {
        python: "if keys[pygame.K_RIGHT]: player_x += speed",
        javascript: "if (keys['ArrowRight']) player.x += speed;",
        cpp: "if (sf::Keyboard::isKeyPressed(sf::Keyboard::Right)) playerX += speed;",
        typescript: "if (keys['ArrowRight']) player.x += speed;"
      } as Record<string, string>
    },
    {
      title: "Adding Left Movement",
      description: "Now add movement to the left when the left arrow key is pressed. Try LEFT and RIGHT arrow keys!",
      concept: "If-Else Statements",
      gameUpdate: { enableLeftMovement: true },
      languageNotes: {
        python: "if keys[pygame.K_LEFT]: player_x -= speed",
        javascript: "if (keys['ArrowLeft']) player.x -= speed;",
        cpp: "if (sf::Keyboard::isKeyPressed(sf::Keyboard::Left)) playerX -= speed;",
        typescript: "if (keys['ArrowLeft']) player.x -= speed;"
      } as Record<string, string>
    },
    {
      title: "Up and Down Movement",
      description: "Complete the movement system by adding up and down controls. Try all four arrow keys!",
      concept: "Multiple Conditions",
      gameUpdate: { enableFullMovement: true },
      languageNotes: {
        python: "if keys[pygame.K_UP]: player_y -= speed\\nif keys[pygame.K_DOWN]: player_y += speed",
        javascript: "if (keys['ArrowUp']) player.y -= speed;\\nif (keys['ArrowDown']) player.y += speed;",
        cpp: "if (sf::Keyboard::isKeyPressed(sf::Keyboard::Up)) playerY -= speed;",
        typescript: "if (keys['ArrowUp']) player.y -= speed;"
      } as Record<string, string>
    },
    {
      title: "Boundary Checking",
      description: "Prevent the player from moving outside the game boundaries.",
      concept: "Boundary Conditions",
      gameUpdate: { addBoundaries: true },
      languageNotes: {
        python: "player_x = max(0, min(WIDTH - player_width, player_x))",
        javascript: "player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));",
        cpp: "playerX = std::max(0.f, std::min(WIDTH - playerWidth, playerX));",
        typescript: "player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));"
      } as Record<string, string>
    },
    {
      title: "Adding Game Objects",
      description: "Introduce collectible items or obstacles into the game world.",
      concept: "Arrays & Collections",
      gameUpdate: { addCollectibles: true },
      languageNotes: {
        python: "collectibles = [{'x': 200, 'y': 150}, {'x': 500, 'y': 300}]",
        javascript: "const collectibles = [{x: 200, y: 150}, {x: 500, y: 300}];",
        cpp: "std::vector<Collectible> collectibles = {{200, 150}, {500, 300}};",
        typescript: "const collectibles: Collectible[] = [{x: 200, y: 150}, {x: 500, y: 300}];"
      } as Record<string, string>
    },
    {
      title: "Collision Detection",
      description: "Detect when the player touches collectibles or obstacles.",
      concept: "Collision Detection",
      gameUpdate: { enableCollisions: true },
      languageNotes: {
        python: "Rectangle collision using pygame.Rect.colliderect()",
        javascript: "AABB collision: overlap in x and y dimensions",
        cpp: "Rectangle intersection using SFML bounds",
        typescript: "Interface-based collision checking functions"
      } as Record<string, string>
    },
    {
      title: "Score System",
      description: "Add a scoring system that increases when collecting items.",
      concept: "State Management",
      gameUpdate: { addScore: true },
      languageNotes: {
        python: "score = 0; when collision: score += 10",
        javascript: "let score = 0; if (collision) score += 10;",
        cpp: "int score = 0; if (collision) score += 10;",
        typescript: "let score: number = 0; if (collision) score += 10;"
      } as Record<string, string>
    },
    {
      title: "Game Over Conditions",
      description: "Add win/lose conditions to make the game more engaging.",
      concept: "Game States",
      gameUpdate: { addGameStates: true },
      languageNotes: {
        python: "game_state = 'playing'; if score >= 100: game_state = 'won'",
        javascript: "let gameState = 'playing'; if (score >= 100) gameState = 'won';",
        cpp: "enum GameState { Playing, Won, Lost }; GameState state = Playing;",
        typescript: "type GameState = 'playing' | 'won' | 'lost'; let gameState: GameState = 'playing';"
      } as Record<string, string>
    },
    {
      title: "Functions and Methods",
      description: "Organize code into reusable functions for better structure.",
      concept: "Functions",
      gameUpdate: { addFunctions: true },
      languageNotes: {
        python: "def update_player(): ... def draw_game(): ...",
        javascript: "function updatePlayer() { ... } function drawGame() { ... }",
        cpp: "void updatePlayer() { ... } void drawGame() { ... }",
        typescript: "function updatePlayer(): void { ... } function drawGame(): void { ... }"
      } as Record<string, string>
    },
    {
      title: "Animation and Timing",
      description: "Add smooth animations and time-based updates to the game.",
      concept: "Animation & Timing",
      gameUpdate: { addAnimation: true },
      languageNotes: {
        python: "clock = pygame.time.Clock(); clock.tick(60) for 60 FPS",
        javascript: "requestAnimationFrame() for smooth animation",
        cpp: "sf::Clock for time management and frame rate control",
        typescript: "Using requestAnimationFrame with proper typing"
      } as Record<string, string>
    },
    {
      title: "Sound Effects",
      description: "Add audio feedback for game events like collecting items.",
      concept: "Audio Programming",
      gameUpdate: { addSound: true },
      languageNotes: {
        python: "pygame.mixer.Sound() for playing sound effects",
        javascript: "new Audio() and HTML5 audio API",
        cpp: "sf::Sound and sf::SoundBuffer for SFML audio",
        typescript: "HTMLAudioElement with proper type definitions"
      } as Record<string, string>
    },
    {
      title: "Advanced Graphics",
      description: "Add visual effects like particles, shadows, and smooth rendering.",
      concept: "Advanced Graphics",
      gameUpdate: { addEffects: true },
      languageNotes: {
        python: "Particle systems, alpha blending, surface effects",
        javascript: "Canvas gradients, shadows, advanced compositing",
        cpp: "SFML shaders, render textures, advanced drawing techniques",
        typescript: "Advanced canvas operations with type safety"
      } as Record<string, string>
    },
    {
      title: "Game Complete!",
      description: "Congratulations! You've built a complete movement game with multiple programming concepts.",
      concept: "Project Complete",
      gameUpdate: { gameComplete: true },
      languageNotes: {
        python: "Full pygame game with all features implemented",
        javascript: "Complete HTML5 canvas game with modern JavaScript",
        cpp: "Professional SFML game with C++ best practices",
        typescript: "Type-safe game implementation with advanced features"
      } as Record<string, string>
    }
  ];

  // Snake Game Tutorial Steps (30+ comprehensive steps)
  const snakeTutorialSteps = [
    {
      title: "Welcome to Snake Game!",
      description: "Learn advanced programming concepts by building the classic Snake game from scratch.",
      concept: "Introduction",
      gameUpdate: { showSnakeWelcome: true },
      languageNotes: {
        python: "We'll use Pygame for graphics and game logic",
        javascript: "HTML5 Canvas with modern JavaScript",
        cpp: "SFML for C++ graphics and input",
        typescript: "Type-safe game development"
      } as Record<string, string>
    },
    {
      title: "Snake Game Fundamentals",
      description: "Understanding the core mechanics: snake moves, eats food, grows, and dies on collision.",
      concept: "Game Design",
      gameUpdate: { showSnakeBasics: true },
      languageNotes: {
        python: "Snake as list of segments, food as coordinates",
        javascript: "Arrays for snake body, objects for game state",
        cpp: "Vectors for snake segments, structs for game data",
        typescript: "Interfaces and typed arrays"
      } as Record<string, string>
    },
    {
      title: "Setting Up Game Constants",
      description: "Define screen dimensions, colors, and game speed constants.",
      concept: "Constants & Configuration",
      gameUpdate: { showSnakeConstants: true },
      languageNotes: {
        python: 'WIDTH = 800\nHEIGHT = 600\nSNAKE_SIZE = 20\nFPS = 10',
        javascript: 'const WIDTH = 800;\nconst HEIGHT = 600;\nconst SNAKE_SIZE = 20;\nconst FPS = 10;',
        cpp: 'const int WIDTH = 800;\nconst int HEIGHT = 600;\nconst int SNAKE_SIZE = 20;\nconst int FPS = 10;',
        typescript: 'const WIDTH: number = 800;\nconst HEIGHT: number = 600;\nconst SNAKE_SIZE: number = 20;\nconst FPS: number = 10;'
      } as Record<string, string>
    },
    {
      title: "Creating the Game Window",
      description: "Initialize the game window with proper dimensions and title.",
      concept: "Graphics Initialization",
      gameUpdate: { showSnakeWindow: true },
      languageNotes: {
        python: 'screen = pygame.display.set_mode((WIDTH, HEIGHT))\npygame.display.set_caption("Snake Game")',
        javascript: 'const canvas = document.getElementById("gameCanvas");\nconst ctx = canvas.getContext("2d");',
        cpp: 'sf::RenderWindow window(sf::VideoMode(WIDTH, HEIGHT), "Snake Game");',
        typescript: 'const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;\nconst ctx = canvas.getContext("2d")!;'
      } as Record<string, string>
    },
    {
      title: "Snake Data Structure",
      description: "Create a data structure to represent the snake as a list of body segments.",
      concept: "Data Structures",
      gameUpdate: { showSnakeData: true },
      languageNotes: {
        python: 'snake = [{"x": WIDTH//2, "y": HEIGHT//2}]\nsnake_dir = "RIGHT"',
        javascript: 'let snake = [{x: WIDTH/2, y: HEIGHT/2}];\nlet direction = "RIGHT";',
        cpp: 'std::vector<sf::Vector2i> snake = {{WIDTH/2, HEIGHT/2}};\nstd::string direction = "RIGHT";',
        typescript: 'let snake: Array<{x: number, y: number}> = [{x: WIDTH/2, y: HEIGHT/2}];\nlet direction: string = "RIGHT";'
      } as Record<string, string>
    },
    {
      title: "Food Generation",
      description: "Create random food placement that doesn't overlap with the snake.",
      concept: "Random Generation",
      gameUpdate: { showSnakeFood: true },
      languageNotes: {
        python: 'import random\nfood = {"x": random.randint(0, WIDTH-SNAKE_SIZE) // SNAKE_SIZE * SNAKE_SIZE,\n       "y": random.randint(0, HEIGHT-SNAKE_SIZE) // SNAKE_SIZE * SNAKE_SIZE}',
        javascript: 'let food = {\n    x: Math.floor(Math.random() * (WIDTH/SNAKE_SIZE)) * SNAKE_SIZE,\n    y: Math.floor(Math.random() * (HEIGHT/SNAKE_SIZE)) * SNAKE_SIZE\n};',
        cpp: 'sf::Vector2i food(\n    (rand() % (WIDTH/SNAKE_SIZE)) * SNAKE_SIZE,\n    (rand() % (HEIGHT/SNAKE_SIZE)) * SNAKE_SIZE\n);',
        typescript: 'let food: {x: number, y: number} = {\n    x: Math.floor(Math.random() * (WIDTH/SNAKE_SIZE)) * SNAKE_SIZE,\n    y: Math.floor(Math.random() * (HEIGHT/SNAKE_SIZE)) * SNAKE_SIZE\n};'
      } as Record<string, string>
    },
    {
      title: "Drawing the Snake",
      description: "Render the snake body as connected rectangles on the screen.",
      concept: "Rendering Basics",
      gameUpdate: { showSnakeDrawing: true },
      languageNotes: {
        python: 'for segment in snake:\n    pygame.draw.rect(screen, GREEN, (segment["x"], segment["y"], SNAKE_SIZE, SNAKE_SIZE))',
        javascript: 'snake.forEach(segment => {\n    ctx.fillStyle = "green";\n    ctx.fillRect(segment.x, segment.y, SNAKE_SIZE, SNAKE_SIZE);\n});',
        cpp: 'for (const auto& segment : snake) {\n    sf::RectangleShape rect(sf::Vector2f(SNAKE_SIZE, SNAKE_SIZE));\n    rect.setPosition(segment.x, segment.y);\n    rect.setFillColor(sf::Color::Green);\n    window.draw(rect);\n}',
        typescript: 'snake.forEach((segment: {x: number, y: number}) => {\n    ctx.fillStyle = "green";\n    ctx.fillRect(segment.x, segment.y, SNAKE_SIZE, SNAKE_SIZE);\n});'
      } as Record<string, string>
    },
    {
      title: "Drawing Food",
      description: "Render the food as a different colored square on the screen.",
      concept: "Sprite Rendering",
      gameUpdate: { showFoodDrawing: true },
      languageNotes: {
        python: 'pygame.draw.rect(screen, RED, (food["x"], food["y"], SNAKE_SIZE, SNAKE_SIZE))',
        javascript: 'ctx.fillStyle = "red";\nctx.fillRect(food.x, food.y, SNAKE_SIZE, SNAKE_SIZE);',
        cpp: 'sf::RectangleShape foodRect(sf::Vector2f(SNAKE_SIZE, SNAKE_SIZE));\nfoodRect.setPosition(food.x, food.y);\nfoodRect.setFillColor(sf::Color::Red);\nwindow.draw(foodRect);',
        typescript: 'ctx.fillStyle = "red";\nctx.fillRect(food.x, food.y, SNAKE_SIZE, SNAKE_SIZE);'
      } as Record<string, string>
    },
    {
      title: "Basic Movement Logic",
      description: "Implement snake movement in four directions with keyboard input.",
      concept: "Input Handling",
      gameUpdate: { enableSnakeMovement: true },
      languageNotes: {
        python: 'if keys[pygame.K_LEFT] and direction != "RIGHT": direction = "LEFT"\n# Similar for other directions',
        javascript: 'if (keys["ArrowLeft"] && direction !== "RIGHT") direction = "LEFT";\n// Similar for other directions',
        cpp: 'if (sf::Keyboard::isKeyPressed(sf::Keyboard::Left) && direction != "RIGHT") direction = "LEFT";',
        typescript: 'if (keys["ArrowLeft"] && direction !== "RIGHT") direction = "LEFT";\n// Similar for other directions'
      } as Record<string, string>
    },
    {
      title: "Snake Movement Update",
      description: "Move the snake head and update all body segments to follow.",
      concept: "Array Manipulation",
      gameUpdate: { showSnakeUpdate: true },
      languageNotes: {
        python: 'head = snake[0].copy()\nif direction == "RIGHT": head["x"] += SNAKE_SIZE\nsnake.insert(0, head)\nsnake.pop()',
        javascript: 'const head = {...snake[0]};\nif (direction === "RIGHT") head.x += SNAKE_SIZE;\nsnake.unshift(head);\nsnake.pop();',
        cpp: 'sf::Vector2i head = snake[0];\nif (direction == "RIGHT") head.x += SNAKE_SIZE;\nsnake.insert(snake.begin(), head);\nsnake.pop_back();',
        typescript: 'const head: {x: number, y: number} = {...snake[0]};\nif (direction === "RIGHT") head.x += SNAKE_SIZE;\nsnake.unshift(head);\nsnake.pop();'
      } as Record<string, string>
    },
    {
      title: "Food Collision Detection",
      description: "Check if snake head collides with food and grow the snake.",
      concept: "Collision Detection",
      gameUpdate: { enableFoodCollision: true },
      languageNotes: {
        python: 'if head["x"] == food["x"] and head["y"] == food["y"]:\n    # Generate new food\n    # Don\'t remove tail (grow)\n    score += 10',
        javascript: 'if (head.x === food.x && head.y === food.y) {\n    // Generate new food\n    // Don\'t pop tail (grow)\n    score += 10;\n}',
        cpp: 'if (head.x == food.x && head.y == food.y) {\n    // Generate new food\n    // Don\'t pop_back (grow)\n    score += 10;\n}',
        typescript: 'if (head.x === food.x && head.y === food.y) {\n    // Generate new food\n    // Don\'t pop tail (grow)\n    score += 10;\n}'
      } as Record<string, string>
    },
    {
      title: "Wall Collision Detection",
      description: "Check if snake hits the game boundaries and end the game.",
      concept: "Boundary Checking",
      gameUpdate: { enableWallCollision: true },
      languageNotes: {
        python: 'if head["x"] < 0 or head["x"] >= WIDTH or head["y"] < 0 or head["y"] >= HEIGHT:\n    game_over = True',
        javascript: 'if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {\n    gameOver = true;\n}',
        cpp: 'if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {\n    gameOver = true;\n}',
        typescript: 'if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {\n    gameOver = true;\n}'
      } as Record<string, string>
    },
    {
      title: "Self-Collision Detection",
      description: "Check if snake collides with its own body segments.",
      concept: "Self-Collision",
      gameUpdate: { enableSelfCollision: true },
      languageNotes: {
        python: 'for segment in snake[1:]:\n    if head["x"] == segment["x"] and head["y"] == segment["y"]:\n        game_over = True',
        javascript: 'for (let i = 1; i < snake.length; i++) {\n    if (head.x === snake[i].x && head.y === snake[i].y) {\n        gameOver = true;\n    }\n}',
        cpp: 'for (size_t i = 1; i < snake.size(); ++i) {\n    if (head.x == snake[i].x && head.y == snake[i].y) {\n        gameOver = true;\n    }\n}',
        typescript: 'for (let i = 1; i < snake.length; i++) {\n    if (head.x === snake[i].x && head.y === snake[i].y) {\n        gameOver = true;\n    }\n}'
      } as Record<string, string>
    },
    {
      title: "Score Display",
      description: "Display the current score and game statistics on screen.",
      concept: "UI & Text Rendering",
      gameUpdate: { showScoreDisplay: true },
      languageNotes: {
        python: 'score_text = font.render(f"Score: {score}", True, WHITE)\nscreen.blit(score_text, (10, 10))',
        javascript: 'ctx.fillStyle = "white";\nctx.font = "20px Arial";\nctx.fillText(`Score: ${score}`, 10, 30);',
        cpp: 'sf::Text scoreText;\nscoreText.setFont(font);\nscoreText.setString("Score: " + std::to_string(score));\nscoreText.setPosition(10, 10);\nwindow.draw(scoreText);',
        typescript: 'ctx.fillStyle = "white";\nctx.font = "20px Arial";\nctx.fillText(`Score: ${score}`, 10, 30);'
      } as Record<string, string>
    },
    {
      title: "Game Over Screen",
      description: "Display game over message and final score when the game ends.",
      concept: "Game States",
      gameUpdate: { showGameOver: true },
      languageNotes: {
        python: 'game_over_text = font.render("Game Over!", True, RED)\nscreen.blit(game_over_text, (WIDTH//2 - 100, HEIGHT//2))',
        javascript: 'ctx.fillStyle = "red";\nctx.font = "48px Arial";\nctx.textAlign = "center";\nctx.fillText("Game Over!", WIDTH/2, HEIGHT/2);',
        cpp: 'sf::Text gameOverText("Game Over!", font, 48);\ngameOverText.setPosition(WIDTH/2 - 100, HEIGHT/2);\ngameOverText.setFillColor(sf::Color::Red);\nwindow.draw(gameOverText);',
        typescript: 'ctx.fillStyle = "red";\nctx.font = "48px Arial";\nctx.textAlign = "center";\nctx.fillText("Game Over!", WIDTH/2, HEIGHT/2);'
      } as Record<string, string>
    },
    {
      title: "Game Speed Increase",
      description: "Gradually increase game speed as the snake grows longer.",
      concept: "Dynamic Difficulty",
      gameUpdate: { enableSpeedIncrease: true },
      languageNotes: {
        python: 'speed = min(20, 10 + len(snake) // 5)\nclock.tick(speed)',
        javascript: 'const speed = Math.min(20, 10 + Math.floor(snake.length / 5));\nsetTimeout(gameLoop, 1000 / speed);',
        cpp: 'int speed = std::min(20, 10 + static_cast<int>(snake.size()) / 5);\n// Adjust frame rate',
        typescript: 'const speed: number = Math.min(20, 10 + Math.floor(snake.length / 5));\nsetTimeout(gameLoop, 1000 / speed);'
      } as Record<string, string>
    },
    {
      title: "Sound Effects Integration",
      description: "Add sound effects for eating food and game over events.",
      concept: "Audio Programming",
      gameUpdate: { addSnakeSounds: true },
      languageNotes: {
        python: 'eat_sound = pygame.mixer.Sound("eat.wav")\nif food_eaten:\n    eat_sound.play()',
        javascript: 'const eatSound = new Audio("eat.mp3");\nif (foodEaten) {\n    eatSound.currentTime = 0;\n    eatSound.play();\n}',
        cpp: 'sf::SoundBuffer eatBuffer;\neatBuffer.loadFromFile("eat.wav");\nsf::Sound eatSound(eatBuffer);\nif (foodEaten) eatSound.play();',
        typescript: 'const eatSound: HTMLAudioElement = new Audio("eat.mp3");\nif (foodEaten) {\n    eatSound.currentTime = 0;\n    eatSound.play();\n}'
      } as Record<string, string>
    },
    {
      title: "High Score System",
      description: "Implement persistent high score storage and display.",
      concept: "Data Persistence",
      gameUpdate: { addHighScore: true },
      languageNotes: {
        python: 'with open("highscore.txt", "r") as f:\n    high_score = int(f.read())\nif score > high_score:\n    with open("highscore.txt", "w") as f:\n        f.write(str(score))',
        javascript: 'let highScore = localStorage.getItem("snakeHighScore") || 0;\nif (score > highScore) {\n    localStorage.setItem("snakeHighScore", score);\n}',
        cpp: 'std::ifstream file("highscore.txt");\nfile >> highScore;\nif (score > highScore) {\n    std::ofstream outFile("highscore.txt");\n    outFile << score;\n}',
        typescript: 'let highScore: number = parseInt(localStorage.getItem("snakeHighScore") || "0");\nif (score > highScore) {\n    localStorage.setItem("snakeHighScore", score.toString());\n}'
      } as Record<string, string>
    },
    {
      title: "Multiple Food Types",
      description: "Add different types of food with varying point values and effects.",
      concept: "Advanced Game Mechanics",
      gameUpdate: { addMultipleFood: true },
      languageNotes: {
        python: 'food_types = [{"color": RED, "points": 10}, {"color": BLUE, "points": 20, "effect": "speed_boost"}]',
        javascript: 'const foodTypes = [\n    {color: "red", points: 10},\n    {color: "blue", points: 20, effect: "speedBoost"}\n];',
        cpp: 'struct FoodType {\n    sf::Color color;\n    int points;\n    std::string effect;\n};\nstd::vector<FoodType> foodTypes = {{sf::Color::Red, 10, ""}, {sf::Color::Blue, 20, "speedBoost"}};',
        typescript: 'interface FoodType {\n    color: string;\n    points: number;\n    effect?: string;\n}\nconst foodTypes: FoodType[] = [\n    {color: "red", points: 10},\n    {color: "blue", points: 20, effect: "speedBoost"}\n];'
      } as Record<string, string>
    },
    {
      title: "Power-ups and Bonuses",
      description: "Implement temporary power-ups that appear randomly on the game field.",
      concept: "Game Enhancements",
      gameUpdate: { addPowerUps: true },
      languageNotes: {
        python: 'power_up = {"x": random_pos, "y": random_pos, "type": "shrink", "duration": 10}',
        javascript: 'const powerUp = {\n    x: randomX,\n    y: randomY,\n    type: "shrink",\n    duration: 10\n};',
        cpp: 'struct PowerUp {\n    int x, y;\n    std::string type;\n    int duration;\n};\nPowerUp powerUp = {randomX, randomY, "shrink", 10};',
        typescript: 'interface PowerUp {\n    x: number;\n    y: number;\n    type: string;\n    duration: number;\n}\nconst powerUp: PowerUp = {\n    x: randomX,\n    y: randomY,\n    type: "shrink",\n    duration: 10\n};'
      } as Record<string, string>
    },
    {
      title: "Snake Skin Customization",
      description: "Allow players to choose different visual themes for the snake.",
      concept: "UI Customization",
      gameUpdate: { addSnakeSkins: true },
      languageNotes: {
        python: 'skins = {"classic": GREEN, "neon": CYAN, "fire": ORANGE}\ncurrent_skin = skins["classic"]',
        javascript: 'const skins = {\n    classic: "green",\n    neon: "cyan",\n    fire: "orange"\n};\nlet currentSkin = skins.classic;',
        cpp: 'std::map<std::string, sf::Color> skins = {\n    {"classic", sf::Color::Green},\n    {"neon", sf::Color::Cyan},\n    {"fire", sf::Color(255, 165, 0)}\n};\nsf::Color currentSkin = skins["classic"];',
        typescript: 'const skins: Record<string, string> = {\n    classic: "green",\n    neon: "cyan",\n    fire: "orange"\n};\nlet currentSkin: string = skins.classic;'
      } as Record<string, string>
    },
    {
      title: "Level Progression",
      description: "Implement multiple difficulty levels with increasing challenges.",
      concept: "Progressive Difficulty",
      gameUpdate: { addLevels: true },
      languageNotes: {
        python: 'levels = [\n    {"speed": 10, "obstacles": []},\n    {"speed": 15, "obstacles": wall_list}\n]',
        javascript: 'const levels = [\n    {speed: 10, obstacles: []},\n    {speed: 15, obstacles: wallList}\n];',
        cpp: 'struct Level {\n    int speed;\n    std::vector<Obstacle> obstacles;\n};\nstd::vector<Level> levels = {{10, {}}, {15, wallList}};',
        typescript: 'interface Level {\n    speed: number;\n    obstacles: Obstacle[];\n}\nconst levels: Level[] = [\n    {speed: 10, obstacles: []},\n    {speed: 15, obstacles: wallList}\n];'
      } as Record<string, string>
    },
    {
      title: "Obstacle System",
      description: "Add walls and obstacles that the snake must avoid.",
      concept: "Environmental Hazards",
      gameUpdate: { addObstacles: true },
      languageNotes: {
        python: 'obstacles = [{"x": 200, "y": 200, "width": 40, "height": 40}]\n# Check collision with obstacles',
        javascript: 'const obstacles = [{x: 200, y: 200, width: 40, height: 40}];\n// Check collision with obstacles',
        cpp: 'std::vector<sf::RectangleShape> obstacles;\nsf::RectangleShape obstacle(sf::Vector2f(40, 40));\nobstacle.setPosition(200, 200);\nobstacles.push_back(obstacle);',
        typescript: 'interface Obstacle {\n    x: number;\n    y: number;\n    width: number;\n    height: number;\n}\nconst obstacles: Obstacle[] = [{x: 200, y: 200, width: 40, height: 40}];'
      } as Record<string, string>
    },
    {
      title: "Particle Effects",
      description: "Add visual particle effects when eating food or colliding.",
      concept: "Visual Effects",
      gameUpdate: { addParticles: true },
      languageNotes: {
        python: 'particles = []\nfor _ in range(10):\n    particles.append({"x": food_x, "y": food_y, "life": 30})',
        javascript: 'const particles = [];\nfor (let i = 0; i < 10; i++) {\n    particles.push({x: foodX, y: foodY, life: 30});\n}',
        cpp: 'std::vector<Particle> particles;\nfor (int i = 0; i < 10; i++) {\n    particles.push_back({foodX, foodY, 30});\n}',
        typescript: 'interface Particle {\n    x: number;\n    y: number;\n    life: number;\n}\nconst particles: Particle[] = [];\nfor (let i = 0; i < 10; i++) {\n    particles.push({x: foodX, y: foodY, life: 30});\n}'
      } as Record<string, string>
    },
    {
      title: "Game Pause Functionality",
      description: "Implement pause/unpause feature with spacebar or P key.",
      concept: "Game Controls",
      gameUpdate: { addPauseFeature: true },
      languageNotes: {
        python: 'if keys[pygame.K_SPACE]:\n    paused = not paused\nif not paused:\n    # Game logic',
        javascript: 'if (keys[" "] || keys["p"]) {\n    paused = !paused;\n}\nif (!paused) {\n    // Game logic\n}',
        cpp: 'if (sf::Keyboard::isKeyPressed(sf::Keyboard::Space)) {\n    paused = !paused;\n}\nif (!paused) {\n    // Game logic\n}',
        typescript: 'if (keys[" "] || keys["p"]) {\n    paused = !paused;\n}\nif (!paused) {\n    // Game logic\n}'
      } as Record<string, string>
    },
    {
      title: "Save/Load Game State",
      description: "Implement game state serialization for save/load functionality.",
      concept: "Data Serialization",
      gameUpdate: { addSaveLoad: true },
      languageNotes: {
        python: 'import json\ngame_state = {"snake": snake, "score": score}\nwith open("save.json", "w") as f:\n    json.dump(game_state, f)',
        javascript: 'const gameState = {snake, score};\nlocalStorage.setItem("snakeSave", JSON.stringify(gameState));',
        cpp: 'std::ofstream file("save.dat", std::ios::binary);\n// Serialize snake and score data',
        typescript: 'interface GameState {\n    snake: Array<{x: number, y: number}>;\n    score: number;\n}\nconst gameState: GameState = {snake, score};\nlocalStorage.setItem("snakeSave", JSON.stringify(gameState));'
      } as Record<string, string>
    },
    {
      title: "Multiplayer Mode",
      description: "Add basic multiplayer functionality with two snakes.",
      concept: "Multiplayer Systems",
      gameUpdate: { addMultiplayer: true },
      languageNotes: {
        python: 'player1 = {"snake": snake1, "controls": {"left": K_a, "right": K_d}}\nplayer2 = {"snake": snake2, "controls": {"left": K_LEFT, "right": K_RIGHT}}',
        javascript: 'const player1 = {snake: snake1, controls: {left: "a", right: "d"}};\nconst player2 = {snake: snake2, controls: {left: "ArrowLeft", right: "ArrowRight"}};',
        cpp: 'struct Player {\n    std::vector<sf::Vector2i> snake;\n    std::map<std::string, sf::Keyboard::Key> controls;\n};',
        typescript: 'interface Player {\n    snake: Array<{x: number, y: number}>;\n    controls: {left: string, right: string};\n}\nconst player1: Player = {snake: snake1, controls: {left: "a", right: "d"}};'
      } as Record<string, string>
    },
    {
      title: "AI Snake Opponent",
      description: "Implement AI-controlled snake that competes against the player.",
      concept: "Artificial Intelligence",
      gameUpdate: { addAISnake: true },
      languageNotes: {
        python: 'def ai_move():\n    # Simple pathfinding to food\n    if ai_head["x"] < food["x"]: return "RIGHT"\n    elif ai_head["x"] > food["x"]: return "LEFT"',
        javascript: 'function aiMove() {\n    // Simple AI logic\n    if (aiHead.x < food.x) return "RIGHT";\n    else if (aiHead.x > food.x) return "LEFT";\n}',
        cpp: 'std::string aiMove() {\n    if (aiHead.x < food.x) return "RIGHT";\n    else if (aiHead.x > food.x) return "LEFT";\n    return "UP";\n}',
        typescript: 'function aiMove(): string {\n    if (aiHead.x < food.x) return "RIGHT";\n    else if (aiHead.x > food.x) return "LEFT";\n    return "UP";\n}'
      } as Record<string, string>
    },
    {
      title: "Network Multiplayer",
      description: "Add basic network functionality for online multiplayer.",
      concept: "Network Programming",
      gameUpdate: { addNetworking: true },
      languageNotes: {
        python: 'import socket\nserver = socket.socket()\nserver.bind(("localhost", 12345))\nserver.listen(1)',
        javascript: 'const ws = new WebSocket("ws://localhost:8080");\nws.onmessage = (event) => {\n    const data = JSON.parse(event.data);\n    // Handle opponent moves\n};',
        cpp: 'sf::TcpListener listener;\nlistener.listen(12345);\nsf::TcpSocket client;\nlistener.accept(client);',
        typescript: 'const ws: WebSocket = new WebSocket("ws://localhost:8080");\nws.onmessage = (event: MessageEvent) => {\n    const data = JSON.parse(event.data);\n    // Handle opponent moves\n};'
      } as Record<string, string>
    },
    {
      title: "Advanced Graphics",
      description: "Implement smooth animations, gradients, and visual polish.",
      concept: "Advanced Rendering",
      gameUpdate: { addAdvancedGraphics: true },
      languageNotes: {
        python: 'gradient = pygame.Surface((SNAKE_SIZE, SNAKE_SIZE))\nfor i in range(SNAKE_SIZE):\n    color = (0, 255 - i*5, 0)\n    pygame.draw.line(gradient, color, (i, 0), (i, SNAKE_SIZE))',
        javascript: 'const gradient = ctx.createLinearGradient(0, 0, SNAKE_SIZE, SNAKE_SIZE);\ngradient.addColorStop(0, "darkgreen");\ngradient.addColorStop(1, "lightgreen");\nctx.fillStyle = gradient;',
        cpp: 'sf::RectangleShape segment(sf::Vector2f(SNAKE_SIZE, SNAKE_SIZE));\nsf::Color headColor(0, 255, 0);\nsf::Color tailColor(0, 180, 0);\n// Apply gradient effect',
        typescript: 'const gradient: CanvasGradient = ctx.createLinearGradient(0, 0, SNAKE_SIZE, SNAKE_SIZE);\ngradient.addColorStop(0, "darkgreen");\ngradient.addColorStop(1, "lightgreen");\nctx.fillStyle = gradient;'
      } as Record<string, string>
    },
    {
      title: "Performance Optimization",
      description: "Implement efficient rendering and game loop optimizations.",
      concept: "Performance",
      gameUpdate: { optimizePerformance: true },
      languageNotes: {
        python: 'dirty_rects = []\nfor segment in snake:\n    dirty_rects.append(pygame.Rect(segment["x"], segment["y"], SNAKE_SIZE, SNAKE_SIZE))\npygame.display.update(dirty_rects)',
        javascript: 'const dirtyRects = snake.map(segment => ({\n    x: segment.x,\n    y: segment.y,\n    width: SNAKE_SIZE,\n    height: SNAKE_SIZE\n}));\n// Only redraw dirty areas',
        cpp: '// Use SFML\'s efficient rendering\nwindow.clear();\n// Only draw visible/changed elements\nwindow.display();',
        typescript: 'const dirtyRects: Array<{x: number, y: number, width: number, height: number}> = \n    snake.map((segment: {x: number, y: number}) => ({\n        x: segment.x,\n        y: segment.y,\n        width: SNAKE_SIZE,\n        height: SNAKE_SIZE\n    }));\n// Only redraw dirty areas'
      } as Record<string, string>
    },
    {
      title: "Snake Game Complete!",
      description: "Congratulations! You've built a comprehensive Snake game with advanced features.",
      concept: "Project Complete",
      gameUpdate: { snakeGameComplete: true },
      languageNotes: {
        python: 'print("🎉 Snake Game Complete!")\nprint("Features implemented:")\nprint("- Movement & Controls")\nprint("- Collision Detection")\nprint("- Scoring System")\nprint("- Sound Effects")\nprint("- Multiplayer")\nprint("- AI Opponent")\nprint("- And much more!")',
        javascript: 'console.log("🎉 Snake Game Complete!");\nconsole.log("Features implemented:");\nconsole.log("- Movement & Controls");\nconsole.log("- Collision Detection");\nconsole.log("- Scoring System");\nconsole.log("- Sound Effects");\nconsole.log("- Multiplayer");\nconsole.log("- AI Opponent");\nconsole.log("- And much more!");',
        cpp: 'std::cout << "🎉 Snake Game Complete!" << std::endl;\nstd::cout << "Features implemented:" << std::endl;\nstd::cout << "- Movement & Controls" << std::endl;\nstd::cout << "- Collision Detection" << std::endl;\nstd::cout << "- Scoring System" << std::endl;\nstd::cout << "- Sound Effects" << std::endl;\nstd::cout << "- Multiplayer" << std::endl;\nstd::cout << "- AI Opponent" << std::endl;\nstd::cout << "- And much more!" << std::endl;',
        typescript: 'console.log("🎉 Snake Game Complete!");\nconsole.log("Features implemented:");\nconsole.log("- Movement & Controls");\nconsole.log("- Collision Detection");\nconsole.log("- Scoring System");\nconsole.log("- Sound Effects");\nconsole.log("- Multiplayer");\nconsole.log("- AI Opponent");\nconsole.log("- And much more!");'
      } as Record<string, string>
    }
  ];

  // Initialize game state on language or game change
  useEffect(() => {
    setCurrentStep(0);
    setGameState({});
    generateGamePreview(0);
  }, [selectedLanguage, selectedGame]);

  // Handle player movement
  React.useEffect(() => {
    if (currentStep >= 7 && currentStep <= 12) { // Movement steps (extended to include collecting steps)
      const moveSpeed = 3;
      const interval = setInterval(() => {
        setPlayerPos(prev => {
          let newX = prev.x;
          let newY = prev.y;

          if (keys['ArrowLeft']) newX -= moveSpeed;
          if (keys['ArrowRight']) newX += moveSpeed;
          if (keys['ArrowUp']) newY -= moveSpeed;
          if (keys['ArrowDown']) newY += moveSpeed;

          // Boundary checking for steps 10+
          if (currentStep >= 10) {
            const playerSize = 50;
            newX = Math.max(15, Math.min(700 - 15 - playerSize, newX));
            newY = Math.max(15, Math.min(400 - 15 - playerSize, newY));
          }

          // Collision detection for steps 11-12 (collecting steps)
          if (currentStep >= 11 && currentStep <= 12) {
            const collectibles = [
              { x: 150, y: 150, radius: 20 },
              { x: 550, y: 300, radius: 20 }
            ];

            const playerCenterX = newX + 25; // Player center (50/2)
            const playerCenterY = newY + 25;

            collectibles.forEach((collectible, index) => {
              if (!collectedItems[index]) {
                const distance = Math.sqrt(
                  Math.pow(playerCenterX - collectible.x, 2) +
                  Math.pow(playerCenterY - collectible.y, 2)
                );

                // Check if player center is within collectible radius
                if (distance < collectible.radius + 15) { // 15 is roughly half player size
                  console.log(`Collected item ${index + 1}!`);
                  setCollectedItems(prev => {
                    const newCollected = [...prev];
                    newCollected[index] = true;
                    return newCollected;
                  });

                  // Show collection feedback
                  setSnackbar({
                    open: true,
                    message: `⭐ Collected item ${index + 1}!`,
                    severity: 'success'
                  });
                }
              }
            });
          }

          return { x: newX, y: newY };
        });
      }, 16); // ~60 FPS

      return () => clearInterval(interval);
    }
  }, [keys, currentStep, collectedItems]);

  // Snake game logic - continuous movement
  React.useEffect(() => {
    if (selectedGame === 'snake' && !snakeGameState.gameOver) {
      const gameLoop = setInterval(() => {
        setSnakeGameState(prevState => {
          const newState = { ...prevState };
          const { snake, direction, food } = newState;

          // Move snake head based on current direction
          const head = { ...snake[0] };

          switch (direction) {
            case 'UP': head.y -= 20; break;
            case 'DOWN': head.y += 20; break;
            case 'LEFT': head.x -= 20; break;
            case 'RIGHT': head.x += 20; break;
          }

          // Check wall collision
          if (head.x < 0 || head.x >= 700 || head.y < 0 || head.y >= 400) {
            console.log('Wall collision detected');
            newState.gameOver = true;
            return newState;
          }

          // Check self collision (skip head)
          for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
              console.log('Self collision detected');
              newState.gameOver = true;
              return newState;
            }
          }

          // Add new head
          snake.unshift(head);

          // Check food collision
          if (head.x === food.x && head.y === food.y) {
            console.log('Food eaten! Score +10');
            // Generate new food (avoid snake body)
            let newFood: {x: number, y: number} = {x: 0, y: 0};
            let attempts = 0;
            do {
              newFood = {
                x: Math.floor(Math.random() * (700 / 20)) * 20,
                y: Math.floor(Math.random() * (400 / 20)) * 20
              };
              attempts++;
            } while (
              attempts < 100 &&
              snake.some((segment: any) => segment.x === newFood.x && segment.y === newFood.y)
            );

            newState.food = newFood;
            newState.score += 10;

            // Increase speed slightly every 50 points
            if (newState.score % 50 === 0 && newState.speed > 80) {
              newState.speed = Math.max(80, newState.speed - 10);
            }
          } else {
            // Remove tail if no food eaten
            snake.pop();
          }

          console.log('Snake moved - Length:', snake.length, 'Score:', newState.score);
          return newState;
        });
      }, snakeGameState.speed);

      return () => clearInterval(gameLoop);
    }
  }, [selectedGame, snakeGameState.gameOver, snakeGameState.speed]);

  // Handle direction changes for snake game - single key press detection
  const [lastDirectionChange, setLastDirectionChange] = useState<string>('');

  React.useEffect(() => {
    if (selectedGame === 'snake') {
      let newDirection = snakeGameState.direction;

      // Check for direction changes (prevent immediate reversal)
      if (keys['ArrowUp'] && snakeGameState.direction !== 'DOWN' && lastDirectionChange !== 'ArrowUp') {
        newDirection = 'UP';
        setLastDirectionChange('ArrowUp');
      } else if (keys['ArrowDown'] && snakeGameState.direction !== 'UP' && lastDirectionChange !== 'ArrowDown') {
        newDirection = 'DOWN';
        setLastDirectionChange('ArrowDown');
      } else if (keys['ArrowLeft'] && snakeGameState.direction !== 'RIGHT' && lastDirectionChange !== 'ArrowLeft') {
        newDirection = 'LEFT';
        setLastDirectionChange('ArrowLeft');
      } else if (keys['ArrowRight'] && snakeGameState.direction !== 'LEFT' && lastDirectionChange !== 'ArrowRight') {
        newDirection = 'RIGHT';
        setLastDirectionChange('ArrowRight');
      }

      if (newDirection !== snakeGameState.direction) {
        console.log('Direction changed to:', newDirection);
        setSnakeGameState(prev => ({ ...prev, direction: newDirection }));
      }
    }
  }, [keys, selectedGame, snakeGameState.direction, lastDirectionChange]);

  // Reset direction change tracking when keys are released
  React.useEffect(() => {
    const allKeysReleased = !keys['ArrowUp'] && !keys['ArrowDown'] && !keys['ArrowLeft'] && !keys['ArrowRight'];
    if (allKeysReleased) {
      setLastDirectionChange('');
    }
  }, [keys]);

  // Animation loop for live snake game rendering
  React.useEffect(() => {
    let animationFrame: number;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      // Limit to ~60 FPS
      if (currentTime - lastTime >= 16.67) {
        setAnimationTime(prev => prev + 1);
        lastTime = currentTime;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    // Only run animation when viewing snake game
    if (selectedGame === 'snake') {
      console.log('Starting snake animation loop');
      animationFrame = requestAnimationFrame(animate);
    } else {
      console.log('Stopping snake animation loop');
    }

    return () => {
      if (animationFrame) {
        console.log('Cleaning up animation frame');
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [selectedGame]);

  // Handle keyboard input
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enable keyboard for movement game (steps 7-12) or snake game (all steps when snake is selected)
      const enableKeyboard = (selectedGame === 'movement' && currentStep >= 7 && currentStep <= 12) ||
                            (selectedGame === 'snake');

      if (enableKeyboard) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
          console.log('Key pressed:', e.code, 'Game:', selectedGame, 'Step:', currentStep);
          e.preventDefault();
          setKeys(prev => ({ ...prev, [e.code]: true }));
        } else if (e.code === 'KeyR' && selectedGame === 'snake' && snakeGameState.gameOver) {
          // Restart snake game
          console.log('Restarting snake game');
          e.preventDefault();
          setSnakeGameState({
            snake: [{x: 200, y: 200}, {x: 180, y: 200}, {x: 160, y: 200}],
            direction: 'RIGHT',
            food: {x: 400, y: 200},
            score: 0,
            gameOver: false,
            speed: 150
          });
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Enable keyboard for movement game (steps 7-12) or snake game (all steps when snake is selected)
      const enableKeyboard = (selectedGame === 'movement' && currentStep >= 7 && currentStep <= 12) ||
                            (selectedGame === 'snake');

      if (enableKeyboard && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        console.log('Key released:', e.code);
        e.preventDefault();
        setKeys(prev => ({ ...prev, [e.code]: false }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentStep, selectedGame, snakeGameState.gameOver]);

  const generateGamePreview = (stepIndex: number) => {
    const currentTutorialSteps = selectedGame === 'movement' ? tutorialSteps : snakeTutorialSteps;
    const step = currentTutorialSteps[stepIndex];
    if (!step) return;

    // Build cumulative game state - include all features up to current step
    const cumulativeState: any = {
      currentStep: stepIndex,
      language: selectedLanguage,
      gameType: selectedGame
    };

    // Add features from all steps up to current step
    for (let i = 0; i <= stepIndex; i++) {
      const stepData = currentTutorialSteps[i];
      Object.assign(cumulativeState, stepData.gameUpdate);
    }

    setGameState(cumulativeState);
  };

  const handleNextStep = () => {
    if (currentStep < currentTutorialSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setPlayerPos({ x: 350, y: 200 }); // Reset player position

      // Reset snake game for new steps
      if (selectedGame === 'snake') {
        setSnakeGameState({
          snake: [{x: 200, y: 200}, {x: 180, y: 200}, {x: 160, y: 200}],
          direction: 'RIGHT',
          food: {x: 400, y: 200},
          score: 0,
          gameOver: false,
          speed: 150
        });
        setLastDirectionChange('');
      }

      // Reset collected items for new game types
      if (selectedGame === 'movement' && nextStep < 13) {
        setCollectedItems([false, false]);
      }

      generateGamePreview(nextStep);

      setSnackbar({
        open: true,
        message: `Step ${nextStep + 1}: ${currentTutorialSteps[nextStep].concept}`,
        severity: 'info'
      });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setPlayerPos({ x: 350, y: 200 }); // Reset player position

      // Reset snake game for new steps
      if (selectedGame === 'snake') {
        setSnakeGameState({
          snake: [{x: 200, y: 200}, {x: 180, y: 200}, {x: 160, y: 200}],
          direction: 'RIGHT',
          food: {x: 400, y: 200},
          score: 0,
          gameOver: false,
          speed: 150
        });
        setLastDirectionChange('');
      }

      // Reset collected items for new game types
      if (selectedGame === 'movement' && prevStep < 13) {
        setCollectedItems([false, false]);
      }

      generateGamePreview(prevStep);
    }
  };

  const completeTutorial = async () => {
    try {
      // Award XP for completing the tutorial
      await axios.post('/api/user/xp', {
        xpGained: selectedGame === 'snake' ? 150 : 100 // More XP for snake game
      });

      setSnackbar({
        open: true,
        message: `${games.find(g => g.value === selectedGame)?.label} completed! +${selectedGame === 'snake' ? 150 : 100} XP awarded!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error completing tutorial:', error);
    }
  };

  const getProgress = (): number => {
    return ((currentStep + 1) / currentTutorialSteps.length) * 100;
  };

  // Select the appropriate tutorial based on game selection
  const currentTutorialSteps = selectedGame === 'movement' ? tutorialSteps : snakeTutorialSteps;
  const currentTutorialStep = currentTutorialSteps[currentStep];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Games color="primary" fontSize="large" />
          {games.find(g => g.value === selectedGame)?.label} Tutorial
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Learn programming by building an interactive game step by step!
        </Typography>
      </Box>

      {/* Language and Game Selection */}
      <Box sx={{ mb: 3, display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Programming Language</InputLabel>
          <Select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            label="Programming Language"
          >
            {languages.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: '20px' }}>{lang.icon}</span>
                  <Typography>{lang.label}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Game Tutorial</InputLabel>
          <Select
            value={selectedGame}
            onChange={(e) => {
              setSelectedGame(e.target.value);
              setCurrentStep(0); // Reset to first step when changing games
              setGameState({}); // Reset game state
              setPlayerPos({ x: 350, y: 200 });
              setCollectedItems([false, false]);
              // Regenerate preview for new game
              const newTutorialSteps = e.target.value === 'movement' ? tutorialSteps : snakeTutorialSteps;
              if (newTutorialSteps[0]) {
                const cumulativeState: any = { currentStep: 0, language: selectedLanguage };
                for (let i = 0; i <= 0; i++) {
                  Object.assign(cumulativeState, newTutorialSteps[i].gameUpdate);
                }
                setGameState(cumulativeState);
              }
            }}
            label="Game Tutorial"
          >
            {games.map((game) => (
              <MenuItem key={game.value} value={game.value}>
                <Box>
                  <Typography variant="subtitle2">{game.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {game.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">
            Step {currentStep + 1} of {tutorialSteps.length}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star color="primary" />
            <Typography variant="body1">
              {Math.round(getProgress())}% Complete
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={getProgress()}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: 'rgba(144, 202, 249, 0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              background: 'linear-gradient(90deg, #90caf9 0%, #64b5f6 100%)',
            }
          }}
        />
      </Box>

      {/* Main Content - Stacked Layout */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
        {/* Top - Step Information */}
        <Card sx={{ flex: '0 0 auto' }}>
          <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <School color="primary" />
                Current Step
              </Typography>

                <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                  {currentTutorialStep.title}
                </Typography>

                <Chip
                  label={currentTutorialStep.concept}
                  color="secondary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />

                <Typography variant="body1" paragraph>
                  {currentTutorialStep.description}
                </Typography>

                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    In {languages.find(l => l.value === selectedLanguage)?.label}:
                  </Typography>
                  <Typography variant="body2">
                    {currentTutorialStep.languageNotes[selectedLanguage]}
                  </Typography>
                </Alert>

                {/* Implementation Summary */}
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
                  What's Being Implemented:
                </Typography>
                <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '13px', color: 'black' }}>
                  {getImplementationText(currentStep, selectedLanguage, selectedGame)}
                  </Typography>
              </Box>

              {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<NavigateBefore />}
                  disabled={currentStep === 0}
                  onClick={handlePreviousStep}
                  sx={{ minWidth: 120 }}
                >
                  Previous
                </Button>

                <Typography variant="body2" color="text.secondary">
                  {currentStep + 1} / {tutorialSteps.length}
                </Typography>

                {currentStep === tutorialSteps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={completeTutorial}
                    sx={{ minWidth: 120 }}
                  >
                    Complete!
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    endIcon={<NavigateNext />}
                    onClick={handleNextStep}
                    sx={{ minWidth: 120 }}
                  >
                    Next Step
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>

        {/* Bottom - Game Console */}
        <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Games color="primary" />
              Game Console
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                backgroundColor: '#0a0a0a',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(144, 202, 249, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '400px',
                pt: 3, // Add padding top to create space for the instruction text
              }}
            >
              <GameCanvas
                gameState={gameState}
                keys={keys}
                setKeys={setKeys}
                playerPos={playerPos}
                setPlayerPos={setPlayerPos}
                collectedItems={collectedItems}
                animationTime={animationTime}
                snakeGameState={snakeGameState}
              />

            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Helper functions for text rendering
const drawWrappedText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number = 20) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY;
};

const drawTextWithBounds = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, maxHeight: number, centerText: boolean = true) => {
  const words = text.split(' ');
  let lines: string[] = [];
  let currentLine = '';

  for (let word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Limit lines to fit within maxHeight
  const lineHeight = 20;
  const maxLines = Math.floor(maxHeight / lineHeight);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines - 1);
    lines.push('...');
  }

  // Draw lines
  for (let i = 0; i < lines.length; i++) {
    const lineY = y + (i * lineHeight);
    if (lineY + lineHeight <= y + maxHeight) {
      if (centerText) {
        // Center the text horizontally
        const lineWidth = ctx.measureText(lines[i]).width;
        const centeredX = x + (maxWidth / 2) - (lineWidth / 2);
        ctx.fillText(lines[i], centeredX, lineY);
      } else {
        ctx.fillText(lines[i], x, lineY);
      }
    }
  }
};

// Snake Game Rendering Function - Live Running Game
const renderSnakeGame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, currentStep: number, animationTime: number, snakeState: any) => {
  console.log('Rendering snake game - step:', currentStep, 'animationTime:', animationTime);

  // Clear canvas
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Define game constants
  const SNAKE_SIZE = 20;
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  // Use animation time for smooth animations
  const time = animationTime * 0.02; // Scale for visible movement

  // For steps 20+, show the actual playable snake game
  if (currentStep >= 20) {
    // Draw game border
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, WIDTH, HEIGHT);

    // Draw snake with gradient effect
    snakeState.snake.forEach((segment: any, index: number) => {
      if (index === 0) {
        // Head - darker green
        ctx.fillStyle = '#2e7d32';
      } else {
        // Body - lighter green
        ctx.fillStyle = '#4caf50';
      }
      ctx.fillRect(segment.x, segment.y, SNAKE_SIZE, SNAKE_SIZE);

      // Add border to segments
      ctx.strokeStyle = '#1b5e20';
      ctx.lineWidth = 1;
      ctx.strokeRect(segment.x, segment.y, SNAKE_SIZE, SNAKE_SIZE);
    });

    // Draw food with glow effect
    ctx.fillStyle = '#ff0000';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(snakeState.food.x + 10, snakeState.food.y + 10, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw apple stem
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(snakeState.food.x + 8, snakeState.food.y, 4, 6);

    // Draw score and info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${snakeState.score}`, 10, 25);
    ctx.fillText(`Length: ${snakeState.snake.length}`, 10, 50);
    ctx.fillText(`Speed: ${Math.round(1000 / snakeState.speed)} FPS`, 10, 75);

    // Draw game over screen
    if (snakeState.gameOver) {
      // Semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Game over text
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2 - 40);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Final Score: ${snakeState.score}`, WIDTH / 2, HEIGHT / 2);
      ctx.fillText(`Snake Length: ${snakeState.snake.length}`, WIDTH / 2, HEIGHT / 2 + 30);

      ctx.font = '18px Arial';
      ctx.fillStyle = '#cccccc';
      ctx.fillText('Press R to restart', WIDTH / 2, HEIGHT / 2 + 70);
    } else {
      // Game instructions
      ctx.fillStyle = '#cccccc';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🐍 Use arrow keys to control the snake • Eat red apples to grow!', canvas.width / 2, canvas.height - 30);
    }

    return;
  }

  // Create a live snake game state based on current step
  let snake = [{x: 200, y: 200}, {x: 180, y: 200}, {x: 160, y: 200}];
  let direction = 'RIGHT';
  let food = {x: 400, y: 200};
  let score = Math.floor(currentStep * 2); // Score increases with steps
  let gameOver = false;

  // Adjust snake length based on current step
  if (currentStep >= 10) {
    snake = snake.concat([{x: 140, y: 200}, {x: 120, y: 200}]); // Add more segments
  }
  if (currentStep >= 15) {
    snake = snake.concat([{x: 100, y: 200}, {x: 80, y: 200}, {x: 60, y: 200}]); // Even more segments
  }

  // Add obstacles for later steps
  const obstacles = [];
  if (currentStep >= 21) {
    obstacles.push({x: 300, y: 100}, {x: 300, y: 300}, {x: 500, y: 100}, {x: 500, y: 300});
  }

  // Draw game based on current step
  switch (currentStep) {
    case 0: // Welcome to Snake Game
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🐍 Snake Game', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '16px Arial';
      ctx.fillText('Advanced Programming Concepts', canvas.width / 2, canvas.height / 2 + 20);
      break;

    case 1: // Snake Game Fundamentals
      // Draw a continuously moving snake with more visible animation
      const baseX = 200;
      const amplitude = 80; // Increased amplitude for more visible movement

      ctx.fillStyle = '#4caf50';
      for (let i = 0; i < 5; i++) {
        const x = baseX + i * SNAKE_SIZE + Math.sin(time + i * 0.5) * amplitude;
        const y = 200 + Math.cos(time + i * 0.3) * 40; // Increased vertical movement
        ctx.fillRect(x, y, SNAKE_SIZE, SNAKE_SIZE);
      }

      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(450 + Math.sin(time) * 60, 200 + Math.cos(time * 0.7) * 50, 15, 0, 2 * Math.PI); // Bigger food movement
      ctx.fill();

      // Debug info
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Animation: ${animationTime}`, 10, 20);
      ctx.fillText(`Time: ${time.toFixed(2)}`, 10, 40);

      ctx.textAlign = 'center';
      ctx.font = '16px Arial';
      ctx.fillText('🐍 Snake is moving continuously!', canvas.width / 2, canvas.height - 80);
      ctx.fillText('Watch the wave motion and floating food', canvas.width / 2, canvas.height - 50);
      break;

    case 2: // Constants & Setup
      // Show animated constants appearing
      const constants = ['WIDTH = 800', 'HEIGHT = 600', 'SNAKE_SIZE = 20', 'FPS = 10'];
      ctx.fillStyle = '#90caf9';
      ctx.font = '14px monospace';
      ctx.textAlign = 'left';

      constants.forEach((constant, index) => {
        const y = 80 + index * 40;
        const alpha = (Math.sin(time * 2 + index) + 1) / 2;
        ctx.globalAlpha = 0.3 + alpha * 0.7;
        ctx.fillText(constant, 100, y);
      });
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Configuration constants with pulsing animation', canvas.width / 2, canvas.height - 50);
      break;

    case 3: // Window Creation
      // Animated border drawing
      const borderProgress = (Math.sin(time) + 1) / 2;
      ctx.strokeStyle = '#90caf9';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, (canvas.width - 40) * borderProgress, canvas.height - 40);

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game window border animating into existence', canvas.width / 2, canvas.height - 50);
      break;

    case 4: // Snake Data Structure
      // Animate snake segments appearing one by one
      ctx.fillStyle = '#4caf50';
      for (let i = 0; i < snake.length; i++) {
        const delay = i * 0.5;
        const progress = Math.max(0, Math.min(1, (time - delay) % 3));
        if (progress > 0) {
          ctx.globalAlpha = progress;
          ctx.fillRect(snake[i].x, snake[i].y, SNAKE_SIZE, SNAKE_SIZE);
        }
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Snake segments appearing sequentially', canvas.width / 2, canvas.height - 80);
      ctx.fillText('Each segment is a position in an array', canvas.width / 2, canvas.height - 50);
      break;

    case 5: // Food Generation
      // Draw snake
      ctx.fillStyle = '#4caf50';
      snake.forEach(segment => ctx.fillRect(segment.x, segment.y, SNAKE_SIZE, SNAKE_SIZE));

      // Animated food bouncing
      const bounce = Math.abs(Math.sin(time * 3)) * 10;
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(food.x, food.y - bounce, 12, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('🍎', food.x, food.y - bounce + 5);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Food bounces and waits to be eaten!', canvas.width / 2, canvas.height - 50);
      break;

    case 6: // Snake Rendering
      // Animate snake body with wave motion
      ctx.fillStyle = '#4caf50';
      for (let i = 0; i < 8; i++) {
        const x = 200 + i * SNAKE_SIZE;
        const y = 200 + Math.sin(time * 2 + i * 0.3) * 15;
        ctx.fillRect(x, y, SNAKE_SIZE, SNAKE_SIZE);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Snake body waves like a real snake!', canvas.width / 2, canvas.height - 80);
      ctx.fillText('Each segment follows fluid motion', canvas.width / 2, canvas.height - 50);
      break;

    case 7: // Food Rendering
      // Multiple animated food items
      const foods = [
        {x: 300, y: 150, emoji: '⭐', color: '#ffeb3b'},
        {x: 450, y: 250, emoji: '🍎', color: '#ff0000'},
        {x: 200, y: 300, emoji: '🍇', color: '#9c27b0'}
      ];

      foods.forEach((f, index) => {
        const bounce = Math.sin(time * 2 + index) * 8;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y + bounce, 15, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(f.emoji, f.x, f.y + bounce + 8);
      });

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Different types of food with unique animations', canvas.width / 2, canvas.height - 50);
      break;

    case 8: // Movement Controls
      // Show animated arrow keys
      const arrows = ['←', '↑', '→', '↓'];
      arrows.forEach((arrow, index) => {
        const angle = (index / 4) * Math.PI * 2;
        const radius = 80;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const scale = 0.8 + Math.sin(time * 3 + index) * 0.2;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(arrow, 0, 12);
        ctx.restore();
      });

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Arrow keys pulse and glow!', canvas.width / 2, canvas.height - 80);
      ctx.fillText('Each direction has its own animation', canvas.width / 2, canvas.height - 50);
      break;

    case 9: // Position Updates
      // Animate snake moving in a circle
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const circleRadius = 60;

      ctx.fillStyle = '#4caf50';
      for (let i = 0; i < 6; i++) {
        const angle = time + i * 0.8;
        const x = centerX + Math.cos(angle) * circleRadius;
        const y = centerY + Math.sin(angle) * circleRadius;
        ctx.fillRect(x - SNAKE_SIZE/2, y - SNAKE_SIZE/2, SNAKE_SIZE, SNAKE_SIZE);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🐍', centerX + Math.cos(time + 0.8) * circleRadius, centerY + Math.sin(time + 0.8) * circleRadius + 5);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText('Snake moves in a perfect circle!', canvas.width / 2, canvas.height - 80);
      ctx.fillText('Each segment follows the leader', canvas.width / 2, canvas.height - 50);
      break;
    case 0: // Welcome to Snake Game
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🐍 Snake Game', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '16px Arial';
      ctx.fillText('Advanced Programming Concepts', canvas.width / 2, canvas.height / 2 + 20);
      break;

    case 1: // Snake Game Fundamentals
      ctx.fillStyle = '#90caf9';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎮 Core Mechanics:', canvas.width / 2, 100);
      ctx.fillText('• Snake moves continuously', canvas.width / 2, 130);
      ctx.fillText('• Eat food to grow', canvas.width / 2, 160);
      ctx.fillText('• Avoid walls and self', canvas.width / 2, 190);
      ctx.fillText('• Score increases with length', canvas.width / 2, 220);
      break;

    case 2: // Constants & Setup
      ctx.fillStyle = '#90caf9';
      ctx.font = '14px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('WIDTH = 800', 50, 80);
      ctx.fillText('HEIGHT = 600', 50, 110);
      ctx.fillText('SNAKE_SIZE = 20', 50, 140);
      ctx.fillText('FPS = 10', 50, 170);
      ctx.fillText('BLACK = (0, 0, 0)', 50, 200);
      ctx.fillText('GREEN = (0, 255, 0)', 50, 230);
      ctx.fillText('RED = (255, 0, 0)', 50, 260);

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Configuration Constants', canvas.width / 2, canvas.height - 50);
      break;

    case 3: // Window Creation
      ctx.strokeStyle = '#90caf9';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Snake Game Window', canvas.width / 2, canvas.height / 2);
      ctx.fillText('Graphics Context Ready', canvas.width / 2, canvas.height / 2 + 30);
      break;

    case 4: // Snake Data Structure
      // Draw a simple snake representation
      ctx.fillStyle = '#4caf50';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(300 + i * 25, 200, 20, 20);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('SNAKE', 325, 250);
      ctx.fillText('Array of body segments', canvas.width / 2, canvas.height - 50);
      break;

    case 5: // Food Generation
      // Draw snake
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(300, 200, 20, 20);
      ctx.fillRect(325, 200, 20, 20);

      // Draw food
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(450, 200, 10, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('🍎', 450, 210);
      ctx.fillText('Random food placement', canvas.width / 2, canvas.height - 50);
      break;

    case 6: // Snake Rendering
      // Draw snake body
      ctx.fillStyle = '#4caf50';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(250 + i * 25, 200, 20, 20);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Snake Body Segments', canvas.width / 2, 280);
      ctx.fillText('Each segment follows the previous one', canvas.width / 2, canvas.height - 50);
      break;

    case 7: // Food Rendering
      // Draw food
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(400, 200, 15, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('⭐', 400, 210);
      ctx.fillText('Food as circular sprite', canvas.width / 2, canvas.height - 50);
      break;

    case 8: // Movement Controls
      ctx.fillStyle = '#ffffff';
      ctx.font = '18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎮 Movement Controls', canvas.width / 2, 120);
      ctx.font = '14px Arial';
      ctx.fillText('Arrow keys: ↑ ↓ ← →', canvas.width / 2, 150);
      ctx.fillText('Snake moves continuously', canvas.width / 2, 180);
      ctx.fillText('Change direction with arrow keys', canvas.width / 2, 210);
      break;

    case 9: // Position Updates
      // Show snake moving animation
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(350, 200, 20, 20); // Head
      ctx.fillRect(325, 200, 20, 20); // Body
      ctx.fillRect(300, 200, 20, 20); // Tail

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('→', 360, 215);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText('Head moves forward, body follows', canvas.width / 2, canvas.height - 50);
      break;

    case 10: // Food Collision
      // Animate snake approaching and eating food
      const eatProgress = (Math.sin(time * 2) + 1) / 2; // 0 to 1
      const snakeEatingX = 300 + eatProgress * 100;

      ctx.fillStyle = '#4caf50';
      ctx.fillRect(snakeEatingX, 200, SNAKE_SIZE, SNAKE_SIZE);

      if (eatProgress > 0.8) {
        // Food being "eaten" - shrinking
        const foodSize = Math.max(0, (1 - (eatProgress - 0.8) * 5) * 15);
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(400, 210, foodSize, 0, 2 * Math.PI);
        ctx.fill();

        // Score increase animation
        ctx.fillStyle = '#4caf50';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('+10', 410, 180 - (eatProgress - 0.8) * 50);
      } else {
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(400, 210, 15, 0, 2 * Math.PI);
        ctx.fill();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(eatProgress > 0.8 ? '💥' : '⭐', 400, 215);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Snake approaches → collides → eats → grows!', canvas.width / 2, canvas.height - 50);
      break;

    case 11: // Wall Collision
      // Animate snake hitting wall
      const hitTime = time % 4;
      let snakeWallX = 200;

      if (hitTime > 2) {
        // Snake moving toward wall
        snakeWallX = 200 + (hitTime - 2) * 150;
      } else if (hitTime > 1.5) {
        // Collision flash
        ctx.fillStyle = '#f44336';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalAlpha = 0.3;
      }

      ctx.globalAlpha = 1;
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(Math.min(snakeWallX, WIDTH - SNAKE_SIZE - 20), 200, SNAKE_SIZE, SNAKE_SIZE);

      // Wall
      ctx.strokeStyle = '#f44336';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, WIDTH - 20, HEIGHT - 20);

      if (hitTime > 2.5) {
        ctx.fillStyle = '#f44336';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💥 WALL COLLISION DETECTED!', canvas.width / 2, canvas.height - 80);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText('Snake hits boundary → Game Over!', canvas.width / 2, canvas.height - 50);
      break;

    case 12: // Self-Collision
      // Animate snake turning back on itself
      const selfCollisionTime = time % 6;
      ctx.fillStyle = '#4caf50';

      if (selfCollisionTime < 3) {
        // Snake moving in U shape
        for (let i = 0; i < 6; i++) {
          let x, y;
          if (i < 3) {
            x = 300 + i * SNAKE_SIZE;
            y = 200;
          } else {
            x = 340 - (i - 3) * SNAKE_SIZE;
            y = 200 + (i - 3) * SNAKE_SIZE;
          }
          ctx.fillRect(x, y, SNAKE_SIZE, SNAKE_SIZE);
        }
      } else {
        // Collision detected - flash
        ctx.fillStyle = '#f44336';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalAlpha = 0.5;

        ctx.globalAlpha = 1;
        ctx.fillStyle = '#f44336';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💥 SELF COLLISION!', canvas.width / 2, canvas.height - 80);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText('Snake bites its own tail → Game Over!', canvas.width / 2, canvas.height - 50);
      break;

    case 13: // Score Display
      ctx.fillStyle = '#4caf50';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('SCORE: 20', 50, 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Score increases with food eaten', canvas.width / 2, canvas.height - 50);
      break;

    case 14: // Game Over Screen
      ctx.fillStyle = '#f44336';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

      ctx.fillStyle = '#4caf50';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('FINAL SCORE: 45', canvas.width / 2, canvas.height / 2 + 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 60);
      break;

    case 15: // Speed Increase
      // Show snake getting faster
      const speedMultiplier = 1 + Math.floor(time / 2) % 5;
      const fastSnakeX = (time * 30 * speedMultiplier) % (WIDTH + 100) - 50;

      ctx.fillStyle = '#4caf50';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(fastSnakeX - i * SNAKE_SIZE, 200, SNAKE_SIZE, SNAKE_SIZE);
      }

      ctx.fillStyle = '#ff9800';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`⚡ SPEED LEVEL ${speedMultiplier}!`, canvas.width / 2, 120);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText(`Snake length: 5 segments`, canvas.width / 2, 150);
      ctx.fillText(`Game speed: ${10 + speedMultiplier * 2} FPS`, canvas.width / 2, 180);
      ctx.fillText('Longer snake = faster movement!', canvas.width / 2, 210);
      break;

    case 16: // Sound Effects
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🔊 SOUND EFFECTS', canvas.width / 2, 120);
      ctx.font = '14px Arial';
      ctx.fillText('• Eat food: "nom.wav"', canvas.width / 2, 150);
      ctx.fillText('• Game over: "crash.wav"', canvas.width / 2, 180);
      ctx.fillText('• Background music loop', canvas.width / 2, 210);
      break;

    case 17: // High Score
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🏆 HIGH SCORE: 125', canvas.width / 2, 120);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.fillText('Personal Best Record', canvas.width / 2, 150);
      ctx.font = '14px Arial';
      ctx.fillText('Saved to local storage', canvas.width / 2, 180);
      break;

    case 18: // Multiple Food Types
      // Draw different food types
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(300, 200, 15, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('⭐', 300, 210);

      ctx.fillStyle = '#9c27b0';
      ctx.beginPath();
      ctx.arc(450, 200, 15, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('💎', 450, 210);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Different food = different points/effects', canvas.width / 2, canvas.height - 50);
      break;

    case 19: // Power-ups
      ctx.fillStyle = '#ff5722';
      ctx.beginPath();
      ctx.arc(400, 200, 12, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⚡', 400, 210);

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.fillText('POWER-UP: Speed Boost', canvas.width / 2, 280);
      ctx.font = '14px Arial';
      ctx.fillText('Temporary special abilities', canvas.width / 2, canvas.height - 50);
      break;

    case 20: // Snake Skins
      // Draw different colored snakes
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(250, 200, 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText('Classic', 250, 235);

      ctx.fillStyle = '#9c27b0';
      ctx.fillRect(350, 200, 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText('Purple', 345, 235);

      ctx.fillStyle = '#ff5722';
      ctx.fillRect(450, 200, 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText('Fire', 450, 235);

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Choose your snake appearance', canvas.width / 2, canvas.height - 50);
      break;

    case 21: // Levels
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('LEVEL 3: OBSTACLE COURSE', canvas.width / 2, 120);

      // Draw obstacles
      ctx.fillStyle = '#666666';
      ctx.fillRect(200, 150, 40, 40);
      ctx.fillRect(400, 250, 40, 40);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText('Walls and obstacles appear', canvas.width / 2, 180);
      ctx.fillText('Increasing difficulty per level', canvas.width / 2, 210);
      break;

    case 22: // Obstacles
      // Draw obstacle course
      ctx.fillStyle = '#666666';
      ctx.fillRect(150, 100, 40, 40);
      ctx.fillRect(250, 200, 40, 40);
      ctx.fillRect(350, 150, 40, 40);
      ctx.fillRect(450, 250, 40, 40);

      ctx.fillStyle = '#4caf50';
      ctx.fillRect(200, 175, 20, 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Navigate around obstacles', canvas.width / 2, canvas.height - 50);
      break;

    case 23: // Particles
      // Draw particle explosion effect
      ctx.fillStyle = '#ffd700';
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = 400 + Math.cos(angle) * 30;
        const y = 200 + Math.sin(angle) * 30;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('✨ PARTICLE EXPLOSION!', canvas.width / 2, 280);
      ctx.font = '14px Arial';
      ctx.fillText('Visual effects when eating food', canvas.width / 2, canvas.height - 50);
      break;

    case 24: // Pause Feature
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⏸️ GAME PAUSED', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '16px Arial';
      ctx.fillText('Press SPACE or P to resume', canvas.width / 2, canvas.height / 2 + 20);
      ctx.font = '14px Arial';
      ctx.fillText('Freeze game state temporarily', canvas.width / 2, canvas.height / 2 + 50);
      break;

    case 25: // Save/Load
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('💾 SAVE GAME STATE', canvas.width / 2, 120);
      ctx.font = '14px Arial';
      ctx.fillText('Snake position, score, level', canvas.width / 2, 150);
      ctx.fillText('Resume from where you left off', canvas.width / 2, 180);
      ctx.fillText('JSON serialization', canvas.width / 2, 210);
      break;

    case 26: // Multiplayer
      // Draw two snakes
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(300, 200, 20, 20);
      ctx.fillRect(325, 200, 20, 20);

      ctx.fillStyle = '#2196f3';
      ctx.fillRect(400, 200, 20, 20);
      ctx.fillRect(425, 200, 20, 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GREEN vs BLUE', canvas.width / 2, 280);
      ctx.font = '14px Arial';
      ctx.fillText('Local multiplayer with two players', canvas.width / 2, canvas.height - 50);
      break;

    case 27: // AI Snake
      ctx.fillStyle = '#ff9800';
      ctx.fillRect(350, 200, 20, 20);
      ctx.fillRect(375, 200, 20, 20);

      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(450, 200, 10, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🤖 AI OPPONENT', canvas.width / 2, 280);
      ctx.font = '14px Arial';
      ctx.fillText('Computer-controlled snake with pathfinding', canvas.width / 2, canvas.height - 50);
      break;

    case 28: // Network Multiplayer
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🌐 ONLINE MULTIPLAYER', canvas.width / 2, 120);
      ctx.font = '14px Arial';
      ctx.fillText('WebSocket connections', canvas.width / 2, 150);
      ctx.fillText('Real-time game state sync', canvas.width / 2, 180);
      ctx.fillText('Cross-device gameplay', canvas.width / 2, 210);
      break;

    case 29: // Advanced Graphics
      // Draw gradient snake
      const gradient = ctx.createLinearGradient(300, 200, 400, 200);
      gradient.addColorStop(0, '#4caf50');
      gradient.addColorStop(1, '#66bb6a');
      ctx.fillStyle = gradient;
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(300 + i * 20, 200, 18, 18);
      }

      // Add shadow effect
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(480, 210, 12, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎨 ADVANCED GRAPHICS', canvas.width / 2, 280);
      ctx.font = '14px Arial';
      ctx.fillText('Gradients, shadows, smooth animations', canvas.width / 2, canvas.height - 50);
      break;

    case 30: // Snake Game Complete
      ctx.fillStyle = '#4caf50';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎉 SNAKE GAME COMPLETE!', canvas.width / 2, canvas.height / 2 - 30);
      ctx.font = '16px Arial';
      ctx.fillText('You\'ve mastered advanced programming!', canvas.width / 2, canvas.height / 2);
      ctx.fillText('From basics to AI and networking', canvas.width / 2, canvas.height / 2 + 30);
      break;

    default:
      // Test animation - simple bouncing ball to verify animation is working
      const ballX = WIDTH / 2 + Math.sin(time) * 150;
      const ballY = HEIGHT / 2 + Math.cos(time * 1.5) * 100;

      ctx.fillStyle = '#ff5722';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 20, 0, 2 * Math.PI);
      ctx.fill();

      // Animated snake
      const snakeX = (time * 30) % (WIDTH + 200) - 100;
      ctx.fillStyle = '#4caf50';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(snakeX - i * SNAKE_SIZE, 150, SNAKE_SIZE, SNAKE_SIZE);
      }

      // Debug info
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Animation Time: ${animationTime}`, 10, 20);
      ctx.fillText(`Time Value: ${time.toFixed(2)}`, 10, 40);

      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🎾 If you see this ball bouncing, animations are working!', canvas.width / 2, canvas.height - 80);
      ctx.fillText(`🐍 Snake should be moving across the screen`, canvas.width / 2, canvas.height - 50);
      break;
  }
};

// Game Canvas Component
const GameCanvas: React.FC<{
  gameState: any;
  keys?: {[key: string]: boolean};
  setKeys?: React.Dispatch<React.SetStateAction<{[key: string]: boolean}>>;
  playerPos?: { x: number; y: number };
  setPlayerPos?: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  collectedItems?: boolean[];
  animationTime?: number;
  snakeGameState?: any;
}> = ({ gameState, keys: externalKeys, setKeys: externalSetKeys, playerPos: externalPlayerPos, setPlayerPos: externalSetPlayerPos, collectedItems = [false, false], animationTime = 0, snakeGameState }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [internalKeys, setInternalKeys] = React.useState<{[key: string]: boolean}>({});
  const [internalPlayerPos, setInternalPlayerPos] = React.useState({ x: 350, y: 200 });

  // Use external state if provided, otherwise use internal state
  const keys = externalKeys !== undefined ? externalKeys : internalKeys;
  const setKeys = externalSetKeys || setInternalKeys;
  const playerPos = externalPlayerPos !== undefined ? externalPlayerPos : internalPlayerPos;
  const setPlayerPos = externalSetPlayerPos || setInternalPlayerPos;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw based on current step to avoid overlapping
    const currentStep = gameState.currentStep || 0;
    const gameType = gameState.gameType || 'movement';

  // Render different content based on game type
  if (gameType === 'snake') {
    renderSnakeGame(ctx, canvas, currentStep, animationTime, snakeGameState);
    return;
  }

    // Default to movement game
    switch (currentStep) {
      case 0: // Welcome
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎮 Movement Game', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '16px Arial';
        ctx.fillText('Building step by step...', canvas.width / 2, canvas.height / 2 + 20);
        break;

      case 1: // Variables
        ctx.fillStyle = '#90caf9';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        const variables = [
          'WIDTH = 800',
          'HEIGHT = 600',
          'player_x = 400',
          'player_y = 300',
          'BLUE = (0,0,255)'
        ];

        variables.forEach((variable, index) => {
          const y = 60 + (index * 35);
          if (y < canvas.height - 100) { // Leave space for bottom text
            ctx.fillText(variable, canvas.width / 2, y);
          }
        });

        ctx.fillStyle = '#ffffff';
        ctx.font = '18px Arial';
        drawTextWithBounds(ctx, 'Learning Variables & Data Types', canvas.width / 2 - 200, canvas.height - 70, 400, 30);
        break;

      case 2: // Window
        ctx.strokeStyle = '#90caf9';
        ctx.lineWidth = 3;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Window Created!', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Graphics Setup Complete', canvas.width / 2, canvas.height / 2 + 30);
        break;

      case 3: // Shapes
        // Draw rectangle
        ctx.fillStyle = '#90caf9';
        ctx.fillRect(150, 120, 100, 60);

        // Draw circle
        ctx.beginPath();
        ctx.arc(400, 150, 30, 0, 2 * Math.PI);
        ctx.fillStyle = '#64b5f6';
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Rectangle', 200, 200);
        ctx.fillText('Circle', 400, 200);
        ctx.fillText('Basic Drawing Shapes', canvas.width / 2, canvas.height - 50);
        break;

      case 4: // Player
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(350, 200, 50, 50);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PLAYER', 375, 270);
        ctx.fillText('Game Character Added', canvas.width / 2, canvas.height - 50);
        break;

      case 5: // Game Loop
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        const loopText = [
          'while running:',
          '    handle_events()',
          '    update_game()',
          '    draw_screen()',
          '    clock.tick(60)'
        ];

        loopText.forEach((line, index) => {
          const y = 100 + index * 20;
          if (y < canvas.height - 80) { // Leave space for bottom text
            ctx.fillText(line, 50, y);
          }
        });

        ctx.fillStyle = '#ff9800';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        drawTextWithBounds(ctx, 'Game Loop Concept', canvas.width / 2 - 150, canvas.height - 60, 300, 30);
        break;

      case 6: // Input
        ctx.fillStyle = '#ff9800';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎹 Keyboard Input', canvas.width / 2, 120);
        ctx.font = '14px Arial';
        ctx.fillText('Detecting key presses...', canvas.width / 2, 150);
        ctx.fillText('Arrow keys will control movement', canvas.width / 2, 180);
        break;

        break;

      case 7: // Basic Movement
        // Draw player at current position
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(playerPos.x, playerPos.y, 50, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PLAYER', playerPos.x + 25, playerPos.y + 30);

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        drawTextWithBounds(ctx, '→ Try pressing RIGHT ARROW!', canvas.width / 2 - 150, 100, 300, 20);
        drawTextWithBounds(ctx, 'Basic movement implemented', canvas.width / 2 - 150, 130, 300, 20);

        // Show key press feedback
        if (keys['ArrowRight']) {
          ctx.fillStyle = '#ff9800';
          ctx.font = 'bold 16px Arial';
          drawTextWithBounds(ctx, '→ RIGHT KEY PRESSED!', canvas.width / 2 - 150, 160, 300, 20);
        }
        break;

      case 8: // Left Movement
        // Draw player at current position
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(playerPos.x, playerPos.y, 50, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PLAYER', playerPos.x + 25, playerPos.y + 30);

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        drawTextWithBounds(ctx, '← → Use LEFT/RIGHT arrows!', canvas.width / 2 - 150, 100, 300, 20);
        drawTextWithBounds(ctx, 'Bidirectional movement', canvas.width / 2 - 150, 130, 300, 20);

        // Show key press feedback
        let keyFeedback = '';
        if (keys['ArrowLeft']) keyFeedback = '← LEFT KEY PRESSED!';
        if (keys['ArrowRight']) keyFeedback = '→ RIGHT KEY PRESSED!';
        if (keyFeedback) {
          ctx.fillStyle = '#ff9800';
          ctx.font = 'bold 16px Arial';
          drawTextWithBounds(ctx, keyFeedback, canvas.width / 2 - 150, 160, 300, 20);
        }
        break;

      case 9: // Full Movement
        // Draw player at current position
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(playerPos.x, playerPos.y, 50, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PLAYER', playerPos.x + 25, playerPos.y + 30);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        drawTextWithBounds(ctx, '🎮 FULL MOVEMENT ENABLED!', canvas.width / 2 - 150, 100, 300, 20);
        ctx.font = '14px Arial';
        drawTextWithBounds(ctx, '↑ ↓ ← → All arrow keys work', canvas.width / 2 - 150, 130, 300, 20);

        // Show which keys are currently pressed
        const pressedKeys: string[] = [];
        if (keys['ArrowLeft']) pressedKeys.push('← LEFT');
        if (keys['ArrowRight']) pressedKeys.push('→ RIGHT');
        if (keys['ArrowUp']) pressedKeys.push('↑ UP');
        if (keys['ArrowDown']) pressedKeys.push('↓ DOWN');

        if (pressedKeys.length > 0) {
          ctx.fillStyle = '#ff9800';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          drawTextWithBounds(ctx, `MOVING: ${pressedKeys.join(', ')}`, canvas.width / 2 - 150, 160, 300, 20);
        } else {
          ctx.fillStyle = '#cccccc';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          drawTextWithBounds(ctx, 'Press arrow keys or use buttons below', canvas.width / 2 - 150, 160, 300, 20);
        }
        break;

      case 10: // Boundaries
        // Draw player at current position
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(playerPos.x, playerPos.y, 50, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PLAYER', playerPos.x + 25, playerPos.y + 30);

        // Draw boundaries
        ctx.strokeStyle = '#f44336';
        ctx.lineWidth = 3;
        ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        drawTextWithBounds(ctx, '🚫 Boundary Limits Added', canvas.width / 2 - 150, 50, 300, 20);
        drawTextWithBounds(ctx, 'Player cannot move outside bounds', canvas.width / 2 - 150, 80, 300, 20);
        break;

      case 11: // Collectibles
        // Draw player at current position
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(playerPos.x, playerPos.y, 50, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PLAYER', playerPos.x + 25, playerPos.y + 30);

        // Draw collectibles (only if not collected)
        const collectiblesStep11 = [
          { x: 150, y: 150, collected: collectedItems[0] },
          { x: 550, y: 300, collected: collectedItems[1] }
        ];

        collectiblesStep11.forEach((collectible, index) => {
          if (!collectible.collected) {
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
            ctx.arc(collectible.x, collectible.y, 20, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
            ctx.fillText('⭐', collectible.x, collectible.y + 10);
          }
        });

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Collectible Items Added!', canvas.width / 2, 50);
        ctx.fillText('Move player to collect stars', canvas.width / 2, 80);
        break;

      case 12: // Collision Detection
        // Draw player at current position
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(playerPos.x, playerPos.y, 50, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PLAYER', playerPos.x + 25, playerPos.y + 30);

        // Draw collectibles (only if not collected)
        const collectiblesStep12 = [
          { x: 150, y: 150, collected: collectedItems[0] },
          { x: 550, y: 300, collected: collectedItems[1] }
        ];

        collectiblesStep12.forEach((collectible, index) => {
          if (!collectible.collected) {
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
            ctx.arc(collectible.x, collectible.y, 20, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
            ctx.fillText('⭐', collectible.x, collectible.y + 10);
          }
        });

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💥 Collision Detection Active!', canvas.width / 2, 50);
        ctx.font = '14px Arial';
        ctx.fillText('Move player to collect stars', canvas.width / 2, 80);

        // Show collection status
        const collectedCount = collectedItems.filter(item => item).length;
        ctx.fillText(`Stars collected: ${collectedCount}/2`, canvas.width / 2, 110);
        break;

      case 13: // Score System
        // Calculate score based on collected items (10 points per item)
        const score = collectedItems.filter(item => item).length * 10;

        // Draw score
        ctx.fillStyle = '#4caf50';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`SCORE: ${score}`, 50, 50);

        // Draw player
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(350, 200, 50, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PLAYER', 375, 270);

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Score system implemented!', canvas.width / 2, canvas.height - 50);
        ctx.fillText(`Collect items to increase score (+10 points each)`, canvas.width / 2, canvas.height - 25);
        break;

      case 14: // Game States
        // Calculate score for game state logic
        const currentScore = collectedItems.filter(item => item).length * 10;
        let gameStateText = 'PLAYING';
        let gameStateColor = '#ffffff';

        if (currentScore >= 20) {
          gameStateText = '🎉 WON!';
          gameStateColor = '#4caf50';
        } else if (currentScore >= 10) {
          gameStateText = 'GOOD PROGRESS';
          gameStateColor = '#ff9800';
        }

        // Show current game state
        ctx.fillStyle = gameStateColor;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`GAME STATE: ${gameStateText}`, canvas.width / 2, 60);

        // Show score
        ctx.fillStyle = '#4caf50';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`SCORE: ${currentScore}`, canvas.width / 2, 90);

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.fillText('🎯 Game Objectives:', canvas.width / 2, 130);
        ctx.font = '14px Arial';
        ctx.fillText('• Collect all items (+10 points each)', canvas.width / 2, 160);
        ctx.fillText('• Avoid obstacles', canvas.width / 2, 190);
        ctx.fillText('• Reach target score (20+ to win)', canvas.width / 2, 220);
        ctx.fillText('• Win/lose conditions based on score', canvas.width / 2, 250);

        // Show win condition progress
        ctx.fillStyle = currentScore >= 20 ? '#4caf50' : '#ff9800';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(currentScore >= 20 ? '🎉 WIN CONDITION MET!' : `Progress: ${currentScore}/20 to win`, canvas.width / 2, 285);
        break;

      case 15: // Functions
        ctx.fillStyle = '#9c27b0';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        const functionCode = [
          'def update_player():',
          '    handle_movement()',
          '    check_collisions()',
          '',
          'def draw_game():',
          '    draw_player()',
          '    draw_items()'
        ];

        functionCode.forEach((line, index) => {
          const y = 100 + index * 20;
          if (y < canvas.height - 80) { // Leave space for bottom text
            ctx.fillText(line, 50, y);
          }
        });

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        drawTextWithBounds(ctx, 'Functions & Organization', canvas.width / 2 - 150, canvas.height - 60, 300, 30);
        break;

      case 16: // Animation
        ctx.fillStyle = '#ff5722';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('✨ Smooth Animations', canvas.width / 2, 120);
        ctx.font = '14px Arial';
        ctx.fillText('60 FPS Game Loop', canvas.width / 2, 150);
        ctx.fillText('Fluid Movement & Effects', canvas.width / 2, 180);
        break;

      case 17: // Sound
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🔊 Sound Effects Added!', canvas.width / 2, 120);
        ctx.font = '14px Arial';
        ctx.fillText('• Collect item sounds', canvas.width / 2, 150);
        ctx.fillText('• Background music', canvas.width / 2, 175);
        ctx.fillText('• Win/lose audio cues', canvas.width / 2, 200);
        break;

      case 18: // Advanced Graphics
        ctx.fillStyle = '#e91e63';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🌟 Advanced Graphics', canvas.width / 2, 100);
        ctx.font = '14px Arial';
        ctx.fillText('Particles • Shadows • Effects', canvas.width / 2, 130);
        ctx.fillText('Professional Visual Polish', canvas.width / 2, 160);
        break;

      case 19: // Game Complete
        ctx.fillStyle = '#4caf50';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎉 GAME COMPLETE!', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '18px Arial';
        ctx.fillText('You\'ve built a full game!', canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('Congratulations! 🎊', canvas.width / 2, canvas.height / 2 + 50);
        break;

      default:
        // Fallback for any missing steps
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Step implementation in progress...', canvas.width / 2, canvas.height / 2);
        break;
    }

  }, [gameState, playerPos, keys, gameState.gameType, animationTime]);

  const handleCanvasClick = () => {
    // Focus the canvas when clicked to ensure keyboard events work
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  };

  // Simplified focus handling
  React.useEffect(() => {
    if (gameState.currentStep >= 7 && gameState.currentStep <= 13) {
      // Just ensure canvas can receive focus
    }
  }, [gameState.currentStep]);


  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={400}
      tabIndex={0} // Make canvas focusable
      onClick={handleCanvasClick}
      onFocus={() => {
        // Add visual feedback when canvas is focused
        if (canvasRef.current) {
          canvasRef.current.style.border = '2px solid #90caf9';
          canvasRef.current.style.boxShadow = '0 0 10px rgba(144, 202, 249, 0.5)';
        }
      }}
      onBlur={() => {
        // Remove visual feedback when canvas loses focus
        if (canvasRef.current) {
          canvasRef.current.style.border = '2px solid rgba(144, 202, 249, 0.3)';
          canvasRef.current.style.boxShadow = 'none';
        }
      }}
      style={{
        display: 'block',
        margin: '0 auto',
        borderRadius: '8px',
        cursor: 'pointer',
        outline: 'none', // Remove default outline
        border: '2px solid rgba(144, 202, 249, 0.3)', // Default border
      }}
    />
  );
};

// Helper function to get implementation text
const getImplementationText = (stepIndex: number, language: string, gameType: string = 'movement'): string => {
  const movementImplementations: Record<number, Record<string, string>> = {
    0: {
      python: 'print("Movement Game Tutorial")',
      javascript: 'console.log("Movement Game Tutorial");',
      cpp: 'std::cout << "Movement Game Tutorial" << std::endl;',
      typescript: 'console.log("Movement Game Tutorial");'
    },
    1: {
      python: 'WIDTH = 800\nHEIGHT = 600\nplayer_x = WIDTH // 2',
      javascript: 'const WIDTH = 800;\nconst HEIGHT = 600;\nlet playerX = WIDTH / 2;',
      cpp: 'const int WIDTH = 800;\nconst int HEIGHT = 600;\nfloat playerX = WIDTH / 2.0f;',
      typescript: 'const WIDTH: number = 800;\nconst HEIGHT: number = 600;\nlet playerX: number = WIDTH / 2;'
    },
    2: {
      python: 'screen = pygame.display.set_mode((WIDTH, HEIGHT))',
      javascript: 'const canvas = document.getElementById("gameCanvas");\nconst ctx = canvas.getContext("2d");',
      cpp: 'sf::RenderWindow window(sf::VideoMode(WIDTH, HEIGHT), "Game");',
      typescript: 'const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;\nconst ctx = canvas.getContext("2d")!;'
    },
    3: {
      python: 'pygame.draw.rect(screen, BLUE, (x, y, width, height))',
      javascript: 'ctx.fillRect(x, y, width, height);',
      cpp: 'window.draw(rectangleShape);',
      typescript: 'ctx.fillRect(x, y, width, height);'
    },
    4: {
      python: 'player = {"x": 400, "y": 300, "width": 50, "height": 50}',
      javascript: 'const player = {x: 400, y: 300, width: 50, height: 50};',
      cpp: 'Player player = {400.0f, 300.0f, 50.0f, 50.0f};',
      typescript: 'const player: Player = {x: 400, y: 300, width: 50, height: 50};'
    },
    5: {
      python: 'while running:\n    update()\n    draw()\n    clock.tick(60)',
      javascript: 'function gameLoop() {\n    update();\n    draw();\n    requestAnimationFrame(gameLoop);\n}',
      cpp: 'while (window.isOpen()) {\n    handleEvents();\n    update();\n    draw();\n}',
      typescript: 'const gameLoop = (): void => {\n    update();\n    draw();\n    requestAnimationFrame(gameLoop);\n};'
    },
    6: {
      python: 'keys = pygame.key.get_pressed()\nif keys[pygame.K_RIGHT]: ...',
      javascript: 'document.addEventListener("keydown", handleKey);\nif (keys["ArrowRight"]) ...',
      cpp: 'if (sf::Keyboard::isKeyPressed(sf::Keyboard::Right)) ...',
      typescript: 'document.addEventListener("keydown", (e: KeyboardEvent) => {\n    if (e.code === "ArrowRight") ...\n});'
    },
    7: {
      python: 'if keys[pygame.K_RIGHT]:\n    player_x += speed',
      javascript: 'if (keys["ArrowRight"]) {\n    player.x += speed;\n}',
      cpp: 'if (sf::Keyboard::isKeyPressed(sf::Keyboard::Right)) {\n    playerX += speed;\n}',
      typescript: 'if (keys["ArrowRight"]) {\n    player.x += speed;\n}'
    },
    8: {
      python: 'if keys[pygame.K_LEFT]:\n    player_x -= speed',
      javascript: 'if (keys["ArrowLeft"]) {\n    player.x -= speed;\n}',
      cpp: 'if (sf::Keyboard::isKeyPressed(sf::Keyboard::Left)) {\n    playerX -= speed;\n}',
      typescript: 'if (keys["ArrowLeft"]) {\n    player.x -= speed;\n}'
    },
    9: {
      python: 'if keys[pygame.K_UP]:\n    player_y -= speed\nif keys[pygame.K_DOWN]:\n    player_y += speed',
      javascript: 'if (keys["ArrowUp"]) player.y -= speed;\nif (keys["ArrowDown"]) player.y += speed;',
      cpp: 'if (sf::Keyboard::isKeyPressed(sf::Keyboard::Up)) playerY -= speed;\nif (sf::Keyboard::isKeyPressed(sf::Keyboard::Down)) playerY += speed;',
      typescript: 'if (keys["ArrowUp"]) player.y -= speed;\nif (keys["ArrowDown"]) player.y += speed;'
    },
    10: {
      python: 'player_x = max(0, min(WIDTH - player_width, player_x))\nplayer_y = max(0, min(HEIGHT - player_height, player_y))',
      javascript: 'player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));\nplayer.y = Math.max(0, Math.min(canvas.height - player.height, player.y));',
      cpp: 'playerX = std::max(0.f, std::min(WIDTH - playerWidth, playerX));\nplayerY = std::max(0.f, std::min(HEIGHT - playerHeight, playerY));',
      typescript: 'player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));\nplayer.y = Math.max(0, Math.min(canvas.height - player.height, player.y));'
    },
    11: {
      python: 'collectibles = [\n    {"x": 150, "y": 150},\n    {"x": 550, "y": 300}\n]',
      javascript: 'const collectibles = [\n    {x: 150, y: 150},\n    {x: 550, y: 300}\n];',
      cpp: 'std::vector<Collectible> collectibles = {\n    {150, 150},\n    {550, 300}\n};',
      typescript: 'const collectibles: Collectible[] = [\n    {x: 150, y: 150},\n    {x: 550, y: 300}\n];'
    },
    12: {
      python: 'for collectible in collectibles:\n    distance = ((player_x - collectible["x"])**2 + (player_y - collectible["y"])**2)**0.5\n    if distance < 35:\n        collectibles.remove(collectible)',
      javascript: 'collectibles.forEach((item, index) => {\n    const distance = Math.sqrt((player.x - item.x)**2 + (player.y - item.y)**2);\n    if (distance < 35) collectibles.splice(index, 1);\n});',
      cpp: 'for (auto it = collectibles.begin(); it != collectibles.end(); ) {\n    float distance = sqrt(pow(playerX - it->x, 2) + pow(playerY - it->y, 2));\n    if (distance < 35) it = collectibles.erase(it);\n    else ++it;\n}',
      typescript: 'collectibles.forEach((item, index) => {\n    const distance = Math.sqrt(Math.pow(player.x - item.x, 2) + Math.pow(player.y - item.y, 2));\n    if (distance < 35) collectibles.splice(index, 1);\n});'
    },
    13: {
      python: 'score = 0\ndef collect_item():\n    global score\n    score += 10\n    print(f"Score: {score}")',
      javascript: 'let score = 0;\nfunction collectItem() {\n    score += 10;\n    console.log(`Score: ${score}`);\n}',
      cpp: 'int score = 0;\nvoid collectItem() {\n    score += 10;\n    std::cout << "Score: " << score << std::endl;\n}',
      typescript: 'let score: number = 0;\nfunction collectItem(): void {\n    score += 10;\n    console.log(`Score: ${score}`);\n}'
    },
    14: {
      python: 'game_state = "playing"\nif score >= 20:\n    game_state = "won"\nelif score == 0:\n    game_state = "lost"',
      javascript: 'let gameState = "playing";\nif (score >= 20) gameState = "won";\nelse if (score == 0) gameState = "lost";',
      cpp: 'enum GameState { Playing, Won, Lost };\nGameState gameState = Playing;\nif (score >= 20) gameState = Won;\nelse if (score == 0) gameState = Lost;',
      typescript: 'type GameState = "playing" | "won" | "lost";\nlet gameState: GameState = "playing";\nif (score >= 20) gameState = "won";\nelse if (score == 0) gameState = "lost";'
    },
    15: {
      python: 'def update_player():\n    handle_movement()\n    check_collisions()\n\ndef draw_game():\n    draw_player()\n    draw_items()',
      javascript: 'function updatePlayer() {\n    handleMovement();\n    checkCollisions();\n}\n\nfunction drawGame() {\n    drawPlayer();\n    drawItems();\n}',
      cpp: 'void updatePlayer() {\n    handleMovement();\n    checkCollisions();\n}\n\nvoid drawGame() {\n    drawPlayer();\n    drawItems();\n}',
      typescript: 'function updatePlayer(): void {\n    handleMovement();\n    checkCollisions();\n}\n\nfunction drawGame(): void {\n    drawPlayer();\n    drawItems();\n}'
    },
    16: {
      python: 'import time\nstart_time = time.time()\ncurrent_time = time.time() - start_time\nif current_time > 1.0:\n    # Do something every second',
      javascript: 'let startTime = Date.now();\nlet currentTime = (Date.now() - startTime) / 1000;\nif (currentTime > 1.0) {\n    // Do something every second\n}',
      cpp: 'sf::Clock clock;\nfloat currentTime = clock.getElapsedTime().asSeconds();\nif (currentTime > 1.0f) {\n    // Do something every second\n}',
      typescript: 'const startTime: number = Date.now();\nconst currentTime: number = (Date.now() - startTime) / 1000;\nif (currentTime > 1.0) {\n    // Do something every second\n}'
    },
    17: {
      python: 'import pygame.mixer\npygame.mixer.music.load("background.mp3")\npygame.mixer.music.play(-1)\ncollect_sound = pygame.mixer.Sound("collect.wav")',
      javascript: 'const backgroundMusic = new Audio("background.mp3");\nbackgroundMusic.loop = true;\nbackgroundMusic.play();\nconst collectSound = new Audio("collect.wav");',
      cpp: 'sf::Music backgroundMusic;\nbackgroundMusic.openFromFile("background.ogg");\nbackgroundMusic.setLoop(true);\nbackgroundMusic.play();\nsf::SoundBuffer buffer;\nbuffer.loadFromFile("collect.wav");\nsf::Sound collectSound(buffer);',
      typescript: 'const backgroundMusic: HTMLAudioElement = new Audio("background.mp3");\nbackgroundMusic.loop = true;\nbackgroundMusic.play();\nconst collectSound: HTMLAudioElement = new Audio("collect.wav");'
    },
    18: {
      python: 'import pygame.gfxdraw\npygame.gfxdraw.filled_circle(screen, x, y, radius, color)\n# Add particle effects and shadows',
      javascript: 'ctx.shadowColor = "rgba(0,0,0,0.5)";\nctx.shadowBlur = 10;\nctx.fillStyle = "red";\nctx.fillRect(x, y, width, height);\n// Advanced canvas effects',
      cpp: 'sf::CircleShape shape(radius);\nshape.setFillColor(sf::Color::Red);\nshape.setOutlineThickness(2);\nshape.setOutlineColor(sf::Color::Black);\n// SFML advanced graphics',
      typescript: 'ctx.shadowColor = "rgba(0,0,0,0.5)";\nctx.shadowBlur = 10;\nctx.fillStyle = "red";\nctx.fillRect(x, y, width, height);\n// Advanced canvas effects with TypeScript'
    },
    19: {
      python: 'print("🎉 Congratulations!")\nprint("You have successfully built a complete game!")\nprint("Key concepts learned:")\nprint("- Variables & Data Types")\nprint("- Game Loops & Input")\nprint("- Collision Detection")\nprint("- Score Systems")\nprint("- And much more!")',
      javascript: 'console.log("🎉 Congratulations!");\nconsole.log("You have successfully built a complete game!");\nconsole.log("Key concepts learned:");\nconsole.log("- Variables & Data Types");\nconsole.log("- Game Loops & Input");\nconsole.log("- Collision Detection");\nconsole.log("- Score Systems");\nconsole.log("- And much more!");',
      cpp: 'std::cout << "🎉 Congratulations!" << std::endl;\nstd::cout << "You have successfully built a complete game!" << std::endl;\nstd::cout << "Key concepts learned:" << std::endl;\nstd::cout << "- Variables & Data Types" << std::endl;\nstd::cout << "- Game Loops & Input" << std::endl;\nstd::cout << "- Collision Detection" << std::endl;\nstd::cout << "- Score Systems" << std::endl;\nstd::cout << "- And much more!" << std::endl;',
      typescript: 'console.log("🎉 Congratulations!");\nconsole.log("You have successfully built a complete game!");\nconsole.log("Key concepts learned:");\nconsole.log("- Variables & Data Types");\nconsole.log("- Game Loops & Input");\nconsole.log("- Collision Detection");\nconsole.log("- Score Systems");\nconsole.log("- And much more!");'
    }
  };

  const snakeImplementations: Record<number, Record<string, string>> = {
    0: {
      python: 'print("Welcome to Snake Game Tutorial!")',
      javascript: 'console.log("Welcome to Snake Game Tutorial!");',
      cpp: 'std::cout << "Welcome to Snake Game Tutorial!" << std::endl;',
      typescript: 'console.log("Welcome to Snake Game Tutorial!");'
    },
    1: {
      python: 'snake = [{"x": WIDTH//2, "y": HEIGHT//2}]\nfood = {"x": 200, "y": 150}\nscore = 0',
      javascript: 'let snake = [{x: WIDTH/2, y: HEIGHT/2}];\nlet food = {x: 200, y: 150};\nlet score = 0;',
      cpp: 'std::vector<sf::Vector2i> snake = {{WIDTH/2, HEIGHT/2}};\nsf::Vector2i food(200, 150);\nint score = 0;',
      typescript: 'let snake: Array<{x: number, y: number}> = [{x: WIDTH/2, y: HEIGHT/2}];\nlet food: {x: number, y: number} = {x: 200, y: 150};\nlet score: number = 0;'
    },
    2: {
      python: 'WIDTH = 800\nHEIGHT = 600\nSNAKE_SIZE = 20\nFPS = 10\nBLACK = (0, 0, 0)\nGREEN = (0, 255, 0)\nRED = (255, 0, 0)',
      javascript: 'const WIDTH = 800;\nconst HEIGHT = 600;\nconst SNAKE_SIZE = 20;\nconst FPS = 10;\nconst BLACK = "black";\nconst GREEN = "green";\nconst RED = "red";',
      cpp: 'const int WIDTH = 800;\nconst int HEIGHT = 600;\nconst int SNAKE_SIZE = 20;\nconst int FPS = 10;\nconst sf::Color BLACK(0, 0, 0);\nconst sf::Color GREEN(0, 255, 0);\nconst sf::Color RED(255, 0, 0);',
      typescript: 'const WIDTH: number = 800;\nconst HEIGHT: number = 600;\nconst SNAKE_SIZE: number = 20;\nconst FPS: number = 10;\nconst BLACK: string = "black";\nconst GREEN: string = "green";\nconst RED: string = "red";'
    },
    3: {
      python: 'screen = pygame.display.set_mode((WIDTH, HEIGHT))\npygame.display.set_caption("Snake Game")',
      javascript: 'const canvas = document.getElementById("gameCanvas");\nconst ctx = canvas.getContext("2d");',
      cpp: 'sf::RenderWindow window(sf::VideoMode(WIDTH, HEIGHT), "Snake Game");',
      typescript: 'const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;\nconst ctx = canvas.getContext("2d")!;'
    },
    4: {
      python: 'snake = [{"x": WIDTH//2, "y": HEIGHT//2}]\nsnake_dir = "RIGHT"',
      javascript: 'let snake = [{x: WIDTH/2, y: HEIGHT/2}];\nlet direction = "RIGHT";',
      cpp: 'std::vector<sf::Vector2i> snake = {{WIDTH/2, HEIGHT/2}};\nstd::string direction = "RIGHT";',
      typescript: 'let snake: Array<{x: number, y: number}> = [{x: WIDTH/2, y: HEIGHT/2}];\nlet direction: string = "RIGHT";'
    },
    5: {
      python: 'food = {"x": random.randint(0, WIDTH-SNAKE_SIZE) // SNAKE_SIZE * SNAKE_SIZE,\n       "y": random.randint(0, HEIGHT-SNAKE_SIZE) // SNAKE_SIZE * SNAKE_SIZE}',
      javascript: 'let food = {\n    x: Math.floor(Math.random() * (WIDTH/SNAKE_SIZE)) * SNAKE_SIZE,\n    y: Math.floor(Math.random() * (HEIGHT/SNAKE_SIZE)) * SNAKE_SIZE\n};',
      cpp: 'sf::Vector2i food(\n    (rand() % (WIDTH/SNAKE_SIZE)) * SNAKE_SIZE,\n    (rand() % (HEIGHT/SNAKE_SIZE)) * SNAKE_SIZE\n);',
      typescript: 'let food: {x: number, y: number} = {\n    x: Math.floor(Math.random() * (WIDTH/SNAKE_SIZE)) * SNAKE_SIZE,\n    y: Math.floor(Math.random() * (HEIGHT/SNAKE_SIZE)) * SNAKE_SIZE\n};'
    },
    6: {
      python: 'for segment in snake:\n    pygame.draw.rect(screen, GREEN, (segment["x"], segment["y"], SNAKE_SIZE, SNAKE_SIZE))',
      javascript: 'snake.forEach(segment => {\n    ctx.fillStyle = "green";\n    ctx.fillRect(segment.x, segment.y, SNAKE_SIZE, SNAKE_SIZE);\n});',
      cpp: 'for (const auto& segment : snake) {\n    sf::RectangleShape rect(sf::Vector2f(SNAKE_SIZE, SNAKE_SIZE));\n    rect.setPosition(segment.x, segment.y);\n    rect.setFillColor(sf::Color::Green);\n    window.draw(rect);\n}',
      typescript: 'snake.forEach((segment: {x: number, y: number}) => {\n    ctx.fillStyle = "green";\n    ctx.fillRect(segment.x, segment.y, SNAKE_SIZE, SNAKE_SIZE);\n});'
    },
    7: {
      python: 'pygame.draw.rect(screen, RED, (food["x"], food["y"], SNAKE_SIZE, SNAKE_SIZE))',
      javascript: 'ctx.fillStyle = "red";\nctx.fillRect(food.x, food.y, SNAKE_SIZE, SNAKE_SIZE);',
      cpp: 'sf::RectangleShape foodRect(sf::Vector2f(SNAKE_SIZE, SNAKE_SIZE));\nfoodRect.setPosition(food.x, food.y);\nfoodRect.setFillColor(sf::Color::Red);\nwindow.draw(foodRect);',
      typescript: 'ctx.fillStyle = "red";\nctx.fillRect(food.x, food.y, SNAKE_SIZE, SNAKE_SIZE);'
    },
    8: {
      python: 'if keys[pygame.K_LEFT] and direction != "RIGHT": direction = "LEFT"\n# Similar for other directions',
      javascript: 'if (keys["ArrowLeft"] && direction !== "RIGHT") direction = "LEFT";\n// Similar for other directions',
      cpp: 'if (sf::Keyboard::isKeyPressed(sf::Keyboard::Left) && direction != "RIGHT") direction = "LEFT";',
      typescript: 'if (keys["ArrowLeft"] && direction !== "RIGHT") direction = "LEFT";\n// Similar for other directions'
    },
    9: {
      python: 'head = snake[0].copy()\nif direction == "RIGHT": head["x"] += SNAKE_SIZE\nsnake.insert(0, head)\nsnake.pop()',
      javascript: 'const head = {...snake[0]};\nif (direction === "RIGHT") head.x += SNAKE_SIZE;\nsnake.unshift(head);\nsnake.pop();',
      cpp: 'sf::Vector2i head = snake[0];\nif (direction == "RIGHT") head.x += SNAKE_SIZE;\nsnake.insert(snake.begin(), head);\nsnake.pop_back();',
      typescript: 'const head: {x: number, y: number} = {...snake[0]};\nif (direction === "RIGHT") head.x += SNAKE_SIZE;\nsnake.unshift(head);\nsnake.pop();'
    },
    10: {
      python: 'if head["x"] == food["x"] and head["y"] == food["y"]:\n    score += 10\n    # Generate new food\n    # Don\'t remove tail (grow)',
      javascript: 'if (head.x === food.x && head.y === food.y) {\n    score += 10;\n    // Generate new food\n    // Don\'t pop tail (grow)\n}',
      cpp: 'if (head.x == food.x && head.y == food.y) {\n    score += 10;\n    // Generate new food\n    // Don\'t pop_back (grow)\n}',
      typescript: 'if (head.x === food.x && head.y === food.y) {\n    score += 10;\n    // Generate new food\n    // Don\'t pop tail (grow)\n}'
    },
    11: {
      python: 'if head["x"] < 0 or head["x"] >= WIDTH or head["y"] < 0 or head["y"] >= HEIGHT:\n    game_over = True',
      javascript: 'if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {\n    gameOver = true;\n}',
      cpp: 'if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {\n    gameOver = true;\n}',
      typescript: 'if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {\n    gameOver = true;\n}'
    },
    12: {
      python: 'for segment in snake[1:]:\n    if head["x"] == segment["x"] and head["y"] == segment["y"]:\n        game_over = True',
      javascript: 'for (let i = 1; i < snake.length; i++) {\n    if (head.x === snake[i].x && head.y === snake[i].y) {\n        gameOver = true;\n    }\n}',
      cpp: 'for (size_t i = 1; i < snake.size(); ++i) {\n    if (head.x == snake[i].x && head.y == snake[i].y) {\n        gameOver = true;\n    }\n}',
      typescript: 'for (let i = 1; i < snake.length; i++) {\n    if (head.x === snake[i].x && head.y === snake[i].y) {\n        gameOver = true;\n    }\n}'
    },
    13: {
      python: 'score_text = font.render(f"Score: {score}", True, WHITE)\nscreen.blit(score_text, (10, 10))',
      javascript: 'ctx.fillStyle = "white";\nctx.font = "20px Arial";\nctx.fillText(`Score: ${score}`, 10, 30);',
      cpp: 'sf::Text scoreText;\nscoreText.setFont(font);\nscoreText.setString("Score: " + std::to_string(score));\nscoreText.setPosition(10, 10);\nwindow.draw(scoreText);',
      typescript: 'ctx.fillStyle = "white";\nctx.font = "20px Arial";\nctx.fillText(`Score: ${score}`, 10, 30);'
    },
    14: {
      python: 'game_over_text = font.render("Game Over!", True, RED)\nscreen.blit(game_over_text, (WIDTH//2 - 100, HEIGHT//2))',
      javascript: 'ctx.fillStyle = "red";\nctx.font = "48px Arial";\nctx.textAlign = "center";\nctx.fillText("Game Over!", WIDTH/2, HEIGHT/2);',
      cpp: 'sf::Text gameOverText("Game Over!", font, 48);\ngameOverText.setPosition(WIDTH/2 - 100, HEIGHT/2);\ngameOverText.setFillColor(sf::Color::Red);\nwindow.draw(gameOverText);',
      typescript: 'ctx.fillStyle = "red";\nctx.font = "48px Arial";\nctx.textAlign = "center";\nctx.fillText("Game Over!", WIDTH/2, HEIGHT/2);'
    },
    15: {
      python: 'speed = min(20, 10 + len(snake) // 5)\nclock.tick(speed)',
      javascript: 'const speed = Math.min(20, 10 + Math.floor(snake.length / 5));\n// Adjust game loop timing',
      cpp: 'int speed = std::min(20, 10 + static_cast<int>(snake.size()) / 5);\n// Adjust frame rate',
      typescript: 'const speed: number = Math.min(20, 10 + Math.floor(snake.length / 5));\n// Adjust game loop timing'
    },
    16: {
      python: 'eat_sound = pygame.mixer.Sound("eat.wav")\nif food_eaten:\n    eat_sound.play()',
      javascript: 'const eatSound = new Audio("eat.mp3");\nif (foodEaten) {\n    eatSound.currentTime = 0;\n    eatSound.play();\n}',
      cpp: 'sf::SoundBuffer buffer;\nbuffer.loadFromFile("eat.wav");\nsf::Sound eatSound(buffer);\nif (foodEaten) eatSound.play();',
      typescript: 'const eatSound: HTMLAudioElement = new Audio("eat.mp3");\nif (foodEaten) {\n    eatSound.currentTime = 0;\n    eatSound.play();\n}'
    },
    17: {
      python: 'with open("highscore.txt", "r") as f:\n    high_score = int(f.read())\nif score > high_score:\n    with open("highscore.txt", "w") as f:\n        f.write(str(score))',
      javascript: 'let highScore = localStorage.getItem("snakeHighScore") || 0;\nif (score > highScore) {\n    localStorage.setItem("snakeHighScore", score);\n}',
      cpp: 'std::ifstream file("highscore.txt");\nfile >> highScore;\nif (score > highScore) {\n    std::ofstream outFile("highscore.txt");\n    outFile << score;\n}',
      typescript: 'let highScore: number = parseInt(localStorage.getItem("snakeHighScore") || "0");\nif (score > highScore) {\n    localStorage.setItem("snakeHighScore", score.toString());\n}'
    },
    18: {
      python: 'food_types = [{"color": RED, "points": 10}, {"color": BLUE, "points": 20, "effect": "speed_boost"}]',
      javascript: 'const foodTypes = [\n    {color: "red", points: 10},\n    {color: "blue", points: 20, effect: "speedBoost"}\n];',
      cpp: 'std::vector<FoodType> foodTypes = {\n    {sf::Color::Red, 10, ""},\n    {sf::Color::Blue, 20, "speedBoost"}\n};',
      typescript: 'const foodTypes: FoodType[] = [\n    {color: "red", points: 10},\n    {color: "blue", points: 20, effect: "speedBoost"}\n];'
    },
    19: {
      python: 'power_up = {"x": 300, "y": 200, "type": "shrink", "duration": 10}',
      javascript: 'const powerUp = {\n    x: 300,\n    y: 200,\n    type: "shrink",\n    duration: 10\n};',
      cpp: 'PowerUp powerUp = {300, 200, "shrink", 10};',
      typescript: 'const powerUp: PowerUp = {\n    x: 300,\n    y: 200,\n    type: "shrink",\n    duration: 10\n};'
    },
    20: {
      python: 'skins = {"classic": GREEN, "neon": CYAN, "fire": ORANGE}\ncurrent_skin = skins["classic"]',
      javascript: 'const skins = {\n    classic: "green",\n    neon: "cyan",\n    fire: "orange"\n};\nlet currentSkin = skins.classic;',
      cpp: 'std::map<std::string, sf::Color> skins = {\n    {"classic", sf::Color::Green},\n    {"neon", sf::Color::Cyan},\n    {"fire", sf::Color(255, 165, 0)}\n};',
      typescript: 'const skins: Record<string, string> = {\n    classic: "green",\n    neon: "cyan",\n    fire: "orange"\n};\nlet currentSkin: string = skins.classic;'
    },
    21: {
      python: 'levels = [\n    {"speed": 10, "obstacles": []},\n    {"speed": 15, "obstacles": wall_list}\n]',
      javascript: 'const levels = [\n    {speed: 10, obstacles: []},\n    {speed: 15, obstacles: wallList}\n];',
      cpp: 'std::vector<Level> levels = {{10, {}}, {15, wallList}};',
      typescript: 'const levels: Level[] = [\n    {speed: 10, obstacles: []},\n    {speed: 15, obstacles: wallList}\n];'
    },
    22: {
      python: 'obstacles = [{"x": 200, "y": 200, "width": 40, "height": 40}]\n# Check collision with obstacles',
      javascript: 'const obstacles = [{x: 200, y: 200, width: 40, height: 40}];\n// Check collision with obstacles',
      cpp: 'std::vector<Obstacle> obstacles = {{200, 200, 40, 40}};\n// Check collision with obstacles',
      typescript: 'const obstacles: Obstacle[] = [{x: 200, y: 200, width: 40, height: 40}];\n// Check collision with obstacles'
    },
    23: {
      python: 'particles = []\nfor _ in range(10):\n    particles.append({"x": food_x, "y": food_y, "life": 30})',
      javascript: 'const particles = [];\nfor (let i = 0; i < 10; i++) {\n    particles.push({x: foodX, y: foodY, life: 30});\n}',
      cpp: 'std::vector<Particle> particles;\nfor (int i = 0; i < 10; i++) {\n    particles.push_back({foodX, foodY, 30});\n}',
      typescript: 'const particles: Particle[] = [];\nfor (let i = 0; i < 10; i++) {\n    particles.push({x: foodX, y: foodY, life: 30});\n}'
    },
    24: {
      python: 'if keys[pygame.K_SPACE]:\n    paused = not paused\nif not paused:\n    # Game logic',
      javascript: 'if (keys[" "] || keys["p"]) {\n    paused = !paused;\n}\nif (!paused) {\n    // Game logic\n}',
      cpp: 'if (sf::Keyboard::isKeyPressed(sf::Keyboard::Space)) {\n    paused = !paused;\n}\nif (!paused) {\n    // Game logic\n}',
      typescript: 'if (keys[" "] || keys["p"]) {\n    paused = !paused;\n}\nif (!paused) {\n    // Game logic\n}'
    },
    25: {
      python: 'game_state = {"snake": snake, "score": score, "food": food}\nwith open("save.json", "w") as f:\n    json.dump(game_state, f)',
      javascript: 'const gameState = {snake, score, food};\nlocalStorage.setItem("snakeSave", JSON.stringify(gameState));',
      cpp: '// Serialize game state to file',
      typescript: 'const gameState: GameState = {snake, score, food};\nlocalStorage.setItem("snakeSave", JSON.stringify(gameState));'
    },
    26: {
      python: 'player1 = {"snake": snake1, "controls": {"left": K_a, "right": K_d}}\nplayer2 = {"snake": snake2, "controls": {"left": K_LEFT, "right": K_RIGHT}}',
      javascript: 'const player1 = {snake: snake1, controls: {left: "a", right: "d"}};\nconst player2 = {snake: snake2, controls: {left: "ArrowLeft", right: "ArrowRight"}};',
      cpp: 'Player player1{snake1, {{"left", sf::Keyboard::A}, {"right", sf::Keyboard::D}}};\nPlayer player2{snake2, {{"left", sf::Keyboard::Left}, {"right", sf::Keyboard::Right}}};',
      typescript: 'const player1: Player = {snake: snake1, controls: {left: "a", right: "d"}};\nconst player2: Player = {snake: snake2, controls: {left: "ArrowLeft", right: "ArrowRight"}};'
    },
    27: {
      python: 'if ai_head["x"] < food["x"]: ai_direction = "RIGHT"\nelif ai_head["x"] > food["x"]: ai_direction = "LEFT"',
      javascript: 'if (aiHead.x < food.x) aiDirection = "RIGHT";\nelse if (aiHead.x > food.x) aiDirection = "LEFT";',
      cpp: 'if (aiHead.x < food.x) aiDirection = "RIGHT";\nelse if (aiHead.x > food.x) aiDirection = "LEFT";',
      typescript: 'if (aiHead.x < food.x) aiDirection = "RIGHT";\nelse if (aiHead.x > food.x) aiDirection = "LEFT";'
    },
    28: {
      python: 'import socket\nclient = socket.socket()\nclient.connect(("localhost", 12345))\n# Send game state',
      javascript: 'const ws = new WebSocket("ws://localhost:8080");\nws.send(JSON.stringify({snake, score}));\nws.onmessage = (event) => {\n    // Handle opponent data\n};',
      cpp: 'sf::TcpSocket socket;\nsocket.connect("localhost", 12345);\n// Send/receive game data',
      typescript: 'const ws: WebSocket = new WebSocket("ws://localhost:8080");\nws.send(JSON.stringify({snake, score}));\nws.onmessage = (event: MessageEvent) => {\n    // Handle opponent data\n};'
    },
    29: {
      python: 'gradient = pygame.Surface((SNAKE_SIZE, SNAKE_SIZE))\nfor i in range(SNAKE_SIZE):\n    pygame.draw.line(gradient, (0, 255 - i*5, 0), (i, 0), (i, SNAKE_SIZE))',
      javascript: 'const gradient = ctx.createLinearGradient(0, 0, SNAKE_SIZE, SNAKE_SIZE);\ngradient.addColorStop(0, "darkgreen");\ngradient.addColorStop(1, "lightgreen");\nctx.fillStyle = gradient;',
      cpp: 'sf::RectangleShape segment(sf::Vector2f(SNAKE_SIZE, SNAKE_SIZE));\n// Apply gradient shader or multiple colors',
      typescript: 'const gradient: CanvasGradient = ctx.createLinearGradient(0, 0, SNAKE_SIZE, SNAKE_SIZE);\ngradient.addColorStop(0, "darkgreen");\ngradient.addColorStop(1, "lightgreen");\nctx.fillStyle = gradient;'
    },
    30: {
      python: 'print("🎉 Snake Game Complete!")\nprint("Advanced concepts mastered:")\nprint("- Game architecture")\nprint("- AI implementation")\nprint("- Network programming")\nprint("- Performance optimization")',
      javascript: 'console.log("🎉 Snake Game Complete!");\nconsole.log("Advanced concepts mastered:");\nconsole.log("- Game architecture");\nconsole.log("- AI implementation");\nconsole.log("- Network programming");\nconsole.log("- Performance optimization");',
      cpp: 'std::cout << "🎉 Snake Game Complete!" << std::endl;\nstd::cout << "Advanced concepts mastered:" << std::endl;\nstd::cout << "- Game architecture" << std::endl;\nstd::cout << "- AI implementation" << std::endl;\nstd::cout << "- Network programming" << std::endl;\nstd::cout << "- Performance optimization" << std::endl;',
      typescript: 'console.log("🎉 Snake Game Complete!");\nconsole.log("Advanced concepts mastered:");\nconsole.log("- Game architecture");\nconsole.log("- AI implementation");\nconsole.log("- Network programming");\nconsole.log("- Performance optimization");'
    }
  };

  if (gameType === 'snake') {
    return snakeImplementations[stepIndex]?.[language] || 'Implementation in progress...';
  }

  return movementImplementations[stepIndex]?.[language] || 'Implementation in progress...';
};

export default GameLearning;
