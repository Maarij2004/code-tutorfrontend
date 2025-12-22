import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Bookmark, Notes as NotesIcon, ExpandMore, Info, Close } from '@mui/icons-material';

const languages = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'nodejs', label: 'Node.js Backend', icon: '🟩' },
  { value: 'express', label: 'Express.js', icon: '🚂' },
  { value: 'sql', label: 'SQL', icon: '🗄️' },
  { value: 'fastapi', label: 'FastAPI', icon: '🚀' },
  { value: 'flask', label: 'Flask', icon: '🧪' },
  { value: 'roblox', label: 'Roblox (Lua)', icon: '🎮' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'cpp', label: 'C++', icon: '⚡' },
  { value: 'html', label: 'HTML + CSS', icon: '🌐' },
  { value: 'react', label: 'React', icon: '⚛️' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
];

const languageDescriptions: Record<string, string> = {
  javascript: 'JavaScript is a versatile, high-level programming language primarily used for creating interactive web content, supporting both frontend and backend development through various frameworks and runtime environments.',
  nodejs: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine that enables server-side scripting, featuring non-blocking I/O and event-driven architecture ideal for building scalable network applications and APIs.',
  fastapi: 'FastAPI is a modern, fast web framework for building APIs with Python 3.7+ based on standard Python type hints, offering automatic OpenAPI documentation generation and high performance comparable to Node.js and Go.',
  flask: 'Flask is a lightweight WSGI web application framework in Python that provides the essential tools for building web applications with flexibility and simplicity, following a minimalistic approach with extensibility through extensions.',
  roblox: 'Roblox development involves Lua scripting within the Roblox Studio environment to create games and experiences, focusing on client-server architecture, 3D world manipulation, and monetization through the Roblox platform.',
  python: 'Python is a high-level, interpreted programming language known for its clear syntax and code readability, widely used in web development, data science, automation, scripting, and artificial intelligence applications.',
  cpp: 'C++ is a general-purpose programming language that extends C with object-oriented features, used for system/software development, game engines, and performance-critical applications requiring direct hardware manipulation.',
  html: 'HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in web browsers, defining structure and content, while CSS (Cascading Style Sheets) describes presentation and layout.',
  react: 'React is a declarative, component-based JavaScript library for building user interfaces, developed by Facebook, that efficiently updates and renders components when data changes using a virtual DOM for performance optimization.',
  typescript: 'TypeScript is a strongly typed programming language that builds on JavaScript, adding static type definitions to enable better tooling, early error detection, and improved code maintainability for large-scale applications.',
  express: 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications, offering routing, middleware support, and template engines for rapid server-side development.',
  sql: 'SQL (Structured Query Language) is a domain-specific language designed for managing and manipulating relational databases, enabling data querying, insertion, updates, deletion, and schema definition across various database management systems.',
};

const notesTemplates: Record<string, {concept: string, description: string}[]> = {
  javascript: [
    {concept: 'Values and primitive types', description: 'JavaScript has 7 primitive types: string, number, bigint, boolean, undefined, null, and symbol. Primitives are immutable and passed by value. Understanding these helps prevent type coercion surprises and forms the foundation for working with data in JS.'},
    {concept: 'let, const, var scope and hoisting', description: 'Variables declared with var are function-scoped and hoisted (initialized as undefined), while let/const are block-scoped and hoisted but not initialized (temporal dead zone). Use const for values that won\'t change, let for mutable variables, and avoid var in modern code.'},
    {concept: 'Functions, arrow functions, default params', description: 'Functions can be declared (hoisted) or expressed. Arrow functions don\'t have their own "this" context. Default parameters allow setting fallback values when arguments are undefined. Mastering these enables clean, predictable function design.'},
    {concept: 'Objects, prototypes, property access', description: 'Objects are collections of key-value pairs. JavaScript uses prototype-based inheritance where objects inherit from other objects. Property access can use dot notation (obj.key) or bracket notation (obj["key"]) for dynamic property names.'},
    {concept: 'Arrays and higher-order methods (map/filter/reduce)', description: 'Arrays are ordered lists that can hold any type. Higher-order methods take functions as arguments: map transforms each element, filter selects elements, and reduce accumulates values. These enable declarative data processing without manual loops.'},
    {concept: 'Template literals and string utilities', description: 'Template literals use backticks and ${} for interpolation, supporting multi-line strings and embedded expressions. String methods like includes(), startsWith(), slice() provide powerful text manipulation without regular expressions.'},
    {concept: 'Destructuring for arrays and objects', description: 'Destructuring extracts values from arrays or properties from objects into distinct variables using pattern matching syntax. It simplifies working with complex data structures and function returns, making code more readable.'},
    {concept: 'Rest/spread operators and copying', description: 'The spread operator (...) expands iterables into individual elements, useful for copying arrays/objects or combining them. The rest operator collects remaining arguments into an array. Both are essential for modern, concise JavaScript patterns.'},
    {concept: 'Optional chaining and nullish coalescing', description: 'Optional chaining (?.) safely accesses nested properties without throwing errors if intermediate values are null/undefined. Nullish coalescing (??) returns the right-hand operand only when the left is null/undefined (not just falsy).'},
    {concept: 'Classes, inheritance, and this binding', description: 'ES6 classes provide syntactic sugar over prototype inheritance. Understanding "this" context is crucial: it references the execution context and can be bound explicitly. Classes support inheritance, static methods, and property initialization.'},
    {concept: 'Modules (ESM vs CommonJS basics)', description: 'ES Modules (import/export) are the standard for code organization, while CommonJS (require/module.exports) is Node.js\'s legacy system. ESM supports static analysis and tree-shaking, while CommonJS loads synchronously at runtime.'},
    {concept: 'Closures and lexical scope', description: 'A closure gives a function access to variables from its outer scope even after that outer function has returned. This enables data privacy, function factories, and state preservation in callbacks and event handlers.'},
    {concept: 'Promises lifecycle', description: 'Promises represent eventual completion of async operations with three states: pending, fulfilled, or rejected. They chain with .then(), .catch(), and .finally() to handle async flows more cleanly than callback nesting.'},
    {concept: 'async/await patterns and error handling', description: 'async/await provides synchronous-looking syntax for promise-based code. async functions always return promises, and await pauses execution until a promise settles. Try/catch blocks handle errors in async flows.'},
    {concept: 'Fetch API and handling JSON', description: 'The Fetch API provides a modern interface for HTTP requests, returning promises. Response.json() parses JSON response bodies. Understanding status codes, headers, and error handling is essential for web API communication.'},
    {concept: 'Timers and task scheduling', description: 'setTimeout() executes code after a delay, setInterval() repeats execution, and requestAnimationFrame() synchronizes with browser repaints. These enable animations, debouncing, and delayed operations without blocking the main thread.'},
    {concept: 'Event loop, microtasks, macrotasks', description: 'JavaScript\'s event loop handles concurrency via a single thread. Microtasks (promises, queueMicrotask()) execute before macrotasks (setTimeout, I/O). Understanding this ensures predictable async execution order and prevents race conditions.'},
    {concept: 'Error types and try/catch/finally', description: 'JavaScript has built-in error types (Error, SyntaxError, TypeError, etc.) and supports custom errors. Try/catch handles exceptions, while finally executes cleanup code regardless of outcome. Proper error handling prevents crashes and aids debugging.'},
    {concept: 'Strict mode behaviors', description: '\'use strict\' enables stricter parsing and error handling by eliminating silent errors, preventing certain syntax, and improving optimization. It\'s automatically enabled in ES modules and classes, helping write safer code.'},
    {concept: 'Truthy/falsy and equality pitfalls', description: 'Falsy values: false, 0, "", null, undefined, NaN. Everything else is truthy. == performs type coercion, === checks type and value. Understanding these prevents logical bugs in conditionals and comparisons.'},
    {concept: 'Date and Intl basics', description: 'Date handles date/time operations but has quirks (months are 0-indexed). Intl provides internationalization for dates, numbers, and collation. For serious date work, consider libraries like date-fns or Luxon.'},
    {concept: 'Regex construction and use', description: 'Regular expressions pattern-match text using literals (/pattern/) or constructors (new RegExp()). Methods like test(), exec(), and string methods match(), replace() enable powerful text processing when used judiciously.'},
    {concept: 'Map/Set/WeakMap/WeakSet', description: 'Map stores key-value pairs with any key type (not just strings). Set stores unique values. WeakMap/WeakSet hold "weak" references that don\'t prevent garbage collection. These collections offer better performance for specific use cases than plain objects.'},
    {concept: 'Number and Math utilities', description: 'Number methods (isNaN, isFinite, parseFloat) and Math functions (round, random, max/min) handle numeric operations. Understanding floating-point precision issues and safe integer ranges (Number.MAX_SAFE_INTEGER) prevents calculation errors.'},
    {concept: 'DOM querying and manipulation essentials', description: 'document.querySelector()/getElementById() find elements. Properties like textContent, innerHTML, classList, and style manipulate content and presentation. Understanding the DOM tree structure is fundamental to interactive web development.'},
    {concept: 'Events and delegation', description: 'Event listeners respond to user interactions. Event delegation attaches a single listener to a parent to handle events from children via bubbling, improving performance for dynamic content and reducing memory usage.'},
    {concept: 'LocalStorage/SessionStorage', description: 'Web Storage API provides simple key-value storage within the browser. localStorage persists across sessions, sessionStorage lasts per tab. Both store only strings and have size limits (usually 5-10MB).'},
    {concept: 'JSON parse/stringify and safety', description: 'JSON.stringify() converts objects to JSON strings, JSON.parse() reverses the process. Reviver/replacer functions customize serialization. Be cautious with circular references and never parse untrusted JSON without validation.'},
    {concept: 'Performance and profiling basics', description: 'Browser DevTools Performance panel identifies bottlenecks. Techniques include debouncing rapid events, virtualizing long lists, code splitting, and minimizing reflows/repaints. Performance is a feature, not an afterthought.'},
    {concept: 'Linting/formatting habits', description: 'ESLint catches errors and enforces code style. Prettier automatically formats code. Integrating these into your workflow ensures consistent, error-resistant codebases and catches bugs before runtime.'},
  ],
  nodejs: [
    {concept: 'Node process model and event loop phases', description: 'Node.js runs on a single thread with an event loop that processes callbacks in phases: timers, pending callbacks, idle/prepare, poll, check, and close. Understanding these phases helps optimize I/O operations and prevents blocking.'},
    {concept: 'npm/yarn/pnpm dependency management', description: 'Package managers handle project dependencies, version resolution, and scripts. npm is Node\'s default, yarn offers deterministic installs, pnpm uses symlinks for disk efficiency. Lockfiles ensure reproducible installations across environments.'},
    {concept: 'ESM vs CJS in Node', description: 'CommonJS (require/module.exports) loads synchronously, while ES Modules (import/export) support static analysis and asynchronous loading. Node.js now supports both, but understanding interoperability and file extensions (.cjs/.mjs) is crucial.'},
    {concept: 'Built-in modules: fs/path/url', description: 'fs provides file system operations (sync/async), path handles cross-platform file paths, and url parses and formats URLs. These core modules form the foundation for most Node.js applications without external dependencies.'},
    {concept: 'http/https servers and routing basics', description: 'The http/https modules create servers that handle HTTP requests and responses. While frameworks abstract routing, understanding the raw flow (request/response objects, status codes, headers) is essential for debugging and custom solutions.'},
    {concept: 'Streams (readable/writable/transform)', description: 'Streams process data in chunks rather than loading everything into memory, essential for large files or network operations. Readable streams produce data, writable streams consume it, and transform streams modify data in transit.'},
    {concept: 'Buffers and encoding', description: 'Buffers handle binary data in Node.js before TypedArray adoption. Understanding character encodings (UTF-8, Base64, hex) prevents data corruption when working with files, network protocols, or binary formats.'},
    {concept: 'EventEmitter usage and patterns', description: 'EventEmitter enables event-driven architecture where objects emit named events that cause listener functions to be called. Many Node.js core classes inherit from EventEmitter, making it fundamental for custom asynchronous APIs.'},
    {concept: 'Environment variables and config separation', description: 'process.env accesses environment variables, enabling configuration externalization for different environments (development, testing, production). This keeps secrets out of code and allows environment-specific behavior without code changes.'},
    {concept: 'Error handling with domains vs try/catch', description: 'While try/catch handles synchronous errors, asynchronous errors require different strategies. Domains (deprecated) and async error handlers prevent uncaught exceptions from crashing the entire Node process.'},
    {concept: 'Logging strategy (levels, structure)', description: 'Effective logging uses levels (error, warn, info, debug), structured formats (JSON), and appropriate transports (console, files, external services). Winston and Pino are popular libraries that support this without reinventing the wheel.'},
    {concept: 'Async patterns (callbacks vs promises)', description: 'Node.js evolved from callback patterns to promise-based async/await. Callbacks follow error-first convention, while promises provide better flow control. Most modern APIs support both, but promises are preferred for new code.'},
    {concept: 'Child processes and workers', description: 'child_process spawns separate processes for CPU-intensive tasks, while worker_threads enable parallel JavaScript execution within the same process. Choosing between them depends on isolation needs and data sharing requirements.'},
    {concept: 'Cluster vs worker_threads', description: 'Cluster module creates multiple Node processes sharing server ports for load balancing, while worker_threads share memory via MessageChannel. Cluster is better for web servers, workers for CPU-heavy computations.'},
    {concept: 'Process signals and graceful shutdown', description: 'SIGTERM and SIGINT signals allow graceful shutdown by closing database connections, finishing requests, and cleaning up resources before exit. This prevents data corruption and provides better user experience during deployments.'},
    {concept: 'CORS, headers, and content negotiation', description: 'CORS (Cross-Origin Resource Sharing) headers control which domains can access your API. Content negotiation (Accept headers) determines response format (JSON, XML). Security headers (CSP, HSTS) protect against common web vulnerabilities.'},
    {concept: 'Input validation and sanitization', description: 'Always validate and sanitize user input to prevent injection attacks and data corruption. Libraries like Joi or validator.js ensure data matches expected formats before processing, while escaping prevents XSS in outputs.'},
    {concept: 'Routing/middleware concepts (Express-like)', description: 'Middleware functions process requests before reaching route handlers (authentication, logging, parsing). Routers organize endpoints by resource or version. Understanding this pipeline is key to building maintainable web applications.'},
    {concept: 'Authentication basics (JWT/session)', description: 'Sessions store state server-side with client cookies, while JWTs (JSON Web Tokens) are self-contained tokens verified by signature. Sessions are simpler to invalidate, JWTs work better in distributed systems without shared storage.'},
    {concept: 'Rate limiting and throttling', description: 'Rate limiting protects APIs from abuse and DoS attacks by restricting requests per client. Implementations can use in-memory stores for single instances or Redis for distributed systems, often with sliding windows or token bucket algorithms.'},
    {concept: 'File uploads and multipart handling', description: 'Multipart/form-data encoding breaks files into chunks for upload. Libraries like multer or busboy parse these streams efficiently. Always validate file types, sizes, and scan for malware before storing user-uploaded content.'},
    {concept: 'Static asset serving', description: 'Serving static files (images, CSS, client JS) efficiently requires proper caching headers (ETag, Cache-Control), compression (gzip/brotli), and security considerations. CDNs often handle this better than application servers for production traffic.'},
    {concept: 'Caching (memory/HTTP semantics)', description: 'In-memory caches (like node-cache) speed up repeated operations, while HTTP caching (Cache-Control headers) reduces server load. Understand cache invalidation strategies and when to use each layer for optimal performance.'},
    {concept: 'Pagination and filtering on APIs', description: 'Offset/limit and cursor-based pagination prevent overwhelming clients with large datasets. Filtering, sorting, and field selection (GraphQL-like) give clients control over returned data without creating endpoint explosion.'},
    {concept: 'Testing with supertest/jest equivalents', description: 'Supertest tests HTTP endpoints by simulating requests. Jest provides test runners, assertions, and mocking. Integration tests should verify API contracts, while unit tests focus on individual functions in isolation.'},
    {concept: 'Linting/formatting in backend projects', description: 'ESLint with Node-specific rules catches common backend issues (security, promises, error handling). Prettier ensures consistent formatting. Husky pre-commit hooks enforce quality before code reaches repositories.'},
    {concept: 'Security headers and helmet-style hardening', description: 'Helmet.js sets security headers like X-Content-Type-Options, X-Frame-Options, and Content-Security-Policy. These headers prevent clickjacking, MIME sniffing, and other common web attacks with minimal configuration.'},
    {concept: 'Dependency auditing and updates', description: 'npm audit identifies vulnerable dependencies. Regular updates (with proper testing) patch security holes. Tools like Dependabot or Renovate automate dependency updates, but human review is still essential for breaking changes.'},
    {concept: 'Performance profiling (CPU/memory)', description: 'Node.js built-in profiler and Chrome DevTools identify CPU hotspots and memory leaks. Clinic.js provides higher-level diagnostics. Production monitoring with APM tools catches issues before they affect users.'},
    {concept: 'Containerization basics for Node apps', description: 'Docker packages applications with their dependencies for consistent environments. Multi-stage builds minimize image size, .dockerignore excludes unnecessary files, and proper signal handling ensures containers shutdown gracefully.'},
  ],
  fastapi: [
    {concept: 'Project structure and uvicorn entrypoints', description: 'Organize FastAPI apps with clear separation: routers, models, dependencies, and utilities. Uvicorn serves as the ASGI server, often launched via main.py or using reload=True for development. This structure scales from simple APIs to complex microservices.'},
    {concept: 'Path and query parameters', description: 'Path parameters capture URL segments (/users/{id}), while query parameters follow ? in URLs. FastAPI automatically validates and documents both using Python type hints, reducing boilerplate and ensuring data correctness from the start.'},
    {concept: 'Request/response bodies', description: 'Pydantic models define request body schemas with validation rules. FastAPI serializes responses automatically based on response_model, supporting nested models, datetime objects, and custom encoders for complex data structures.'},
    {concept: 'Pydantic models and validation', description: 'Pydantic uses Python type annotations to validate data at runtime. Models support custom validators, field constraints (min_length, regex), and inheritance. This eliminates manual validation code while providing excellent error messages.'},
    {concept: 'response_model shaping output', description: 'response_model controls what data gets returned, excluding private fields or transforming structures. Use response_model_exclude/unset to fine-tune output, and response_model_by_alias to control field naming in serialized responses.'},
    {concept: 'Depends for dependency injection', description: 'FastAPI\'s Depends() creates reusable dependencies that inject shared logic (database sessions, authentication) into path operations. Dependencies can be cached per request, nested, and overridden for testing, promoting DRY code.'},
    {concept: 'APIRouter modularization', description: 'APIRouter groups related endpoints with shared prefixes, tags, and dependencies. This enables splitting large applications into logical modules while maintaining centralized OpenAPI documentation and consistent behavior.'},
    {concept: 'Status codes and HTTPException', description: 'Set appropriate HTTP status codes (200 OK, 201 Created, 404 Not Found) using status_code parameter. HTTPException raises errors with custom messages and status codes, while validation errors automatically return 422 Unprocessable Entity.'},
    {concept: 'Custom exception handlers', description: '@app.exception_handler registers functions to convert uncaught exceptions into proper HTTP responses. This centralizes error formatting, logs unexpected errors, and ensures clients receive consistent error structures.'},
    {concept: 'Middleware for cross-cutting concerns', description: 'Middleware processes requests/responses globally (CORS, logging, request timing). FastAPI uses Starlette middleware, supporting both sync and async patterns. Order matters: middleware executes in registration order for requests, reverse for responses.'},
    {concept: 'BackgroundTasks usage', description: 'BackgroundTasks defer non-critical work (email sending, notifications) until after response is sent. Tasks run in the same event loop, so use separate processes for CPU-heavy work to avoid blocking the main application.'},
    {concept: 'OAuth2PasswordBearer and security schemes', description: 'FastAPI provides built-in OAuth2 flows with password bearer tokens. OAuth2PasswordBearer dependency extracts tokens from Authorization headers, while security schemes in OpenAPI documentation show clients how to authenticate.'},
    {concept: 'JWT auth flow integration', description: 'JSON Web Tokens encode user claims with expiration. python-jose or PyJWT create/verify tokens. Store tokens client-side, validate signatures server-side, and include user context in dependencies for authorized endpoints.'},
    {concept: 'Security scopes/roles', description: 'OAuth2 scopes or custom role systems limit endpoint access. FastAPI\'s Security() dependency checks permissions, supporting AND/OR logic. This enables fine-grained authorization beyond simple authenticated/not-authenticated checks.'},
    {concept: 'CORS configuration', description: 'CORS (Cross-Origin Resource Sharing) middleware allows frontend applications on different domains to call your API. Configure allowed origins, methods, headers, and credentials based on your security requirements and deployment setup.'},
    {concept: 'File uploads and Form handling', description: 'Upload files with File() and FormData using multipart encoding. FastAPI streams uploads to prevent memory issues with large files. Validate file types, sizes, and store securely (often in cloud storage, not databases).'},
    {concept: 'Static files and mounts', description: 'Mount Starlette\'s StaticFiles to serve static assets (images, CSS, JS). For production, use CDNs or dedicated web servers (nginx) for better performance. Mounts allow combining multiple ASGI apps in a single deployment.'},
    {concept: 'WebSocket endpoints', description: 'WebSocket endpoints maintain persistent bidirectional connections for real-time features. FastAPI uses Starlette WebSocket support. Handle connection lifecycle, message parsing, and broadcast patterns for chat, notifications, or live updates.'},
    {concept: 'StreamingResponse and generators', description: 'StreamingResponse sends data in chunks as it becomes available, useful for large files or real-time data streams. Yield from async generators to produce content incrementally without loading everything into memory.'},
    {concept: 'Pagination and filtering patterns', description: 'Offset/limit pagination with query parameters is common, but cursor-based pagination performs better with large datasets. Filtering uses query params validated by Pydantic models, ensuring type safety for database queries.'},
    {concept: 'Database sessions (sync/async) lifecycle', description: 'SQLAlchemy sessions manage database connections and transactions. Create session per request via dependencies, commit on success, rollback on errors, and always close sessions. Async support requires SQLAlchemy 1.4+ with async drivers.'},
    {concept: 'Dependency overrides for testing', description: 'app.dependency_overrides replaces production dependencies with test versions during testing. Mock external services, use in-memory databases, and inject test users without modifying application code or configuration.'},
    {concept: 'Settings management (pydantic BaseSettings)', description: 'Pydantic BaseSettings loads configuration from environment variables, .env files, and defaults. Supports nested models, validation, and different configurations per environment (development, testing, production).'},
    {concept: 'OpenAPI schema customization', description: 'Customize OpenAPI documentation with title, version, description, and contact info. Add tags for grouping, modify operation IDs, and include external docs. This makes your API documentation more useful for consumers.'},
    {concept: 'Docs URLs and metadata', description: 'FastAPI auto-generates interactive docs at /docs (Swagger UI) and /redoc. Customize docs appearance, disable in production, or add authentication to protect internal API documentation from public access.'},
    {concept: 'Testing with TestClient', description: 'TestClient from fastapi.testclient simulates HTTP requests without running a server. Write integration tests that verify endpoints work correctly together, mocking only external dependencies for realistic testing.'},
    {concept: 'Rate limiting strategies (custom deps)', description: 'Implement rate limiting via dependencies that check request counts against limits stored in Redis or in-memory caches. Use sliding windows or token bucket algorithms, and exempt certain endpoints or authenticated users as needed.'},
    {concept: 'Versioned routing (v1/v2)', description: 'API versioning via URL prefixes (/api/v1/users) or headers (Accept-version). APIRouters with different prefixes keep version logic separate. Plan for backward compatibility and document deprecation timelines when introducing breaking changes.'},
    {concept: 'Tracing/logging per request', description: 'Middleware can add request IDs, log entry/exit points, and measure execution time. Structured logging with correlation IDs helps trace requests through microservices and diagnose production issues.'},
    {concept: 'Task queues (Celery) integration points', description: 'Offload long-running tasks to Celery workers via message brokers (Redis, RabbitMQ). FastAPI endpoints trigger tasks and provide status endpoints. Use async result backends for checking task completion without blocking.'},
  ],
  flask: [
    {concept: 'App creation and app factory pattern', description: 'Flask apps can be created directly or via factory functions that return app instances. The factory pattern enables multiple app instances with different configurations, easier testing, and delayed initialization with app context.'},
    {concept: 'Routing and variable rules', description: '@app.route() decorators map URLs to view functions. Variable rules (<int:id>, <string:name>) capture URL segments as function arguments. HTTP methods (GET, POST) are specified via methods parameter, enabling RESTful endpoint design.'},
    {concept: 'Request/response objects', description: 'Flask\'s request object contains incoming request data (form, JSON, files). Responses can be strings, tuples (data, status, headers), or Response objects. Understanding the request/response lifecycle is fundamental to Flask development.'},
    {concept: 'Application vs request context', description: 'Application context tracks app-level data during a request, while request context tracks request-specific data. Both contexts are automatically pushed/popped. Understanding this prevents "working outside context" errors in background tasks or testing.'},
    {concept: 'Config management and env separation', description: 'app.config dictionary holds configuration from objects, files, or environment variables. Use classes per environment (DevelopmentConfig, ProductionConfig) and load secrets from .env files (python-dotenv) for security.'},
    {concept: 'Blueprints for modular APIs', description: 'Blueprints organize related routes, templates, and static files into reusable components. They enable splitting large apps into modules, each with its own URL prefix. Register blueprints with the main app for a clean, scalable structure.'},
    {concept: 'Jinja templating basics', description: 'Jinja2 templates mix HTML with dynamic expressions using {{ variables }}, {% control structures %}, and {# comments #}. Template inheritance via {% extends %} and {% block %} creates consistent layouts without duplication.'},
    {concept: 'Static files handling', description: 'Flask serves static files (CSS, JS, images) from the "static" folder by default at /static/ path. In production, use CDNs or reverse proxies for better performance. url_for() generates correct URLs for static resources.'},
    {concept: 'JSON responses and jsonify', description: 'jsonify() converts Python dicts to JSON responses with proper Content-Type. For complex serialization, use libraries like Marshmallow. Flask-RESTful or Flask-RESTX provide more structure for API-only applications.'},
    {concept: 'Middleware via before/after_request', description: '@app.before_request functions run before each request (authentication, logging). @app.after_request functions run after, modifying responses. @app.teardown_request handles cleanup. These decorators enable cross-cutting concerns.'},
    {concept: 'Error handlers and custom payloads', description: '@app.errorhandler decorators catch HTTP errors or exceptions, returning custom responses. Centralize error formatting here, logging errors for developers while sending user-friendly messages to clients.'},
    {concept: 'Sessions and cookies', description: 'Flask sessions store user data server-side with signed cookies client-side. Configure secret key securely. For scalability, use server-side session stores (Redis, databases) via Flask-Session extension.'},
    {concept: 'Authentication approaches', description: 'Common patterns: session-based (Flask-Login), token-based (JWT with Flask-JWT-Extended), or OAuth (Authlib). Choose based on needs: sessions for server-rendered apps, tokens for APIs, OAuth for third-party integration.'},
    {concept: 'Authorization decorators/roles', description: 'Custom decorators check user permissions before allowing access to routes. Flask-Principal provides role-based access control. Keep authorization logic separate from business logic for maintainability.'},
    {concept: 'Form handling and validation', description: 'WTForms creates HTML forms with validation, CSRF protection, and file uploads. Forms validate on submission, providing error messages. For APIs, use Marshmallow or similar for request validation.'},
    {concept: 'Database setup with SQLAlchemy', description: 'Flask-SQLAlchemy integrates SQLAlchemy ORM with Flask, managing sessions and connections. Define models as classes, create migrations, and use the session for queries. Follow the "application factory" pattern for proper setup.'},
    {concept: 'Migrations with Flask-Migrate', description: 'Flask-Migrate wraps Alembic for database migrations. Track schema changes in version control, generate migration scripts automatically, and apply upgrades/downgrades across environments consistently.'},
    {concept: 'CLI commands with flask CLI', description: '@app.cli.command() creates custom command-line commands (db seed, import data). Flask\'s built-in CLI also runs development servers and shells. Custom commands automate common tasks and setup procedures.'},
    {concept: 'Logging configuration', description: 'Configure Python logging to capture errors, warnings, and info messages. Use different handlers for console (development) and files/Sentry (production). Log structured data for easier analysis in production environments.'},
    {concept: 'File uploads and validation', description: 'request.files contains uploaded files. Validate file size, extension, and content type before saving. Use secure_filename() to prevent path traversal attacks. Store files outside webroot or in cloud storage.'},
    {concept: 'Streaming responses', description: 'Generator functions that yield data create streaming responses for large files or real-time data. This prevents memory issues when sending large responses. Set appropriate Content-Type and Disposition headers.'},
    {concept: 'Caching with Flask-Caching', description: 'Flask-Caching adds decorators for view caching (@cache.cached()) and fragment caching. Configure backends (Redis, Memcached, filesystem). Use cache keys intelligently and invalidate when data changes.'},
    {concept: 'Celery task queue integration', description: 'Offload long tasks to Celery workers. Flask-Celery integration shares app configuration. Use tasks for email sending, report generation, or data processing. Monitor tasks with Flower dashboard.'},
    {concept: 'Rate limiting (extensions/custom)', description: 'Flask-Limiter or custom decorators enforce rate limits based on IP, user ID, or other criteria. Store counts in Redis for distributed applications. Return 429 Too Many Requests with Retry-After header.'},
    {concept: 'CORS configuration', description: 'Flask-CORS extension handles Cross-Origin Resource Sharing for APIs consumed by JavaScript from different domains. Configure allowed origins, methods, and headers based on your security model.'},
    {concept: 'Testing with app/test_client', description: 'app.test_client() simulates HTTP requests for integration tests. Use pytest fixtures for app context. Test both success and error cases, and mock external services for reliable, fast tests.'},
    {concept: 'Blueprint versioning', description: 'Version APIs by registering blueprints with different URL prefixes (/api/v1/, /api/v2/). Share models and logic between versions when possible, and document deprecation schedules for old versions.'},
    {concept: 'Background jobs and polling', description: 'For simple background tasks without Celery, use threading or asyncio with appropriate synchronization. Provide status endpoints for polling completion. Consider complexity vs. need before adding full task queues.'},
    {concept: 'WebSockets with Flask-SocketIO', description: 'Flask-SocketIO adds WebSocket support to Flask for real-time bidirectional communication. Handle connection events, rooms, and namespaces. Use message queues (Redis) for scaling across multiple processes.'},
    {concept: 'Security headers and hardening', description: 'Set security headers: Content-Security-Policy, X-Frame-Options, HSTS. Use Flask-Talisman extension. Regularly update dependencies, disable debug mode in production, and follow OWASP guidelines for web security.'},
  ],
  roblox: [
    {concept: 'Exploring Services (Players, Workspace, ReplicatedStorage)', description: 'Roblox Engine services are singletons accessed via game:GetService(). Players manages connected users, Workspace contains 3D world, ReplicatedStorage shares data between client/server. Understanding the service hierarchy is fundamental to Roblox scripting.'},
    {concept: 'Instance creation and parenting', description: 'Instances are the building blocks of Roblox experiences. Create with Instance.new(), set properties, and parent to appropriate containers. Proper parenting ensures objects render correctly and get cleaned up when no longer needed.'},
    {concept: 'Properties and attributes', description: 'Properties define instance characteristics (Position, Color, Transparency). Attributes (introduced 2019) store custom metadata. Properties sync automatically between server/client when appropriate, while attributes require explicit replication settings.'},
    {concept: 'Events and RBXScriptSignal', description: 'RBXScriptSignals fire when something happens (Touched, Changed, Activated). Connect functions to events using :Connect(). Always disconnect connections when objects are destroyed to prevent memory leaks and errors.'},
    {concept: 'Debounce patterns for events', description: 'Debouncing prevents rapid-fire event handling (e.g., clicking a button multiple times). Use boolean flags or time checks to ensure actions complete before allowing repeats. Essential for preventing exploit abuse and ensuring intended behavior.'},
    {concept: 'LocalScript vs Script execution contexts', description: 'Scripts run on server, LocalScripts run on client. Server scripts handle game logic, data validation, and security. LocalScripts handle UI, local effects, and input. Understanding this separation prevents security vulnerabilities.'},
    {concept: 'Client-server model and replication', description: 'Roblox uses authoritative server model: server is source of truth, clients are untrusted. Changes replicate from server→client automatically for most properties. Client→server communication requires RemoteEvents/Functions with validation.'},
    {concept: 'RemoteEvent and RemoteFunction patterns', description: 'RemoteEvents fire one-way signals between client/server. RemoteFunctions request/response. Always validate arguments server-side, rate limit calls, and use return values sparingly (async limitations). These are the backbone of secure client-server communication.'},
    {concept: 'Security: server-authoritative validation', description: 'Never trust client data. Validate all inputs server-side: check player permissions, verify possible actions, sanitize values. Assume clients can send any data, even malicious or impossible values. This prevents most exploits.'},
    {concept: 'DataStoreService basics with pcall', description: 'DataStores persistently save player data across sessions. Always wrap calls in pcall() (protected call) to handle failures gracefully. Use :GetAsync(), :SetAsync(), :UpdateAsync() with appropriate error recovery and data versioning.'},
    {concept: 'Player lifecycle (Added/Removing)', description: 'Players.PlayerAdded fires when player joins, PlayerRemoving when they leave. Handle initial setup (spawning, loading data) and cleanup (saving data) in these events. Use Player object throughout session for player-specific operations.'},
    {concept: 'Characters and Humanoid interactions', description: 'Player.Character contains the avatar model. Humanoid controls movement, health, and animations. Listen to Humanoid.Died, .StateChanged events. Use Humanoid:LoadAnimation() for custom animations, and HumanoidRootPart for positioning.'},
    {concept: 'Leaderstats creation and updates', description: 'Create a Folder named "leaderstats" under player with IntValue/StringValue children to display stats in player list. Update values server-side to prevent cheating. Use :GetPropertyChangedSignal() for reactive UI updates.'},
    {concept: 'TweenService for animations', description: 'TweenService smoothly interpolates property values over time. Create TweenInfo defining duration, easing style, and repetition. Use for UI animations, moving objects, or visual effects. More performant than manually animating in render-stepped loops.'},
    {concept: 'PathfindingService usage', description: 'PathfindingService computes navigation paths for NPCs or automated movement. :CreatePath() then :ComputeAsync() generates waypoints. Handle blocked paths gracefully with replanning. Use with Humanoid:MoveTo() for autonomous movement.'},
    {concept: 'Raycasting for interaction', description: 'Raycasting shoots invisible lines to detect what they hit. Use for weapons, placement systems, or interaction detection. workspace:Raycast() returns hit position, material, and instance. Filter descendants to ignore certain objects.'},
    {concept: 'Camera manipulation on client', description: 'workspace.CurrentCamera controls what player sees. Manipulate CameraType, CFrame, and FieldOfView for custom camera systems (vehicle cameras, cutscenes). Use Camera:GetRenderCFrame() for accurate rendering positions.'},
    {concept: 'UI construction with ScreenGui', description: 'ScreenGuis contain UI elements visible to players. Use Frame, TextButton, TextLabel, and other UI elements. AnchorPoint and Position (UDim2) create responsive layouts. Enable AutoLocalize for automatic translation support.'},
    {concept: 'SoundService and effects', description: 'Sound objects play audio when parented to Workspace or UI. Control PlaybackSpeed, Volume, and Looping. Use SoundGroups for categorized volume control. Spatial sound (with RollOffMode) creates 3D audio experiences.'},
    {concept: 'Physics constraints and forces', description: 'Constraints (Weld, Hinge, BallSocket) connect parts together. Apply forces via BodyMover objects or directly manipulating AssemblyLinearVelocity. Understand mass, friction, and elasticity for realistic physics behavior.'},
    {concept: 'ModuleScripts for shared logic', description: 'ModuleScripts return tables of functions/data shared between scripts. Promote code reuse, encapsulate complexity, and organize systems. Use require() to load modules. Great for weapon systems, data managers, or utility libraries.'},
    {concept: 'State machines for NPCs', description: 'State machines manage NPC behavior (idle, patrol, chase, attack). Each state has enter/exit logic and update loop. Transitions occur based on conditions (distance, time). Creates predictable, debuggable AI behavior.'},
    {concept: 'CollectionService tagging', description: 'CollectionService tags instances for easy grouping without parenting. Add/remove tags dynamically. Find all tagged instances with :GetTagged(). Perfect for spawn points, interactable objects, or team management.'},
    {concept: 'Attributes for metadata', description: 'Attributes store custom data on instances (damage value, team ID, spawn time). Get/SetAttribute methods access them. Configure replication in properties to control server→client sync. More flexible than custom object properties.'},
    {concept: 'MessagingService cross-server comms', description: 'MessagingService sends publish/subscribe messages between servers in the same experience. Use for global events, cross-server announcements, or shared state. Limited rate (1KB/s per channel), so use judiciously.'},
    {concept: 'MarketplaceService purchases', description: 'Handle game passes and developer product purchases. ProcessPurchase() callback verifies transactions server-side. Always deliver products server-side after validation. Handle both success and failure cases with appropriate user feedback.'},
    {concept: 'Anti-exploit considerations', description: 'Sanity-check everything: validate movement speed, check animation humanoids, verify tool ownership. Use server-side validation for all critical actions. Monitor suspicious patterns (rapid firing, teleportation) and implement mitigations.'},
    {concept: 'Analytics/telemetry batching', description: 'Use AnalyticsService to track custom metrics (level completions, deaths, purchases). Batch events where possible to reduce network overhead. Analyze data to improve game design and identify issues.'},
    {concept: 'Networking budget and throttling', description: 'Roblox enforces network budgets to maintain performance. Monitor stats in Developer Console. Optimize replication: use value objects for frequent updates, compress data, and throttle non-critical updates to stay within limits.'},
    {concept: 'Testing in Studio vs live', description: 'Test in Studio with Play Solo (local), Play (local server), or Team Test (multiple clients). Use Test tab to simulate many players. Remember some behaviors differ in live games (DataStore calls, some services).'},
  ],
  python: [
    {concept: 'Primitive types and variables', description: 'Python has integers, floats, booleans, strings, and None as core types. Variables are references to objects (everything is an object). Dynamic typing means types are associated with values, not variables, enabling flexible but potentially error-prone code.'},
    {concept: 'Control flow (if/elif/else)', description: 'if/elif/else statements control program execution based on conditions. Python uses indentation (typically 4 spaces) to define blocks. Conditions evaluate to True/False, with truthy values (non-empty collections, non-zero numbers) also treated as True in boolean contexts.'},
    {concept: 'Loops and iterables', description: 'for loops iterate over sequences (lists, strings, ranges). while loops continue while condition is True. break exits loops early, continue skips to next iteration. Python\'s iterable protocol enables looping over custom objects.'},
    {concept: 'Functions and default arguments', description: 'def defines functions. Arguments can have default values (evaluated at definition time). Functions return None implicitly or use return statement. Functions are first-class objects that can be assigned, passed as arguments, or returned.'},
    {concept: 'Comprehensions (list/dict/set)', description: 'Comprehensions create collections concisely: [x*2 for x in range(10)] creates a list. Add if clauses for filtering. Dictionary comprehensions {k: v for k, v in items} and set comprehensions {x for x in iterable} follow similar patterns.'},
    {concept: 'Strings and formatting (f-strings)', description: 'Strings are immutable sequences of Unicode characters. f-strings (f"Hello {name}") embed expressions for readable formatting. Older methods: .format() and % formatting. String methods (split(), join(), strip()) handle common manipulations.'},
    {concept: 'Data structures: list/tuple/set/dict', description: 'Lists are mutable sequences, tuples are immutable, sets store unique elements, dictionaries map keys to values. Each has specific use cases: lists for ordered collections, tuples for fixed records, sets for membership testing, dicts for key-value mapping.'},
    {concept: 'Modules and packages', description: 'Modules are .py files containing code. Packages are directories with __init__.py. import loads modules, from module import name brings specific names. Understanding the import system and PYTHONPATH is key to organizing larger projects.'},
    {concept: 'Virtual environments and pip', description: 'Virtual environments isolate project dependencies. venv module creates them. pip installs packages from PyPI. Requirements.txt or pyproject.toml document dependencies. This prevents version conflicts between projects.'},
    {concept: 'Error handling with try/except/finally', description: 'try blocks run code that might raise exceptions. except catches specific exceptions. finally always executes for cleanup. else runs if no exception occurred. Raise exceptions with raise statement, create custom exceptions by subclassing Exception.'},
    {concept: 'File I/O basics', description: 'open() returns file objects. Use with statement for automatic closing. Modes: "r" read, "w" write (truncates), "a" append, "b" binary. Read/write text with encoding specification. For large files, iterate line by line instead of reading all at once.'},
    {concept: 'Context managers and with', description: 'Context managers (objects with __enter__/__exit__ methods) handle setup/teardown. with statement ensures proper resource management (files, locks, connections). @contextmanager decorator creates simple context managers from generator functions.'},
    {concept: 'Generators and yield', description: 'Generators are functions that yield values one at a time, maintaining state between yields. They\'re memory-efficient for large sequences. yield pauses execution and returns value, next() resumes. Generators are iterators themselves.'},
    {concept: 'Decorators fundamentals', description: 'Decorators are functions that modify other functions. @decorator syntax applies them. Decorators can add logging, timing, authentication, or caching. Understanding closure and *args/**kwargs is key to writing flexible decorators.'},
    {concept: 'OOP: classes, inheritance, dunder methods', description: 'Classes define blueprints for objects with attributes and methods. Inheritance allows subclassing. Dunder methods (__init__, __str__, __add__) customize behavior. Understand self parameter, instance vs class attributes, and method resolution order (MRO).'},
    {concept: 'Typing and type hints', description: 'Type hints (def func(x: int) -> str) document expected types without runtime enforcement. mypy checks them statically. Improves code clarity and catches bugs. Built-in types (List[str], Optional[int]), generics, and custom TypeVar for generic functions.'},
    {concept: 'Standard library highlights (itertools/pathlib)', description: 'itertools provides efficient looping tools (chain, product, combinations). pathlib offers object-oriented filesystem paths. collections has specialized containers (defaultdict, Counter). Learn the standard library to avoid reinventing wheels.'},
    {concept: 'Datetime and timezone basics', description: 'datetime module handles dates and times. datetime objects are naive (no timezone) or aware (with timezone). timedelta represents durations. Use pytz or zoneinfo for timezone handling. Common pitfalls: daylight saving, string parsing formats.'},
    {concept: 'Regex usage', description: 're module provides regular expressions. compile patterns for reuse. match() checks start of string, search() finds anywhere, findall() returns all matches. Use raw strings (r"pattern") to avoid backslash escapes. Regex can be complex - sometimes simple string methods suffice.'},
    {concept: 'Logging configuration', description: 'logging module provides flexible logging system. Configure levels (DEBUG, INFO, WARNING, ERROR, CRITICAL), handlers (console, file), and formatters. Use named loggers per module. Better than print() for production code.'},
    {concept: 'Testing with unittest/pytest', description: 'unittest is built-in testing framework. pytest is popular third-party alternative with simpler syntax and powerful features (fixtures, parametrization). Write tests that are isolated, fast, and cover edge cases. Aim for high test coverage.'},
    {concept: 'Packaging and setup.cfg/pyproject', description: 'Package distribution uses setuptools. Modern projects use pyproject.toml (PEP 518) specifying build backend and dependencies. setup.cfg or setup.py for older style. Create wheel distributions with python -m build.'},
    {concept: 'Environment variables and config', description: 'os.getenv() reads environment variables. python-dotenv loads .env files. Separate configuration from code for different environments. Use validation (pydantic) for complex configurations. Never commit secrets to version control.'},
    {concept: 'HTTP requests with requests', description: 'requests library simplifies HTTP calls. get(), post() methods return Response objects with status_code, content, json(). Handle errors, timeouts, and sessions for connection reuse. For async, use aiohttp or httpx.'},
    {concept: 'Concurrency with threading', description: 'Threading runs multiple threads in same process (shared memory). Global Interpreter Lock (GIL) limits CPU parallelism but I/O operations can still benefit. Use threading for I/O-bound tasks, multiprocessing for CPU-bound. Synchronize with locks when needed.'},
    {concept: 'Asyncio basics', description: 'asyncio provides single-threaded concurrency using async/await. Coroutines are async functions. Event loop manages execution. Use for I/O-bound concurrent operations (web servers, network calls). Different from threading - tasks cooperate via await.'},
    {concept: 'Data handling with json/csv', description: 'json module loads/dumps JSON data. csv module reads/writes CSV files. Use DictReader/DictWriter for named columns. pandas provides more advanced data manipulation but adds heavy dependency. Always validate/sanitize external data.'},
    {concept: 'Performance profiling', description: 'cProfile identifies slow functions. timeit measures small code snippets. memory_profiler tracks memory usage. Line profiler shows per-line execution time. Profile before optimizing - often algorithmic improvements beat micro-optimizations.'},
    {concept: 'Linting/formatting (flake8/black)', description: 'flake8 checks style and errors. black auto-formats code consistently. isort sorts imports. mypy checks types. Pre-commit hooks run these automatically. Consistent style improves readability and reduces review time.'},
    {concept: 'Virtualenv vs venv vs pipenv', description: 'venv is built-in virtual environment tool. virtualenv is third-party with more features. pipenv combines pip + virtualenv with lockfile. poetry handles dependencies, packaging, and publishing. Choose based on project needs and team preferences.'},
  ],
  cpp: [
    {concept: 'Basic syntax and types', description: 'C++ is statically typed with fundamental types: int, float, double, char, bool. Variables must be declared with type before use. Semicolons terminate statements. Understanding type sizes and signed/unsigned variants is crucial for portable code.'},
    {concept: 'Input/output streams', description: 'iostream provides cin for input, cout for output, cerr for errors. << inserts into streams, >> extracts.'},
    {concept: 'Control flow statements', description: 'if/else, switch for branching. for, while, do-while for looping. break exits loops, continue skips iteration. C++17 added if/switch with initializers for cleaner scoping. Control flow forms the backbone of program logic.'},
    {concept: 'Functions and overloading', description: 'Functions return a value (void for none). Parameters can be passed by value, reference, or pointer. Function overloading allows same name with different parameters. Default arguments provide optional parameters. Inline functions suggest compiler optimization.'},
    {concept: 'Headers and compilation model', description: 'Header files (.h/.hpp) declare interfaces, source files (.cpp) define implementations. #include copies headers. Separate compilation produces object files linked together. Understanding this prevents circular dependencies and compilation errors.'},
    {concept: 'Pointers and references', description: 'Pointers store memory addresses, references are aliases to existing variables. & gets address, * dereferences. References must be initialized, pointers can be null. Use references when possible, pointers when null or reassignment is needed.'},
    {concept: 'Dynamic memory and RAII', description: 'new allocates memory, delete frees it. Manual memory management is error-prone. RAII (Resource Acquisition Is Initialization) ties resource lifetime to object lifetime - acquire in constructor, release in destructor. Prevents leaks.'},
    {concept: 'Classes, structs, and encapsulation', description: 'Classes bundle data and functions. struct defaults public members, class defaults private. Public interface, private implementation. Constructors initialize, destructors clean up. Member functions can be const (don\'t modify object).'},
    {concept: 'Constructors/destructors', description: 'Constructors initialize objects (default, copy, move, parameterized). Destructors clean up resources. Rule of Three/Five: if you need custom destructor/copy/move, you probably need all three/five. Use =default for compiler-generated versions.'},
    {concept: 'Operator overloading', description: 'Define custom behavior for operators (+, ==, <<, etc.) as member or non-member functions. Follow conventions: + returns new object, += modifies left operand. Some operators must be members ((), [], ->, =).'},
    {concept: 'Inheritance and polymorphism', description: 'Derived classes inherit from base classes. public inheritance models "is-a" relationship. Virtual functions enable runtime polymorphism via base pointers/references. Pure virtual functions make abstract base classes. Understand slicing problem.'},
    {concept: 'Templates and generic programming', description: 'Templates write code that works with any type. Function templates deduce types, class templates specify them. Template metaprogramming performs computations at compile time. Modern C++ adds concepts (C++20) for better error messages.'},
    {concept: 'STL containers (vector/map/set)', description: 'Standard Template Library provides containers: vector (dynamic array), list (doubly-linked), map/set (tree-based), unordered_map/set (hash-based). Choose based on access patterns: vector for random access, map for key-value, set for uniqueness.'},
    {concept: 'Iterators and algorithms', description: 'Iterators abstract container traversal (begin/end). Algorithms work with iterators: sort, find, transform, accumulate. Range-based for loops (for (auto& x : container)) simplify iteration. Custom iterators enable algorithms on custom containers.'},
    {concept: 'Smart pointers (unique/shared/weak)', description: 'unique_ptr has exclusive ownership, movable not copyable. shared_ptr has shared ownership with reference counting. weak_ptr breaks circular references. Prefer smart pointers to raw new/delete. make_unique/make_shared for exception-safe creation.'},
    {concept: 'Exceptions and error handling', description: 'throw raises exceptions, try/catch handles them. Exception classes should inherit from std::exception. noexcept specifies functions that won\'t throw. RAII ensures cleanup even when exceptions occur. Consider performance implications in embedded systems.'},
    {concept: 'Namespaces and scope', description: 'Namespaces prevent name collisions. :: scope resolution operator. using declarations bring names into scope. Anonymous namespaces for internal linkage. ADL (Argument Dependent Lookup) finds functions in associated namespaces.'},
    {concept: 'Const-correctness', description: 'const prevents modification. const objects, const member functions (can\'t modify members), const parameters, const return values. mutable allows modification in const functions for caching. Const-correctness catches bugs and enables optimization.'},
    {concept: 'Move semantics and rvalue refs', description: 'Move semantics transfer resources instead of copying. Rvalue references (&&) bind to temporaries. std::move casts to rvalue. Move constructors/assignment operators enable efficient transfers. Rule of Five includes move operations.'},
    {concept: 'Lambda functions', description: 'Lambdas create anonymous function objects. Capture list specifies captured variables (by value [=] or reference [&]). Can be generic with auto parameters (C++14). Useful for algorithms, callbacks, and one-off functions.'},
    {concept: 'std::thread and concurrency basics', description: 'std::thread creates threads. Join or detach threads. Data races occur when multiple threads access shared data without synchronization. Use std::mutex, std::lock_guard for mutual exclusion. Prefer tasks over raw threads.'},
    {concept: 'Mutexes and locks', description: 'std::mutex provides mutual exclusion. std::lock_guard RAII wrapper. std::unique_lock more flexible (deferred locking). std::scoped_lock locks multiple mutexes deadlock-free (C++17). Deadlocks occur with circular lock acquisition.'},
    {concept: 'Chrono and timing', description: '<chrono> provides time utilities. std::chrono::duration represents time spans. std::chrono::time_point represents points in time. Clocks (system_clock, steady_clock) measure time. Useful for benchmarks, timeouts, and scheduling.'},
    {concept: 'File streams and filesystem', description: '<fstream> for file I/O: ifstream input, ofstream output, fstream both. <filesystem> (C++17) for path manipulation, directory iteration, file operations. RAII ensures files close. Handle errors (file not found, permissions).'},
    {concept: 'Preprocessor directives', description: '#include, #define macros, #ifdef conditional compilation. Use const/inline/enum instead of macros when possible. Header guards (#ifndef HEADER_H) prevent multiple inclusion. Macros have no scope and can cause subtle bugs.'},
    {concept: 'Memory layout and alignment', description: 'Struct members padded to alignment boundaries. alignas specifies alignment, alignof queries it. Understanding layout matters for performance (cache lines) and interoperability (hardware, other languages). Use static_assert to verify assumptions.'},
    {concept: 'Undefined behavior pitfalls', description: 'UB occurs when program breaks language rules: dangling pointers, out-of-bounds access, signed overflow, uninitialized variables. UB allows compilers to optimize aggressively but can cause security vulnerabilities. Use sanitizers to detect UB.'},
    {concept: 'Build systems (CMake basics)', description: 'CMake generates build files (Makefiles, VS projects). CMakeLists.txt specifies targets, dependencies, options. Modern CMake (target-based) is preferred. Learn find_package, add_library, target_link_libraries. Build systems manage complex dependencies.'},
    {concept: 'Testing frameworks intro', description: 'Google Test, Catch2, doctest are popular frameworks. Write TEST() cases with assertions (EXPECT_EQ, ASSERT_TRUE). Set up fixtures for shared test configuration. Mock objects simulate dependencies. Continuous integration runs tests automatically.'},
    {concept: 'Performance and optimization', description: 'Profile before optimizing. Cache locality matters: contiguous access patterns. Avoid virtual calls in hot loops. Understand CPU pipelines, branch prediction. Compiler optimizations (-O2, -O3) but beware of UB. Sometimes simpler code is faster.'},
  ],
  html: [
    {concept: 'Document structure and doctype', description: '<!DOCTYPE html> declares HTML5 document. <html> root element contains <head> (metadata) and <body> (content). Proper structure ensures browsers render correctly and aids accessibility tools. This foundational structure appears in every HTML page.'},
    {concept: 'Head vs body semantics', description: '<head> contains metadata (title, stylesheets, scripts, meta tags) not displayed. <body> contains visible content (text, images, interactive elements). Separation of concerns: head defines how page behaves/appears, body defines what users see/interact with.'},
    {concept: 'Meta tags and SEO basics', description: '<meta> tags provide metadata: charset (UTF-8), viewport (responsive design), description (search snippets), keywords (less important now). Open Graph tags (og:) control social media previews. Proper meta tags improve SEO and user experience across platforms.'},
    {concept: 'Headings and text semantics', description: '<h1>-<h6> create hierarchical headings (h1 most important). Use sequentially (don\'t skip levels). <p> for paragraphs, <strong> for importance, <em> for emphasis. Semantic text elements (<time>, <mark>) add meaning beyond visual presentation.'},
    {concept: 'Links and navigation', description: '<a href="url"> creates hyperlinks. href can be absolute, relative, or fragment (#section). target="_blank" opens new tab (add rel="noopener" for security). Navigation menus use lists (<ul>) of links. Links are fundamental to web connectivity.'},
    {concept: 'Lists (ul/ol)', description: '<ul> unordered (bulleted) lists, <ol> ordered (numbered) lists, <li> list items. Nest lists for hierarchies. Lists structure related items: navigation menus, instructions, features. Screen readers announce list length, aiding navigation for visually impaired users.'},
    {concept: 'Images with alt text', description: '<img src="path" alt="description"> embeds images. alt text describes image content for screen readers, displays if image fails to load, and aids SEO. Use descriptive alt text for content images, empty alt="" for decorative images. Optimize images for web (size, format).'},
    {concept: 'Tables and accessibility', description: '<table> with <thead>, <tbody>, <tfoot>, <tr> rows, <td> data cells, <th> header cells. Use scope attribute on headers (col, row). Complex tables need id/headers attributes. Tables are for tabular data only, not layout. Accessibility features make data understandable to screen readers.'},
    {concept: 'Forms and input types', description: '<form> collects user input. <input> types: text, email, password, number, date, etc. <textarea> multi-line text. <select> dropdowns. <button> submits or resets. Each input should have associated <label>. Forms enable user interaction and data submission.'},
    {concept: 'Labels and accessibility basics', description: '<label for="id"> associates text with form controls. Clicking label focuses control. Always label form elements - use visible text or aria-label for icon buttons. Proper labeling is crucial for accessibility and forms usability.'},
    {concept: 'Buttons vs links semantics', description: '<button> triggers actions (submit form, open modal). <a> navigates to URLs. Use buttons for in-page actions, links for navigation. Styling can make them look similar, but semantic distinction matters for accessibility and expected behavior.'},
    {concept: 'Semantic layout (header/nav/main/footer)', description: '<header> introductory content, <nav> navigation links, <main> primary content, <footer> closing content. <article> standalone content, <section> thematic grouping, <aside> tangential content. Semantic elements improve accessibility, SEO, and code readability over generic <div>s.'},
    {concept: 'Sections, articles, asides', description: '<section> groups related content (chapters, tabs). <article> independent content (blog post, product). <aside> related but tangential content (sidebar, pull quote). Choose based on content independence, not visual presentation. Nest appropriately.'},
    {concept: 'Inline vs block elements', description: 'Block elements (div, p, section) start on new line, take full width. Inline elements (span, a, strong) flow within text, only take needed width. CSS can change display property (block, inline, inline-block). Understanding this prevents layout surprises.'},
    {concept: 'Audio/video embedding', description: '<audio> and <video> embed media with controls attribute for play/pause. <source> elements provide multiple formats for compatibility. Track element adds captions/subtitles. Consider autoplay policies and provide fallback content for unsupported browsers.'},
    {concept: 'Iframes and sandboxing', description: '<iframe> embeds another HTML page. Use for third-party content (maps, videos). sandbox attribute restricts capabilities (scripts, forms). Always consider security implications - iframes can be used for clickjacking attacks without proper restrictions.'},
    {concept: 'ARIA roles and attributes', description: 'ARIA (Accessible Rich Internet Applications) attributes enhance accessibility when native HTML falls short. role defines element purpose (navigation, dialog). aria-label provides accessible name. Use native HTML elements when possible, ARIA as supplement.'},
    {concept: 'Responsive meta viewport', description: '<meta name="viewport" content="width=device-width, initial-scale=1"> enables responsive design by controlling layout on mobile devices. Without it, mobile browsers may zoom out to show desktop layout. Essential for mobile-friendly websites.'},
    {concept: 'Favicons and assets', description: 'Favicon appears in browser tabs/bookmarks. Use <link rel="icon"> with various sizes for different devices (16x16, 32x32, 180x180 for iOS). Modern sites need multiple icon formats. Also specify manifest.json for PWA capabilities.'},
    {concept: 'Data attributes', description: 'data-* attributes store custom data private to page (data-user-id="123"). Accessed via JavaScript element.dataset or CSS attribute selectors. Useful for scripting without non-standard attributes or hidden elements. Keep data attributes for private use, not public API.'},
    {concept: 'Custom attributes and validation', description: 'Custom attributes (non-data-*) are allowed but may not validate. Use data-* for custom needs. HTML validators check against specification. Valid HTML ensures cross-browser compatibility and future-proofing as standards evolve.'},
    {concept: 'SVG embedding', description: 'SVG (Scalable Vector Graphics) can be embedded via <img>, CSS background, inline <svg>, or <object>. Inline SVG is manipulable with JavaScript/CSS. Use for icons, logos, diagrams that need crisp scaling at any size or animation.'},
    {concept: 'Canvas basics', description: '<canvas> creates drawing surface for JavaScript-rendered graphics (charts, games, image editing). Requires JavaScript to draw. Alternative to SVG for dynamic, pixel-based graphics. Consider accessibility - provide text alternatives for canvas content.'},
    {concept: 'Media elements controls', description: 'Customize media player with JavaScript API (play(), pause(), currentTime). Create custom controls when default UI doesn\'t match design. Handle events (timeupdate, ended). Provide keyboard accessibility for custom controls.'},
    {concept: 'Picture/source for responsive images', description: '<picture> with <source> elements provides different images based on conditions (viewport size, pixel density, format support). <img> inside provides fallback. Optimizes bandwidth and performance by serving appropriately sized images.'},
    {concept: 'Forms validation attributes', description: 'HTML5 form validation: required, min/max, pattern (regex), maxlength. Invalid fields show browser-native error messages. Combine with JavaScript for custom validation. Use novalidate to disable browser validation when implementing custom.'},
    {concept: 'Input accessibility and autocomplete', description: 'autocomplete attribute helps browsers fill forms (name, email, address). Proper input types (email, tel) trigger appropriate keyboards on mobile. Accessibility: ensure form can be navigated and understood using only keyboard and screen reader.'},
    {concept: 'Progress/meter elements', description: '<progress> shows completion of task (download, form completion). <meter> displays scalar measurement within range (disk usage, score). Semantic alternatives to custom div-based progress bars. Style with CSS, update values with JavaScript.'},
    {concept: 'Tables with thead/tbody/tfoot', description: '<thead> header rows, <tbody> data rows, <tfoot> footer rows (summary, totals). Logical grouping aids styling, scripting, and accessibility. <tfoot> can appear before <tbody> in HTML but renders after. Use for large tables with scrolling bodies.'},
    {concept: 'Best practices for semantics', description: 'Use most specific semantic element available. Validate HTML regularly. Ensure logical heading hierarchy. Test with screen readers. Semantic HTML improves accessibility, SEO, maintainability, and interoperability with assistive technologies.'},
  ],
  react: [
    {concept: 'JSX syntax and rules', description: 'JSX is JavaScript syntax extension that looks like HTML. It must have one parent element (use Fragment <> or div). Embed JavaScript expressions with {}. className instead of class, htmlFor instead of for. JSX compiles to React.createElement() calls.'},
    {concept: 'Components (function) and props', description: 'Components are reusable UI pieces. Function components receive props object, return JSX. Props are read-only, passed from parent to child. Destructure props for cleaner code. Components should be pure with respect to props (same props → same output).'},
    {concept: 'State with useState', description: 'useState hook creates state variables that persist between renders. Returns [value, setter] array. State updates are asynchronous and batched. Setter can take function for updates based on previous state. State is isolated to each component instance.'},
    {concept: 'Event handling in React', description: 'Pass function references as event handlers (onClick={handleClick}). Events are React\'s SyntheticEvent (cross-browser wrapper). Access event details via parameter. Prevent default behavior with e.preventDefault(). Bind class methods in constructor or use arrow functions.'},
    {concept: 'Conditional rendering patterns', description: 'Use && for conditional inclusion, ternary for either/or, variables for complex logic. Component functions can return null to render nothing. Extract conditional logic into separate components when it becomes complex.'},
    {concept: 'Lists and keys', description: 'Map arrays to JSX elements. Each list item needs unique key prop (string) for React to track changes efficiently. Use stable IDs from data when possible, index as last resort. Keys only need uniqueness among siblings, not globally.'},
    {concept: 'Lifting state up', description: 'When multiple components need same state, move it to their closest common ancestor. Pass state down via props, pass setters to update it. This centralizes state management and ensures components stay synchronized.'},
    {concept: 'Prop drilling vs composition', description: 'Prop drilling passes props through intermediate components. Context API or state management libraries reduce drilling. Component composition (children, render props, higher-order components) provides more flexible code reuse than prop passing.'},
    {concept: 'useEffect for side effects', description: 'useEffect runs side effects after render. Dependencies array controls when effect runs: [] (mount), [dep] (when dep changes), no array (every render). Return cleanup function. Use for data fetching, subscriptions, DOM manipulation.'},
    {concept: 'Dependency arrays and cleanup', description: 'Dependencies array should include all values from component scope that effect uses. Missing dependencies cause stale closures. Cleanup function runs before next effect execution and on unmount. Essential for preventing memory leaks.'},
    {concept: 'Refs and uncontrolled components', description: 'useRef creates mutable object that persists across renders. ref.current accesses DOM nodes or any mutable value. Uncontrolled components use refs instead of state for form inputs. Refs don\'t trigger re-renders when changed.'},
    {concept: 'Context API for shared state', description: 'Context provides way to pass data through component tree without prop drilling. createContext, Provider, useContext. Use for global data (theme, auth, language). Avoid overusing - context changes cause all consuming components to re-render.'},
    {concept: 'Custom hooks patterns', description: 'Custom hooks extract component logic into reusable functions. Must start with "use". Can call other hooks. Encapsulate complex logic, enable code reuse across components. Examples: useLocalStorage, useFetch, useAuth.'},
    {concept: 'Memoization (useMemo/useCallback)', description: 'useMemo caches expensive calculations, recomputes when dependencies change. useCallback caches function definitions. Use to prevent unnecessary re-renders of child components. Don\'t over-optimize - profile first.'},
    {concept: 'React.memo for pure components', description: 'React.memo memoizes component, prevents re-renders if props haven\'t changed (shallow comparison). Accepts custom comparison function. Use for expensive components that render often with same props. Not needed for simple components.'},
    {concept: 'Error boundaries (class-based)', description: 'Error boundaries catch JavaScript errors in child components, display fallback UI. Must be class components with componentDidCatch or getDerivedStateFromError. Place strategically to prevent entire app from crashing.'},
    {concept: 'Portals for modals/tooltips', description: 'ReactDOM.createPortal renders children into different DOM node (outside parent hierarchy). Useful for modals, tooltips, dropdowns that need to break out of container CSS. Events bubble through React tree, not DOM tree.'},
    {concept: 'Suspense and lazy loading', description: 'React.lazy() dynamically imports components. Suspense wraps lazy components, shows fallback while loading. Reduces initial bundle size. Combine with code splitting for optimal performance.'},
    {concept: 'Routing concepts', description: 'React Router handles navigation in single-page applications. Route matching, nested routes, URL parameters, navigation between routes. Other options: Reach Router, wouter. Understand difference between HashRouter and BrowserRouter.'},
    {concept: 'Forms and controlled inputs', description: 'Controlled components: form data handled by React state. Input value tied to state, onChange updates state. Handles complex validation, conditional disabling. Alternative: uncontrolled with refs for simple cases or large forms.'},
    {concept: 'Accessibility considerations', description: 'Semantic HTML, proper labeling, keyboard navigation, ARIA attributes, focus management. React-specific: manage focus after async operations, announce dynamic content to screen readers. Accessibility should be built in, not bolted on.'},
    {concept: 'Styling options (CSS modules/CSS-in-JS)', description: 'CSS Modules scopes CSS to component. CSS-in-JS (styled-components, Emotion) colocate styles with components. Also: plain CSS, Sass, utility frameworks (Tailwind). Choose based on team preference, project scale, and performance needs.'},
    {concept: 'Performance profiling', description: 'React DevTools Profiler measures component render times. Identify unnecessary re-renders with "Highlight updates". Use production builds for accurate profiling. Common optimizations: memoization, virtualization, code splitting.'},
    {concept: 'Testing components', description: 'React Testing Library tests components as users interact with them. Jest as test runner. Test behavior, not implementation. Mock external dependencies. Test accessibility with jest-axe. Integration tests over unit tests for UI.'},
    {concept: 'Server communication (fetch/query libs)', description: 'fetch or axios for HTTP requests. Handle loading/error states. Libraries: React Query for caching/synchronization, SWR for data fetching. For complex state, Redux with middleware (redux-thunk, redux-saga).'},
    {concept: 'State management options', description: 'useState/useContext for simple apps. Redux for complex global state. MobX for observable-based state. Recoil/Jotai for atomic state. Zustand for minimal store. Choose based on app complexity and team experience.'},
    {concept: 'Rendering lists at scale (virtualization)', description: 'Virtualization renders only visible items for long lists (react-window, react-virtualized). Improves performance and memory usage. Also: pagination, infinite scroll. Measure performance before implementing.'},
    {concept: 'Code splitting and chunking', description: 'Split code at route level (React.lazy) or component level. Webpack automatically splits dynamic imports. Analyze bundle with source-map-explorer. Reduce initial load time, especially important for mobile users.'},
    {concept: 'SSR/SSG basics', description: 'Server-Side Rendering (Next.js) renders React on server for faster initial load, SEO. Static Site Generation pre-builds pages. Understand hydration: React "takes over" static HTML. Trade-offs between build time, dynamic content, and complexity.'},
    {concept: 'Build and deploy pipeline', description: 'Create React App sets up development/production builds. Configure environment variables. Deploy to static hosts (Netlify, Vercel) or servers. Set up CI/CD for testing, building, deploying. Monitor performance with Real User Monitoring.'},
  ],
  typescript: [
    {concept: 'Type annotations and inference', description: 'Type annotations explicitly declare types (let x: number). Type inference automatically determines types when initialized (let x = 5 infers number). Use annotations for function parameters/returns, let inference work for variables when possible.'},
    {concept: 'Primitive vs object types', description: 'Primitives: string, number, boolean, null, undefined, symbol, bigint. Object types: functions, arrays, classes, interfaces. TypeScript tracks these differently - primitives are value types, objects are reference types. Understand type widening and const contexts.'},
    {concept: 'Interfaces and type aliases', description: 'Both define object shapes. Interfaces use interface keyword, can be extended/merged. Type aliases use type keyword, can represent any type (unions, primitives). Prefer interfaces for object shapes, types for unions/tuples. Know when each is appropriate.'},
    {concept: 'Functions and typed params/returns', description: 'Function parameters and return values can be typed. Optional parameters use ?, default values set type automatically. Rest parameters (...args) can be typed as arrays. Function types describe function shapes for callbacks.'},
    {concept: 'Optional and default parameters', description: 'Optional parameters (param?: string) can be undefined. Default parameters (param = "default") infer type from default value. Optional must come after required parameters. Different from union with undefined (param: string | undefined).'},
    {concept: 'Union and intersection types', description: 'Union (A | B) means value can be either type. Intersection (A & B) combines types (must satisfy both). Unions enable flexible typing, intersections create combined types. Use type guards to narrow unions at runtime.'},
    {concept: 'Literal and enum types', description: 'Literal types are specific values ("red", 42, true). Enum creates named constant set (numeric or string). String enums are generally preferred over traditional enums for better debugging and tree-shaking.'},
    {concept: 'Generics basics', description: 'Generics create reusable components that work with multiple types. <T> is type parameter. Functions, interfaces, classes can be generic. Constraints (T extends SomeType) limit allowable types. Foundation for type-safe reusable code.'},
    {concept: 'Generic constraints with extends', description: 'Constraints restrict generic types to those with certain properties. T extends HasId requires T to have id property. Enables accessing properties while maintaining flexibility. Multiple constraints with intersection types.'},
    {concept: 'Readonly and partial utilities', description: 'Readonly<T> makes all properties readonly. Partial<T> makes all properties optional. Built-in utility types help transform types without rewriting. Others: Required<T>, Pick<T, K>, Omit<T, K>, Record<K, T>.'},
    {concept: 'Pick/Omit/Record mapped types', description: 'Pick<T, K> selects subset of properties. Omit<T, K> excludes properties. Record<K, T> creates object type with keys K and values T. Mapped types transform existing types programmatically. Essential for type transformations.'},
    {concept: 'Index signatures and key remapping', description: 'Index signatures [key: string]: T allow any string key with value T. Key remapping (as clause) in mapped types transforms key names. Useful for creating type-safe dictionaries and transforming object shapes.'},
    {concept: 'Tuple types and variadic tuples', description: 'Tuples are fixed-length arrays with known types at each position. [string, number] pair. Variadic tuples (...T[]) enable rest elements in tuples. Useful for function parameters, React hooks, and fixed-format data.'},
    {concept: 'Conditional types', description: 'Conditional types (T extends U ? X : Y) choose types based on condition. Enables type-level logic. infer keyword extracts types within conditional branches. Advanced but powerful for complex type transformations.'},
    {concept: 'Discriminated unions', description: 'Union where each member has common property (discriminant) with literal type. TypeScript can narrow based on discriminant. Pattern for modeling state machines, API responses, or variant data structures with type safety.'},
    {concept: 'Type guards and predicates', description: 'Type guard functions return boolean indicating if value is of type. User-defined type guards use "value is Type" return type. typeof, instanceof are built-in guards. Narrow union types safely at runtime.'},
    {concept: 'Assertion functions', description: 'Functions that throw if condition fails, narrowing type afterward. asserts condition return type. Like type guards but throw instead of returning false. Useful for validating inputs and ensuring invariants.'},
    {concept: 'Never and unknown usage', description: 'never represents unreachable code (exhaustive checks). unknown is type-safe any - must be narrowed before use. Prefer unknown over any for receiving untrusted data. never in conditional types filters out types.'},
    {concept: 'This typing and contextual typing', description: 'this parameter in functions/types refers to current object. Contextual typing infers types from usage location (function arguments, arrow functions). Understand how TypeScript uses context to infer types without explicit annotations.'},
    {concept: 'Modules and import/export', description: 'TypeScript follows ES module syntax. Can import/export types with type modifier. Understand difference between value space and type space. Declaration files (.d.ts) describe external JavaScript code.'},
    {concept: 'Declaration merging', description: 'Interfaces with same name in same scope merge. Useful for extending existing declarations (like adding to global Window). Modules, namespaces, enums also merge. Understand when merging happens and how to use it effectively.'},
    {concept: 'Ambient declarations (.d.ts)', description: 'Declaration files describe types without implementation. declare keyword. Used for JavaScript libraries without TypeScript. DefinitelyTyped (@types packages) provides these for popular libraries. Write your own for internal JS code.'},
    {concept: 'DOM lib types overview', description: 'TypeScript includes lib.dom.d.ts with DOM API types. HTMLElement, Event, etc. Understand these types when working with browser APIs. Different lib targets (es5, es2015, dom) include different built-in type definitions.'},
    {concept: 'Utility types from stdlib', description: 'TypeScript provides utility types: Awaited<T>, Capitalize<StringType>, etc. These manipulate types at compile time. Familiarize with common ones, know they exist to avoid reinventing solutions.'},
    {concept: 'Template literal types', description: 'Template literal types combine string literals with placeholders. `Hello ${World}` where World is string literal type. Enable type-safe string manipulation, URL building, CSS property validation. Advanced but powerful feature.'},
    {concept: 'Recursive types', description: 'Types that reference themselves. type Json = string | number | boolean | null | Json[] | {[key: string]: Json}. Handle nested structures. TypeScript 4.1+ better handles recursive types with improved performance and error messages.'},
    {concept: 'Decorators (experimental)', description: 'Decorators modify classes/methods at design time. Experimental feature requiring --experimentalDecorators. Used by Angular, TypeORM. Understand metadata reflection API if using decorators extensively.'},
    {concept: 'Strict mode options', description: '--strict enables all strict type-checking options. Key ones: noImplicitAny, strictNullChecks, strictFunctionTypes. Use strict mode for maximum type safety. May require more annotations but catches more bugs.'},
    {concept: 'tsconfig essentials', description: 'tsconfig.json configures TypeScript compiler. Important settings: target (output ECMAScript version), module (module system), outDir, include/exclude, compilerOptions. Understand difference between files, include, and references.'},
    {concept: 'Interop with JS and any safety', description: 'TypeScript can gradually adopt existing JavaScript. Use JSDoc comments for type hints in .js files. any type opts out of type checking - use sparingly. unknown is safer alternative. Migration strategies for converting JS to TS.'},
  ],
  
  sql: [
    {concept: 'SELECT statement fundamentals', description: 'SELECT retrieves data from database tables. Basic syntax: SELECT column1, column2 FROM table_name. Use * to select all columns. SELECT is the foundation of all data retrieval operations in SQL.'},
    {concept: 'WHERE clause and filtering', description: 'WHERE filters rows based on conditions using comparison operators (=, !=, <, >, <=, >=), logical operators (AND, OR, NOT), and pattern matching (LIKE, IN, BETWEEN). Essential for retrieving specific data subsets.'},
    {concept: 'JOIN operations (INNER, LEFT, RIGHT, FULL)', description: 'JOINs combine data from multiple tables. INNER JOIN returns matching rows, LEFT JOIN includes all left table rows, RIGHT JOIN includes all right table rows, FULL OUTER JOIN includes all rows from both tables. Understanding join types is crucial for relational queries.'},
    {concept: 'Aggregate functions (COUNT, SUM, AVG, MIN, MAX)', description: 'Aggregate functions perform calculations on groups of rows. COUNT counts rows, SUM adds values, AVG calculates average, MIN/MAX find extremes. These functions work with GROUP BY to create summary reports.'},
    {concept: 'GROUP BY and HAVING clauses', description: 'GROUP BY groups rows with identical values in specified columns, enabling aggregate calculations per group. HAVING filters groups after aggregation (unlike WHERE which filters rows before aggregation). Essential for summary queries.'},
    {concept: 'Subqueries and correlated subqueries', description: 'Subqueries are queries nested inside other queries. Scalar subqueries return single values, while table subqueries return result sets. Correlated subqueries reference outer query columns, executing once per outer row. Powerful for complex filtering and calculations.'},
    {concept: 'Window functions (ROW_NUMBER, RANK, LAG, LEAD)', description: 'Window functions perform calculations across related rows without collapsing them into groups. ROW_NUMBER assigns sequential numbers, RANK handles ties, LAG/LEAD access previous/next row values. Enable advanced analytical queries.'},
    {concept: 'Common Table Expressions (CTEs)', description: 'CTEs create named temporary result sets using WITH clause, improving query readability and enabling recursive queries. Recursive CTEs traverse hierarchical data like organizational charts or tree structures.'},
    {concept: 'Indexes and query optimization', description: 'Indexes improve query performance by creating data structures that allow faster data retrieval. Primary keys automatically create indexes. Understanding index types (B-tree, hash, composite) and when to use them is crucial for database performance.'},
    {concept: 'Transactions and ACID properties', description: 'Transactions ensure data consistency through ACID properties: Atomicity (all or nothing), Consistency (valid state transitions), Isolation (concurrent transactions don\'t interfere), Durability (committed changes persist). Use BEGIN, COMMIT, ROLLBACK to control transactions.'},
    {concept: 'Data types and constraints', description: 'SQL supports various data types: INTEGER, VARCHAR, TEXT, DATE, TIMESTAMP, DECIMAL, BOOLEAN. Constraints (PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK) enforce data integrity rules at the database level.'},
    {concept: 'String and date functions', description: 'String functions (CONCAT, SUBSTRING, LENGTH, UPPER, LOWER, TRIM) manipulate text data. Date functions (DATEADD, DATEDIFF, EXTRACT, DATE_FORMAT) handle temporal operations. These enable data transformation directly in queries.'},
    {concept: 'UNION, INTERSECT, and EXCEPT operations', description: 'Set operations combine query results: UNION merges results (removes duplicates), UNION ALL keeps duplicates, INTERSECT finds common rows, EXCEPT finds rows in first but not second query. Useful for data comparison and consolidation.'},
    {concept: 'Views and materialized views', description: 'Views are virtual tables defined by queries, simplifying complex queries and providing data abstraction. Materialized views store pre-computed results for performance, requiring refresh strategies. Both enhance query organization and performance.'},
    {concept: 'Stored procedures and functions', description: 'Stored procedures encapsulate SQL logic for reuse, accepting parameters and returning results. Functions return single values or tables. Both enable code reuse, security through parameterization, and improved performance through execution plan caching.'},
    {concept: 'Triggers and automated actions', description: 'Triggers automatically execute SQL code when data changes occur (INSERT, UPDATE, DELETE). BEFORE triggers run before the change, AFTER triggers run after. Useful for audit trails, data validation, and maintaining derived data.'},
    {concept: 'Normalization and database design', description: 'Normalization reduces data redundancy through normal forms (1NF, 2NF, 3NF, BCNF). Proper normalization prevents update anomalies and ensures data integrity, though denormalization may be used for performance optimization in read-heavy scenarios.'},
    {concept: 'NULL handling and COALESCE', description: 'NULL represents missing or unknown data. Comparisons with NULL require IS NULL or IS NOT NULL (not = or !=). COALESCE returns the first non-NULL value from a list. Understanding NULL behavior prevents logical errors in queries.'},
    {concept: 'PIVOT and UNPIVOT operations', description: 'PIVOT transforms rows into columns for cross-tabulation reports. UNPIVOT reverses this, converting columns to rows. These operations enable matrix-style reporting and data normalization, though syntax varies by database system.'},
    {concept: 'Full-text search capabilities', description: 'Full-text search enables efficient searching across large text columns using specialized indexes. Functions like CONTAINS, FREETEXT, and ranking algorithms provide flexible text querying beyond simple LIKE patterns, essential for content management systems.'},
    {concept: 'Temporal tables and versioning', description: 'Temporal tables automatically track data changes over time, maintaining history of all modifications. System-versioned tables enable querying data as it existed at specific points in time, crucial for audit requirements and historical analysis.'},
    {concept: 'JSON and XML data handling', description: 'Modern databases support native JSON and XML data types with specialized functions for querying, parsing, and manipulating semi-structured data. JSON functions (JSON_VALUE, JSON_QUERY, JSON_EXISTS) enable flexible data storage and retrieval patterns.'},
    {concept: 'Query execution plans and optimization', description: 'Execution plans show how the database engine processes queries. Understanding plans helps identify bottlenecks, missing indexes, and optimization opportunities. Use EXPLAIN or SHOWPLAN to analyze query performance and optimize slow queries.'},
    {concept: 'Partitioning strategies', description: 'Table partitioning divides large tables into smaller, manageable pieces (partitions) based on criteria like date ranges or hash values. Partition pruning improves query performance by accessing only relevant partitions, essential for very large datasets.'},
    {concept: 'Security and access control', description: 'SQL security involves user management, role-based access control (RBAC), row-level security policies, and encryption. GRANT/REVOKE statements control permissions. Understanding security best practices prevents unauthorized data access and SQL injection attacks.'},
  ],
  
  express: [
    {concept: 'Express application setup and routing', description: 'Express apps are created with express() and use app.get(), app.post(), etc. for route definitions. Routes match HTTP methods and URL patterns. Understanding route order and specificity is crucial for correct request handling.'},
    {concept: 'Middleware concept and execution order', description: 'Middleware functions have access to request, response, and next. They execute in order and can modify requests/responses or terminate the request-response cycle. app.use() applies middleware globally or to specific paths. Order matters significantly.'},
    {concept: 'Request and response objects', description: 'req object contains request data: req.params (route parameters), req.query (query string), req.body (parsed body), req.headers. res object sends responses: res.send(), res.json(), res.status(), res.setHeader(). Understanding these is fundamental.'},
    {concept: 'Route parameters and query strings', description: 'Route parameters (:id) extract values from URL paths, accessible via req.params. Query strings (?key=value) are parsed into req.query object. Both enable dynamic route handling and data passing through URLs.'},
    {concept: 'Body parsing middleware', description: 'express.json() parses JSON request bodies into req.body. express.urlencoded() handles form data. These middleware must be applied before routes that need body data. Understanding content-type headers and parsing is essential for POST/PUT requests.'},
    {concept: 'Error handling middleware', description: 'Error middleware has four parameters (err, req, res, next) and handles errors from previous middleware/routes. Place error handlers after all routes. Use try/catch in async routes or next(error) to pass errors to error middleware.'},
    {concept: 'Router and route organization', description: 'express.Router() creates modular route handlers. Use router.get(), router.post() to define routes, then app.use(\'/path\', router) to mount. This enables code organization, route prefixes, and reusable route modules for large applications.'},
    {concept: 'Static file serving', description: 'express.static() middleware serves static files (HTML, CSS, images) from a directory. Configured with app.use(express.static(\'public\')). Essential for serving frontend assets and public resources without individual route handlers.'},
    {concept: 'CORS configuration', description: 'CORS (Cross-Origin Resource Sharing) headers allow browsers to make requests from different origins. Configure with cors middleware or manually set Access-Control-Allow-Origin headers. Critical for API accessibility from frontend applications.'},
    {concept: 'Template engines and views', description: 'Express supports template engines (EJS, Pug, Handlebars) for server-side rendering. Configure with app.set(\'view engine\', \'ejs\') and render with res.render(\'template\', data). Enables dynamic HTML generation for traditional web applications.'},
    {concept: 'Session management', description: 'express-session middleware manages user sessions using cookies or server-side storage. Sessions enable stateful authentication and user data persistence across requests. Configure with secret, store options, and cookie settings for security.'},
    {concept: 'Authentication and authorization patterns', description: 'Authentication verifies user identity (login), authorization checks permissions (access control). Implement with JWT tokens, session-based auth, or OAuth. Middleware can protect routes by checking authentication status before allowing access.'},
    {concept: 'File upload handling', description: 'multer middleware handles multipart/form-data file uploads. Configure storage (disk/memory), file size limits, and file filtering. Access uploaded files via req.file or req.files. Essential for user-generated content and media handling.'},
    {concept: 'Rate limiting and security', description: 'Rate limiting prevents abuse by limiting requests per IP/time window. Use express-rate-limit. Security best practices include helmet (security headers), input validation, SQL injection prevention, XSS protection, and HTTPS enforcement.'},
    {concept: 'Environment variables and configuration', description: 'Use process.env for configuration (PORT, database URLs, API keys). Keep secrets out of code. Use dotenv for local development. Different configs for dev/staging/production environments. Essential for secure, flexible deployments.'},
    {concept: 'Database integration patterns', description: 'Express integrates with databases via drivers (mysql2, pg, mongodb) or ORMs (Sequelize, Mongoose, TypeORM). Connection pooling, query builders, and transaction handling are important. Understand async/await patterns for database operations.'},
    {concept: 'API versioning strategies', description: 'Version APIs using URL paths (/api/v1/users) or headers (Accept: application/vnd.api+json;version=1). Enables backward compatibility while evolving APIs. Route organization and middleware can handle version-specific logic.'},
    {concept: 'Request validation and sanitization', description: 'Validate incoming data using libraries like express-validator or Joi. Check required fields, data types, formats, and constraints. Sanitize input to prevent injection attacks. Return clear error messages for invalid input.'},
    {concept: 'Logging and monitoring', description: 'Use morgan for HTTP request logging. Implement structured logging with levels (error, warn, info, debug). Monitor application health, performance metrics, and errors. Integration with logging services (Winston, Pino) for production applications.'},
    {concept: 'Testing Express applications', description: 'Test Express apps using supertest for HTTP assertions, jest or mocha for test frameworks. Test routes, middleware, and error handling. Use test databases and mock external services. Integration and unit testing ensure application reliability.'},
    {concept: 'Production deployment considerations', description: 'Production concerns: process managers (PM2), reverse proxies (Nginx), HTTPS/SSL, environment variables, error handling, logging, monitoring, graceful shutdown, health checks, and scaling strategies. Security hardening and performance optimization are critical.'},
    {concept: 'WebSocket integration', description: 'WebSockets enable real-time bidirectional communication. Integrate with Socket.io or ws library. Handle connection events, room management, and message broadcasting. Useful for chat applications, live updates, and real-time features.'},
    {concept: 'Caching strategies', description: 'Implement caching with Redis or in-memory stores. Cache frequently accessed data, API responses, or computed results. Use cache headers (ETag, Last-Modified) for HTTP caching. Balance cache invalidation with performance benefits.'},
    {concept: 'Microservices and API design', description: 'Design RESTful APIs with proper HTTP methods, status codes, and resource naming. Follow REST principles for scalable, maintainable APIs. Consider GraphQL as alternative. API documentation (Swagger/OpenAPI) improves developer experience.'},
    {concept: 'Performance optimization', description: 'Optimize Express apps through compression (gzip), connection pooling, query optimization, caching, CDN usage, and code splitting. Profile applications to identify bottlenecks. Use clustering or worker threads for CPU-intensive tasks.'},
  ],
};

const describeConcept = (concept: string, languageKey: string) => {
  const languageData = notesTemplates[languageKey];
  if (!languageData) return '';

  const foundConcept = languageData.find(item => item.concept === concept);
  return foundConcept ? `${concept}: ${foundConcept.description}` : '';
};

const Notes: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [userNotes, setUserNotes] = useState<Record<string, Array<{concept: string, description: string}>>>(() => {
    try {
      const saved = localStorage.getItem('userNotesByLanguage');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [newNote, setNewNote] = useState('');
  const [newNoteDescription, setNewNoteDescription] = useState('');
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingConcept, setEditingConcept] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLanguageInfo, setSelectedLanguageInfo] = useState<{
    label: string;
    description: string;
    icon: string;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem('userNotesByLanguage', JSON.stringify(userNotes));
  }, [userNotes]);

  const languageNotes = useMemo(() => {
    const key = notesTemplates[selectedLanguage] ? selectedLanguage : 'javascript';
    const base = notesTemplates[key] || [];
    const personal = userNotes[key] || [];
    const combined = [
      ...base.map((n, idx) => ({ ...n, id: `b-${idx}`, isUser: false, personalIndex: null })),
      ...personal.map((n, idx) => ({ ...n, id: `u-${idx}`, isUser: true, personalIndex: idx })),
    ];
    return { base, personal, combined };
  }, [selectedLanguage, userNotes]);

  useEffect(() => {
    const first = languageNotes.combined[0];
    setExpandedNote(first ? first.id : null);
    setEditingNoteId(null);
    setEditingConcept('');
    setEditingDescription('');
  }, [languageNotes.combined, selectedLanguage]);

  const handleAddNote = () => {
    const trimmedConcept = newNote.trim();
    const trimmedDescription = newNoteDescription.trim();
    
    if (!trimmedConcept || !trimmedDescription) return;
    
    const key = notesTemplates[selectedLanguage] ? selectedLanguage : 'javascript';
    
    // Avoid duplicate user notes within same language
    if ((userNotes[key] || []).some(note => note.concept === trimmedConcept)) {
      setNewNote('');
      setNewNoteDescription('');
      return;
    }
    
    setUserNotes(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { concept: trimmedConcept, description: trimmedDescription }],
    }));
    
    setNewNote('');
    setNewNoteDescription('');
  };

  const handleDeleteNote = (personalIndex: number | null) => {
    if (personalIndex === null) return;
    const key = notesTemplates[selectedLanguage] ? selectedLanguage : 'javascript';
    setUserNotes(prev => {
      const next = [...(prev[key] || [])];
      next.splice(personalIndex, 1);
      return { ...prev, [key]: next };
    });
    setEditingNoteId(null);
    setEditingConcept('');
    setEditingDescription('');
  };

  const handleStartEdit = (noteId: string, concept: string, description: string) => {
    setEditingNoteId(noteId);
    setEditingConcept(concept);
    setEditingDescription(description);
  };

  const handleSaveEdit = (personalIndex: number | null) => {
    if (personalIndex === null) return;
    const key = notesTemplates[selectedLanguage] ? selectedLanguage : 'javascript';
    const trimmedConcept = editingConcept.trim();
    const trimmedDescription = editingDescription.trim();
    if (!trimmedConcept || !trimmedDescription) return;
    setUserNotes(prev => {
      const next = [...(prev[key] || [])];
      next[personalIndex] = { concept: trimmedConcept, description: trimmedDescription };
      return { ...prev, [key]: next };
    });
    setEditingNoteId(null);
    setEditingConcept('');
    setEditingDescription('');
  };

  const handleLanguageSelect = (value: string) => {
    setSelectedLanguage(value);
    const lang = languages.find(l => l.value === value);
    if (lang) {
      setSelectedLanguageInfo({
        label: lang.label,
        description: languageDescriptions[value] || 'No description available.',
        icon: lang.icon
      });
      setDialogOpen(true);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Notes Library
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NotesIcon color="primary" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Quick Reference by Language
              </Typography>
              <Typography variant="body2" color="text.secondary">
                30 key bullet points covering the core concepts for each stack.
              </Typography>
            </Box>
          </Box>

          <FormControl sx={{ maxWidth: 320 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={selectedLanguage}
              label="Language"
              onChange={(e) => handleLanguageSelect(e.target.value)}
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
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {languages.find((l) => l.value === selectedLanguage)?.icon}{' '}
              {languages.find((l) => l.value === selectedLanguage)?.label} — {languageNotes.combined.length} Concepts
            </Typography>
            <Chip label={`${languageNotes.combined.length} bullets`} color="primary" size="small" />
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mb: 3, p: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Add Your Own Note
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <TextField
                fullWidth
                label="Concept Title"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="e.g. Memory Management Patterns"
                size="small"
              />
              <TextField
                fullWidth
                label="Concept Description"
                value={newNoteDescription}
                onChange={(e) => setNewNoteDescription(e.target.value)}
                placeholder="Describe the concept in detail..."
                multiline
                rows={2}
                size="small"
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  onClick={handleAddNote} 
                  disabled={!newNote.trim() || !newNoteDescription.trim()}
                >
                  Add Note
                </Button>
              </Box>
            </Box>
          </Box>

          <Box>
            {languageNotes.combined.map((note, idx) => {
              const expanded = expandedNote === note.id;
              const languageLabel = languages.find((l) => l.value === selectedLanguage)?.label;
              return (
                <Accordion
                  key={note.id}
                  expanded={expanded}
                  onChange={() => setExpandedNote(expanded ? null : note.id)}
                  disableGutters
                  sx={{
                    backgroundColor: expanded ? 'rgba(144, 202, 249, 0.08)' : 'transparent',
                    boxShadow: 'none',
                    border: '1px solid rgba(144, 202, 249, 0.15)',
                    mb: 1,
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Bookmark fontSize="small" color="primary" />
                      {idx + 1}. {note.concept}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {note.isUser && editingNoteId === note.id ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <TextField
                          fullWidth
                          label="Concept Title"
                          value={editingConcept}
                          onChange={(e) => setEditingConcept(e.target.value)}
                          size="small"
                        />
                        <TextField
                          fullWidth
                          label="Concept Description"
                          value={editingDescription}
                          onChange={(e) => setEditingDescription(e.target.value)}
                          multiline
                          rows={2}
                          size="small"
                        />
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setEditingNoteId(null);
                              setEditingConcept('');
                              setEditingDescription('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleSaveEdit(note.personalIndex)}
                            disabled={!editingConcept.trim() || !editingDescription.trim()}
                          >
                            Save
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2" color="text.primary">
                          {note.description}
                        </Typography>
                        {describeConcept(note.concept, selectedLanguage) && (
                          <Typography variant="body2" color="text.secondary">
                            {describeConcept(note.concept, selectedLanguage)}
                          </Typography>
                        )}
                        {note.isUser && (
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleStartEdit(note.id, note.concept, note.description)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() => handleDeleteNote(note.personalIndex)}
                            >
                              Delete
                            </Button>
                          </Box>
                        )}
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedLanguageInfo?.icon}
            <Typography variant="h6">{selectedLanguageInfo?.label} Overview</Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => setDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            {selectedLanguageInfo?.description}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Key Concepts Covered:
          </Typography>
          <List dense>
            {languageNotes.base.slice(0, 5).map((note, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={`• ${note.concept}`} />
              </ListItem>
            ))}
            {languageNotes.base.length > 5 && (
              <ListItem>
                <ListItemText primary={`... and ${languageNotes.base.length - 5} more concepts`} />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setDialogOpen(false);
              // Scroll to add note section
              document.getElementById('add-note-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Add Your Note
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notes;