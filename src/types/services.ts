import type { Student, ApiResponse } from './index.js'

export interface StudentsApi {
  getAll(): Promise<ApiResponse<Student[]>>
  getById(id: string | number): Promise<ApiResponse<Student>>
  create(data: Partial<Student>): Promise<ApiResponse<Student>>
  update(id: string | number, data: Partial<Student>): Promise<ApiResponse<Student>>
  delete(id: string | number): Promise<ApiResponse<{ deleted: boolean }>>
  bulkCreate(dataArray: Partial<Student>[]): Promise<ApiResponse<{ created: number; students: Student[] }>>
}

export interface PaymentsApi {
  sendReminder(studentId: string | number): Promise<ApiResponse<{ sent: boolean; recipient: string }>>
  recordPayment(studentId: string | number, amount: number, options?: Record<string, unknown>): Promise<ApiResponse<Student>>
  getReport(grade?: string): Promise<ApiResponse<unknown>>
  exportUnpaid(): Promise<ApiResponse<{ csv: string; filename: string }>>
  exportSummary(): Promise<ApiResponse<{ csv: string; filename: string }>>
}

export interface SettingsApi {
  get(): Promise<ApiResponse<Record<string, unknown>>>
  update(data: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>>
  uploadLogo(file: File): Promise<ApiResponse<{ logo: string }>>
}

export interface Api {
  students: StudentsApi
  payments: PaymentsApi
  settings: SettingsApi
}