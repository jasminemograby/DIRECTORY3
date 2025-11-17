// Infrastructure Layer - CSV Validator
// Validates CSV data and identifies errors

class CSVValidator {
  /**
   * Validate parsed CSV data
   * @param {Array} rows - Parsed CSV rows
   * @param {string} companyId - Company ID (from registration)
   * @returns {Object} Validation result with errors and warnings
   */
  validate(rows, companyId) {
    const errors = [];
    const warnings = [];
    const validRows = [];

    if (!rows || rows.length === 0) {
      errors.push({
        type: 'empty_file',
        message: 'CSV file is empty or contains no data rows',
        row: null,
        column: null
      });
      return { errors, warnings, validRows, isValid: false };
    }

    // Track unique identifiers for duplicate detection
    const employeeIds = new Set();
    const departmentIds = new Set();
    const teamIds = new Set();
    const emails = new Set();

    rows.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because CSV is 1-indexed and has header row
      const rowErrors = [];
      const rowWarnings = [];

      // Validate mandatory employee fields
      if (!row.employee_id) {
        rowErrors.push({
          type: 'missing_field',
          message: 'employee_id is required',
          row: rowNumber,
          column: 'employee_id'
        });
      } else if (employeeIds.has(row.employee_id)) {
        rowErrors.push({
          type: 'duplicate_employee_id',
          message: `Duplicate employee_id: ${row.employee_id}`,
          row: rowNumber,
          column: 'employee_id'
        });
      } else {
        employeeIds.add(row.employee_id);
      }

      if (!row.full_name) {
        rowErrors.push({
          type: 'missing_field',
          message: 'full_name is required',
          row: rowNumber,
          column: 'full_name'
        });
      }

      if (!row.email) {
        rowErrors.push({
          type: 'missing_field',
          message: 'email is required',
          row: rowNumber,
          column: 'email'
        });
      } else if (!this.isValidEmail(row.email)) {
        rowErrors.push({
          type: 'invalid_format',
          message: `Invalid email format: ${row.email}`,
          row: rowNumber,
          column: 'email'
        });
      } else if (emails.has(row.email.toLowerCase())) {
        rowErrors.push({
          type: 'duplicate_email',
          message: `Duplicate email: ${row.email}`,
          row: rowNumber,
          column: 'email'
        });
      } else {
        emails.add(row.email.toLowerCase());
      }

      if (!row.role_type) {
        rowErrors.push({
          type: 'missing_field',
          message: 'role_type is required',
          row: rowNumber,
          column: 'role_type'
        });
      } else if (!this.isValidRoleType(row.role_type)) {
        rowErrors.push({
          type: 'invalid_format',
          message: `Invalid role_type: ${row.role_type}. Must be one of: REGULAR_EMPLOYEE, TRAINER, TEAM_MANAGER, DEPARTMENT_MANAGER, DECISION_MAKER, or combinations`,
          row: rowNumber,
          column: 'role_type'
        });
      }

      if (!row.department_id || !row.department_name) {
        rowErrors.push({
          type: 'missing_field',
          message: 'department_id and department_name are required',
          row: rowNumber,
          column: 'department_id/department_name'
        });
      }

      if (!row.team_id || !row.team_name) {
        rowErrors.push({
          type: 'missing_field',
          message: 'team_id and team_name are required',
          row: rowNumber,
          column: 'team_id/team_name'
        });
      }

      // Validate optional fields with warnings
      if (!row.manager_id) {
        rowWarnings.push({
          type: 'missing_optional_field',
          message: 'manager_id is missing (optional but recommended)',
          row: rowNumber,
          column: 'manager_id'
        });
      }

      if (!row.password) {
        rowWarnings.push({
          type: 'missing_optional_field',
          message: 'password is missing (will use default)',
          row: rowNumber,
          column: 'password'
        });
      }

      // Track department and team IDs
      if (row.department_id) {
        departmentIds.add(row.department_id);
      }
      if (row.team_id) {
        teamIds.add(row.team_id);
      }

      // If row has no errors, add to valid rows
      if (rowErrors.length === 0) {
        validRows.push({
          ...row,
          rowNumber
        });
      } else {
        errors.push(...rowErrors);
      }

      if (rowWarnings.length > 0) {
        warnings.push(...rowWarnings);
      }
    });

    // Validate manager_id references (check if manager exists in valid rows)
    const validEmployeeIds = new Set(validRows.map(r => r.employee_id));
    validRows.forEach(row => {
      if (row.manager_id && !validEmployeeIds.has(row.manager_id)) {
        warnings.push({
          type: 'invalid_manager_reference',
          message: `manager_id ${row.manager_id} does not exist in CSV`,
          row: row.rowNumber,
          column: 'manager_id'
        });
      }
    });

    return {
      errors,
      warnings,
      validRows,
      isValid: errors.length === 0,
      summary: {
        totalRows: rows.length,
        validRows: validRows.length,
        errorRows: errors.length,
        warningRows: warnings.length,
        uniqueDepartments: departmentIds.size,
        uniqueTeams: teamIds.size,
        uniqueEmployees: validRows.length
      }
    };
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  isValidEmail(email) {
    if (!email || typeof email !== 'string') {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Validate role type
   * @param {string} roleType - Role type to validate
   * @returns {boolean} True if valid
   */
  isValidRoleType(roleType) {
    if (!roleType || typeof roleType !== 'string') {
      return false;
    }

    const validRoles = [
      'REGULAR_EMPLOYEE',
      'TRAINER',
      'TEAM_MANAGER',
      'DEPARTMENT_MANAGER',
      'DECISION_MAKER'
    ];

    // Check if it's a single role
    if (validRoles.includes(roleType.trim())) {
      return true;
    }

    // Check if it's a combination (e.g., "REGULAR_EMPLOYEE + TEAM_MANAGER")
    const roles = roleType.split('+').map(r => r.trim());
    return roles.every(role => validRoles.includes(role));
  }
}

module.exports = CSVValidator;

