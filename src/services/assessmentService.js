// Live Assessment data service backed by real server sessions & localStorage persistence
export const assessmentService = {
  async getAssessments() {
    try {
      const response = await fetch('/api/assessments');
      if (response.ok) {
        const serverData = await response.json();
        if (Array.isArray(serverData) && serverData.length > 0) {
          // Sync with local storage
          localStorage.setItem('vpn_vision_real_assessments', JSON.stringify(serverData));
          return serverData;
        }
      }
    } catch (err) {
      console.warn('Could not load assessments from backend API:', err.message);
    }

    try {
      const cached = localStorage.getItem('vpn_vision_real_assessments');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {}

    return [];
  },

  saveAssessment(assessment) {
    try {
      const cached = localStorage.getItem('vpn_vision_real_assessments');
      const list = cached ? JSON.parse(cached) : [];
      if (!list.some(a => a.id === assessment.id)) {
        list.unshift(assessment);
        localStorage.setItem('vpn_vision_real_assessments', JSON.stringify(list));
      }
    } catch (e) {}
  }
};

export default assessmentService;
