// Application Layer - Get Employee Courses Use Case
// Fetches courses from Course Builder for an employee

const EmployeeRepository = require('../infrastructure/EmployeeRepository');
const MicroserviceClient = require('../infrastructure/MicroserviceClient');

class GetEmployeeCoursesUseCase {
  constructor() {
    this.employeeRepository = new EmployeeRepository();
    this.microserviceClient = new MicroserviceClient();
  }

  /**
   * Get employee courses from Course Builder
   * @param {string} employeeId - Employee UUID
   * @param {string} companyId - Company UUID
   * @returns {Promise<Object>} Courses data
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

      // Check if profile is approved (only approved employees can see courses)
      if (employee.profile_status !== 'approved') {
        throw new Error('Employee profile must be approved to view courses');
      }

      // Call Course Builder to get courses
      const coursesData = await this.microserviceClient.getEmployeeCourses(
        employee.employee_id, // Use employee_id (string) not UUID
        employee.company_id.toString() // Company ID as string
      );

      return {
        success: true,
        courses: coursesData
      };
    } catch (error) {
      console.error('[GetEmployeeCoursesUseCase] Error:', error);
      throw error;
    }
  }
}

module.exports = GetEmployeeCoursesUseCase;

