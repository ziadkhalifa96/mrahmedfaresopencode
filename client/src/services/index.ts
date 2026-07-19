import api from './api';
import type { User, Course, Chapter, Lesson, Enrollment, Exam, ExamAttempt, Booking, Payment, BlogPost, Certificate, Notification, PaginatedResponse } from '../types';

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', data),
  register: (data: { name: string; email: string; password: string; phone?: string; language?: string }) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/register', data),
  getMe: () => api.get<{ user: User }>('/auth/me'),
  updateProfile: (data: Partial<User>) =>
    api.put<{ user: User }>('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
  logout: () => api.post('/auth/logout'),
};

// Courses
export const coursesApi = {
  getAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Course>>('/courses', { params: { page, limit } }),
  getBySlug: (slug: string) =>
    api.get<{ course: Course }>(`/courses/${slug}`),
  getChapters: (courseId: number) =>
    api.get<{ chapters: Chapter[] }>(`/courses/${courseId}/chapters`),
  getLessons: (chapterId: number) =>
    api.get<{ lessons: Lesson[] }>(`/chapters/${chapterId}/lessons`),
  getLesson: (lessonId: number) =>
    api.get(`/courses/lessons/${lessonId}`),
};

// Enrollments
export const enrollmentsApi = {
  enroll: (courseId: number) =>
    api.post('/enrollments', { courseId }),
  getMyEnrollments: () =>
    api.get<{ enrollments: Enrollment[] }>('/enrollments'),
  updateProgress: (enrollmentId: number, lessonId: number) =>
    api.put(`/enrollments/${enrollmentId}/progress`, { lessonId }),
};

// Exams
export const examsApi = {
  getByCourse: (courseId: number) =>
    api.get(`/courses/${courseId}/exams`),
  getExam: (examId: number) =>
    api.get<{ exam: Exam; questions: any[]; attemptsUsed: number }>(`/exams/${examId}`),
  startAttempt: (examId: number) =>
    api.post<{ attempt: ExamAttempt }>(`/exams/${examId}/start`),
  submitAttempt: (attemptId: number, answers: { questionId: number; selectedOptionId: string }[]) =>
    api.put<{ attempt: ExamAttempt }>(`/exams/attempts/${attemptId}/submit`, { answers }),
  getResult: (attemptId: number) =>
    api.get<{ attempt: ExamAttempt }>(`/exams/attempts/${attemptId}/result`),
};

// Bookings
export const bookingsApi = {
  getAvailable: () =>
    api.get<{ bookings: Booking[] }>('/bookings/available'),
  book: (bookingId: number) =>
    api.post('/bookings', { bookingId }),
  getMyBookings: () =>
    api.get<{ bookings: Booking[] }>('/bookings/my'),
  cancel: (bookingId: number) =>
    api.put(`/bookings/${bookingId}/cancel`),
};

// Payments
export const paymentsApi = {
  submit: (data: FormData) =>
    api.post('/payments', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMyPayments: () =>
    api.get<{ payments: Payment[] }>('/payments/my'),
};

// Blog
export const blogApi = {
  getAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<BlogPost>>('/blog', { params: { page, limit } }),
  getBySlug: (slug: string) =>
    api.get<{ post: BlogPost }>(`/blog/${slug}`),
};

// Certificates
export const certificatesApi = {
  getMyCertificates: () =>
    api.get<{ certificates: Certificate[] }>('/certificates'),
};

// Notifications
export const notificationsApi = {
  getAll: () =>
    api.get<{ notifications: Notification[]; unreadCount: number }>('/notifications'),
  markAsRead: (id: number) =>
    api.put(`/notifications/${id}/read`),
  markAllAsRead: () =>
    api.put('/notifications/read-all'),
};

// Admin API
export const adminApi = {
  dashboard: {
    getStats: () => api.get('/admin/dashboard'),
  },
  users: {
    getAll: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
      api.get('/admin/users', { params }),
    getOne: (id: number) => api.get(`/admin/users/${id}`),
    update: (id: number, data: Partial<User>) => api.put(`/admin/users/${id}`, data),
    delete: (id: number) => api.delete(`/admin/users/${id}`),
  },
  courses: {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
      api.get('/admin/courses', { params }),
    getOne: (id: number) => api.get(`/admin/courses/${id}`),
    create: (data: FormData) =>
      api.post('/admin/courses', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id: number, data: FormData) =>
      api.put(`/admin/courses/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id: number) => api.delete(`/admin/courses/${id}`),
    createChapter: (courseId: number, data: { title: string; titleAr: string; orderIndex?: number }) =>
      api.post(`/admin/courses/${courseId}/chapters`, data),
    updateChapter: (chapterId: number, data: { title?: string; titleAr?: string; orderIndex?: number }) =>
      api.put(`/admin/chapters/${chapterId}`, data),
    deleteChapter: (chapterId: number) => api.delete(`/admin/chapters/${chapterId}`),
    createLesson: (chapterId: number, data: { title: string; titleAr: string; type?: string; content?: string; contentAr?: string; videoUrl?: string; duration?: number; orderIndex?: number; isFree?: boolean }) =>
      api.post(`/admin/chapters/${chapterId}/lessons`, data),
    updateLesson: (lessonId: number, data: Record<string, any>) =>
      api.put(`/admin/lessons/${lessonId}`, data),
    deleteLesson: (lessonId: number) => api.delete(`/admin/lessons/${lessonId}`),
  },
  payments: {
    getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
      api.get('/admin/payments', { params }),
    review: (id: number, data: { status: 'approved' | 'rejected'; adminNotes?: string }) =>
      api.put(`/admin/payments/${id}/review`, data),
  },
  bookings: {
    getAll: (params?: { page?: number; limit?: number; status?: string }) =>
      api.get('/admin/bookings', { params }),
    create: (data: any) => api.post('/admin/bookings', data),
    update: (id: number, data: any) => api.put(`/admin/bookings/${id}`, data),
    delete: (id: number) => api.delete(`/admin/bookings/${id}`),
  },
  blog: {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
      api.get('/admin/blog', { params }),
    create: (data: FormData) =>
      api.post('/admin/blog', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id: number, data: FormData) =>
      api.put(`/admin/blog/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id: number) => api.delete(`/admin/blog/${id}`),
  },
  settings: {
    get: () => api.get('/admin/settings'),
    update: (key: string, value: any) => api.put(`/admin/settings/${key}`, { value }),
  },
  announcements: {
    getAll: () => api.get('/admin/announcements'),
    create: (data: { message: string; messageAr: string; isActive?: boolean; link?: string }) =>
      api.post('/admin/announcements', data),
    update: (id: number, data: { message?: string; messageAr?: string; isActive?: boolean; link?: string }) =>
      api.put(`/admin/announcements/${id}`, data),
    delete: (id: number) => api.delete(`/admin/announcements/${id}`),
  },
  exams: {
    getAll: (params?: { courseId?: number }) =>
      api.get('/admin/exams', { params }),
    getOne: (id: number) => api.get(`/admin/exams/${id}`),
    create: (data: any) => api.post('/admin/exams', data),
    update: (id: number, data: any) => api.put(`/admin/exams/${id}`, data),
    delete: (id: number) => api.delete(`/admin/exams/${id}`),
    createQuestion: (examId: number, data: any) => api.post(`/admin/exams/${examId}/questions`, data),
    updateQuestion: (questionId: number, data: any) => api.put(`/admin/exams/questions/${questionId}`, data),
    deleteQuestion: (questionId: number) => api.delete(`/admin/exams/questions/${questionId}`),
  },
  notifications: {
    getAll: () => api.get('/admin/notifications'),
    send: (data: { userIds?: number[]; title: string; titleAr?: string; message: string; messageAr?: string; type?: string; link?: string }) =>
      api.post('/admin/notifications', data),
    delete: (id: number) => api.delete(`/admin/notifications/${id}`),
  },
};

// Public API
export const publicApi = {
  getAnnouncements: () => api.get('/public/announcements'),
  getSettings: () => api.get('/public/settings'),
};

// Page Content
export const pageContentApi = {
  getPage: (page: string) => api.get(`/page-content/${page}`),
  getAll: () => api.get('/page-content'),
  upsert: (data: { page: string; section: string; key: string; valueEn: string; valueAr: string; metadata?: object }) =>
    api.post('/page-content', data),
  delete: (id: number) => api.delete(`/page-content/${id}`),
};

// Public Site Settings
export const publicSiteSettingsApi = {
  getSettings: () => api.get('/public/site-settings'),
};

// Hero Slides
export const heroSlidesApi = {
  getPublic: () => api.get<{ slides: any[] }>('/hero-slides'),
  getAll: () => api.get<{ slides: any[] }>('/hero-slides/admin'),
  create: (data: any) => api.post('/hero-slides/admin', data),
  update: (id: number, data: any) => api.put(`/hero-slides/admin/${id}`, data),
  delete: (id: number) => api.delete(`/hero-slides/admin/${id}`),
};

// Progress
export const progressApi = {
  markComplete: (lessonId: number) =>
    api.post(`/progress/lessons/${lessonId}/complete`),
  getCourseProgress: (courseId: number) =>
    api.get(`/progress/courses/${courseId}`),
};
