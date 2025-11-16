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
   * Register a new company (atomic operation)
   * @param {Object} companyData - Company registration data
   * @returns {Promise<Object>} Created company with ID
   */
  async execute(companyData) {
    // Step 1: Validate all data BEFORE any database operations
    this.validateCompanyData(companyData);

    // Step 2: Check if company with same domain already exists
    // This check happens BEFORE creating any records
    const existingCompany = await this.companyRepository.findByDomain(companyData.domain);
    if (existingCompany) {
      throw new Error('A company with this domain already exists. Please use a different domain or contact support if you believe this is an error.');
    }

    // Step 3: Use transaction to ensure atomicity
    // If anything fails after this point, the entire operation is rolled back
    const client = await this.companyRepository.beginTransaction();
    
    try {
      // Create company within transaction
      const company = await this.companyRepository.create(companyData, client);
      
      // Commit transaction - only now is the company actually saved
      await this.companyRepository.commitTransaction(client);
      
      // Step 4: Trigger domain verification automatically (async, don't wait)
      // This happens AFTER successful commit, so even if it fails, company is saved
      this.verifyCompanyUseCase.verifyDomain(company.id).catch(error => {
        console.error('Auto-verification failed:', error);
        // Don't fail registration if verification fails - company is already created
      });

      return {
        company_id: company.id,
        company_name: company.company_name,
        domain: company.domain,
        verification_status: company.verification_status
      };
    } catch (error) {
      // Rollback transaction on any error
      await this.companyRepository.rollbackTransaction(client);
      
      // Re-throw the error with context
      if (error.message.includes('already exists')) {
        throw error; // Re-throw domain exists error as-is
      }
      
      // For other errors, wrap with context
      throw new Error(`Registration failed: ${error.message}`);
    }
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

