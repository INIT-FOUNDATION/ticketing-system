const BASE_URL = 'http://localhost';
const DIRECT_BASE_URL = 'http://localhost';
const API_ADMIN_PORT = `:9001`;
const API_AUTH_PORT = `:9002`;
const API_USER_PORT = `:9003`;
const API_TICKET_PORT = `:9005`;


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
