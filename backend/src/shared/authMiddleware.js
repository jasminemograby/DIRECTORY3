// Authentication Middleware
// Validates authentication tokens on protected routes
// Works with both dummy and real Auth Service modes

const AuthFactory = require('../infrastructure/auth/AuthFactory');

// Create auth provider instance (singleton pattern)
let authProvider = null;

/**
 * Get or create auth provider instance
 * @returns {AuthProvider}
 */
function getAuthProvider() {
  if (!authProvider) {
    authProvider = AuthFactory.create();
  }
  return authProvider;
}

/**
 * Authentication Middleware
 * Validates JWT token from request headers and attaches user to request
 * 
 * Usage:
 *   app.get('/protected-route', authMiddleware, (req, res) => {
 *     // req.user is available here
 *     res.json({ user: req.user });
 *   });
 */
const authMiddleware = async (req, res, next) => {
  try {
    const provider = getAuthProvider();
    const token = provider.extractTokenFromHeaders(req.headers);

    if (!token) {
      return res.status(401).json({
        requester_service: 'directory_service',
        response: {
          error: 'Authentication required. Please provide a valid token.'
        }
      });
    }

    // Validate token
    const validationResult = await provider.validateToken(token);

    if (!validationResult.valid) {
      return res.status(401).json({
        requester_service: 'directory_service',
        response: {
          error: validationResult.error || 'Invalid or expired token'
        }
      });
    }

    // Attach user to request
    req.user = validationResult.user;
    req.token = token;

    next();
  } catch (error) {
    console.error('[authMiddleware] Error:', error);
    return res.status(500).json({
      requester_service: 'directory_service',
      response: {
        error: 'Authentication error. Please try again.'
      }
    });
  }
};

/**
 * Optional Authentication Middleware
 * Validates token if present, but doesn't fail if missing
 * Useful for routes that work with or without authentication
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const provider = getAuthProvider();
    const token = provider.extractTokenFromHeaders(req.headers);

    if (token) {
      const validationResult = await provider.validateToken(token);
      if (validationResult.valid) {
        req.user = validationResult.user;
        req.token = token;
      }
    }

    next();
  } catch (error) {
    // Don't fail on optional auth errors, just continue
    console.warn('[optionalAuthMiddleware] Warning:', error.message);
    next();
  }
};

/**
 * HR-only Middleware
 * Ensures user is HR before allowing access
 * Must be used after authMiddleware
 */
const hrOnlyMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      requester_service: 'directory_service',
      response: {
        error: 'Authentication required'
      }
    });
  }

  if (!req.user.isHR) {
    return res.status(403).json({
      requester_service: 'directory_service',
      response: {
        error: 'Access denied. HR privileges required.'
      }
    });
  }

  next();
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  hrOnlyMiddleware
};

