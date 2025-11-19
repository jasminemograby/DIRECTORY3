// Application Layer - Get Employee Learning Path Use Case
// Fetches learning path from Learner AI for an employee

const EmployeeRepository = require('../infrastructure/EmployeeRepository');
const MicroserviceClient = require('../infrastructure/MicroserviceClient');

class GetEmployeeLearningPathUseCase {
  constructor() {
    this.employeeRepository = new EmployeeRepository();
    this.microserviceClient = new MicroserviceClient();
  }

  /**
   * Get employee learning path from Learner AI
   * @param {string} employeeId - Employee UUID
   * @param {string} companyId - Company UUID
   * @returns {Promise<Object>} Learning path data
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

      // Check if profile is approved (only approved employees can see learning path)
      if (employee.profile_status !== 'approved') {
        throw new Error('Employee profile must be approved to view learning path');
      }

      // Call Learner AI to get learning path
      const learningPathData = await this.microserviceClient.getLearningPath(
        employee.employee_id, // Use employee_id (string) not UUID
        employee.company_id.toString() // Company ID as string
      );

      return {
        success: true,
        learningPath: learningPathData
      };
    } catch (error) {
      console.error('[GetEmployeeLearningPathUseCase] Error:', error);
      throw error;
    }
  }
}

module.exports = GetEmployeeLearningPathUseCase;

