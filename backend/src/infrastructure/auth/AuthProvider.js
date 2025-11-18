// Authentication Provider Abstraction
// This abstraction allows switching between dummy auth (testing) and real Auth Service (production)
// without changing application logic

const config = require('../../config');

/**
 * Authentication Provider Interface
 * All authentication logic goes through this abstraction
 */
class AuthProvider {
  /**
   * Authenticate a user (login)
   * @param {string} email - User email
   * @param {string} password - User password (optional in dummy mode)
   * @returns {Promise<{success: boolean, token?: string, user?: object, error?: string}>}
   */
  async authenticate(email, password) {
    throw new Error('authenticate() must be implemented by subclass');
  }

  /**
   * Validate a JWT token from incoming request
   * @param {string} token - JWT token
   * @returns {Promise<{valid: boolean, user?: object, error?: string}>}
   */
  async validateToken(token) {
    throw new Error('validateToken() must be implemented by subclass');
  }

  /**
   * Extract token from request headers
   * @param {object} headers - Request headers
   * @returns {string|null} - Extracted token or null
   */
  extractTokenFromHeaders(headers) {
    throw new Error('extractTokenFromHeaders() must be implemented by subclass');
  }

  /**
   * Get current authentication mode
   * @returns {string} - 'dummy' or 'auth-service'
   */
  getMode() {
    return config.auth.mode;
  }
}

module.exports = AuthProvider;

