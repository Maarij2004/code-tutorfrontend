import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Tabs,
  Tab,
  LinearProgress,
  Avatar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Code,
  CheckCircle,
  EmojiEvents,
  Star,
  Lock,
  Code as CodeIcon,
  Done,
  Celebration,
} from '@mui/icons-material';
import { RootState, useAppDispatch } from '../store';
import { fetchChallenges, setCurrentChallenge, submitChallenge } from '../store/slices/codeSlice';
import { fetchUserProgress, updateXP } from '../store/slices/userSlice';
import { apiService } from '../services/api';

const languages = [
  { value: 'html', label: 'HTML + CSS', icon: '🌐' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'cpp', label: 'C++', icon: '⚡' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'nodejs', label: 'Node.js Backend', icon: '🟩' },
  { value: 'express', label: 'Express.js', icon: '🚂' },
  { value: 'sql', label: 'SQL', icon: '🗄️' },
  { value: 'fastapi', label: 'FastAPI', icon: '🚀' },
  { value: 'flask', label: 'Flask', icon: '🧪' },
  { value: 'roblox', label: 'Roblox (Lua)', icon: '🎮' },
  { value: 'react', label: 'React', icon: '⚛️' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
];

const Challenges: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentChallenge } = useSelector((state: RootState) => state.code);
  const { progress } = useSelector((state: RootState) => state.user);

  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [activeTab, setActiveTab] = useState(0); // 0 Challenges
  const [completionDialog, setCompletionDialog] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [finalCode, setFinalCode] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [attempts, setAttempts] = useState(0);
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);
  const [tutorialDialog, setTutorialDialog] = useState(false);
  const [evaluationDialog, setEvaluationDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchChallenges());
    dispatch(fetchUserProgress());
  }, [dispatch]);

  // Generate challenges for selected language
  const generateLanguageChallenges = (language: string) => {
    const challenges = [];
    const baseId =
      language === 'html' ? 1000 :
      language === 'python' ? 2000 :
      language === 'cpp' ? 3000 :
      language === 'javascript' ? 4000 :
      language === 'react' ? 5000 :
      language === 'nodejs' ? 6000 :
      language === 'express' ? 6500 :
      language === 'sql' ? 7000 :
      language === 'typescript' ? 8000 :
      language === 'fastapi' ? 9000 :
      language === 'flask' ? 10000 :
      language === 'roblox' ? 11000 :
      12000;

    // Generate actual coding challenges with specific problems
    const getChallengeData = (level: number, difficulty: string, language: string) => {
      const challengeTemplates = {
        python: {
          easy: [
            { title: "Grade Calculator", desc: "Write a program that takes a score (0-100) and prints the grade A-F." },
            { title: "Even or Odd", desc: "Check if a number is even or odd." },
            { title: "Positive or Negative", desc: "Check if a number is positive, negative, or zero." },
            { title: "Largest of Three", desc: "Find the largest of three numbers." },
            { title: "Vowel Checker", desc: "Check if a character is a vowel or consonant." },
            { title: "Sum of Numbers", desc: "Calculate sum of numbers from 1 to n." },
            { title: "Factorial Calculator", desc: "Calculate factorial of a number." },
            { title: "Multiplication Table", desc: "Print multiplication table of a number." },
            { title: "Simple Interest", desc: "Calculate simple interest given principal, rate, and time." },
            { title: "Temperature Converter", desc: "Convert Celsius to Fahrenheit." }
          ],
          medium: [
            { title: "Prime Number Checker", desc: "Check if a number is prime." },
            { title: "Fibonacci Series", desc: "Print first n terms of Fibonacci sequence." },
            { title: "Palindrome Checker", desc: "Check if a string is a palindrome." },
            { title: "Array Sum", desc: "Sum and average of a list of numbers." },
            { title: "String Reversal", desc: "Reverse a string." },
            { title: "Count Vowels", desc: "Count vowels in a string." },
            { title: "Factorial Using Recursion", desc: "Implement factorial recursively." },
            { title: "GCD Calculation", desc: "Calculate Greatest Common Divisor of two numbers." },
            { title: "List Sorting", desc: "Sort a list of numbers in ascending order." },
            { title: "Character Frequency", desc: "Count frequency of characters in a string." }
          ],
          hard: [
            { title: "Binary Search", desc: "Implement binary search on a sorted list." },
            { title: "Matrix Addition", desc: "Add two 3x3 matrices." },
            { title: "Bubble Sort", desc: "Implement bubble sort for a list of numbers." },
            { title: "GCD Calculator", desc: "Calculate GCD using Euclidean algorithm." },
            { title: "Merge Sort", desc: "Implement merge sort for a list of numbers." },
            { title: "Linked List", desc: "Implement singly linked list with insert/delete." },
            { title: "Stack Implementation", desc: "Implement stack using list operations." },
            { title: "Queue Implementation", desc: "Implement queue using list operations." },
            { title: "File I/O Operations", desc: "Read and write data to a text file." },
            { title: "Graph Traversal", desc: "Implement BFS and DFS for a graph." }
          ]
        },
      
        javascript: {
          easy: [
            { title: "Grade Calculator", desc: "Function that returns grade A-F for a score." },
            { title: "Even or Odd", desc: "Check if a number is even or odd." },
            { title: "Positive or Negative", desc: "Return 'Positive', 'Negative', or 'Zero'." },
            { title: "Largest of Three", desc: "Return the largest of three numbers." },
            { title: "Vowel Checker", desc: "Check if a character is a vowel or consonant." },
            { title: "Sum of Numbers", desc: "Return sum of numbers from 1 to n." },
            { title: "Array Sum", desc: "Sum elements in an array." },
            { title: "String Length", desc: "Return the length of a string." },
            { title: "Temperature Converter", desc: "Convert Celsius to Fahrenheit." },
            { title: "Simple Interest", desc: "Calculate simple interest for given inputs." }
          ],
          medium: [
            { title: "Prime Number Checker", desc: "Check if a number is prime." },
            { title: "Fibonacci Series", desc: "Generate first n Fibonacci numbers." },
            { title: "Palindrome Checker", desc: "Check if a string is a palindrome." },
            { title: "Array Reversal", desc: "Reverse an array without built-in reverse." },
            { title: "Count Vowels", desc: "Count vowels in a string." },
            { title: "Find Maximum", desc: "Return maximum number in an array." },
            { title: "Factorial Using Recursion", desc: "Implement factorial recursively." },
            { title: "GCD Calculator", desc: "Calculate GCD of two numbers." },
            { title: "Merge Arrays", desc: "Merge two arrays and sort." },
            { title: "Character Frequency", desc: "Count character frequency in string." }
          ],
          hard: [
            { title: "Binary Search", desc: "Implement binary search on sorted array." },
            { title: "Bubble Sort", desc: "Sort array using bubble sort." },
            { title: "Two Sum Problem", desc: "Find two numbers adding up to target." },
            { title: "String Permutations", desc: "Print all permutations of a string." },
            { title: "Merge Sort", desc: "Implement merge sort." },
            { title: "Linked List", desc: "Implement singly linked list with insert/delete." },
            { title: "Stack Implementation", desc: "Implement stack using array." },
            { title: "Queue Implementation", desc: "Implement queue using array." },
            { title: "Graph Traversal", desc: "Implement BFS and DFS for a graph." },
            { title: "File I/O", desc: "Read/write JSON data to/from file." }
          ]
        },

        nodejs: {
          easy: [
            { title: "Hello Server", desc: "Use http module to respond 'Hello, World!' on GET /." },
            { title: "JSON Health", desc: "Return {status:'ok'} for GET /health using http module." },
            { title: "Echo Body", desc: "POST /echo returns parsed JSON body (handle invalid JSON)." },
            { title: "Query Greet", desc: "GET /greet?name=... responds with Hello <name>." },
            { title: "Route Not Found", desc: "Respond 404 JSON for unknown paths." },
            { title: "Ping Pong", desc: "GET /ping returns {pong:true}." },
            { title: "Uptime", desc: "GET /uptime returns process.uptime() seconds." },
            { title: "Headers Back", desc: "GET /headers returns request headers as JSON (filter out sensitive)." },
            { title: "Sum Numbers", desc: "POST /sum expects {a,b} numbers and returns their sum." },
            { title: "Timestamp", desc: "GET /now returns current ISO timestamp JSON." }
          ],
          medium: [
            { title: "In-Memory Todos", desc: "Implement CRUD for /todos using only arrays (no DB, http module)." },
            { title: "Validate Input", desc: "POST /users requires name & email; return 400 on invalid JSON." },
            { title: "API Key Check", desc: "Reject requests missing x-api-key header with 401 JSON." },
            { title: "Rate Counter", desc: "Count requests per route and expose GET /metrics with counts." },
            { title: "CORS Headers", desc: "Manually set CORS headers for all responses." },
            { title: "Env Port", desc: "Use PORT from env with default 3000; return port in /health." },
            { title: "Static Text", desc: "Serve a simple HTML string for GET / about page (no fs needed)." },
            { title: "Path Params", desc: "GET /users/:id style parsing using pathname segments." },
            { title: "Search Filter", desc: "GET /search?term= filters a hardcoded array of items." },
            { title: "JSON Error Wrap", desc: "Wrap handler calls in try/catch and return JSON errors." }
          ],
          hard: [
            { title: "JWT Parse (No Verify)", desc: "Read Authorization header, decode base64 payload safely (no libs)." },
            { title: "Pagination", desc: "Implement page & limit query params over a hardcoded list." },
            { title: "File Stats", desc: "Use fs to return size/mtime of a temp file path (no uploads)." },
            { title: "Cache Layer", desc: "Add simple in-memory cache with TTL for GET /cache?key=&value=." },
            { title: "Webhook Logger", desc: "POST /webhook logs headers/body; always 200 JSON ack." },
            { title: "Metrics Endpoint", desc: "Return request counts, uptime, and memoryUsage() data." },
            { title: "Graceful Shutdown", desc: "Handle SIGTERM and close server (simulate by timeout if not supported)." },
            { title: "Config Switch", desc: "Return config JSON varying by NODE_ENV (dev/prod)." },
            { title: "Input Sanitizer", desc: "Trim string fields in JSON body and reject non-object bodies." },
            { title: "Middleware Chain", desc: "Manually chain small functions (auth/log) before handler." }
          ]
        },
      
        fastapi: {
          easy: [
            { title: "Hello FastAPI", desc: "Create GET / that returns a JSON greeting." },
            { title: "Path Params", desc: "GET /items/{item_id} returns the id from the path." },
            { title: "Query Search", desc: "GET /search?term= filters a hardcoded list with Query params." },
            { title: "Response Model", desc: "Use response_model with a Pydantic schema for GET /profile." },
            { title: "Create User", desc: "POST /users validates body with a Pydantic model and returns 201." },
            { title: "Enum Parameter", desc: "Use Enum for /status/{state} and reject invalid values." },
            { title: "Default Pagination", desc: "Add skip and limit query params with sensible defaults." },
            { title: "Dependency Injection", desc: "Create Depends that yields a fake db session per request." },
            { title: "Tags and Docs", desc: "Add tags, summary, and description so routes look good in docs." },
            { title: "Custom Status Codes", desc: "Return Response with custom status codes for create/delete." }
          ],
          medium: [
            { title: "APIRouter CRUD", desc: "Use APIRouter for /todos with list/create/update/delete handlers." },
            { title: "Pagination & Filter", desc: "Support completed filter plus pagination query params." },
            { title: "Middleware Logging", desc: "Middleware logs process time and sets X-Process-Time header." },
            { title: "Background Task", desc: "Use BackgroundTasks to simulate sending email after POST." },
            { title: "File Upload", desc: "Accept UploadFile, store to /tmp, and return filename and size." },
            { title: "OAuth2 Protected Route", desc: "Protect an endpoint with OAuth2PasswordBearer token dependency." },
            { title: "Custom Exception Handler", desc: "Handle HTTPException and return a consistent JSON shape." },
            { title: "WebSocket Echo", desc: "Add /ws endpoint that accepts and echoes messages." },
            { title: "Dependency Overrides", desc: "Allow overriding a Depends service for tests/fakes." },
            { title: "Cached Endpoint", desc: "In-memory cache dependency for GET /articles with TTL." }
          ],
          hard: [
            { title: "JWT Auth Flow", desc: "Implement login that issues JWT plus dependency to verify tokens." },
            { title: "Role-Based Scopes", desc: "Use Security scopes to restrict admin-only endpoints." },
            { title: "Rate Limiting", desc: "Shared counter dependency throttles requests per client IP." },
            { title: "Async DB Session", desc: "Provide async SQLAlchemy session dependency with cleanup." },
            { title: "Celery Task Queue", desc: "Offload long task to Celery and expose a status endpoint." },
            { title: "Streaming Response", desc: "Stream a large CSV via StreamingResponse generator." },
            { title: "Versioned Routers", desc: "Mount /api/v1 and /api/v2 routers with different payloads." },
            { title: "OpenAPI Customization", desc: "Add metadata, contact info, and custom docs URLs." },
            { title: "Request ID Tracing", desc: "Middleware adds request_id to logs and responses." },
            { title: "GraphQL Endpoint", desc: "Expose a GraphQL route using Strawberry or graphene." }
          ]
        },
      
        flask: {
          easy: [
            { title: "Hello Flask", desc: "GET / returns a small JSON hello." },
            { title: "Route Params", desc: "GET /users/<user_id> returns the captured path parameter." },
            { title: "Query Search", desc: "GET /search?term= filters a hardcoded list." },
            { title: "JSON Echo", desc: "POST /echo validates JSON and returns it with 200." },
            { title: "Blueprint Setup", desc: "Create an /api blueprint and register it on the app." },
            { title: "Custom 404", desc: "Return JSON error payload via errorhandler for 404s." },
            { title: "Request Logging", desc: "Before-request hook logs method and path." },
            { title: "Config Values", desc: "Load config from env with sane defaults and expose /config." },
            { title: "Template Render", desc: "Render a tiny Jinja template from a route." },
            { title: "Enable CORS", desc: "Allow cross-origin requests using flask-cors helper." }
          ],
          medium: [
            { title: "Todo CRUD", desc: "In-memory CRUD routes for /todos inside a blueprint." },
            { title: "Input Validation", desc: "Validate required JSON fields and return 400 on errors." },
            { title: "Auth Decorator", desc: "Decorator enforces a static token header on protected routes." },
            { title: "Pagination", desc: "Add page and limit query params to the list route." },
            { title: "File Upload", desc: "Handle multipart upload, save to /tmp, return filename and size." },
            { title: "Error Handler", desc: "Global errorhandler returns a consistent JSON envelope." },
            { title: "SQLAlchemy Setup", desc: "Configure SQLite with a model and persist created records." },
            { title: "Caching", desc: "Use Flask-Caching to cache GET /stats for a short TTL." },
            { title: "Background Task", desc: "Kick off a Celery task and expose an endpoint to poll status." },
            { title: "Rate Limiter", desc: "Add simple per-IP rate limiting (flask-limiter or custom)." }
          ],
          hard: [
            { title: "JWT Auth", desc: "Issue and verify JWT tokens with flask-jwt-extended and protect routes." },
            { title: "Role-Based Access", desc: "Decorator enforces admin role for specific endpoints." },
            { title: "Flask-SocketIO Chat", desc: "Broadcast chat messages to connected clients in a room." },
            { title: "Streaming Response", desc: "Stream a CSV/large payload using a generator response." },
            { title: "OpenAPI Docs", desc: "Generate Swagger UI using flasgger or apispec integration." },
            { title: "Database Migrations", desc: "Integrate Flask-Migrate to run Alembic migrations." },
            { title: "Request Correlation", desc: "Attach request id header and log it for each request." },
            { title: "Upload Validation", desc: "Validate file type and size before saving uploads." },
            { title: "Task Queue Retries", desc: "Celery task with retry/backoff and status endpoint." },
            { title: "API Versioning", desc: "Expose /api/v1 and /api/v2 blueprints with different payloads." }
          ]
        },
      
        roblox: {
          easy: [
            { title: "Hello Output", desc: "Script prints a welcome message to the Output on start." },
            { title: "Create Part", desc: "Spawn a Part in workspace with custom color and material." },
            { title: "Touch Event", desc: "Part listens for Touched and awards coins or prints a message." },
            { title: "Click Toggle", desc: "ClickDetector toggles a part's visibility every click." },
            { title: "Tween Movement", desc: "Move a part along a path using TweenService." },
            { title: "GUI Button", desc: "LocalScript button updates label text and plays a sound." },
            { title: "Humanoid Health Watch", desc: "Detect when a player's health hits zero and log it." },
            { title: "Leaderstats Starter", desc: "Add leaderstats with a Coins IntValue on player join." },
            { title: "Sound Trigger", desc: "Play a sound when a part is touched with a debounce." },
            { title: "Looping Messages", desc: "Iterate players and send a chat-style message from a script." }
          ],
          medium: [
            { title: "RemoteEvent Chat", desc: "RemoteEvent sends chat messages server-to-clients safely." },
            { title: "RemoteFunction Fetch", desc: "RemoteFunction returns a player's inventory table to client." },
            { title: "DataStore Save", desc: "Save and load coins with DataStoreService using pcall." },
            { title: "Leaderboard Kills", desc: "Track kills in leaderstats and update on damage events." },
            { title: "NPC Patrol", desc: "NPC patrols waypoints using Humanoid:MoveTo with debounce." },
            { title: "Tool Damage Script", desc: "Tool damages targets with debounce and team checks." },
            { title: "UI Tween Menu", desc: "Animate opening/closing menus using TweenService." },
            { title: "Debounced Interactions", desc: "Reusable debounce helper for click/touch events." },
            { title: "Camera Switcher", desc: "LocalScript toggles custom camera positions for a player." },
            { title: "Remote Validation", desc: "Server validates RemoteEvent payload sizes and rate limits." }
          ],
          hard: [
            { title: "Matchmaking Queue", desc: "Queue players then balance teams before teleporting or starting a round." },
            { title: "Pathfinding Chase", desc: "NPC uses PathfindingService to chase nearest player and replan on failure." },
            { title: "NPC State Machine", desc: "ModuleScript state machine for idle/patrol/chase/attack behaviors." },
            { title: "Cross-Server Messaging", desc: "Use MessagingService to broadcast announcements to all servers." },
            { title: "Inventory Service", desc: "Server-authoritative inventory syncing via RemoteEvents." },
            { title: "Robust DataStore", desc: "Retry with exponential backoff and budget checks around DataStore calls." },
            { title: "Analytics Queue", desc: "Batch gameplay analytics events and flush on intervals." },
            { title: "Remote Security", desc: "Audit and throttle high-frequency remotes; kick on abuse." },
            { title: "Module Services Lifecycle", desc: "Service module with init/start/stop reused by multiple scripts." },
            { title: "Secure Trading", desc: "Two-step trade request/accept flow with server-side validation." }
          ]
        },
      
        cpp: {
          easy: [
            { title: "Grade Calculator", desc: "Print grade A-F for a score." },
            { title: "Even or Odd", desc: "Check if a number is even or odd." },
            { title: "Positive or Negative", desc: "Check if a number is positive, negative, or zero." },
            { title: "Largest of Three", desc: "Find largest of three numbers." },
            { title: "Vowel Checker", desc: "Check if character is vowel/consonant." },
            { title: "Sum of Numbers", desc: "Sum numbers from 1 to n." },
            { title: "Factorial Calculator", desc: "Calculate factorial of a number." },
            { title: "Simple Calculator", desc: "Basic arithmetic operations." },
            { title: "Temperature Converter", desc: "Convert Celsius to Fahrenheit." },
            { title: "Area of Circle", desc: "Calculate area given radius." }
          ],
          medium: [
            { title: "Prime Number Checker", desc: "Check if number is prime." },
            { title: "Fibonacci Series", desc: "Print first n Fibonacci numbers." },
            { title: "Palindrome Checker", desc: "Check if string is palindrome." },
            { title: "Array Operations", desc: "Sum, average, min, max of array." },
            { title: "String Reversal", desc: "Reverse a string." },
            { title: "Matrix Addition", desc: "Add two 2x2 matrices." },
            { title: "GCD Calculator", desc: "Calculate GCD of two numbers." },
            { title: "LCM Calculator", desc: "Calculate LCM of two numbers." },
            { title: "Sort Array", desc: "Sort array using any algorithm." },
            { title: "Count Vowels", desc: "Count vowels in a string." }
          ],
          hard: [
            { title: "Binary Search", desc: "Implement binary search on sorted array." },
            { title: "Bubble Sort", desc: "Sort array using bubble sort." },
            { title: "Linked List", desc: "Implement singly linked list with insert/delete." },
            { title: "Stack Implementation", desc: "Implement stack using array." },
            { title: "Queue Implementation", desc: "Implement queue using array." },
            { title: "Graph Traversal", desc: "Implement BFS and DFS." },
            { title: "Merge Sort", desc: "Implement merge sort." },
            { title: "File I/O", desc: "Read/write text files." },
            { title: "Matrix Multiplication", desc: "Multiply two 3x3 matrices." },
            { title: "Pointer Practice", desc: "Use pointers for dynamic memory allocation." }
          ]
        },
      
        html: {
          easy: [
            { title: "Basic Structure", desc: "Create a basic HTML page with head and body." },
            { title: "Headings Hierarchy", desc: "Add h1-h6 headings in proper hierarchy." },
            { title: "Text Formatting", desc: "Use bold, italic, underline, strikethrough." },
            { title: "Lists", desc: "Create ordered and unordered lists." },
            { title: "Links", desc: "Create internal and external links." },
            { title: "Images", desc: "Add images with alt text." },
            { title: "Tables", desc: "Create a table with headers and rows." },
            { title: "Forms", desc: "Create a contact form with inputs." },
            { title: "Paragraph Styling", desc: "Style paragraphs with CSS color and font-size." },
            { title: "Background Color", desc: "Set background color using CSS." }
          ],
          medium: [
            { title: "Semantic HTML", desc: "Use semantic tags properly." },
            { title: "Responsive Images", desc: "Implement responsive images with srcset." },
            { title: "Form Validation", desc: "Use HTML5 validation attributes." },
            { title: "Multimedia Embedding", desc: "Embed audio and video elements." },
            { title: "CSS Grid Layout", desc: "Create responsive layout with CSS Grid." },
            { title: "Flexbox Layout", desc: "Create layout with CSS Flexbox." },
            { title: "Pseudo-classes", desc: "Use :hover, :focus, :active selectors." },
            { title: "Transitions", desc: "Animate elements using transition property." },
            { title: "Media Queries", desc: "Create responsive design using media queries." },
            { title: "CSS Variables", desc: "Use CSS variables for colors and spacing." }
          ],
          hard: [
            { title: "Complex Layout", desc: "Complete page layout with header, sidebar, main, footer." },
            { title: "Interactive Elements", desc: "Use CSS hover/focus and transitions for interactions." },
            { title: "CSS Animations", desc: "Implement keyframe animations." },
            { title: "Responsive Design", desc: "Make layout fully responsive on all screen sizes." },
            { title: "Flex + Grid Combination", desc: "Use flex and grid together in layout." },
            { title: "Clip-path Shapes", desc: "Create shapes using clip-path." },
            { title: "Z-index Management", desc: "Layer elements properly using z-index." },
            { title: "Advanced Selectors", desc: "Use attribute selectors and combinators." },
            { title: "Custom Fonts", desc: "Use @font-face to include custom fonts." },
            { title: "CSS Filters", desc: "Apply blur, grayscale, brightness effects." }
          ]
        },
      
        react: {
          easy: [
            { title: "Hello React", desc: "Display 'Hello, World!' in a component." },
            { title: "Props Display", desc: "Display name passed via props." },
            { title: "Button Click", desc: "Show alert on button click." },
            { title: "State Counter", desc: "Create counter with increment/decrement." },
            { title: "Conditional Rendering", desc: "Render different UI based on state." },
            { title: "List Rendering", desc: "Render list items using map() with keys." },
            { title: "Controlled Input", desc: "Input updates state and shows value below." },
            { title: "Simple Form", desc: "Display submitted form data." },
            { title: "Component Styling", desc: "Apply inline and CSS module styles." },
            { title: "Event Handling", desc: "Handle onChange and onClick events." }
          ],
          medium: [
            { title: "Todo List", desc: "Add, delete, toggle tasks in a list." },
            { title: "API Fetch", desc: "Fetch data and display it in a component." },
            { title: "useEffect Hook", desc: "Fetch data on component mount using useEffect." },
            { title: "Form Validation", desc: "Validate form fields and show errors." },
            { title: "Context API", desc: "Manage theme state across components." },
            { title: "Custom Hook", desc: "Create reusable hook for form handling." },
            { title: "Modal Component", desc: "Create a modal with open/close state." },
            { title: "Pagination Component", desc: "Implement paginated list view." },
            { title: "Filter List", desc: "Filter displayed list based on input text." },
            { title: "Toggle Dark Mode", desc: "Toggle dark/light theme using context." }
          ],
          hard: [
            { title: "State Management", desc: "Complex state solution for a shopping cart." },
            { title: "Real-time Updates", desc: "Update component data in real-time using WebSockets." },
            { title: "Performance Optimization", desc: "Optimize large list rendering with React.memo and useMemo." },
            { title: "Advanced Routing", desc: "Implement nested routes with route guards." },
            { title: "Dynamic Forms", desc: "Render form fields dynamically from JSON." },
            { title: "Custom Hooks with Context", desc: "Create reusable hooks with context integration." },
            { title: "Higher-Order Components", desc: "Create HOC to wrap multiple components." },
            { title: "Render Props Pattern", desc: "Share functionality using render props." },
            { title: "Code Splitting", desc: "Lazy load components using React.lazy and Suspense." },
            { title: "Profiler Analysis", desc: "Measure component performance using Profiler API." }
          ]
        },
      
        typescript: {
          easy: [
            { title: "Typed Variables", desc: "Declare variables with explicit types." },
            { title: "Interface Definition", desc: "Create Person interface with name, age, email." },
            { title: "Function Types", desc: "Write function with typed parameters and return." },
            { title: "Array Types", desc: "Create typed arrays." },
            { title: "Union Types", desc: "Variable that can be string or number." },
            { title: "Optional Properties", desc: "Interface with optional properties." },
            { title: "Type Assertion", desc: "Use type assertion for variable type." },
            { title: "Basic Generics", desc: "Generic function that works with any type." },
            { title: "Enum Usage", desc: "Define enum and use in variables." },
            { title: "Readonly Properties", desc: "Define object with readonly fields." }
          ],
          medium: [
            { title: "Advanced Interfaces", desc: "Interfaces with methods and readonly properties." },
            { title: "Generic Constraints", desc: "Create generic with constraints using extends." },
            { title: "Mapped Types", desc: "Make all properties optional using mapped types." },
            { title: "Conditional Types", desc: "Create types using conditional logic." },
            { title: "Type Guards", desc: "Implement custom type guards." },
            { title: "Discriminated Unions", desc: "Use discriminated unions for type safety." },
            { title: "Modules & Imports", desc: "Use import/export for modular code." },
            { title: "Namespace Usage", desc: "Organize code using namespaces." },
            { title: "Default Parameters", desc: "Functions with default values." },
            { title: "Tuple Types", desc: "Define and use tuple types." }
          ],
          hard: [
            { title: "Advanced Generics", desc: "Complex generics with multiple constraints." },
            { title: "Template Literal Types", desc: "Manipulate strings at type level." },
            { title: "Recursive Types", desc: "Define recursive types for tree structures." },
            { title: "Utility Types", desc: "Use Partial, Pick, Omit utility types." },
            { title: "Intersection Types", desc: "Combine multiple types." },
            { title: "Keyof & Lookup Types", desc: "Access keys and types dynamically." },
            { title: "Advanced Decorators", desc: "Apply class/method/property decorators." },
            { title: "Mixins", desc: "Combine classes using mixin pattern." },
            { title: "Dynamic Imports", desc: "Load modules dynamically." },
            { title: "Complex Type Challenges", desc: "Solve advanced TypeScript type puzzles." }
          ]
        },
        
        sql: {
          easy: [
            { title: "Select All Customers", desc: "Write a query to retrieve all columns from the customers table." },
            { title: "Filter by Price", desc: "Select products where price is greater than 100." },
            { title: "Sort by Date", desc: "Get all orders sorted by order_date in descending order." },
            { title: "Count Records", desc: "Count the total number of employees in the employees table." },
            { title: "Find Maximum Value", desc: "Find the highest salary from the employees table." },
            { title: "Filter with Multiple Conditions", desc: "Select products where category is 'Electronics' AND price < 500." },
            { title: "Use LIKE Operator", desc: "Find customers whose name starts with 'John' using LIKE." },
            { title: "Calculate Average", desc: "Calculate the average price of all products." },
            { title: "Group by Category", desc: "Group products by category and count items in each category." },
            { title: "Limit Results", desc: "Select the top 10 most expensive products using LIMIT." }
          ],
          medium: [
            { title: "Join Two Tables", desc: "Join customers and orders tables to show customer names with their order IDs." },
            { title: "Subquery for Filtering", desc: "Find products with price above the average price using a subquery." },
            { title: "Aggregate with HAVING", desc: "Find categories with more than 5 products using GROUP BY and HAVING." },
            { title: "Left Join to Include All", desc: "Use LEFT JOIN to show all customers even if they have no orders." },
            { title: "Window Function Ranking", desc: "Rank employees by salary within each department using ROW_NUMBER()." },
            { title: "Date Range Query", desc: "Select orders placed between '2024-01-01' and '2024-12-31'." },
            { title: "String Concatenation", desc: "Concatenate first_name and last_name to create full_name." },
            { title: "CASE Statement", desc: "Use CASE to categorize products as 'Expensive' or 'Affordable' based on price." },
            { title: "UNION Query", desc: "Combine results from two SELECT statements using UNION." },
            { title: "EXISTS Subquery", desc: "Find customers who have placed at least one order using EXISTS." }
          ],
          hard: [
            { title: "Complex Multi-Table Join", desc: "Join customers, orders, and order_items to show customer name, order date, and product name." },
            { title: "Recursive CTE Hierarchy", desc: "Use recursive CTE to traverse an employee-manager hierarchy." },
            { title: "Window Function Moving Average", desc: "Calculate a 7-day moving average of sales using window functions." },
            { title: "PIVOT Operation", desc: "Transform rows into columns showing monthly sales totals for each product." },
            { title: "Correlated Subquery", desc: "Find employees whose salary is above the average in their department using correlated subquery." },
            { title: "Advanced GROUP BY", desc: "Use GROUPING SETS to show totals at multiple aggregation levels." },
            { title: "Temporal Query", desc: "Query historical data using temporal tables to see product prices as of a specific date." },
            { title: "JSON Data Extraction", desc: "Extract and query JSON data stored in a column using JSON functions." },
            { title: "Full-Text Search", desc: "Implement full-text search to find articles containing specific keywords." },
            { title: "Optimized Query with Indexes", desc: "Write a query that efficiently uses indexes and analyze its execution plan." }
          ]
        },
        
        express: {
          easy: [
            { title: "Hello Express Route", desc: "Create a GET / route that returns JSON {message: 'Hello Express!'} using http module." },
            { title: "JSON Health Check", desc: "Implement GET /health that returns {status: 'ok'} with proper JSON headers." },
            { title: "Echo Request Body", desc: "Create POST /echo that reads JSON body and returns it as response." },
            { title: "Query Parameter Handler", desc: "Build GET /greet?name=... that responds with personalized greeting." },
            { title: "Path Parameter Route", desc: "Implement GET /user/:id that extracts and returns the user ID from URL path." },
            { title: "404 Not Found Handler", desc: "Add a catch-all route that returns 404 JSON for unknown paths." },
            { title: "Status Code Response", desc: "Create POST /create that returns 201 status code with JSON response." },
            { title: "Request Headers Endpoint", desc: "Build GET /headers that returns request headers as JSON (filter sensitive ones)." },
            { title: "Multiple Routes", desc: "Implement GET /api/users and GET /api/posts routes with different responses." },
            { title: "JSON Error Response", desc: "Handle invalid JSON in POST requests and return 400 error with message." }
          ],
          medium: [
            { title: "In-Memory CRUD API", desc: "Build full CRUD operations for /api/todos using array storage (GET, POST, PUT, DELETE)." },
            { title: "Request Validation Middleware", desc: "Validate POST /users requires name and email fields, return 400 if missing." },
            { title: "Authentication Middleware", desc: "Create middleware that checks x-api-key header and returns 401 if missing." },
            { title: "Route Metrics Counter", desc: "Track request counts per route and expose GET /metrics with statistics." },
            { title: "CORS Headers Middleware", desc: "Add middleware that sets CORS headers (Access-Control-Allow-Origin, etc.) for all responses." },
            { title: "Environment Configuration", desc: "Use PORT from process.env with default 3000, return port in /health endpoint." },
            { title: "Error Handling Middleware", desc: "Implement error middleware that catches exceptions and returns JSON error responses." },
            { title: "Query String Filtering", desc: "Build GET /products?category=...&minPrice=... that filters hardcoded product array." },
            { title: "Request Logging", desc: "Add middleware that logs method, path, and timestamp for each request." },
            { title: "Pagination Support", desc: "Implement GET /items with ?page= and ?limit= query parameters for pagination." }
          ],
          hard: [
            { title: "JWT Token Parser", desc: "Decode JWT token from Authorization header and extract payload (no verification, use base64)." },
            { title: "Rate Limiting Middleware", desc: "Implement rate limiting that tracks requests per IP and blocks after threshold." },
            { title: "File Upload Handler", desc: "Handle multipart/form-data file uploads and return file metadata (use built-in modules only)." },
            { title: "Session Management", desc: "Implement session storage using in-memory Map with session IDs and expiration." },
            { title: "API Versioning", desc: "Support /api/v1 and /api/v2 routes with different handlers for same endpoints." },
            { title: "Request Body Parser", desc: "Parse both JSON and URL-encoded bodies, detect content-type automatically." },
            { title: "Advanced Routing", desc: "Implement Express Router-like functionality with route prefixes and nested routes." },
            { title: "Caching Layer", desc: "Add in-memory cache with TTL for GET requests, invalidate on POST/PUT/DELETE." },
            { title: "Request Validation", desc: "Validate request body schema, query params, and path params with detailed error messages." },
            { title: "Production Ready Server", desc: "Implement graceful shutdown, request timeout handling, and comprehensive error logging." }
          ]
        }
      };
      
      const langKey = (challengeTemplates as Record<string, any>)[language] ? language : 'javascript';
      const langTemplates = (challengeTemplates as Record<string, any>)[langKey];
      if (!langTemplates) {
        return {
          title: `${language} Challenge ${level}`,
          desc: `Solve this ${difficulty} level coding problem in ${language}.`
        };
      }

      const diffTemplates = langTemplates[difficulty as keyof typeof langTemplates] || [];

      if (diffTemplates[level - 1]) {
        return diffTemplates[level - 1];
      }

      // Fallback for levels beyond available templates
      return {
        title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ${language} Challenge ${level}`,
        desc: `Solve this advanced ${language} coding problem. Level ${level} ${difficulty} challenge.`
      };
    };

    // 10 easy challenges
    for (let i = 1; i <= 10; i++) {
      const challengeData = getChallengeData(i, 'easy', language);
      challenges.push({
        id: baseId + i,
        title: challengeData.title,
        description: challengeData.desc,
        difficulty: 'easy',
        language,
        xpReward: 25,
        isLocked: i > 1 && !isChallengeCompleted(baseId + i - 1),
      });
    }

    // 10 medium challenges - unlock after completing all easy, then sequential
    for (let i = 11; i <= 20; i++) {
      const challengeIndex = i - 10;
      const challengeData = getChallengeData(challengeIndex, 'medium', language);
      const previousId = baseId + i - 1;
      challenges.push({
        id: baseId + i,
        title: challengeData.title,
        description: challengeData.desc,
        difficulty: 'medium',
        language,
        xpReward: 50,
        isLocked: !isChallengeCompleted(baseId + 10) || (i > 11 && !isChallengeCompleted(previousId)),
      });
    }

    // 10 hard challenges - unlock after completing all medium, then sequential
    for (let i = 21; i <= 30; i++) {
      const challengeIndex = i - 20;
      const challengeData = getChallengeData(challengeIndex, 'hard', language);
      const previousId = baseId + i - 1;
      challenges.push({
        id: baseId + i,
        title: challengeData.title,
        description: challengeData.desc,
        difficulty: 'hard',
        language,
        xpReward: 75,
        isLocked: !isChallengeCompleted(baseId + 20) || (i > 21 && !isChallengeCompleted(previousId)),
      });
    }

    return challenges;
  };

  // Generate tutorial content for selected language
  const generateLanguageTutorials = (language: string) => {
    const tutorials = [];
    const baseId = 
      language === 'html' ? 5000 : 
      language === 'python' ? 6000 : 
      language === 'cpp' ? 7000 : 
      language === 'javascript' ? 8000 : 
      language === 'react' ? 9000 : 
      language === 'nodejs' ? 10000 :
      language === 'express' ? 11000 :
      language === 'sql' ? 12000 :
      language === 'typescript' ? 13000 :
      14000;

    // Generate tutorial content with educational topics
    const getTutorialData = (level: number, difficulty: string, language: string) => {
      const tutorialTemplates = {
        python: {
          easy: [
            {
              title: "Python Basics - Hello World",
              content: "Python is a high-level programming language known for its simplicity and readability.",
              concepts: ["print() function", "Basic syntax", "Comments"],
              examples: [
                { code: 'print("Hello, World!")', explanation: "Basic print statement" },
                { code: '# This is a comment\nprint("Python is easy!")', explanation: "Adding comments" }
              ]
            },
            {
              title: "Variables and Data Types",
              content: "Variables store data values. Python has several built-in data types.",
              concepts: ["Variables", "Strings", "Numbers", "Booleans"],
              examples: [
                { code: 'name = "Alice"\nage = 25\nis_student = True', explanation: "Variable declaration" },
                { code: 'print(type(name))  # <class \'str\'>\nprint(type(age))   # <class \'int\'>', explanation: "Checking data types" }
              ]
            },
            {
              title: "Basic Operations",
              content: "Python supports various mathematical and string operations.",
              concepts: ["Arithmetic operators", "String concatenation", "Type conversion"],
              examples: [
                { code: 'x = 10\ny = 3\nprint(x + y)  # 13\nprint(x * y)  # 30', explanation: "Arithmetic operations" },
                { code: 'first = "Hello"\nsecond = "World"\nprint(first + " " + second)', explanation: "String concatenation" }
              ]
            },
            {
              title: "User Input",
              content: "The input() function allows users to enter data during program execution.",
              concepts: ["input() function", "String conversion", "User interaction"],
              examples: [
                { code: 'name = input("Enter your name: ")\nprint("Hello, " + name)', explanation: "Basic user input" },
                { code: 'age = int(input("Enter your age: "))\nprint("You are", age, "years old")', explanation: "Converting input to numbers" }
              ]
            },
            {
              title: "Conditional Statements - if-else",
              content: "Conditional statements allow your program to make decisions based on conditions.",
              concepts: ["if statement", "else clause", "Comparison operators"],
              examples: [
                { code: 'age = 18\nif age >= 18:\n    print("You are an adult")\nelse:\n    print("You are a minor")', explanation: "Basic if-else statement" },
                { code: 'score = 85\nif score >= 90:\n    print("Grade: A")\nelif score >= 80:\n    print("Grade: B")\nelse:\n    print("Grade: C or below")', explanation: "if-elif-else chain" }
              ]
            },
            {
              title: "Loops - for and while",
              content: "Loops allow you to execute code repeatedly until a condition is met.",
              concepts: ["for loop", "while loop", "range() function", "Loop control"],
              examples: [
                { code: 'for i in range(5):\n    print("Count:", i)', explanation: "Basic for loop with range" },
                { code: 'count = 0\nwhile count < 5:\n    print("Count:", count)\n    count += 1', explanation: "Basic while loop" }
              ]
            },
            {
              title: "Lists - Arrays in Python",
              content: "Lists are ordered collections that can store multiple items of different types.",
              concepts: ["List creation", "Indexing", "List methods", "Slicing"],
              examples: [
                { code: 'fruits = ["apple", "banana", "orange"]\nprint(fruits[0])  # apple\nprint(len(fruits))  # 3', explanation: "List creation and basic operations" },
                { code: 'numbers = [1, 2, 3, 4, 5]\nprint(numbers[1:4])  # [2, 3, 4]\nnumbers.append(6)\nprint(numbers)', explanation: "List slicing and methods" }
              ]
            },
            {
              title: "Functions",
              content: "Functions are reusable blocks of code that perform specific tasks.",
              concepts: ["Function definition", "Parameters", "Return values", "Function calls"],
              examples: [
                { code: 'def greet(name):\n    return "Hello, " + name\n\nprint(greet("Alice"))', explanation: "Simple function with parameter and return" },
                { code: 'def add_numbers(a, b):\n    return a + b\n\nresult = add_numbers(5, 3)\nprint(result)', explanation: "Function with multiple parameters" }
              ]
            }
          ],
          medium: [
            {
              title: "List Comprehensions",
              content: "List comprehensions provide a concise way to create lists from existing lists.",
              concepts: ["List comprehensions", "Conditional comprehensions", "Nested comprehensions"],
              examples: [
                { code: 'numbers = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in numbers]\nprint(squares)', explanation: "Basic list comprehension" },
                { code: 'numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nevens = [x for x in numbers if x % 2 == 0]\nprint(evens)', explanation: "List comprehension with condition" }
              ]
            },
            {
              title: "Dictionaries",
              content: "Dictionaries store data in key-value pairs, allowing fast lookups.",
              concepts: ["Dictionary creation", "Accessing values", "Dictionary methods", "Iteration"],
              examples: [
                { code: 'person = {"name": "Alice", "age": 25, "city": "New York"}\nprint(person["name"])', explanation: "Creating and accessing dictionary" },
                { code: 'person["job"] = "Engineer"\nprint(person.keys())\nprint(person.values())', explanation: "Adding items and accessing keys/values" }
              ]
            },
            {
              title: "File Input/Output",
              content: "Python can read from and write to files using built-in functions.",
              concepts: ["Opening files", "Reading files", "Writing files", "File modes"],
              examples: [
                { code: 'with open("example.txt", "w") as file:\n    file.write("Hello, World!")\n\nwith open("example.txt", "r") as file:\n    content = file.read()\n    print(content)', explanation: "Writing to and reading from files" }
              ]
            },
            {
              title: "Exception Handling",
              content: "Exception handling allows your program to gracefully handle errors.",
              concepts: ["try-except blocks", "Multiple exceptions", "finally clause", "Custom exceptions"],
              examples: [
                { code: 'try:\n    x = int(input("Enter a number: "))\n    print("You entered:", x)\nexcept ValueError:\n    print("Please enter a valid number")', explanation: "Basic exception handling" },
                { code: 'try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")\nfinally:\n    print("This always executes")', explanation: "Exception handling with finally" }
              ]
            },
            {
              title: "Modules and Imports",
              content: "Modules allow you to organize code into reusable components.",
              concepts: ["Importing modules", "Standard library", "Custom modules", "from imports"],
              examples: [
                { code: 'import math\nprint(math.sqrt(16))\nprint(math.pi)', explanation: "Importing and using standard library modules" },
                { code: 'from datetime import datetime\nnow = datetime.now()\nprint(now.strftime("%Y-%m-%d %H:%M:%S"))', explanation: "Importing specific functions from modules" }
              ]
            }
          ],
          hard: [
            {
              title: "Object-Oriented Programming",
              content: "OOP allows you to create classes and objects to model real-world entities.",
              concepts: ["Classes", "Objects", "Methods", "Inheritance", "Encapsulation"],
              examples: [
                { code: 'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    \n    def greet(self):\n        return f"Hello, I\'m {self.name}"\n\nperson = Person("Alice", 25)\nprint(person.greet())', explanation: "Creating classes and objects" },
                { code: 'class Student(Person):\n    def __init__(self, name, age, grade):\n        super().__init__(name, age)\n        self.grade = grade\n\nstudent = Student("Bob", 20, "A")\nprint(student.greet())', explanation: "Inheritance example" }
              ]
            },
            {
              title: "Advanced Data Structures",
              content: "Beyond basic lists and dictionaries, Python offers advanced data structures.",
              concepts: ["Stacks", "Queues", "Trees", "Graphs"],
              examples: [
                { code: 'class Stack:\n    def __init__(self):\n        self.items = []\n    \n    def push(self, item):\n        self.items.append(item)\n    \n    def pop(self):\n        return self.items.pop() if self.items else None\n\nstack = Stack()\nstack.push(1)\nstack.push(2)\nprint(stack.pop())  # 2', explanation: "Implementing a stack" }
              ]
            }
          ]
        },
        javascript: {
          easy: [
            {
              title: "JavaScript Basics",
              content: "JavaScript is a programming language that makes web pages interactive.",
              concepts: ["console.log()", "Variables", "Basic syntax"],
              examples: [
                { code: 'console.log("Hello, World!");', explanation: "Basic console output" },
                { code: 'let name = "Alice";\nconsole.log(name);', explanation: "Variable declaration" }
              ]
            },
            {
              title: "Data Types and Variables",
              content: "JavaScript has several data types and ways to declare variables.",
              concepts: ["let, const, var", "Primitive types", "Type checking"],
              examples: [
                { code: 'let name = "Alice"; // string\nconst age = 25; // number\nvar isStudent = true; // boolean', explanation: "Different variable declarations" },
                { code: 'console.log(typeof name); // "string"\nconsole.log(typeof age); // "number"', explanation: "Checking variable types" }
              ]
            },
            {
              title: "Operators and Expressions",
              content: "JavaScript supports various operators for calculations and comparisons.",
              concepts: ["Arithmetic operators", "Comparison operators", "Logical operators"],
              examples: [
                { code: 'let x = 10;\nlet y = 3;\nconsole.log(x + y); // 13\nconsole.log(x > y); // true', explanation: "Arithmetic and comparison operators" },
                { code: 'let isAdult = age >= 18 && age < 65;\nconsole.log(isAdult);', explanation: "Logical operators" }
              ]
            },
            {
              title: "Control Flow - if/else",
              content: "Control flow statements allow your program to make decisions.",
              concepts: ["if statement", "else clause", "else if", "Ternary operator"],
              examples: [
                { code: 'let age = 20;\nif (age >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Minor");\n}', explanation: "Basic if-else statement" },
                { code: 'let grade = score >= 90 ? "A" : score >= 80 ? "B" : "C";\nconsole.log(grade);', explanation: "Ternary operator" }
              ]
            },
            {
              title: "Loops",
              content: "Loops allow you to execute code repeatedly.",
              concepts: ["for loop", "while loop", "for...of loop", "break and continue"],
              examples: [
                { code: 'for (let i = 0; i < 5; i++) {\n  console.log("Count:", i);\n}', explanation: "Basic for loop" },
                { code: 'let numbers = [1, 2, 3, 4, 5];\nfor (let num of numbers) {\n  console.log(num);\n}', explanation: "for...of loop with arrays" }
              ]
            },
            {
              title: "Arrays",
              content: "Arrays store multiple values in a single variable.",
              concepts: ["Array creation", "Array methods", "Accessing elements", "Array length"],
              examples: [
                { code: 'let fruits = ["apple", "banana", "orange"];\nconsole.log(fruits[0]); // "apple"\nconsole.log(fruits.length); // 3', explanation: "Creating and accessing arrays" },
                { code: 'fruits.push("grape");\nconsole.log(fruits);\nfruits.pop();\nconsole.log(fruits);', explanation: "Array methods: push and pop" }
              ]
            },
            {
              title: "Functions",
              content: "Functions are reusable blocks of code that perform specific tasks.",
              concepts: ["Function declaration", "Parameters", "Return values", "Arrow functions"],
              examples: [
                { code: 'function greet(name) {\n  return "Hello, " + name;\n}\n\nconsole.log(greet("Alice"));', explanation: "Function declaration with parameters" },
                { code: 'const add = (a, b) => a + b;\nconsole.log(add(5, 3)); // 8', explanation: "Arrow function syntax" }
              ]
            },
            {
              title: "Objects",
              content: "Objects store collections of key-value pairs.",
              concepts: ["Object creation", "Accessing properties", "Object methods", "this keyword"],
              examples: [
                { code: 'let person = {\n  name: "Alice",\n  age: 25,\n  greet: function() {\n    return "Hello, I\'m " + this.name;\n  }\n};\n\nconsole.log(person.name);\nconsole.log(person.greet());', explanation: "Creating objects with methods" }
              ]
            }
          ],
          medium: [
            {
              title: "DOM Manipulation",
              content: "The DOM represents the structure of HTML documents.",
              concepts: ["Selecting elements", "Changing content", "Event listeners", "Creating elements"],
              examples: [
                { code: 'let element = document.getElementById("myDiv");\nelement.textContent = "New content";', explanation: "Selecting and modifying elements" },
                { code: 'let button = document.querySelector("button");\nbutton.addEventListener("click", function() {\n  alert("Button clicked!");\n});', explanation: "Adding event listeners" }
              ]
            },
            {
              title: "Promises and Async/Await",
              content: "Promises handle asynchronous operations in JavaScript.",
              concepts: ["Promises", "async/await", ".then()/.catch()", "Error handling"],
              examples: [
                { code: 'function delay(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms));\n}\n\ndelay(1000).then(() => {\n  console.log("Delayed for 1 second");\n});', explanation: "Creating and using promises" },
                { code: 'async function example() {\n  await delay(1000);\n  console.log("Delayed for 1 second");\n}\n\nexample();', explanation: "Using async/await syntax" }
              ]
            }
          ],
          hard: [
            {
              title: "Advanced Array Methods",
              content: "Modern JavaScript provides powerful array manipulation methods.",
              concepts: ["map()", "filter()", "reduce()", "find()", "some()", "every()"],
              examples: [
                { code: 'let numbers = [1, 2, 3, 4, 5];\nlet doubled = numbers.map(x => x * 2);\nconsole.log(doubled); // [2, 4, 6, 8, 10]', explanation: "Using map() to transform arrays" },
                { code: 'let numbers = [1, 2, 3, 4, 5, 6];\nlet evens = numbers.filter(x => x % 2 === 0);\nconsole.log(evens); // [2, 4, 6]', explanation: "Using filter() to select elements" }
              ]
            }
          ]
        },
        cpp: {
          easy: [
            {
              title: "C++ Basics - Hello World",
              content: "C++ is a powerful, high-performance programming language.",
              concepts: ["#include directive", "main function", "cout", "Namespaces"],
              examples: [
                { code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}', explanation: "Basic C++ program structure" }
              ]
            },
            {
              title: "Variables and Data Types",
              content: "C++ supports various data types for storing different kinds of values.",
              concepts: ["int, float, double", "char, string", "bool", "Variable declaration"],
              examples: [
                { code: '#include <iostream>\n#include <string>\n\nint main() {\n    int age = 25;\n    double height = 5.9;\n    std::string name = "Alice";\n    bool isStudent = true;\n    \n    std::cout << name << " is " << age << " years old" << std::endl;\n    return 0;\n}', explanation: "Different data types in C++" }
              ]
            },
            {
              title: "Input and Output",
              content: "C++ uses cin and cout for input and output operations.",
              concepts: ["std::cin", "std::cout", ">> and << operators", "Input validation"],
              examples: [
                { code: '#include <iostream>\n#include <string>\n\nint main() {\n    std::string name;\n    int age;\n    \n    std::cout << "Enter your name: ";\n    std::cin >> name;\n    \n    std::cout << "Enter your age: ";\n    std::cin >> age;\n    \n    std::cout << "Hello " << name << ", you are " << age << " years old!" << std::endl;\n    \n    return 0;\n}', explanation: "Basic input and output" }
              ]
            }
          ],
          medium: [
            {
              title: "Pointers",
              content: "Pointers store memory addresses of variables.",
              concepts: ["Pointer declaration", "Dereferencing", "Address-of operator", "Dynamic memory"],
              examples: [
                { code: '#include <iostream>\n\nint main() {\n    int x = 10;\n    int* ptr = &x; // Pointer to x\n    \n    std::cout << "Value of x: " << x << std::endl;\n    std::cout << "Address of x: " << &x << std::endl;\n    std::cout << "Value through pointer: " << *ptr << std::endl;\n    \n    return 0;\n}', explanation: "Basic pointer usage" }
              ]
            }
          ],
          hard: [
            {
              title: "Object-Oriented Programming",
              content: "C++ supports object-oriented programming with classes and objects.",
              concepts: ["Classes", "Objects", "Member functions", "Access specifiers", "Constructors"],
              examples: [
                { code: '#include <iostream>\n#include <string>\n\nclass Person {\nprivate:\n    std::string name;\n    int age;\n    \npublic:\n    Person(std::string n, int a) {\n        name = n;\n        age = a;\n    }\n    \n    void display() {\n        std::cout << "Name: " << name << ", Age: " << age << std::endl;\n    }\n};\n\nint main() {\n    Person person("Alice", 25);\n    person.display();\n    return 0;\n}', explanation: "Creating classes and objects in C++" }
              ]
            }
          ]
        },
        html: {
          easy: [
            {
              title: "HTML Document Structure",
              content: "Every HTML document has a basic structure with essential elements.",
              concepts: ["DOCTYPE", "html, head, body tags", "Document structure", "Meta tags"],
              examples: [
                { code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My First Page</title>\n</head>\n<body>\n    <h1>Welcome to HTML!</h1>\n</body>\n</html>', explanation: "Complete HTML document structure" }
              ]
            },
            {
              title: "Headings and Paragraphs",
              content: "HTML provides heading tags and paragraph tags for content structure.",
              concepts: ["Heading tags (h1-h6)", "Paragraph tags", "Text hierarchy", "Semantic meaning"],
              examples: [
                { code: '<h1>Main Heading</h1>\n<h2>Subheading</h2>\n<h3>Smaller Subheading</h3>\n\n<p>This is a paragraph of text.</p>\n<p>This is another paragraph.</p>', explanation: "Using headings and paragraphs" }
              ]
            },
            {
              title: "Text Formatting",
              content: "HTML provides tags to format text appearance and meaning.",
              concepts: ["Bold and italic", "Strong and emphasis", "Underline and strikethrough", "Semantic formatting"],
              examples: [
                { code: '<p>\n    <strong>This is bold text</strong><br>\n    <em>This is italic text</em><br>\n    This is <u>underlined</u> text<br>\n    This is <s>strikethrough</s> text\n</p>', explanation: "Text formatting tags" }
              ]
            },
            {
              title: "Lists",
              content: "HTML supports both ordered and unordered lists.",
              concepts: ["Ordered lists (<ol>)", "Unordered lists (<ul>)", "List items (<li>)", "Nested lists"],
              examples: [
                { code: '<h3>Unordered List:</h3>\n<ul>\n    <li>Apple</li>\n    <li>Banana</li>\n    <li>Orange</li>\n</ul>\n\n<h3>Ordered List:</h3>\n<ol>\n    <li>First item</li>\n    <li>Second item</li>\n    <li>Third item</li>\n</ol>', explanation: "Creating ordered and unordered lists" }
              ]
            }
          ],
          medium: [
            {
              title: "Links and Navigation",
              content: "Links connect different pages and sections of your website.",
              concepts: ["Anchor tags (<a>)", "href attribute", "Internal vs external links", "Link targets"],
              examples: [
                { code: '<a href="https://www.google.com">Visit Google</a><br>\n<a href="#section1">Go to Section 1</a><br>\n<a href="page.html" target="_blank">Open in new tab</a>', explanation: "Different types of links" }
              ]
            },
            {
              title: "Images",
              content: "Images make web pages more engaging and informative.",
              concepts: ["img tag", "src attribute", "alt attribute", "Image sizing", "Responsive images"],
              examples: [
                { code: '<img src="image.jpg" alt="A beautiful landscape" width="300" height="200"><br>\n<img src="photo.png" alt="Company logo" style="width: 100px; height: auto;">', explanation: "Adding images with different attributes" }
              ]
            },
            {
              title: "Tables",
              content: "Tables organize data in rows and columns.",
              concepts: ["table, tr, td, th tags", "Table headers", "Table structure", "Table styling"],
              examples: [
                { code: '<table border="1">\n    <tr>\n        <th>Name</th>\n        <th>Age</th>\n        <th>City</th>\n    </tr>\n    <tr>\n        <td>Alice</td>\n        <td>25</td>\n        <td>New York</td>\n    </tr>\n    <tr>\n        <td>Bob</td>\n        <td>30</td>\n        <td>London</td>\n    </tr>\n</table>', explanation: "Creating a data table" }
              ]
            }
          ],
          hard: [
            {
              title: "Forms",
              content: "Forms collect user input and send it to servers.",
              concepts: ["form tag", "input types", "labels", "form validation", "form submission"],
              examples: [
                { code: '<form action="/submit" method="post">\n    <label for="name">Name:</label>\n    <input type="text" id="name" name="name" required><br><br>\n    \n    <label for="email">Email:</label>\n    <input type="email" id="email" name="email" required><br><br>\n    \n    <label for="age">Age:</label>\n    <input type="number" id="age" name="age" min="1" max="120"><br><br>\n    \n    <input type="submit" value="Submit">\n</form>', explanation: "Complete contact form with validation" }
              ]
            }
          ]
        },
        react: {
          easy: [
            {
              title: "Introduction to React",
              content: "React is a JavaScript library for building user interfaces.",
              concepts: ["Components", "JSX", "Props", "State"],
              examples: [
                { code: 'function Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\nconst element = <Welcome name="Alice" />;\nReactDOM.render(element, document.getElementById(\'root\'));', explanation: "Basic React component with props" }
              ]
            },
            {
              title: "JSX Syntax",
              content: "JSX is a syntax extension for JavaScript used in React.",
              concepts: ["JSX elements", "Expressions in JSX", "JSX attributes", "Self-closing tags"],
              examples: [
                { code: 'const element = (\n  <div>\n    <h1>Welcome to React!</h1>\n    <p>The current time is {new Date().toLocaleTimeString()}.</p>\n  </div>\n);', explanation: "JSX with JavaScript expressions" }
              ]
            },
            {
              title: "Components and Props",
              content: "Components are the building blocks of React applications.",
              concepts: ["Functional components", "Class components", "Props", "PropTypes"],
              examples: [
                { code: 'function Greeting(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\nfunction App() {\n  return (\n    <div>\n      <Greeting name="Alice" />\n      <Greeting name="Bob" />\n    </div>\n  );\n}', explanation: "Reusing components with different props" }
              ]
            },
            {
              title: "State Management",
              content: "State allows components to manage and update their own data.",
              concepts: ["useState hook", "State updates", "Event handlers", "Controlled components"],
              examples: [
                { code: 'import React, { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}', explanation: "Using useState for state management" }
              ]
            }
          ],
          medium: [
            {
              title: "Event Handling",
              content: "React provides a way to handle user interactions through events.",
              concepts: ["Event handlers", "Synthetic events", "Event binding", "Preventing default behavior"],
              examples: [
                { code: 'function Form() {\n  function handleSubmit(e) {\n    e.preventDefault();\n    alert(\'Form submitted!\');\n  }\n  \n  return (\n    <form onSubmit={handleSubmit}>\n      <input type="text" />\n      <button type="submit">Submit</button>\n    </form>\n  );\n}', explanation: "Handling form submission" }
              ]
            },
            {
              title: "Lists and Keys",
              content: "Rendering lists of data is a common pattern in React.",
              concepts: ["map() function", "Keys", "List rendering", "Conditional rendering"],
              examples: [
                { code: 'function TodoList() {\n  const todos = [\'Learn React\', \'Build an app\', \'Deploy to production\'];\n  \n  return (\n    <ul>\n      {todos.map((todo, index) => (\n        <li key={index}>{todo}</li>\n      ))}\n    </ul>\n  );\n}', explanation: "Rendering a list with keys" }
              ]
            }
          ],
          hard: [
            {
              title: "Hooks",
              content: "Hooks are functions that let you use state and lifecycle features in functional components.",
              concepts: ["useEffect", "useContext", "Custom hooks", "Rules of hooks"],
              examples: [
                { code: 'import React, { useState, useEffect } from \'react\';\n\nfunction Timer() {\n  const [seconds, setSeconds] = useState(0);\n  \n  useEffect(() => {\n    const interval = setInterval(() => {\n      setSeconds(seconds => seconds + 1);\n    }, 1000);\n    return () => clearInterval(interval);\n  }, []);\n  \n  return <div>Seconds: {seconds}</div>;\n}', explanation: "Using useEffect for side effects" }
              ]
            }
          ]
        },
        typescript: {
          easy: [
            {
              title: "TypeScript Basics",
              content: "TypeScript is a superset of JavaScript that adds static typing.",
              concepts: ["Type annotations", "Basic types", "Type inference", "Compilation"],
              examples: [
                { code: 'let name: string = "Alice";\nlet age: number = 25;\nlet isStudent: boolean = true;\n\n// Type inference\nlet city = "New York"; // TypeScript infers string', explanation: "Basic type annotations" }
              ]
            },
            {
              title: "Arrays and Objects",
              content: "TypeScript provides ways to type arrays and objects.",
              concepts: ["Array types", "Object types", "Optional properties", "Readonly properties"],
              examples: [
                { code: 'let numbers: number[] = [1, 2, 3, 4, 5];\nlet names: Array<string> = ["Alice", "Bob"];\n\ninterface Person {\n  name: string;\n  age: number;\n  email?: string; // Optional property\n}\n\nconst person: Person = {\n  name: "Alice",\n  age: 25\n};', explanation: "Typing arrays and objects" }
              ]
            },
            {
              title: "Functions",
              content: "TypeScript allows you to specify types for function parameters and return values.",
              concepts: ["Function signatures", "Optional parameters", "Default parameters", "Function types"],
              examples: [
                { code: 'function greet(name: string, age?: number): string {\n  if (age) {\n    return `Hello ${name}, you are ${age} years old!`;\n  }\n  return `Hello ${name}!`;\n}\n\nconsole.log(greet("Alice", 25));\nconsole.log(greet("Bob"));', explanation: "Typed function parameters and return values" }
              ]
            }
          ],
          medium: [
            {
              title: "Advanced Types",
              content: "TypeScript offers advanced type features for complex scenarios.",
              concepts: ["Union types", "Intersection types", "Type aliases", "Literal types"],
              examples: [
                { code: 'type Status = "success" | "error" | "loading";\nlet currentStatus: Status = "success";\n\ninterface User {\n  id: number;\n  name: string;\n}\n\ninterface Admin {\n  id: number;\n  permissions: string[];\n}\n\ntype UserOrAdmin = User | Admin;\nconst person: UserOrAdmin = { id: 1, name: "Alice" };', explanation: "Union types and type aliases" }
              ]
            }
          ],
          hard: [
            {
              title: "Generics",
              content: "Generics provide a way to create reusable components that work with multiple types.",
              concepts: ["Generic functions", "Generic interfaces", "Constraints", "Keyof operator"],
              examples: [
                { code: 'function identity<T>(arg: T): T {\n  return arg;\n}\n\nlet output1 = identity<string>("Hello");\nlet output2 = identity<number>(42);\n\ninterface Container<T> {\n  value: T;\n  getValue(): T;\n}\n\nlet stringContainer: Container<string> = {\n  value: "Hello",\n  getValue() { return this.value; }\n};', explanation: "Generic functions and interfaces" }
              ]
            }
          ]
        }
      };

      const langTemplates = tutorialTemplates[language as keyof typeof tutorialTemplates];
      if (!langTemplates) {
        return {
          title: `${language} Tutorial ${level}`,
          content: `Learn the basics of ${language}. This tutorial covers fundamental concepts.`,
          concepts: ["Basic syntax", "Variables", "Control flow"],
          examples: []
        };
      }

      const diffTemplates = langTemplates[difficulty as keyof typeof langTemplates] || [];

      if (diffTemplates[level - 1]) {
        return diffTemplates[level - 1];
      }

      return {
        title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ${language} Tutorial ${level}`,
        content: `Advanced ${language} concepts and techniques. Tutorial level ${level}.`,
        concepts: ["Advanced features", "Best practices", "Performance"],
        examples: []
      };
    };

    // 40 easy tutorials
    for (let i = 1; i <= 40; i++) {
      const tutorialData = getTutorialData(i, 'easy', language);
      tutorials.push({
        id: baseId + i,
        title: tutorialData.title,
        content: tutorialData.content,
        concepts: tutorialData.concepts,
        examples: tutorialData.examples,
        difficulty: 'easy',
        language,
        isLocked: i > 1 && !isTutorialCompleted(baseId + i - 1),
      });
    }

    // 30 medium tutorials
    for (let i = 41; i <= 70; i++) {
      const tutorialData = getTutorialData(i - 40, 'medium', language);
      tutorials.push({
        id: baseId + i,
        title: tutorialData.title,
        content: tutorialData.content,
        concepts: tutorialData.concepts,
        examples: tutorialData.examples,
        difficulty: 'medium',
        language,
        isLocked: !isTutorialCompleted(baseId + 40) || (i > 41 && !isTutorialCompleted(baseId + i - 1)),
      });
    }

    // 30 hard tutorials
    for (let i = 71; i <= 100; i++) {
      const tutorialData = getTutorialData(i - 70, 'hard', language);
      tutorials.push({
        id: baseId + i,
        title: tutorialData.title,
        content: tutorialData.content,
        concepts: tutorialData.concepts,
        examples: tutorialData.examples,
        difficulty: 'hard',
        language,
        isLocked: !isTutorialCompleted(baseId + 70) || (i > 71 && !isTutorialCompleted(baseId + i - 1)),
      });
    }

    return tutorials;
  };

  const isTutorialCompleted = (tutorialId: number | undefined) => {
    // For now, we'll use the same completion tracking as challenges
    // In a real app, you'd have separate tutorial completion tracking
    if (!progress?.completedChallenges || tutorialId === undefined || tutorialId === null) return false;
    // Check both as number and as string to handle mixed types from backend
    const completed = progress.completedChallenges as (number | string)[];
    return completed.includes(tutorialId) || 
           completed.includes(String(tutorialId)) ||
           completed.includes(tutorialId.toString());
  };

  const isChallengeCompleted = (challengeId: number | undefined) => {
    if (!progress?.completedChallenges || challengeId === undefined || challengeId === null) return false;
    // Check both as number and as string to handle mixed types from backend
    // Challenge IDs from MongoDB are ObjectIds (strings), tutorial IDs are integers
    const completed = progress.completedChallenges as (number | string)[];
    return completed.includes(challengeId) || 
           completed.includes(String(challengeId)) ||
           completed.includes(challengeId.toString());
  };

  const languageChallenges = generateLanguageChallenges(selectedLanguage);
  const completedCount = languageChallenges.filter(c => isChallengeCompleted(c.id)).length;
  const progressPercent = languageChallenges.length ? (completedCount / languageChallenges.length) * 100 : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  const handleOpenCodeEditor = (challenge: any) => {
    dispatch(setCurrentChallenge(challenge));
    navigate('/dashboard/editor');
  };

  const handleMarkCompleted = (challenge: any) => {
    setSelectedChallenge(challenge);
    setCompletionDialog(true);
    setFinalCode('');
    setEvaluationResult(null);
    setAttempts(0);
  };

  const handleSubmitFinalCode = async () => {
    if (!finalCode.trim()) return;

    setIsEvaluating(true);

    try {
      // Send code to backend for AI evaluation
      const result = await apiService.evaluateChallenge(
        selectedChallenge.id,
        finalCode,
        selectedLanguage,
        selectedChallenge.title,
        selectedChallenge.description,
        selectedChallenge.difficulty
      );

      setEvaluationResult({
        score: result.score,
        passed: result.passed,
        feedback: result.feedback,
        suggestions: result.suggestions
      });

      // Show evaluation dialog
      setEvaluationDialog(true);

      // Reset attempts if passed
      if (result.passed) {
        setAttempts(0);
      }

      if (result.passed) {
        // Mark as completed and award XP
        dispatch(submitChallenge({ challengeId: selectedChallenge.id, code: finalCode, xpReward: selectedChallenge.xpReward }));
        dispatch(updateXP(selectedChallenge.xpReward));

        // Refetch progress to update completed challenges and unlock next challenge
        dispatch(fetchUserProgress());

        setCompletionDialog(false);
        setSelectedChallenge(null);
        setAttempts(0);
      } else {
        setAttempts(prev => prev + 1);
      }
    } catch (error) {
      setEvaluationResult({
        score: 0,
        passed: false,
        error: 'Evaluation failed - please try again'
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const languageTutorials = generateLanguageTutorials(selectedLanguage);
  const tutorialProgress = languageTutorials.filter(t => isTutorialCompleted(t.id)).length;
  const tutorialProgressPercent = tutorialProgress > 0 ? (tutorialProgress / 100) * 100 : 0;

  const handleOpenTutorial = (tutorial: any) => {
    setSelectedTutorial(tutorial);
    setTutorialDialog(true);
  };

  const handleMarkTutorialCompleted = (tutorial?: any) => {
    const tutorialToComplete = tutorial || selectedTutorial;
    if (tutorialToComplete) {
      // For now, using the same completion tracking as challenges
      // In a real app, you'd have separate tutorial completion
      dispatch(submitChallenge({ challengeId: tutorialToComplete.id, code: '' }));
      dispatch(updateXP(15)); // Less XP for tutorials than challenges
      setTutorialDialog(false);
      setSelectedTutorial(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Learning Center
      </Typography>

      {/* Primary tab (Challenges only) */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Challenges" />
        </Tabs>
      </Box>

      {/* Language Selector */}
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel>Select Language</InputLabel>
          <Select
            value={selectedLanguage}
            label="Select Language"
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{lang.icon}</span>
                  <span>{lang.label}</span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>



      {/* Content based on active tab */}
      {activeTab === 0 && (
        <>
          {/* Challenge Progress Overview */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {languages.find(l => l.value === selectedLanguage)?.icon} {languages.find(l => l.value === selectedLanguage)?.label} Challenges Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="body1">
                  {completedCount}/30 Challenges Completed
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({progressPercent.toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>

          {/* Challenge Grid */}
          <Grid container spacing={3}>
            {languageChallenges.map((challenge) => (
              <Grid item xs={12} md={6} lg={4} key={challenge.id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: challenge.isLocked ? 0.6 : 1,
                  border: challenge.isLocked ? '2px solid #ccc' : 'none'
                }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{
                        bgcolor: isChallengeCompleted(challenge.id) ? 'success.main' : challenge.isLocked ? 'grey.400' : 'primary.main',
                        mr: 2
                      }}>
                        {isChallengeCompleted(challenge.id) ? <CheckCircle /> : challenge.isLocked ? <Lock /> : <Code />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {challenge.title}
                        </Typography>
                        <Chip
                          label={challenge.difficulty}
                          size="small"
                          color={getDifficultyColor(challenge.difficulty) as any}
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {challenge.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Star sx={{ color: 'warning.main', fontSize: 16 }} />
                      <Typography variant="body2">
                        +{challenge.xpReward} XP
                      </Typography>
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    {!challenge.isLocked && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          startIcon={<CodeIcon />}
                          onClick={() => handleOpenCodeEditor(challenge)}
                          size="small"
                          fullWidth
                        >
                          Open Code Editor
                        </Button>
                        {!isChallengeCompleted(challenge.id) && (
                          <Button
                            variant="contained"
                            startIcon={<Done />}
                            onClick={() => handleMarkCompleted(challenge)}
                            size="small"
                            fullWidth
                          >
                            Mark Completed
                          </Button>
                        )}
                      </Box>
                    )}
                    {challenge.isLocked && (
                      <Button
                        variant="outlined"
                        startIcon={<Lock />}
                        disabled
                        size="small"
                        fullWidth
                      >
                        Locked
                      </Button>
                    )}
                    {isChallengeCompleted(challenge.id) && (
                      <Chip
                        label="Completed"
                        color="success"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {activeTab === 1 && (
        <>
          {/* Tutorial Progress Overview */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {languages.find(l => l.value === selectedLanguage)?.icon} {languages.find(l => l.value === selectedLanguage)?.label} Tutorials Progress
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="body1">
                  {tutorialProgress}/30 Tutorials Completed
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({tutorialProgressPercent.toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={tutorialProgressPercent}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>

          {/* Tutorial Grid */}
          <Grid container spacing={3}>
            {languageTutorials.map((tutorial) => (
              <Grid item xs={12} md={6} lg={4} key={tutorial.id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: tutorial.isLocked ? 0.6 : 1,
                  border: tutorial.isLocked ? '2px solid #ccc' : 'none'
                }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{
                        bgcolor: isTutorialCompleted(tutorial.id) ? 'success.main' : tutorial.isLocked ? 'grey.400' : 'info.main',
                        mr: 2
                      }}>
                        {isTutorialCompleted(tutorial.id) ? <CheckCircle /> : tutorial.isLocked ? <Lock /> : <EmojiEvents />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {tutorial.title}
                        </Typography>
                        <Chip
                          label={tutorial.difficulty}
                          size="small"
                          color={getDifficultyColor(tutorial.difficulty) as any}
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {tutorial.content.substring(0, 100)}...
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {tutorial.concepts.slice(0, 3).map((concept, index) => (
                        <Chip
                          key={index}
                          label={concept}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Star sx={{ color: 'warning.main', fontSize: 16 }} />
                      <Typography variant="body2">
                        +15 XP
                      </Typography>
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    {!tutorial.isLocked && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          startIcon={<EmojiEvents />}
                          onClick={() => handleOpenTutorial(tutorial)}
                          size="small"
                          fullWidth
                        >
                          View Tutorial
                        </Button>
                        {!isTutorialCompleted(tutorial.id) && (
                          <Button
                            variant="contained"
                            startIcon={<Done />}
                            onClick={() => handleMarkTutorialCompleted(tutorial)}
                            size="small"
                            fullWidth
                          >
                            Mark Completed
                          </Button>
                        )}
                      </Box>
                    )}
                    {tutorial.isLocked && (
                      <Button
                        variant="outlined"
                        startIcon={<Lock />}
                        disabled
                        size="small"
                        fullWidth
                      >
                        Locked
                      </Button>
                    )}
                    {isTutorialCompleted(tutorial.id) && (
                      <Chip
                        label="Completed"
                        color="success"
                        size="small"
                        sx={{ width: '100%' }}
                      />
                    )}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Completion Dialog */}
      <Dialog open={completionDialog} onClose={() => setCompletionDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Submit Final Code - {selectedChallenge?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Enter your final working code below. It will be evaluated by AI.
          </Typography>

          <TextField
            multiline
            rows={10}
            fullWidth
            label="Final Code"
            value={finalCode}
            onChange={(e) => setFinalCode(e.target.value)}
            placeholder="Paste your complete working solution here..."
            sx={{ mb: 2 }}
          />

          {attempts > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              You've made {attempts} attempt(s). Keep trying!
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompletionDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitFinalCode}
            variant="contained"
            disabled={isEvaluating || !finalCode.trim()}
            startIcon={isEvaluating ? <CircularProgress size={16} /> : null}
          >
            {isEvaluating ? 'Evaluating...' : 'Submit for Evaluation'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tutorial Viewing Dialog */}
      <Dialog
        open={tutorialDialog}
        onClose={() => setTutorialDialog(false)}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <EmojiEvents sx={{ color: 'info.main' }} />
          {selectedTutorial?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Overview
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {selectedTutorial?.content}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Key Concepts
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {selectedTutorial?.concepts.map((concept: string, index: number) => (
              <Chip
                key={index}
                label={concept}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>

          <Typography variant="h6" gutterBottom>
            Code Examples
          </Typography>
          {selectedTutorial?.examples.map((example: any, index: number) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Example {index + 1}: {example.explanation}
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', fontFamily: 'monospace' }}>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                  {example.code}
                </Typography>
              </Paper>
            </Box>
          ))}

          {selectedTutorial?.examples.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No code examples available for this tutorial.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CodeIcon />}
            onClick={() => {
              handleOpenCodeEditor(selectedTutorial);
              setTutorialDialog(false);
            }}
          >
            Open Code Editor
          </Button>
          {!isTutorialCompleted(selectedTutorial?.id) && (
            <Button
              variant="contained"
              startIcon={<Done />}
              onClick={handleMarkTutorialCompleted}
              color="success"
            >
              Mark as Completed (+15 XP)
            </Button>
          )}
          <Button onClick={() => setTutorialDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Evaluation Result Dialog */}
      <Dialog
        open={evaluationDialog}
        onClose={() => setEvaluationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: evaluationResult?.passed ? 'success.main' : 'warning.main',
          color: 'white'
        }}>
          {evaluationResult?.passed ? (
            <Celebration sx={{ fontSize: 28 }} />
          ) : (
            <CheckCircle sx={{ fontSize: 28 }} />
          )}
          {evaluationResult?.passed ? 'Challenge Completed!' : 'Evaluation Results'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {/* Score Display */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h3" sx={{
              fontWeight: 'bold',
              color: evaluationResult?.passed ? 'success.main' : 'warning.main',
              mb: 1
            }}>
              {evaluationResult?.score}/10
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {evaluationResult?.passed ? 'PASSED' : 'FAILED'}
            </Typography>

            {evaluationResult?.passed && (
              <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                🎉 Congratulations! You earned +{selectedChallenge?.xpReward} XP!
              </Typography>
            )}
          </Box>

          {/* Feedback Section */}
          {evaluationResult?.feedback && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Feedback:
              </Typography>
              <Typography variant="body1" sx={{
                p: 2,
                bgcolor: 'grey.800',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.700',
                color: 'grey.100'
              }}>
                {evaluationResult.feedback}
              </Typography>
            </Box>
          )}

          {/* Suggestions Section */}
          {evaluationResult?.suggestions && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                Suggestions for Improvement:
              </Typography>
              <Typography variant="body1" sx={{
                p: 2,
                bgcolor: 'grey.800',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.700',
                color: 'grey.100'
              }}>
                {evaluationResult.suggestions}
              </Typography>
            </Box>
          )}

          {/* Attempts Info */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.800', borderRadius: 1, border: '1px solid', borderColor: 'grey.700' }}>
            <Typography variant="body2" sx={{ color: 'grey.300' }}>
              Attempts made: {attempts}
            </Typography>
            {!evaluationResult?.passed && (
              <Typography variant="body2" sx={{ mt: 1, color: 'grey.200' }}>
                💡 Need at least 6/10 to pass. Try improving your code and submit again!
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          {!evaluationResult?.passed && (
            <Button
              variant="outlined"
              onClick={() => {
                setEvaluationDialog(false);
                // Keep the completion dialog open so they can try again
              }}
            >
              Try Again
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => {
              setEvaluationDialog(false);
              setCompletionDialog(false);
              setSelectedChallenge(null);
              setEvaluationResult(null);
              setAttempts(0);
              setFinalCode('');
            }}
          >
            {evaluationResult?.passed ? 'Continue' : 'Close'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Challenges;
