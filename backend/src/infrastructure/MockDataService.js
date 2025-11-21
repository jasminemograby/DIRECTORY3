// Infrastructure Layer - Mock Data Service
// Provides fallback mock data when external APIs fail

const path = require('path');
const fs = require('fs');

class MockDataService {
  constructor() {
    // Load mock data (will be created if it doesn't exist)
    try {
      // Try multiple possible paths
      const possiblePaths = [
        path.join(__dirname, '../../mockData/index.json'),
        path.join(process.cwd(), 'mockData/index.json'),
        path.join(process.cwd(), '../mockData/index.json')
      ];
      
      let mockDataLoaded = false;
      for (const mockPath of possiblePaths) {
        if (fs.existsSync(mockPath)) {
          this.mockData = require(mockPath);
          mockDataLoaded = true;
          break;
        }
      }
      
      if (!mockDataLoaded) {
        console.warn('[MockDataService] Mock data file not found in any expected location');
        console.warn('[MockDataService] Tried paths:', possiblePaths);
        this.mockData = {};
      } else {
        console.log('[MockDataService] ✅ Mock data file loaded successfully');
        console.log('[MockDataService] Available microservices:', Object.keys(this.mockData));
      }
    } catch (error) {
      console.warn('[MockDataService] Error loading mock data file:', error.message);
      console.warn('[MockDataService] Using empty mock data object');
      this.mockData = {};
    }
  }

  /**
   * Get mock bio for an employee
   * @param {Object} employeeBasicInfo - Basic employee info
   * @returns {string} Mock bio
   */
  getMockBio(employeeBasicInfo) {
    const name = employeeBasicInfo?.full_name || 'Employee';
    const role = employeeBasicInfo?.current_role_in_company || 'professional';
    
    // Try to get from mock data file
    if (this.mockData?.gemini?.bio) {
      return this.mockData.gemini.bio
        .replace('{{name}}', name)
        .replace('{{role}}', role);
    }

    // Default mock bio
    return `${name} is a ${role} with expertise in software development and technology. They bring valuable experience and skills to their team, contributing to innovative projects and solutions.`;
  }

  /**
   * Get mock project summaries for repositories
   * @param {Array} repositories - Array of repository objects
   * @returns {Array} Array of project summaries
   */
  getMockProjectSummaries(repositories) {
    if (!repositories || repositories.length === 0) {
      return [];
    }

    // Try to get from mock data file
    if (this.mockData?.gemini?.project_summaries) {
      return this.mockData.gemini.project_summaries.slice(0, repositories.length);
    }

    // Generate default mock summaries from repository data
    return repositories.slice(0, 20).map(repo => ({
      repository_name: repo.name,
      repository_url: repo.url,
      summary: repo.description || 
        `A ${repo.language || 'software'} project${repo.is_fork ? ' (forked)' : ''} that demonstrates technical skills and development experience.`
    }));
  }

  /**
   * Get mock data for a specific microservice and operation
   * @param {string} microservice - Microservice name (e.g., 'skills-engine')
   * @param {string} operation - Operation name (e.g., 'normalize-skills')
   * @returns {Object|null} Mock data or null if not found
   */
  getMockData(microservice, operation) {
    console.log(`[MockDataService] Looking for mock data: ${microservice}/${operation}`);
    console.log(`[MockDataService] Available microservices:`, Object.keys(this.mockData || {}));
    
    if (!this.mockData || !this.mockData[microservice]) {
      console.warn(`[MockDataService] Microservice '${microservice}' not found in mock data`);
      return null;
    }
    
    if (!this.mockData[microservice][operation]) {
      console.warn(`[MockDataService] Operation '${operation}' not found for microservice '${microservice}'`);
      console.log(`[MockDataService] Available operations for ${microservice}:`, Object.keys(this.mockData[microservice]));
      return null;
    }
    
    console.log(`[MockDataService] ✅ Found mock data for ${microservice}/${operation}`);
    return this.mockData[microservice][operation];
  }
}

module.exports = MockDataService;

