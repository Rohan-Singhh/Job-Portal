const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/error');

const app = express();

// Load environment variables
const port = process.env.PORT || 5000;
const dbURI = process.env.DB;

// Middleware
app.use(morgan('dev')); // Logging HTTP requests
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true })); // Adjust for specific client origins
app.use(bodyParser.json({ limit: '50mb' })); // Parse JSON payloads
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded payloads
app.use(cookieParser()); // Parse cookies
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Gzip compression for improved performance

// Rate limiting (e.g., 100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use(limiter); // Apply rate limiting middleware

// Database connection
mongoose
  .connect(process.env.DB) // Removed deprecated options
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.log('Database connection error:', err));


// Routes
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the server! The server is working on port 5000.');
});

// 404 Error for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Resource not found' });
});

// Error-handling middleware (MUST BE AFTER ROUTES)
app.use(errorHandler);

// Graceful shutdown (e.g., for Docker or Kubernetes)
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
