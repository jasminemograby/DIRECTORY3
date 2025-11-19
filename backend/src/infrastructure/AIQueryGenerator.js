// Infrastructure Layer - AI Query Generator
// Uses Gemini AI to generate SQL queries based on payload and response structure

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const config = require('../config');

class AIQueryGenerator {
  constructor() {
    this.apiKey = config.gemini?.apiKey;
    if (!this.apiKey) {
      console.warn('[AIQueryGenerator] ⚠️  GEMINI_API_KEY not configured. AI query generation will be disabled.');
      this.genAI = null;
    } else {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        console.log('[AIQueryGenerator] ✅ Initialized with Gemini API');
      } catch (error) {
        console.error('[AIQueryGenerator] ❌ Failed to initialize Gemini:', error);
        this.genAI = null;
      }
    }
  }

  /**
   * Load migration files to provide schema context to AI
   * @returns {string} Migration file content
   */
  loadMigrationFiles() {
    try {
      const migrationPath = path.join(__dirname, '../../database/migrations/001_initial_schema.sql');
      const migrationContent = fs.readFileSync(migrationPath, 'utf8');
      return migrationContent;
    } catch (error) {
      console.error('[AIQueryGenerator] Error loading migration files:', error);
      return '';
    }
  }

  /**
   * Generate SQL query using AI based on payload and response structure
   * @param {Object} payload - Request payload from microservice
   * @param {Object} responseTemplate - Response template structure
   * @param {string} requesterService - Name of the requesting microservice
   * @returns {Promise<string>} Generated SQL query
   */
  async generateQuery(payload, responseTemplate, requesterService) {
    if (!this.genAI) {
      throw new Error('AI query generation is not available. GEMINI_API_KEY is not configured.');
    }

    try {
      const migrationContent = this.loadMigrationFiles();
      
      // Build prompt for AI
      const prompt = this.buildPrompt(payload, responseTemplate, requesterService, migrationContent);

      // Get model
      const model = this.genAI.getModel('gemini-1.5-flash'); // Using flash for faster responses

      // Generate query
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();

      // Extract SQL query from response (AI might add explanations)
      const sqlQuery = this.extractSQL(generatedText);

      console.log('[AIQueryGenerator] ✅ Generated SQL query:', sqlQuery.substring(0, 200) + '...');
      return sqlQuery;

    } catch (error) {
      console.error('[AIQueryGenerator] Error generating query:', error);
      throw new Error(`Failed to generate SQL query: ${error.message}`);
    }
  }

  /**
   * Build prompt for AI query generation
   * @param {Object} payload - Request payload
   * @param {Object} responseTemplate - Response template
   * @param {string} requesterService - Requester service name
   * @param {string} migrationContent - Database schema
   * @returns {string} Prompt text
   */
  buildPrompt(payload, responseTemplate, requesterService, migrationContent) {
    return `You are a SQL query generator for a PostgreSQL database. Your task is to generate a valid SQL query that will fill the response template based on the provided payload.

DATABASE SCHEMA:
${migrationContent}

REQUESTER SERVICE: ${requesterService}

PAYLOAD (input data):
${JSON.stringify(payload, null, 2)}

RESPONSE TEMPLATE (structure to fill):
${JSON.stringify(responseTemplate, null, 2)}

INSTRUCTIONS:
1. Analyze the payload to understand what data is being requested
2. Look at the response template to understand what fields need to be filled
3. Generate a PostgreSQL SELECT query that retrieves the necessary data
4. Map database columns to response template fields (e.g., user_id → employee_id, company_id → company_id)
5. Handle schema matching: Directory uses "employee_id" and "company_id", but other services might use "user_id" or "company_id"
6. If the payload contains filters (e.g., employee_id, company_id), use them in WHERE clauses
7. Return ONLY the SQL query, no explanations, no markdown formatting, just the raw SQL

IMPORTANT RULES:
- Use proper JOINs when needed (employees, companies, departments, teams, employee_roles, etc.)
- Use parameterized queries with $1, $2, etc. for values from payload
- Handle NULL values appropriately
- Use proper data types (UUID, VARCHAR, TEXT, JSONB, etc.)
- Return the query as a single line or properly formatted SQL

Generate the SQL query now:`;
  }

  /**
   * Extract SQL query from AI response (removes markdown, explanations, etc.)
   * @param {string} aiResponse - Raw AI response
   * @returns {string} Clean SQL query
   */
  extractSQL(aiResponse) {
    // Remove markdown code blocks
    let sql = aiResponse.replace(/```sql\n?/gi, '').replace(/```\n?/g, '');
    
    // Remove explanations before/after query
    const sqlMatch = sql.match(/(SELECT.*?;)/is);
    if (sqlMatch) {
      sql = sqlMatch[1];
    }

    // Clean up whitespace
    sql = sql.trim();

    // If no semicolon, add one
    if (!sql.endsWith(';')) {
      sql += ';';
    }

    return sql;
  }

  /**
   * Validate generated SQL query for safety
   * @param {string} sql - SQL query to validate
   * @returns {boolean} True if valid
   */
  validateSQL(sql) {
    // Basic validation - prevent dangerous operations
    const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE'];
    const upperSQL = sql.toUpperCase();
    
    for (const keyword of dangerousKeywords) {
      if (upperSQL.includes(keyword)) {
        console.error(`[AIQueryGenerator] ⚠️  Dangerous keyword detected: ${keyword}`);
        return false;
      }
    }

    // Must be a SELECT query
    if (!upperSQL.trim().startsWith('SELECT')) {
      console.error('[AIQueryGenerator] ⚠️  Query must start with SELECT');
      return false;
    }

    return true;
  }
}

module.exports = AIQueryGenerator;

