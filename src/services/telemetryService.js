import { request } from './api';

export const telemetryService = {
  async getTelemetry() {
    return request('/api/telemetry');
  }
};

export default telemetryService;
