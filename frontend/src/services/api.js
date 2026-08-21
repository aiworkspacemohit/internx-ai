import axios from 'axios';
import ENV from '../config/env';

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('internx_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized / Expired Session
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('internx_token');
      localStorage.removeItem('internx_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  sendOtp: (data) => api.post('/auth/register/send-otp', data),
  verifyOtpAndRegister: (data) => api.post('/auth/register/verify-otp', data),
  registerStudent: (data) => api.post('/auth/register/student', data),
  registerCompany: (data) => api.post('/auth/register/company', data),
  getMe: () => api.get('/auth/me'),
};

export const userService = {
  getUsers: (role) => api.get('/users/', { params: { role } }),
  createOfficer: (data) => api.post('/users/officers', data),
  updateProfile: (data) => api.put('/users/me', data),
  uploadAvatar: (formData) => api.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadResume: (formData) => api.post('/users/me/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  toggleActive: (userId) => api.put(`/users/${userId}/toggle-active`),
};

export const companyService = {
  getCompanies: (status) => api.get('/companies/', { params: { status } }),
  getMyProfile: () => api.get('/companies/me'),
  updateMyProfile: (data) => api.put('/companies/me', data),
  approveCompany: (companyId) => api.put(`/companies/${companyId}/approve`),
  rejectCompany: (companyId) => api.put(`/companies/${companyId}/reject`),
};

export const internshipService = {
  getInternships: (params) => api.get('/internships/', { params }),
  getMyPostings: () => api.get('/internships/company/my-postings'),
  getById: (id) => api.get(`/internships/${id}`),
  create: (data) => api.post('/internships/', data),
  update: (id, data) => api.put(`/internships/${id}`, data),
  delete: (id) => api.delete(`/internships/${id}`),
};

export const applicationService = {
  apply: (data) => api.post('/applications/', data),
  getStudentApps: () => api.get('/applications/student/my-applications'),
  getCompanyPipeline: (params) => api.get('/applications/company/applicant-pipeline', { params }),
  getById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
};

export const interviewService = {
  schedule: (data) => api.post('/interviews/', data),
  getStudentInterviews: () => api.get('/interviews/student/my-interviews'),
  getCompanyInterviews: () => api.get('/interviews/company/scheduled-interviews'),
};

export const announcementService = {
  getAnnouncements: (department) => api.get('/announcements/', { params: { department } }),
  create: (data) => api.post('/announcements/', data),
};

export const notificationService = {
  getNotifications: () => api.get('/notifications/'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/mark-all-read'),
};

export const aiService = {
  reviewResume: (data) => api.post('/ai/resume-review', data),
  parseResume: (formData) => api.post('/ai/parse-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  generateInterviewPrep: (data) => api.post('/ai/interview-prep', data),
  generateCareerRoadmap: (data) => api.post('/ai/career-roadmap', data),
  suggestCandidates: (data) => api.post('/ai/suggest-candidates', data),
  sendChatMessage: (data) => api.post('/ai/chatbot', data),
  getRecommendations: () => api.get('/ai/recommendations'),
};

export const analyticsService = {
  getStudentAnalytics: () => api.get('/analytics/student'),
  getCompanyAnalytics: () => api.get('/analytics/company'),
  getOfficerAnalytics: () => api.get('/analytics/officer'),
  getAdminAnalytics: () => api.get('/analytics/admin'),
};

export default api;
