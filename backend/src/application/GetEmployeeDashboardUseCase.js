// Application Layer - Get Employee Dashboard Use Case
// Fetches learning dashboard data from Learning Analytics for an employee

const EmployeeRepository = require('../infrastructure/EmployeeRepository');
const MicroserviceClient = require('../infrastructure/MicroserviceClient');

class GetEmployeeDashboardUseCase {
  constructor() {
    this.employeeRepository = new EmployeeRepository();
    this.microserviceClient = new MicroserviceClient();
  }

  /**
   * Get employee learning dashboard from Learning Analytics
   * @param {string} employeeId - Employee UUID
   * @param {string} companyId - Company UUID
   * @returns {Promise<Object>} Dashboard data
   */
  async execute(employeeId, companyId) {
    try {
      // Get employee data
      const employee = await this.employeeRepository.findById(employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Check if employee belongs to the company (compare as strings for UUID)
      if (String(employee.company_id) !== String(companyId)) {
        throw new Error('Employee does not belong to this company');
      }

      // Check if profile is approved (only approved employees can see dashboard)
      if (employee.profile_status !== 'approved') {
        throw new Error('Employee profile must be approved to view dashboard');
      }

      // Call Learning Analytics to get dashboard data
      const dashboardData = await this.microserviceClient.getLearningDashboard(
        employee.employee_id, // Use employee_id (string) not UUID
        employee.company_id.toString() // Company ID as string
      );

      return {
        success: true,
        dashboard: dashboardData
      };
    } catch (error) {
      console.error('[GetEmployeeDashboardUseCase] Error:', error);
      throw error;
    }
  }
}

module.exports = GetEmployeeDashboardUseCase;

