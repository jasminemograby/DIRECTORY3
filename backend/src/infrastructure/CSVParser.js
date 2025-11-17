// Infrastructure Layer - CSV Parser
// Parses CSV files and extracts company hierarchy and employee data

const csv = require('csv-parser');
const { Readable } = require('stream');

class CSVParser {
  /**
   * Parse CSV file buffer
   * @param {Buffer} fileBuffer - CSV file buffer
   * @returns {Promise<Array>} Parsed CSV rows
   */
  async parse(fileBuffer) {
    return new Promise((resolve, reject) => {
      const results = [];
      const stream = Readable.from(fileBuffer.toString());

      stream
        .pipe(csv())
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', () => {
          console.log(`[CSVParser] Parsed ${results.length} rows from CSV`);
          resolve(results);
        })
        .on('error', (error) => {
          console.error('[CSVParser] Error parsing CSV:', error);
          reject(new Error(`Failed to parse CSV file: ${error.message}`));
        });
    });
  }

  /**
   * Normalize CSV row data
   * @param {Object} row - Raw CSV row
   * @param {number} rowNumber - Row number (1-indexed, including header)
   * @returns {Object} Normalized row data
   */
  normalizeRow(row, rowNumber) {
    return {
      rowNumber,
      // Company data
      company_name: this.trimValue(row.company_name),
      industry: this.trimValue(row.industry),
      learning_path_approval: this.trimValue(row.learning_path_approval) || 'manual',
      primary_kpis: this.trimValue(row.primary_KPIs) || this.trimValue(row.primary_kpis),
      
      // Department data
      department_id: this.trimValue(row.department_id),
      department_name: this.trimValue(row.department_name),
      
      // Team data
      team_id: this.trimValue(row.team_id),
      team_name: this.trimValue(row.team_name),
      
      // Employee data
      employee_id: this.trimValue(row.employee_id),
      full_name: this.trimValue(row.full_name),
      email: this.trimValue(row.email),
      role_type: this.trimValue(row.role_type),
      current_role_in_company: this.trimValue(row.current_role_in_company),
      target_role_in_company: this.trimValue(row.target_role_in_company),
      manager_id: this.trimValue(row.manager_id),
      password: this.trimValue(row.password),
      preferred_language: this.trimValue(row.preferred_language),
      status: this.trimValue(row.status) || 'active',
      
      // Trainer-specific fields
      ai_enabled: this.parseBoolean(row.ai_enabled),
      public_publish_enable: this.parseBoolean(row.public_publish_enable)
    };
  }

  /**
   * Trim and clean string value
   * @param {string} value - Value to trim
   * @returns {string|null} Trimmed value or null if empty
   */
  trimValue(value) {
    if (value === undefined || value === null) {
      return null;
    }
    const trimmed = String(value).trim();
    return trimmed === '' ? null : trimmed;
  }

  /**
   * Parse boolean value from CSV
   * @param {string} value - Value to parse
   * @returns {boolean} Parsed boolean
   */
  parseBoolean(value) {
    if (value === undefined || value === null) {
      return false;
    }
    const str = String(value).trim().toUpperCase();
    return str === 'TRUE' || str === '1' || str === 'YES';
  }
}

module.exports = CSVParser;

