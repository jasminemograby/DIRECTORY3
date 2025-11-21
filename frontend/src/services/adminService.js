// Frontend Service - Admin Service
// Handles API calls for admin operations

import api from '../utils/api';

export const getAllCompanies = async () => {
  try {
    const response = await api.get('/admin/companies');
    return response.data;
  } catch (error) {
    console.error('Get all companies error:', error);
    throw error;
  }
};

export const getCompany = async (companyId) => {
  try {
    const response = await api.get(`/admin/companies/${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Get company error:', error);
    throw error;
  }
};

