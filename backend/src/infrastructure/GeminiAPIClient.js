// Infrastructure Layer - Gemini API Client
// Handles API calls to Google Gemini AI for profile enrichment

const axios = require('axios');
const config = require('../config');

class GeminiAPIClient {
  constructor() {
    this.apiKey = config.gemini?.apiKey || process.env.GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    
    if (!this.apiKey) {
      console.warn('[GeminiAPIClient] ⚠️  Gemini API key not configured.');
      console.warn('[GeminiAPIClient] To enable Gemini AI enrichment, set GEMINI_API_KEY in Railway.');
      console.warn('[GeminiAPIClient] See /docs/Gemini-Integration-Setup.md for setup instructions.');
    } else {
      console.log('[GeminiAPIClient] ✅ Gemini API key configured');
    }
  }

  /**
   * Generate professional bio from LinkedIn and GitHub data
   * @param {Object} linkedinData - LinkedIn profile data
   * @param {Object} githubData - GitHub profile data
   * @param {Object} employeeBasicInfo - Basic employee info (name, role, etc.)
   * @returns {Promise<string>} Generated bio
   */
  async generateBio(linkedinData, githubData, employeeBasicInfo) {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = this.buildBioPrompt(linkedinData, githubData, employeeBasicInfo);

    try {
      const response = await axios.post(
        `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const bio = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!bio) {
        throw new Error('No bio generated from Gemini API');
      }

      return bio;
    } catch (error) {
      console.error('[GeminiAPIClient] Error generating bio:', error.response?.data || error.message);
      throw new Error(`Failed to generate bio: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Generate project summaries for GitHub repositories
   * @param {Array} repositories - Array of GitHub repository objects
   * @returns {Promise<Array>} Array of project summaries with repository_name and summary
   */
  async generateProjectSummaries(repositories) {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    if (!repositories || repositories.length === 0) {
      return [];
    }

    const prompt = this.buildProjectSummariesPrompt(repositories);

    try {
      const response = await axios.post(
        `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const summariesText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!summariesText) {
        throw new Error('No project summaries generated from Gemini API');
      }

      // Parse the response (expecting JSON array)
      const summaries = this.parseProjectSummaries(summariesText, repositories);
      return summaries;
    } catch (error) {
      console.error('[GeminiAPIClient] Error generating project summaries:', error.response?.data || error.message);
      throw new Error(`Failed to generate project summaries: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Build prompt for bio generation
   */
  buildBioPrompt(linkedinData, githubData, employeeBasicInfo) {
    const name = employeeBasicInfo?.full_name || 'the employee';
    const role = employeeBasicInfo?.current_role_in_company || 'their role';
    const targetRole = employeeBasicInfo?.target_role_in_company || null;
    
    let context = `Generate a professional, concise bio (2-3 sentences) for ${name}, who works as ${role}`;
    if (targetRole && targetRole !== role) {
      context += ` with a goal to transition to ${targetRole}`;
    }
    context += `.\n\n`;
    
    if (linkedinData) {
      context += `LinkedIn Profile Information:\n`;
      if (linkedinData.name) context += `- Full Name: ${linkedinData.name}\n`;
      if (linkedinData.given_name) context += `- First Name: ${linkedinData.given_name}\n`;
      if (linkedinData.family_name) context += `- Last Name: ${linkedinData.family_name}\n`;
      if (linkedinData.email) context += `- Email: ${linkedinData.email}\n`;
      if (linkedinData.locale) context += `- Location: ${linkedinData.locale}\n`;
      // Include any additional LinkedIn data fields
      if (linkedinData.headline) context += `- Headline: ${linkedinData.headline}\n`;
      if (linkedinData.summary) context += `- Summary: ${linkedinData.summary}\n`;
      if (linkedinData.positions && linkedinData.positions.length > 0) {
        context += `- Work Experience: ${linkedinData.positions.length} position(s)\n`;
        linkedinData.positions.slice(0, 3).forEach((pos, idx) => {
          context += `  ${idx + 1}. ${pos.title || 'Position'} at ${pos.companyName || 'Company'}`;
          if (pos.description) context += ` - ${pos.description.substring(0, 100)}`;
          context += '\n';
        });
      }
      context += '\n';
    }
    
    if (githubData) {
      context += `GitHub Profile Information:\n`;
      if (githubData.name) context += `- Name: ${githubData.name}\n`;
      if (githubData.login) context += `- Username: ${githubData.login}\n`;
      if (githubData.bio) context += `- Bio: ${githubData.bio}\n`;
      if (githubData.company) context += `- Company: ${githubData.company}\n`;
      if (githubData.location) context += `- Location: ${githubData.location}\n`;
      if (githubData.blog) context += `- Website: ${githubData.blog}\n`;
      if (githubData.public_repos) context += `- Public Repositories: ${githubData.public_repos}\n`;
      if (githubData.followers) context += `- Followers: ${githubData.followers}\n`;
      if (githubData.following) context += `- Following: ${githubData.following}\n`;
      if (githubData.repositories && githubData.repositories.length > 0) {
        context += `- Total Repositories Fetched: ${githubData.repositories.length}\n`;
        // Include top repositories with languages
        const topRepos = githubData.repositories.slice(0, 5);
        context += `- Top Repositories:\n`;
        topRepos.forEach((repo, idx) => {
          context += `  ${idx + 1}. ${repo.name}`;
          if (repo.description) context += ` - ${repo.description}`;
          if (repo.language) context += ` (${repo.language})`;
          if (repo.stars) context += ` - ${repo.stars} stars`;
          context += '\n';
        });
      }
      context += '\n';
    }
    
    context += `Requirements:\n`;
    context += `- Write in third person\n`;
    context += `- Keep it professional and concise (2-3 sentences, max 200 words)\n`;
    context += `- Synthesize information from both LinkedIn and GitHub to create a comprehensive professional profile\n`;
    context += `- Highlight technical skills from GitHub repositories and professional experience from LinkedIn\n`;
    context += `- Focus on professional experience, technical expertise, and career goals\n`;
    context += `- Do not include personal information, contact details, or URLs\n`;
    context += `- Return only the bio text, no additional formatting, explanations, or markdown\n`;
    
    return context;
  }

  /**
   * Build prompt for project summaries generation
   */
  buildProjectSummariesPrompt(repositories) {
    let context = `Generate concise, professional project summaries (1-2 sentences each) for the following GitHub repositories.\n\n`;
    context += `Repositories:\n`;
    
    // Include more details about each repository
    repositories.slice(0, 20).forEach((repo, index) => {
      context += `${index + 1}. ${repo.name || repo.full_name || 'Repository'}`;
      if (repo.description) context += `\n   Description: ${repo.description}`;
      if (repo.language) context += `\n   Primary Language: ${repo.language}`;
      if (repo.stars) context += `\n   Stars: ${repo.stars}`;
      if (repo.forks) context += `\n   Forks: ${repo.forks}`;
      if (repo.url) context += `\n   URL: ${repo.url}`;
      if (repo.created_at) context += `\n   Created: ${repo.created_at}`;
      if (repo.updated_at) context += `\n   Last Updated: ${repo.updated_at}`;
      if (repo.is_fork) context += `\n   Note: This is a forked repository`;
      if (repo.is_private) context += `\n   Note: This is a private repository`;
      context += '\n\n';
    });
    
    context += `Requirements:\n`;
    context += `- Return a JSON array with objects containing "repository_name" and "summary" fields\n`;
    context += `- Each summary should be 1-2 sentences (max 150 words) describing what the project does, its purpose, and key technologies\n`;
    context += `- Focus on the business value, technical implementation, and technologies used\n`;
    context += `- Make summaries professional and suitable for a work profile\n`;
    context += `- For forked repositories, mention if it's a contribution to an existing project\n`;
    context += `- Return only valid JSON array, no markdown formatting, no code blocks, no explanations\n`;
    context += `- Example format: [{"repository_name": "project-name", "summary": "Brief professional description of the project's purpose and technologies..."}]\n`;
    
    return context;
  }

  /**
   * Parse project summaries from Gemini response
   */
  parseProjectSummaries(summariesText, repositories) {
    try {
      // Try to extract JSON from the response (might be wrapped in markdown)
      let jsonText = summariesText.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }
      
      // Try to parse as JSON
      const summaries = JSON.parse(jsonText);
      
      if (!Array.isArray(summaries)) {
        throw new Error('Response is not an array');
      }
      
      // Validate and map to repository names
      return summaries.map(item => ({
        repository_name: item.repository_name || item.name || '',
        repository_url: repositories.find(r => r.name === item.repository_name)?.url || null,
        summary: item.summary || item.description || ''
      })).filter(item => item.repository_name && item.summary);
    } catch (error) {
      console.warn('[GeminiAPIClient] Failed to parse JSON, creating summaries from repository data:', error.message);
      
      // Fallback: create basic summaries from repository data
      return repositories.slice(0, 20).map(repo => ({
        repository_name: repo.name,
        repository_url: repo.url,
        summary: repo.description || `A ${repo.language || 'software'} project${repo.is_fork ? ' (forked)' : ''}.`
      }));
    }
  }
}

module.exports = GeminiAPIClient;

