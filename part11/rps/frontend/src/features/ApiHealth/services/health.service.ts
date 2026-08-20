import api from '@/shared/services/api';

const healthLiveUrl = '/api/health/live';

const healthService = {

  getLiveUrl() {
    return healthLiveUrl;
  },

  async check(): Promise<void> {
    await api.get('/health');
  },
};

export default healthService;

