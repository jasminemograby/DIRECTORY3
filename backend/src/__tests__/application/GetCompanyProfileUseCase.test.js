// Tests for GetCompanyProfileUseCase (TDD - RED PHASE)
// Write failing tests first, then implement to make them pass

const GetCompanyProfileUseCase = require('../../application/GetCompanyProfileUseCase');

// Mock dependencies
jest.mock('../../infrastructure/CompanyRepository');
jest.mock('../../infrastructure/DepartmentRepository');
jest.mock('../../infrastructure/TeamRepository');
jest.mock('../../infrastructure/EmployeeRepository');

describe('GetCompanyProfileUseCase', () => {
  let useCase;
  let mockCompanyRepository;
  let mockDepartmentRepository;
  let mockTeamRepository;
  let mockEmployeeRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new GetCompanyProfileUseCase();
    mockCompanyRepository = useCase.companyRepository;
    mockDepartmentRepository = useCase.departmentRepository;
    mockTeamRepository = useCase.teamRepository;
    mockEmployeeRepository = useCase.employeeRepository;
  });

  describe('execute', () => {
    test('should throw error if company not found', async () => {
      mockCompanyRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('non-existent-id')).rejects.toThrow('Company not found');
    });

    test('should return company profile with departments, teams, and employees', async () => {
      const companyId = 'company-123';
      const mockCompany = {
        id: companyId,
        company_name: 'Test Company',
        industry: 'Tech',
        domain: 'test.com',
        verification_status: 'approved'
      };

      const mockDepartments = [
        { id: 'dept-1', department_id: '101', department_name: 'Engineering' },
        { id: 'dept-2', department_id: '102', department_name: 'Sales' }
      ];

      const mockTeams = [
        { id: 'team-1', team_id: '201', team_name: 'Backend Team', department_id: 'dept-1' },
        { id: 'team-2', team_id: '202', team_name: 'Frontend Team', department_id: 'dept-1' }
      ];

      const mockEmployees = [
        { id: 'emp-1', employee_id: '1', full_name: 'John Doe', email: 'john@test.com' },
        { id: 'emp-2', employee_id: '2', full_name: 'Jane Smith', email: 'jane@test.com' }
      ];

      mockCompanyRepository.findById.mockResolvedValue(mockCompany);
      mockDepartmentRepository.findByCompanyId = jest.fn().mockResolvedValue(mockDepartments);
      mockTeamRepository.findByCompanyId = jest.fn().mockResolvedValue(mockTeams);
      mockEmployeeRepository.findByCompanyId = jest.fn().mockResolvedValue(mockEmployees);

      const result = await useCase.execute(companyId);

      expect(mockCompanyRepository.findById).toHaveBeenCalledWith(companyId);
      expect(result).toHaveProperty('company');
      expect(result).toHaveProperty('departments');
      expect(result).toHaveProperty('teams');
      expect(result).toHaveProperty('employees');
      expect(result.departments).toHaveLength(2);
      expect(result.teams).toHaveLength(2);
      expect(result.employees).toHaveLength(2);
    });

    test('should build organizational hierarchy', async () => {
      const companyId = 'company-123';
      const mockCompany = { id: companyId, company_name: 'Test Company' };
      const mockDepartments = [
        { id: 'dept-1', department_id: '101', department_name: 'Engineering' }
      ];
      const mockTeams = [
        { id: 'team-1', team_id: '201', team_name: 'Backend', department_id: 'dept-1' }
      ];
      const mockEmployees = [
        { id: 'emp-1', employee_id: '1', full_name: 'John', team_id: 'team-1' }
      ];

      mockCompanyRepository.findById.mockResolvedValue(mockCompany);
      mockDepartmentRepository.findByCompanyId = jest.fn().mockResolvedValue(mockDepartments);
      mockTeamRepository.findByCompanyId = jest.fn().mockResolvedValue(mockTeams);
      mockEmployeeRepository.findByCompanyId = jest.fn().mockResolvedValue(mockEmployees);

      const result = await useCase.execute(companyId);

      expect(result).toHaveProperty('hierarchy');
      expect(result.hierarchy).toBeDefined();
    });

    test('should calculate company metrics', async () => {
      const companyId = 'company-123';
      const mockCompany = { id: companyId, company_name: 'Test Company' };
      const mockDepartments = [{ id: 'dept-1', department_id: '101', department_name: 'Engineering' }];
      const mockTeams = [{ id: 'team-1', team_id: '201', team_name: 'Backend', department_id: 'dept-1' }];
      const mockEmployees = [
        { id: 'emp-1', employee_id: '1', full_name: 'John', status: 'active' },
        { id: 'emp-2', employee_id: '2', full_name: 'Jane', status: 'active' }
      ];

      mockCompanyRepository.findById.mockResolvedValue(mockCompany);
      mockDepartmentRepository.findByCompanyId = jest.fn().mockResolvedValue(mockDepartments);
      mockTeamRepository.findByCompanyId = jest.fn().mockResolvedValue(mockTeams);
      mockEmployeeRepository.findByCompanyId = jest.fn().mockResolvedValue(mockEmployees);

      const result = await useCase.execute(companyId);

      expect(result).toHaveProperty('metrics');
      expect(result.metrics).toHaveProperty('totalEmployees');
      expect(result.metrics).toHaveProperty('totalDepartments');
      expect(result.metrics).toHaveProperty('totalTeams');
      expect(result.metrics.totalEmployees).toBe(2);
      expect(result.metrics.totalDepartments).toBe(1);
      expect(result.metrics.totalTeams).toBe(1);
    });
  });
});

