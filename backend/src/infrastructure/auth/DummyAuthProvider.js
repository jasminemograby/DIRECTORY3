// Dummy Authentication Provider
// FOR TESTING ONLY - NOT SECURE - DO NOT USE IN PRODUCTION
// This provider allows testing Directory functionality without real authentication

const AuthProvider = require('./AuthProvider');
const config = require('../../config');

/**
 * Dummy Authentication Provider
 * 
 * ⚠️ WARNING: This is for local testing only!
 * - No real authentication
 * - No real JWT validation
 * - Returns fake user sessions
 * - NOT SECURE - DO NOT USE IN PRODUCTION
 */
class DummyAuthProvider extends AuthProvider {
  constructor() {
    super();
    this.testUsers = config.auth.dummy.testUsers;
  }

  /**
   * Authenticate a user (dummy - always succeeds if email exists in test users)
   * @param {string} email - User email
   * @param {string} password - User password (ignored in dummy mode)
   * @returns {Promise<{success: boolean, token?: string, user?: object, error?: string}>}
   */
  async authenticate(email, password) {
    // In dummy mode, we just check if email exists in test users
    // Password is ignored
    const user = this.testUsers[email.toLowerCase()];
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid email. Use one of the test emails: ' + Object.keys(this.testUsers).join(', ')
      };
    }

    // Generate a dummy token (just a simple string, not a real JWT)
    const dummyToken = `dummy-token-${email}-${Date.now()}`;

    return {
      success: true,
      token: dummyToken,
      user: {
        email: email.toLowerCase(),
        employeeId: user.employeeId,
        companyId: user.companyId,
        isHR: user.isHR,
        fullName: user.fullName
      }
    };
  }

  /**
   * Validate a token (dummy - always succeeds if token format is correct)
   * @param {string} token - Dummy token
   * @returns {Promise<{valid: boolean, user?: object, error?: string}>}
   */
  async validateToken(token) {
    // In dummy mode, we just check if token starts with "dummy-token-"
    // This is NOT secure - just for testing
    if (!token || !token.startsWith('dummy-token-')) {
      return {
        valid: false,
        error: 'Invalid token format'
      };
    }

    // Extract email from dummy token (format: dummy-token-{email}-{timestamp})
    const parts = token.split('-');
    if (parts.length < 3) {
      return {
        valid: false,
        error: 'Invalid token format'
      };
    }

    // Reconstruct email (everything between "dummy-token-" and last part)
    const email = parts.slice(2, -1).join('-');
    const user = this.testUsers[email.toLowerCase()];

    if (!user) {
      return {
        valid: false,
        error: 'User not found in test users'
      };
    }

    return {
      valid: true,
      user: {
        email: email.toLowerCase(),
        employeeId: user.employeeId,
        companyId: user.companyId,
        isHR: user.isHR,
        fullName: user.fullName
      }
    };
  }

  /**
   * Extract token from request headers (dummy mode)
   * @param {object} headers - Request headers
   * @returns {string|null} - Extracted token or null
   */
  extractTokenFromHeaders(headers) {
    // In dummy mode, check for Authorization header or custom header
    const authHeader = headers.authorization || headers.Authorization;
    
    if (authHeader) {
      // Remove "Bearer " prefix if present
      return authHeader.replace(/^Bearer\s+/i, '').trim();
    }

    // Also check for custom header (for testing)
    const customHeader = headers['x-dummy-token'] || headers['X-Dummy-Token'];
    if (customHeader) {
      return customHeader;
    }

    return null;
  }
}

module.exports = DummyAuthProvider;

