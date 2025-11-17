// Frontend Service - Company Profile
// Handles fetching company profile data

import api from '../utils/api';

export const getCompanyProfile = async (companyId) => {
  try {
    const response = await api.get(`/companies/${companyId}/profile`);
    return response.data;
  } catch (error) {
    console.error('Company profile error:', error);
    throw error;
  }
};

