// Infrastructure Layer - LinkedIn API Client
// Fetches profile data from LinkedIn API

const axios = require('axios');

class LinkedInAPIClient {
  constructor() {
    // LinkedIn API v2 endpoints
    this.baseUrl = 'https://api.linkedin.com/v2';
    
    // Profile fields we need for enrichment
    // Using OpenID Connect userinfo endpoint for basic info
    this.userInfoUrl = 'https://api.linkedin.com/v2/userinfo';
    
    // Legacy profile endpoint (if needed)
    this.profileUrl = 'https://api.linkedin.com/v2/me';
    
    // Email endpoint
    this.emailUrl = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';
  }

  /**
   * Fetch user profile information using OpenID Connect
   * @param {string} accessToken - LinkedIn access token
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile(accessToken) {
    try {
      // Use OpenID Connect userinfo endpoint (recommended)
      // This endpoint returns email if 'email' scope is granted
      const response = await axios.get(this.userInfoUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      const profileData = {
        id: response.data.sub,
        name: response.data.name,
        given_name: response.data.given_name,
        family_name: response.data.family_name,
        email: response.data.email || null, // Email from userinfo (if 'email' scope granted)
        picture: response.data.picture,
        locale: response.data.locale,
        email_verified: response.data.email_verified || false
      };

      // Log if email is present from userinfo endpoint
      if (profileData.email) {
        console.log('[LinkedInAPIClient] ✅ Email retrieved from OpenID Connect userinfo endpoint');
      } else {
        console.log('[LinkedInAPIClient] ⚠️  Email not in userinfo response (may need separate email endpoint)');
      }

      return profileData;
    } catch (error) {
      console.error('[LinkedInAPIClient] Error fetching user profile:', error.response?.data || error.message);
      
      // Fallback to legacy endpoint if OpenID Connect fails
      if (error.response?.status === 404 || error.response?.status === 403) {
        console.warn('[LinkedInAPIClient] OpenID Connect endpoint failed, trying legacy endpoint');
        return await this.getLegacyProfile(accessToken);
      }
      
      throw new Error(`Failed to fetch LinkedIn profile: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Fetch user profile using legacy LinkedIn API endpoint
   * @param {string} accessToken - LinkedIn access token
   * @returns {Promise<Object>} User profile data
   */
  async getLegacyProfile(accessToken) {
    try {
      const response = await axios.get(this.profileUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      return {
        id: response.data.id,
        firstName: response.data.firstName?.localized?.en_US || response.data.firstName,
        lastName: response.data.lastName?.localized?.en_US || response.data.lastName,
        profilePicture: response.data.profilePicture?.displayImage || null
      };
    } catch (error) {
      console.error('[LinkedInAPIClient] Error fetching legacy profile:', error.response?.data || error.message);
      throw new Error(`Failed to fetch LinkedIn profile: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Fetch user email address using legacy LinkedIn API v2 endpoint
   * NOTE: This endpoint requires the 'emailAddress' product to be approved in LinkedIn Developer Portal
   * If not approved, this will fail with 403. The email from OpenID Connect userinfo should be used instead.
   * @param {string} accessToken - LinkedIn access token
   * @returns {Promise<string|null>} Email address or null
   */
  async getUserEmail(accessToken) {
    try {
      const response = await axios.get(this.emailUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      // Extract email from response
      if (response.data?.elements && response.data.elements.length > 0) {
        const emailElement = response.data.elements[0];
        const email = emailElement['handle~']?.emailAddress || null;
        if (email) {
          console.log('[LinkedInAPIClient] ✅ Email retrieved from legacy email endpoint');
        }
        return email;
      }
      
      return null;
    } catch (error) {
      // This is expected if 'emailAddress' product is not approved in LinkedIn Developer Portal
      // The email should already be available from OpenID Connect userinfo endpoint if 'email' scope is granted
      if (error.response?.status === 403) {
        console.warn('[LinkedInAPIClient] ⚠️  Email endpoint requires "emailAddress" product approval in LinkedIn Developer Portal');
        console.warn('[LinkedInAPIClient] ⚠️  This is OK - email should be available from OpenID Connect userinfo endpoint');
      } else {
        console.warn('[LinkedInAPIClient] Could not fetch email from legacy endpoint:', error.response?.data || error.message);
      }
      return null; // Email is optional, don't fail if we can't get it
    }
  }

  /**
   * Fetch complete LinkedIn profile data (profile + email)
   * @param {string} accessToken - LinkedIn access token
   * @returns {Promise<Object>} Complete profile data
   */
  async getCompleteProfile(accessToken) {
    // First, get profile from OpenID Connect userinfo (includes email if 'email' scope granted)
    const profile = await this.getUserProfile(accessToken);
    
    // Only try legacy email endpoint if email is not already in profile
    // This avoids unnecessary API calls and 403 errors
    let email = profile.email;
    if (!email) {
      console.log('[LinkedInAPIClient] Email not in userinfo, trying legacy email endpoint...');
      email = await this.getUserEmail(accessToken);
    } else {
      console.log('[LinkedInAPIClient] ✅ Email already available from userinfo, skipping legacy email endpoint');
    }

    // Ensure picture field is properly extracted
    const pictureUrl = profile.picture 
      || profile.profilePicture?.displayImage 
      || (typeof profile.profilePicture === 'string' ? profile.profilePicture : null)
      || profile.profilePicture?.url
      || null;

    const completeProfile = {
      ...profile,
      picture: pictureUrl, // Normalize to 'picture' field for consistent access
      email: email || null, // Use email from userinfo (preferred) or legacy endpoint (fallback)
      fetched_at: new Date().toISOString()
    };

    if (completeProfile.email) {
      console.log('[LinkedInAPIClient] ✅ Complete profile fetched with email');
    } else {
      console.warn('[LinkedInAPIClient] ⚠️  Complete profile fetched but email is missing');
    }

    return completeProfile;
  }
}

module.exports = LinkedInAPIClient;

