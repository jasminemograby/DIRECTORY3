// Real Auth Service Provider
// This provider integrates with the real Auth Service for production use
// When AUTH_MODE=auth-service, this provider is used

const AuthProvider = require('./AuthProvider');
const config = require('../../config');
const axios = require('axios');
const jwt = require('jsonwebtoken');

/**
 * Real Auth Service Provider
 * 
 * This provider integrates with the Auth Service microservice:
 * - Sends login requests to Auth Service
 * - Receives real JWTs from Auth Service
 * - Validates incoming JWTs
 * - Extracts user information from JWTs
 */
class AuthServiceProvider extends AuthProvider {
  constructor() {
    super();
    this.authServiceUrl = config.auth.authService.baseUrl;
    this.loginEndpoint = config.auth.authService.loginEndpoint;
    this.validateEndpoint = config.auth.authService.validateEndpoint;
    this.jwtSecret = config.auth.authService.jwtSecret;
    this.jwtHeaderName = config.auth.authService.jwtHeaderName;
    this.jwtTokenPrefix = config.auth.authService.jwtTokenPrefix;
  }

  /**
   * Authenticate a user via Auth Service
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{success: boolean, token?: string, user?: object, error?: string}>}
   */
  async authenticate(email, password) {
    try {
      // Send login request to Auth Service
      const response = await axios.post(
        `${this.authServiceUrl}${this.loginEndpoint}`,
        {
          email,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (response.data && response.data.token) {
        // Decode JWT to get user information (without verification - Auth Service already verified)
        const decoded = jwt.decode(response.data.token);
        
        return {
          success: true,
          token: response.data.token,
          user: {
            email: decoded.email || email,
            employeeId: decoded.employeeId || decoded.user_id,
            companyId: decoded.companyId || decoded.company_id,
            isHR: decoded.isHR || decoded.is_hr || false,
            fullName: decoded.fullName || decoded.full_name || decoded.name
          }
        };
      }

      return {
        success: false,
        error: 'Auth Service did not return a token'
      };
    } catch (error) {
      console.error('[AuthServiceProvider] Authentication error:', error.message);
      
      if (error.response) {
        // Auth Service returned an error
        return {
          success: false,
          error: error.response.data?.message || error.response.data?.error || 'Authentication failed'
        };
      }

      // Network or other error
      return {
        success: false,
        error: 'Failed to connect to Auth Service. Please try again later.'
      };
    }
  }

  /**
   * Validate a JWT token
   * @param {string} token - JWT token
   * @returns {Promise<{valid: boolean, user?: object, error?: string}>}
   */
  async validateToken(token) {
    try {
      // Option 1: Validate JWT locally using secret
      if (this.jwtSecret) {
        try {
          const decoded = jwt.verify(token, this.jwtSecret);
          
          return {
            valid: true,
            user: {
              email: decoded.email,
              employeeId: decoded.employeeId || decoded.user_id,
              companyId: decoded.companyId || decoded.company_id,
              isHR: decoded.isHR || decoded.is_hr || false,
              fullName: decoded.fullName || decoded.full_name || decoded.name
            }
          };
        } catch (jwtError) {
          return {
            valid: false,
            error: 'Invalid or expired token'
          };
        }
      }

      // Option 2: Validate via Auth Service endpoint (if no secret provided)
      const response = await axios.post(
        `${this.authServiceUrl}${this.validateEndpoint}`,
        { token },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000 // 5 second timeout
        }
      );

      if (response.data && response.data.valid) {
        return {
          valid: true,
          user: response.data.user
        };
      }

      return {
        valid: false,
        error: response.data?.error || 'Token validation failed'
      };
    } catch (error) {
      console.error('[AuthServiceProvider] Token validation error:', error.message);
      
      return {
        valid: false,
        error: 'Failed to validate token'
      };
    }
  }

  /**
   * Extract token from request headers
   * @param {object} headers - Request headers
   * @returns {string|null} - Extracted token or null
   */
  extractTokenFromHeaders(headers) {
    // Get header name (default: 'Authorization')
    const headerName = this.jwtHeaderName.toLowerCase();
    const headerValue = headers[headerName] || headers[this.jwtHeaderName];

    if (!headerValue) {
      return null;
    }

    // Remove token prefix (default: 'Bearer ')
    const prefix = this.jwtTokenPrefix.trim() + ' ';
    if (headerValue.startsWith(prefix)) {
      return headerValue.substring(prefix.length).trim();
    }

    // If no prefix, return as-is
    return headerValue.trim();
  }
}

module.exports = AuthServiceProvider;

