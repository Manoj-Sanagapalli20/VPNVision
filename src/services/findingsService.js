import { request } from './api';

export const findingsService = {
  async getFindings() {
    return request('/api/findings');
  }
};

export default findingsService;
