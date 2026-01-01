export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface AuthState {
  user: Record<string, unknown> | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}