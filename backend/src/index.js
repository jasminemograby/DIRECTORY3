const express = require('express');
const cors = require('cors');
const parseRequest = require('./shared/requestParser');
const formatResponse = require('./shared/responseFormatter');

// Controllers
const CompanyRegistrationController = require('./presentation/CompanyRegistrationController');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(parseRequest);
app.use(formatResponse);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Initialize controllers
const companyRegistrationController = new CompanyRegistrationController();

// API Routes
const apiRouter = express.Router();

// Company Registration
apiRouter.post('/companies/register', (req, res, next) => {
  companyRegistrationController.register(req, res, next);
});

app.use('/api/v1', apiRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    requester_service: 'directory_service',
    response: {
      error: 'Endpoint not found'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    requester_service: 'directory_service',
    response: {
      error: 'Internal server error'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

