import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Clear,
  Code,
  Help,
  FiberManualRecord,
} from '@mui/icons-material';
import { RootState, useAppDispatch } from '../store';
import { apiService } from '../services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AskTutor: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML/CSS' },
    { value: 'react', label: 'React' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'sql', label: 'SQL' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'fastapi', label: 'FastAPI' },
    { value: 'flask', label: 'Flask' },
  ];

// Add this state
const [quickQuestions, setQuickQuestions] = useState<string[]>([]);

// Add this useEffect after the existing useEffect
useEffect(() => {
  const questionSets: { [key: string]: string[] } = {
    javascript: [
      "What are variables in JavaScript?",
      "How do I use arrow functions?",
      "Explain promises and async/await",
      "How does the DOM work?",
      "What are ES6 features?",
    ],
    python: [
      "How do Python variables work?",
      "Explain list comprehensions", 
      "How does indentation work?",
      "What are Python decorators?",
      "How do I handle exceptions?",
    ],
    java: [
      "What are Java classes and objects?",
      "How do I use Java collections?",
      "Explain inheritance in Java",
      "What are Java interfaces?",
      "How does exception handling work?",
    ],
    cpp: [
      "What are pointers in C++?",
      "How do I use STL containers?",
      "Explain memory management",
      "What are C++ references?",
      "How do templates work?",
    ],
    html: [
      "How do HTML semantic elements work?",
      "What are CSS selectors?",
      "How do I create responsive layouts?",
      "Explain CSS flexbox",
      "How do HTML forms work?",
    ],
    react: [
      "How do React components work?",
      "What are React hooks?",
      "How does state management work?",
      "Explain React props",
      "How do I handle events in React?",
    ],
    typescript: [
      "What are TypeScript types?",
      "How do interfaces work?",
      "Explain TypeScript generics",
      "What are union types?",
      "How does type inference work?",
    ],
    sql: [
      "How do SQL JOINs work?",
      "What are SQL aggregate functions?",
      "How do I use WHERE clauses?",
      "Explain database normalization",
      "How do I create indexes?",
    ],
    nodejs: [
      "How does Node.js event loop work?",
      "What are npm packages?",
      "How do I use Express.js?",
      "Explain Node.js modules",
      "How do I handle asynchronous code?",
    ],
    fastapi: [
      "How do FastAPI path parameters work?",
      "What are Pydantic models?",
      "How do I handle authentication?",
      "Explain FastAPI dependencies",
      "How do I create API documentation?",
    ],
    flask: [
      "How do Flask routes work?",
      "What are Flask blueprints?",
      "How do I use Jinja2 templates?",
      "Explain Flask-WTF forms",
      "How do I handle sessions?",
    ],
  };

  setQuickQuestions(questionSets[selectedLanguage] || questionSets.javascript);
}, [selectedLanguage]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiService.askTutor(inputMessage, '', selectedLanguage);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting tutor response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error while processing your question. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const MAX_ITEMS = 6;
  const formatMessage = (text: string) => {
    // Clean up markdown formatting and make responses concise
    let cleanedText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **
      .replace(/\*(.*?)\*/g, '$1') // Remove italic *
      .replace(/#{1,6}\s/g, '') // Remove heading #
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Remove inline code `
      .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
      .replace(/\bbullets?:\s*/gi, '') // Remove literal "bullet(s):" prefixes
      .trim();

    // Helper function to detect and format lists
    const formatParagraphWithLists = (paragraph: string) => {
      const lines = paragraph.split('\n');
      const listItems: string[] = [];
      const regularText: string[] = [];

      lines.forEach(line => {
        const trimmedLine = line.trim();
        // Check for numbered lists (1., 2., etc.)
        if (/^\d+\.\s/.test(trimmedLine)) {
          const content = trimmedLine.replace(/^\d+\.\s/, '');
          listItems.push(content);
        }
        // Check for bullet points (-, •, *, etc.)
        else if (/^[-•*]\s/.test(trimmedLine)) {
          const content = trimmedLine.replace(/^[-•*]\s/, '');
          listItems.push(content);
        }
        // Check for lettered lists (a., b., etc.)
        else if (/^[a-zA-Z]\.\s/.test(trimmedLine)) {
          const content = trimmedLine.replace(/^[a-zA-Z]\.\s/, '');
          listItems.push(content);
        }
        else if (trimmedLine) {
          regularText.push(trimmedLine);
        }
      });

      // If we have list items, render as a list
      if (listItems.length > 0) {
        const limited = listItems.slice(0, MAX_ITEMS);
        return (
          <Box key={`list-${Math.random()}`}>
            {regularText.length > 0 && (
              <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
                {regularText.join(' ')}
              </Typography>
            )}
            <List dense sx={{ pl: 2 }}>
              {limited.map((item, itemIndex) => (
                <ListItem key={itemIndex} sx={{ px: 0, py: 0.5, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 'auto', mr: 1, mt: 0.5 }}>
                    <FiberManualRecord sx={{ fontSize: 8, color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        );
      }

      // Regular paragraph
      return (
        <Typography
          key={`para-${Math.random()}`}
          variant="body1"
          component="p"
          sx={{ lineHeight: 1.6 }}
        >
          {regularText.join(' ')}
        </Typography>
      );
    };

    // Simple formatting for code blocks
    const parts = cleanedText.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a code block - style for dark theme
        return (
          <Box
            key={index}
            component="pre"
            sx={{
              backgroundColor: '#1e1e1e',
              color: '#ffffff',
              padding: 1.5,
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              overflow: 'auto',
              margin: '8px 0',
              border: '1px solid rgba(144, 202, 249, 0.2)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {part.trim()}
          </Box>
        );
      }
      // Regular text - check for lists and format accordingly
      const paragraphs = part.split('\n\n').filter(p => p.trim()).slice(0, MAX_ITEMS);
      return paragraphs.map((paragraph, paraIndex) => (
        <Box key={`${index}-${paraIndex}`} sx={{ mb: paraIndex < paragraphs.length - 1 ? 1 : 0 }}>
          {formatParagraphWithLists(paragraph)}
        </Box>
      ));
    });
  };

  return (
    <Box sx={{ height: 'calc(600px + 200px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Ask Your Code Tutor
      </Typography>

      {/* Language Selector */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Select your preferred programming language:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {languages.map((lang) => (
            <Chip
              key={lang.value}
              label={lang.label}
              onClick={() => setSelectedLanguage(lang.value)}
              color={selectedLanguage === lang.value ? 'primary' : 'default'}
              variant={selectedLanguage === lang.value ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
        </Box>
      </Box>

      {/* Quick Questions */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Quick questions to get started:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {quickQuestions.map((question) => (
            <Chip
              key={question}
              label={question}
              onClick={() => handleQuickQuestion(question)}
              variant="outlined"
              size="small"
              icon={<Help />}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Chat Container */}
      <Paper
        elevation={2}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          mb: 2,
          overflow: 'hidden',
        }}
      >
        {/* Messages Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Chat with {languages.find(l => l.value === selectedLanguage)?.label} Tutor
          </Typography>
          <Tooltip title="Clear chat">
            <IconButton onClick={clearChat} size="small">
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Messages List */}
        <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
          <List>
            {messages.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SmartToy sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Ask me anything about coding!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  I'm here to help you learn {languages.find(l => l.value === selectedLanguage)?.label}
                </Typography>
              </Box>
            )}
            {messages.map((message) => (
              <ListItem key={message.id} sx={{ alignItems: 'flex-start', px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main' }}>
                    {message.sender === 'user' ? <Person /> : <SmartToy />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {message.sender === 'user' ? 'You' : 'Code Tutor'} • {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" component="div">
                      {formatMessage(message.text)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            {isLoading && (
              <ListItem sx={{ alignItems: 'flex-start', px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <SmartToy />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      Code Tutor • Thinking...
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography variant="body2">Analyzing your question...</Typography>
                    </Box>
                  }
                />
              </ListItem>
            )}
          </List>
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask me about ${languages.find(l => l.value === selectedLanguage)?.label}...`}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            sx={{ minWidth: 'auto', px: 2 }}
            endIcon={<Send />}
          >
            Send
          </Button>
        </Box>
      </Paper>

      {/* Footer */}
      <Typography variant="body2" color="text.secondary" align="center">
        Tip: Be specific in your questions for better explanations with code examples!
      </Typography>
    </Box>
  );
};

export default AskTutor;
