const BASE_URL = 'https://apitc-lb.aieze.in';
const DIRECT_BASE_URL = 'https://apitc-lb.aieze.in';
const API_ADMIN_PORT = ``;
const API_AUTH_PORT = ``;
const API_USER_PORT = ``;
const API_TICKET_PORT = ``;

export const environment = {
  production: false,
  defaultLanguage: 'en',
  supportedLanguages: [
    { id: 'en', name: 'English', regional: 'English' },
  ],
  admin_prefix_url: `${BASE_URL}${API_ADMIN_PORT}/api/v1/admin`,
  auth_prefix_url: `${BASE_URL}${API_AUTH_PORT}/api/v1/auth`,
  user_prefix_url: `${BASE_URL}${API_USER_PORT}/api/v1/user`,
  ticket_prefix_url: `${BASE_URL}${API_TICKET_PORT}/api/v1/ticket`,
};
