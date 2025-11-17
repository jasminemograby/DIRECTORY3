// Application Layer - Get Company Profile Use Case
// Retrieves company profile with hierarchy, employees, and metrics

const CompanyRepository = require('../infrastructure/CompanyRepository');
const DepartmentRepository = require('../infrastructure/DepartmentRepository');
const TeamRepository = require('../infrastructure/TeamRepository');
const EmployeeRepository = require('../infrastructure/EmployeeRepository');

class GetCompanyProfileUseCase {
  constructor() {
    this.companyRepository = new CompanyRepository();
    this.departmentRepository = new DepartmentRepository();
    this.teamRepository = new TeamRepository();
    this.employeeRepository = new EmployeeRepository();
  }

  /**
   * Get company profile with full organizational data
   * @param {string} companyId - Company ID
   * @returns {Promise<Object>} Company profile with departments, teams, employees, hierarchy, and metrics
   */
  async execute(companyId) {
    // Get company
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    // Get departments, teams, and employees
    const departments = await this.departmentRepository.findByCompanyId(companyId);
    const teams = await this.teamRepository.findByCompanyId(companyId);
    const employees = await this.employeeRepository.findByCompanyId(companyId);

    // Build organizational hierarchy
    const hierarchy = this.buildHierarchy(departments, teams, employees);

    // Calculate metrics
    const metrics = this.calculateMetrics(departments, teams, employees);

    return {
      company,
      departments,
      teams,
      employees,
      hierarchy,
      metrics
    };
  }

  /**
   * Build organizational hierarchy structure
   * @param {Array} departments - Departments
   * @param {Array} teams - Teams
   * @param {Array} employees - Employees
   * @returns {Object} Hierarchical structure
   */
  buildHierarchy(departments, teams, employees) {
    const hierarchy = {};

    departments.forEach(dept => {
      hierarchy[dept.id] = {
        department: dept,
        teams: []
      };
    });

    teams.forEach(team => {
      if (team.department_id && hierarchy[team.department_id]) {
        hierarchy[team.department_id].teams.push({
          team,
          employees: []
        });
      }
    });

    employees.forEach(employee => {
      // Find which team this employee belongs to
      if (employee.teams && employee.teams.length > 0) {
        const teamId = employee.teams[0].id;
        // Find the team in hierarchy
        for (const deptId in hierarchy) {
          const dept = hierarchy[deptId];
          const team = dept.teams.find(t => t.team.id === teamId);
          if (team) {
            team.employees.push(employee);
            break;
          }
        }
      }
    });

    return hierarchy;
  }

  /**
   * Calculate company metrics
   * @param {Array} departments - Departments
   * @param {Array} teams - Teams
   * @param {Array} employees - Employees
   * @returns {Object} Metrics object
   */
  calculateMetrics(departments, teams, employees) {
    const activeEmployees = employees.filter(emp => emp.status === 'active');
    const inactiveEmployees = employees.filter(emp => emp.status === 'inactive');

    return {
      totalEmployees: employees.length,
      activeEmployees: activeEmployees.length,
      inactiveEmployees: inactiveEmployees.length,
      totalDepartments: departments.length,
      totalTeams: teams.length
    };
  }
}

module.exports = GetCompanyProfileUseCase;

