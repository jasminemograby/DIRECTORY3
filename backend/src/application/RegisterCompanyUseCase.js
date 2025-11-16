// Application Layer - Register Company Use Case
// Business logic for company registration

const CompanyRepository = require('../infrastructure/CompanyRepository');
const VerifyCompanyUseCase = require('./VerifyCompanyUseCase');

class RegisterCompanyUseCase {
  constructor() {
    this.companyRepository = new CompanyRepository();
    this.verifyCompanyUseCase = new VerifyCompanyUseCase();
  }

  /**
   * Register a new company
   * @param {Object} companyData - Company registration data
   * @returns {Promise<Object>} Created company with ID
   */
  async execute(companyData) {
    // Validate required fields
    this.validateCompanyData(companyData);

    // Check if company with same domain already exists
    const existingCompany = await this.companyRepository.findByDomain(companyData.domain);
    if (existingCompany) {
      throw new Error('A company with this domain already exists');
    }

    // Create company
    const company = await this.companyRepository.create(companyData);

    // Trigger domain verification automatically (async, don't wait)
    this.verifyCompanyUseCase.verifyDomain(company.id).catch(error => {
      console.error('Auto-verification failed:', error);
      // Don't fail registration if verification fails
    });

    return {
      company_id: company.id,
      company_name: company.company_name,
      domain: company.domain,
      verification_status: company.verification_status
    };
  }

  /**
   * Validate company registration data
   * @param {Object} companyData - Company data to validate
   * @throws {Error} If validation fails
   */
  validateCompanyData(companyData) {
    const requiredFields = [
      'company_name',
      'industry',
      'domain',
      'hr_contact_name',
      'hr_contact_email',
      'hr_contact_role'
    ];

    for (const field of requiredFields) {
      if (!companyData[field] || !companyData[field].trim()) {
        throw new Error(`${field.replace('_', ' ')} is required`);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyData.hr_contact_email)) {
      throw new Error('Invalid email format');
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(companyData.domain)) {
      throw new Error('Invalid domain format');
    }
  }
}

module.exports = RegisterCompanyUseCase;

