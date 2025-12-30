import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Grid,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Lightbulb,
  Settings,
  Input,
  Output,
  ContentCopy,
  Code as CodeIcon,
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import { RootState, useAppDispatch } from '../store';
import {
  executeCode,
  analyzeCode,
  setCurrentCode,
  setLanguage,
  clearExecutionResult,
} from '../store/slices/codeSlice';

// NOTE: This sandbox runs with a normal lightweight compiler/runtime.
// For external dependencies (Flask/FastAPI/Node packages/Roblox Lua), use a full setup (e.g., VS Code) with those deps installed.
// Here you can run simple scripts for these languages without extra packages.
const languages = [
  { value: 'html', label: 'HTML + CSS', extension: 'html' },
  { value: 'python', label: 'Python', extension: 'py' },
  { value: 'cpp', label: 'C++', extension: 'cpp' },
  { value: 'java', label: 'Java', extension: 'java' },
  { value: 'javascript', label: 'JavaScript', extension: 'js' },
  { value: 'nodejs', label: 'Node.js Backend', extension: 'js' },
  { value: 'express', label: 'Express.js', extension: 'js' },
  { value: 'typescript', label: 'TypeScript', extension: 'ts' },
  { value: 'flask', label: 'Flask (Python)', extension: 'py' },
  { value: 'fastapi', label: 'FastAPI (Python)', extension: 'py' },
  { value: 'roblox', label: 'Roblox (Lua)', extension: 'lua' },
];

const CodeEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    currentCode,
    language,
    isExecuting,
    executionResult,
    aiAnalysis,
    error,
  } = useSelector((state: RootState) => state.code);

  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [correctedCodeDialog, setCorrectedCodeDialog] = useState(false);
  const [editorLoading, setEditorLoading] = useState(true);
  const [editorMounted, setEditorMounted] = useState(false);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload Monaco Editor
  useEffect(() => {
    // Preload Monaco editor to make it load faster
    const preloadMonaco = async () => {
      try {
        // This helps preload the Monaco bundle
        await import('@monaco-editor/react');
      } catch (error) {
        console.warn('Failed to preload Monaco editor:', error);
      }
    };

    preloadMonaco();
  }, []);

  // Handle editor loading state - only show loading on initial mount, not language changes
  useEffect(() => {
    if (!editorMounted) {
      setEditorLoading(true);
    }
  }, [editorMounted]);

  // Handle editor layout updates
  useEffect(() => {
    const handleLayoutUpdate = () => {
      if (editorRef.current) {
        // Force layout update
        editorRef.current.layout();
      }
    };

    // Update layout when editor mounts or language changes
    if (editorMounted) {
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(handleLayoutUpdate, 50);

      // Also trigger layout after a longer delay in case of rendering issues
      const delayedTimeoutId = setTimeout(handleLayoutUpdate, 200);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(delayedTimeoutId);
      };
    }
  }, [editorMounted, language]);

  // Handle container resize with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      // Debounce the layout calls
      clearTimeout((resizeObserver as any).timeoutId);
      (resizeObserver as any).timeoutId = setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.layout();
        }
      }, 50);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if ((resizeObserver as any).timeoutId) {
        clearTimeout((resizeObserver as any).timeoutId);
      }
    };
  }, [editorMounted]);

  // Handle window resize as fallback
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.layout();
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, []);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    setEditorLoading(false);
    setEditorMounted(true);

    // Configure Monaco Editor
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
      },
    });

    // Force initial layout
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    }, 100);
  };

  const runtimeLanguage = (lang: string) => {
    if (lang === 'flask' || lang === 'fastapi') return 'python';
    if (lang === 'roblox') return 'javascript'; // treated as JS for execution (Monaco) though Roblox uses Lua
    if (lang === 'nodejs' || lang === 'express') return 'javascript';
    return lang;
  };
  const handleRunCode = () => {
    const codeToExecute = currentCode || getLanguageTemplate(language);
    const execLang = runtimeLanguage(language);
    if (codeToExecute.trim()) {
      dispatch(executeCode({ code: codeToExecute, language: execLang, input: input }));
    }
  };
  const handleAnalyzeCode = () => {
    const codeToAnalyze = currentCode || getLanguageTemplate(language);
    const execLang = runtimeLanguage(language);
    if (codeToAnalyze.trim()) {
      dispatch(analyzeCode({ code: codeToAnalyze, language: execLang }));
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    dispatch(setCurrentCode(value || ''));
  };

  const handleLanguageChange = (newLanguage: string) => {
    dispatch(setLanguage(newLanguage));
    dispatch(clearExecutionResult());

    // If currentCode is empty or still a template, update it with the new language template
    const currentTemplate = getLanguageTemplate(language);
    if (!currentCode || currentCode === currentTemplate) {
      const newTemplate = getLanguageTemplate(newLanguage);
      dispatch(setCurrentCode(newTemplate));
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const getLanguageTemplate = (lang: string) => {
    const templates: { [key: string]: string } = {
      javascript: `// Write your JavaScript code here
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim();
console.log(Number(input) + 1);
`,
      nodejs: `const http = require('http');

const server = http.createServer((req, res) => {
  res.end('ok');
});

server.listen(0, () => {
  const { port } = server.address();
  console.log(\`Server is running at port \${port}\`);

  http.get(\`http://127.0.0.1:\${port}/\`, () => {
    server.close(() => process.exit(0));
  }).on('error', () => process.exit(1));
});

// failsafe
setTimeout(() => process.exit(0), 3000);`,      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Create scanner for input
        Scanner scanner = new Scanner(System.in);
        
        // Read input if available
        System.out.println("Hello, Java!");
        
        // Example: Read a number and add 1
        // int number = scanner.nextInt();
        // System.out.println("Result: " + (number + 1));
        
        // Close scanner
        scanner.close();
    }
}`,
      express: `// Express.js style server using built-in http module
// Note: Express is not available in sandbox, using http module instead
const http = require('http');
const { URL } = require('url');

// Simple routing helper (Express-like)
const routes = {
  'GET /': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello Express-style server!' }));
  },
  'GET /api/data': (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, data: 'Express-style API' }));
  },
  'POST /api/submit': (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: true, data: body }));
    });
  }
};

const server = http.createServer((req, res) => {
  const method = req.method;
  const pathname = new URL(req.url, \`http://\${req.headers.host}\`).pathname;
  const routeKey = \`\${method} \${pathname}\`;
  
  const handler = routes[routeKey] || routes[\`\${method} *\`] || ((req, res) => {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });
  
  handler(req, res);
});

server.listen(0, () => {
  const { port } = server.address();
  console.log(\`Express-style server running on port \${port}\`);
  
  // Auto-test the server
  http.get(\`http://127.0.0.1:\${port}/\`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Response:', data);
      server.close(() => process.exit(0));
    });
  }).on('error', () => process.exit(1));
});

// Failsafe
setTimeout(() => process.exit(0), 3000);`,

      flask: `# Use a plain Python function for a quick run.
# this is normal compiler just to run small scripts 
# for more dependencies of flask node js roblox and fast api use vs code etc
def greet(name="Flask Friend"):
    return f"Hello, {name}!"

print(greet())`,

      fastapi: `# Use a plain Python function for a quick run.
# this is normal compiler just to run small scripts 
# for more dependencies of flask node js roblox and fast api use vs code etc
def add(a: int, b: int) -> int:
    return a + b

print(add(2, 3))`,

      roblox: `// Roblox placeholder (Lua isn't available in this sandbox)
// Use a plain approach for a quick run.
// this is normal compiler just to run small scripts 
// for more dependencies of flask node js roblox and fast api use vs code etc
//
console.log("Roblox code placeholder - run Lua in Roblox Studio.");

// Simple standalone example (no dependencies)
let touched = false;

function onTouched() {
  touched = true;
  console.log("Touched!");
}

// Simulate a touch event
onTouched();`,
      python: `# Write your Python code here
def hello():
    print("Hello, World!")

if __name__ == "__main__":
    hello()`,
     
      cpp: `// Write your C++ code here
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
      csharp: `// Write your C# code here
using System;

class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hello, World!");
    }
}`,
      go: `// Write your Go code here
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
      rust: `// Write your Rust code here
fn main() {
    println!("Hello, World!");
}`,
      typescript: `// Simple program: adds 1 to input
const input = 5; // you can change this value
const result = input + 1;
console.log("Result:", result);

// Simple function example
function hello() {
  console.log("Hello, World!");
}

hello();
`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My HTML Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        p {
            line-height: 1.6;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello, World!</h1>
        <p>This is a sample HTML page with CSS styling.</p>
        <p>You can run this code to see how it renders in a browser.</p>
    </div>
</body>
</html>`,
    };
    return templates[lang] || '// Start coding here...';
  };

  const currentLang = languages.find(lang => lang.value === language);

  return (
    <Box sx={{ height: 'calc(100vh - 100px)' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Editor Panel */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Toolbar */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">Code Editor</Typography>

              <TextField
                select
                size="small"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                sx={{ minWidth: 150 }}
                SelectProps={{
                  native: true,
                }}
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </TextField>

              <Button
                variant="contained"
                startIcon={isExecuting ? <CircularProgress size={16} /> : <PlayArrow />}
                onClick={handleRunCode}
                disabled={isExecuting || !(currentCode || getLanguageTemplate(language)).trim()}
                size="small"
              >
                {isExecuting ? 'Compiling...' : 'Compile & Run'}
              </Button>

              <Button
                variant="outlined"
                startIcon={<Lightbulb />}
                onClick={handleAnalyzeCode}
                disabled={!(currentCode || getLanguageTemplate(language)).trim()}
                size="small"
              >
                AI Analyze
              </Button>
            </Box>

            {/* Monaco Editor */}
            <Box
              ref={containerRef}
              sx={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 400,
                width: '100%',
                '& .monaco-editor': {
                  borderRadius: '4px',
                },
                '& .monaco-editor .monaco-editor-background': {
                  backgroundColor: '#1e1e1e !important',
                }
              }}
            >
              {!editorMounted && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#1e1e1e',
                    color: '#cccccc',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    padding: '16px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onClick={() => {
                    // Force layout when clicked (in case editor is loaded but not visible)
                    setTimeout(() => {
                      if (editorRef.current) {
                        editorRef.current.layout();
                      }
                    }, 50);
                  }}
                >
                  <Box sx={{ mb: 2, color: '#007acc', fontWeight: 'bold' }}>
                    // Click to initialize editor...
                  </Box>
                  <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <pre style={{
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      lineHeight: '1.4',
                      opacity: 0.7
                    }}>
{`function hello() {
  console.log("Hello, World!");
  // Your code will appear here...
}

hello();`}
                    </pre>
                  </Box>
                </Box>
              )}
              <Editor
                height="100%"
                language={
                  language === 'react'
                    ? 'javascript'
                    : language === 'nodejs' || language === 'express'
                    ? 'javascript'
                    : language === 'flask' || language === 'fastapi'
                    ? 'python'
                    : language === 'roblox'
                    ? 'javascript'
                    : language
                }
                value={currentCode || getLanguageTemplate(language)}
                onChange={handleCodeChange}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                keepCurrentModel={true}
                loading={
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    backgroundColor: '#1e1e1e',
                    color: '#ffffff',
                    flexDirection: 'column',
                    gap: 1
                  }}>
                    <CircularProgress size={24} sx={{ color: '#007acc' }} />
                    <Typography variant="body2" sx={{ color: '#cccccc', fontSize: '0.875rem' }}>
                      Loading editor...
                    </Typography>
                  </Box>
                }
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: 'on',
                  suggestOnTriggerCharacters: true,
                  acceptSuggestionOnEnter: 'on',
                  quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: false
                  },
                  parameterHints: {
                    enabled: true,
                  },
                  renderLineHighlight: 'line',
                  cursorBlinking: 'blink',
                  smoothScrolling: true,
                  // Performance optimizations
                  glyphMargin: false,
                  folding: false,
                  renderWhitespace: 'none',
                  wordBasedSuggestions: 'off',
                  contextmenu: true,
                  mouseWheelZoom: false,
                  multiCursorModifier: 'ctrlCmd',
                  accessibilitySupport: 'off',
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Output Panel */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab icon={<Input />} label="Input" />
              <Tab icon={<Output />} label="Output" />
            </Tabs>

            {/* Tab Content */}
            <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Input
                  </Typography>
                  <TextField
                    multiline
                    fullWidth
                    rows={10}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter input for your program..."
                    variant="outlined"
                  />
                </Box>
              )}

              {activeTab === 1 && (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom>
                    Output & Analysis
                  </Typography>

                  {/* Execution Results */}
                  <Box sx={{ mb: 3 }}>
                    {error && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                      </Alert>
                    )}
                    {executionResult ? (
                      <Box>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Chip
                            label={executionResult.status}
                            color={executionResult.status === 'success' ? 'success' : 'error'}
                            size="small"
                          />
                          <Chip
                            label={`${executionResult.executionTime}ms`}
                            variant="outlined"
                            size="small"
                          />
                          <Chip
                            label={`${executionResult.memoryUsed}KB`}
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            {(language === 'html' || language === 'react' || language === 'typescript') && executionResult.htmlContent && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  const newWindow = window.open('', '_blank');
                                  if (newWindow) {
                                    newWindow.document.write(executionResult.htmlContent || '');
                                    newWindow.document.close();
                                  }
                                }}
                                sx={{
                                  color: '#ffffff',
                                  borderColor: '#ffffff',
                                  '&:hover': { borderColor: '#cccccc', color: '#cccccc' },
                                  fontSize: '0.75rem',
                                  py: 0.5
                                }}
                              >
                                Open in Browser
                              </Button>
                            )}
                          </Box>
                          <Paper sx={{ p: 2, backgroundColor: '#1e1e1e', color: '#ffffff', fontFamily: 'monospace' }}>
                            {language === 'html' && executionResult.htmlContent ? (
                              <div>
                                <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold', color: '#ffffff' }}>
                                  HTML Preview (Click "Open in Browser" for full rendering):
                                </Typography>
                                <iframe
                                  srcDoc={executionResult.htmlContent}
                                  style={{
                                    width: '100%',
                                    height: '200px',
                                    border: '1px solid #333',
                                    borderRadius: '4px'
                                  }}
                                  title="HTML Preview"
                                />
                              </div>
                            ) : (
                              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', color: '#ffffff', margin: 0 }}>
                                {executionResult.output || executionResult.error}
                              </Typography>
                            )}
                          </Paper>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Run your code to see the output here.
                      </Typography>
                    )}
                  </Box>

                  {/* AI Analysis Section */}
                  <Box sx={{ flex: 1, borderTop: 1, borderColor: 'divider', pt: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Lightbulb sx={{ fontSize: 20 }} />
                      AI Code Analysis
                    </Typography>
                    {error && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        Analysis Error: {error}
                      </Alert>
                    )}
                    {aiAnalysis ? (
                      <Box sx={{ height: '100%', overflow: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body1" sx={{ mr: 1 }}>
                            Code Score:
                          </Typography>
                          <Chip
                            label={`${aiAnalysis.score}/100`}
                            color={aiAnalysis.score >= 80 ? 'success' : aiAnalysis.score >= 60 ? 'warning' : 'error'}
                          />
                        </Box>

                        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.4 }}>
                          {typeof aiAnalysis.feedback === 'string' ? aiAnalysis.feedback : 'Analysis completed successfully'}
                        </Typography>

                        {aiAnalysis.suggestions.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                              Suggestions:
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                              {aiAnalysis.suggestions.slice(0, 3).map((suggestion, index) => (
                                <Typography key={index} component="li" variant="body2" sx={{ mb: 0.5 }}>
                                  {suggestion}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        )}

                        {aiAnalysis.improvements.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                              Improvements:
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                              {aiAnalysis.improvements.slice(0, 3).map((improvement, index) => (
                                <Typography key={index} component="li" variant="body2" sx={{ mb: 0.5 }}>
                                  {improvement}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        )}

                        {aiAnalysis.correctedCode && (
                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="outlined"
                              startIcon={<CodeIcon />}
                              onClick={() => setCorrectedCodeDialog(true)}
                              size="small"
                              sx={{ color: '#ffffff', borderColor: '#ffffff', '&:hover': { borderColor: '#cccccc', color: '#cccccc' } }}
                            >
                              View Corrected Code
                            </Button>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Click "AI Analyze" to get intelligent feedback on your code.
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}

            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Corrected Code Dialog */}
      <Dialog
        open={correctedCodeDialog}
        onClose={() => setCorrectedCodeDialog(false)}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CodeIcon sx={{ color: 'primary.main' }} />
          Corrected Code - {languages.find(l => l.value === language)?.label}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Here's an improved version of your code based on AI analysis:
          </Typography>

          <Paper sx={{ p: 2, backgroundColor: '#1e1e1e', color: '#ffffff', fontFamily: 'monospace' }}>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', margin: 0, color: '#ffffff' }}>
              {aiAnalysis?.correctedCode || 'No corrected code available'}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ContentCopy />}
            onClick={() => handleCopyToClipboard(aiAnalysis?.correctedCode || '')}
          >
            Copy Code
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (aiAnalysis?.correctedCode) {
                dispatch(setCurrentCode(aiAnalysis.correctedCode));
              }
              setCorrectedCodeDialog(false);
            }}
          >
            Use This Code
          </Button>
          <Button onClick={() => setCorrectedCodeDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CodeEditor;
