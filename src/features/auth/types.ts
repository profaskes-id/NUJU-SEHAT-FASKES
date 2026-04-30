export interface AuthUser {
  uuid: string;
  email: string;
  role: 'faskes';
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AuthUser;
}

export interface ApiError {
  success: boolean;
  statusCode: number;
  message: string;
}
