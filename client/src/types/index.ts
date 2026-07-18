export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'student';
  avatar?: string;
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  isVerified: boolean;
  createdAt: string;
}

export interface Course {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  slug: string;
  thumbnail?: string;
  price: number;
  isFree: boolean;
  isPublished: boolean;
  orderIndex: number;
  chapters?: Chapter[];
  createdAt: string;
}

export interface Chapter {
  id: number;
  courseId: number;
  title: string;
  titleAr: string;
  orderIndex: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  chapterId: number;
  title: string;
  titleAr: string;
  type: 'video' | 'text' | 'quiz' | 'exam';
  content?: string;
  contentAr?: string;
  videoUrl?: string;
  duration: number;
  orderIndex: number;
  isFree: boolean;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  status: 'active' | 'completed';
  enrolledAt: string;
  completedAt?: string;
  course?: Course;
}

export interface Exam {
  id: number;
  courseId: number;
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  duration: number;
  passingScore: number;
  maxAttempts: number;
  isPublished: boolean;
  questions?: ExamQuestion[];
}

export interface ExamQuestion {
  id: number;
  examId: number;
  question: string;
  questionAr: string;
  type: 'mcq' | 'true_false';
  options: { id: string; text: string; textAr: string }[];
  correctAnswer: string;
  orderIndex: number;
}

export interface ExamAttempt {
  id: number;
  userId: number;
  examId: number;
  score?: number;
  answers?: { questionId: number; selectedOptionId: string; isCorrect: boolean }[];
  startedAt: string;
  completedAt?: string;
}

export interface Booking {
  id: number;
  userId: number;
  type: 'offline' | 'online';
  date: string;
  time: string;
  duration: number;
  maxSeats: number;
  bookedSeats: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  dailyRoomUrl?: string;
  location?: string;
  notes?: string;
}

export interface Payment {
  id: number;
  userId: number;
  courseId?: number;
  bookingId?: number;
  amount: number;
  currency: string;
  method: 'vodafone_cash' | 'instapay';
  proofImage: string;
  senderPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  reviewedAt?: string;
  createdAt: string;
  course?: Course;
}

export interface BlogPost {
  id: number;
  title: string;
  titleAr: string;
  slug: string;
  content: string;
  contentAr: string;
  thumbnail?: string;
  excerpt?: string;
  excerptAr?: string;
  isPublished: boolean;
  authorId: number;
  author?: User;
  createdAt: string;
}

export interface Certificate {
  id: number;
  userId: number;
  courseId: number;
  certificateNumber: string;
  issuedAt: string;
  course?: Course;
  user?: User;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: 'system' | 'payment' | 'course' | 'booking';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  errors?: { field: string; message: string }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
