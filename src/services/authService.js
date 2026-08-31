import { request } from './api';

export const authService = {
  async login(email, password) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async register(email, password, name, org) {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, org })
    });
  }
};

export default authService;
