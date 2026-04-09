export interface Student {
  id: string | number;
  name: string;
  grade: string;
  parent: string;
  parentEmail: string;
  status: 'Paid' | 'Partial' | 'Unpaid';
  paid: number;
  balance: number;
}

export interface Staff {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  designation: string;
  department?: string;
}

export interface FeePayment {
  id: string | number;
  studentId: string | number;
  amount: number;
  paymentDate: string;
  method: 'CASH' | 'CARD' | 'BANK' | 'ONLINE';
}

export interface AttendanceRecord {
  id: string | number;
  studentId: string | number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
}

export interface Book {
  id: string | number;
  title: string;
  author: string;
  isbn?: string;
  available: number;
  total: number;
}

export interface Notice {
  id: string | number;
  title: string;
  content: string;
  type: 'ANNOUNCEMENT' | 'NOTICE' | 'EVENT' | 'CIRCULAR';
  publishedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
}