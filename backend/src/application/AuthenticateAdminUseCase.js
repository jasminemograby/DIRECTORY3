// Application Layer - Authenticate Admin Use Case
// Handles admin authentication logic

const AdminRepository = require('../infrastructure/AdminRepository');
const config = require('../config');

class AuthenticateAdminUseCase {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  /**
   * Authenticate admin
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<Object>} Authentication result
   */
  async execute(email, password) {
    try {
      if (!email || !password) {
        return {
          success: false,
          error: 'Email and password are required'
        };
      }

      // Find admin by email
      const admin = await this.adminRepository.findByEmail(email);
      
      if (!admin) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Verify password
      const isPasswordValid = await this.adminRepository.verifyPassword(
        password,
        admin.password_hash
      );

      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Check if admin is active
      if (!admin.is_active) {
        return {
          success: false,
          error: 'Admin account is inactive'
        };
      }

      // Generate token (using dummy mode for now)
      const authMode = config.auth?.mode || 'dummy';
      let token;
      
      if (authMode === 'dummy') {
        token = `dummy-token-admin-${admin.id}-${admin.email}-${Date.now()}`;
      } else {
        // In real auth mode, token comes from AuthProvider
        token = null;
      }

      return {
        success: true,
        token: token,
        user: {
          id: admin.id,
          email: admin.email,
          fullName: admin.full_name,
          role: 'DIRECTORY_ADMIN',
          isAdmin: true,
          companyId: null // Admin is not tied to any company
        }
      };
    } catch (error) {
      console.error('[AuthenticateAdminUseCase] Error:', error);
      return {
        success: false,
        error: 'An error occurred during authentication'
      };
    }
  }
}

module.exports = AuthenticateAdminUseCase;

