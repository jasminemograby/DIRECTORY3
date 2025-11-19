import config from '../config';

const API_ROOT = config.apiBaseUrl.replace(/\/api\/v1$/, '');

let cachedTokens = null;

export const fetchDesignTokens = async () => {
  if (cachedTokens) {
    return cachedTokens;
  }

  const response = await fetch(`${API_ROOT}/design-tokens`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to load design tokens');
  }

  const data = await response.json();
  cachedTokens = data;
  return data;
};

export const getLogoUrl = (variant = 'logo1') => {
  return `${API_ROOT}/assets/${variant}`;
};


