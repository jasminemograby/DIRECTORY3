import api from '../utils/api';

/**
 * Get company verification status
 * @param {string} companyId - Company ID
 * @returns {Promise<Object>} Verification status response
 */
export const getCompanyVerificationStatus = async (companyId) => {
  try {
    const response = await api.get(`/api/v1/companies/${companyId}/verification`);

    return response.data;
  } catch (error) {
    console.error('Company verification status error:', error);
    throw error;
  }
};

