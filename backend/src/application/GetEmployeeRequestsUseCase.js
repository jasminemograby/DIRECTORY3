// Application Layer - Get Employee Requests Use Case
// Fetches employee requests

const EmployeeRepository = require('../infrastructure/EmployeeRepository');
const EmployeeRequestRepository = require('../infrastructure/EmployeeRequestRepository');

class GetEmployeeRequestsUseCase {
  constructor() {
    this.employeeRepository = new EmployeeRepository();
    this.requestRepository = new EmployeeRequestRepository();
  }

  /**
   * Get employee requests
   * @param {string} employeeId - Employee UUID
   * @param {string} companyId - Company UUID
   * @returns {Promise<Array>} Array of requests
   */
  async execute(employeeId, companyId) {
    try {
      // Get employee data
      const employee = await this.employeeRepository.findById(employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Check if employee belongs to the company
      if (String(employee.company_id) !== String(companyId)) {
        throw new Error('Employee does not belong to this company');
      }

      // Check if profile is approved (only approved employees can view requests)
      if (employee.profile_status !== 'approved') {
        throw new Error('Employee profile must be approved to view requests');
      }

      // Get requests
      const requests = await this.requestRepository.findByEmployeeId(employeeId);

      return {
        success: true,
        requests
      };
    } catch (error) {
      console.error('[GetEmployeeRequestsUseCase] Error:', error);
      throw error;
    }
  }
}

module.exports = GetEmployeeRequestsUseCase;

