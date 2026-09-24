require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const generationRoutes = require('./routes/generation');
const workflowRoutes = require('./routes/workflows');
const rulesRoutes = require('./routes/rules');
const userStoriesRoutes = require('./routes/userStories');
const testcasesRoutes = require('./routes/testcases');
const exportRoutes = require('./routes/export');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')));

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/generation', generationRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/rules', rulesRoutes);
app.use('/api/user-stories', userStoriesRoutes);
app.use('/api/test-cases', testcasesRoutes);
app.use('/api/export', exportRoutes);

// 404
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler — must be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`MELO server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// GPT-4o can take 30–60 s for large prompts; default Node HTTP timeout is 5 s
server.timeout = 120000; // 2 minutes

module.exports = app;
