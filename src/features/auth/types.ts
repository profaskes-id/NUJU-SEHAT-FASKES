export interface AuthUser {
  id: number;
  uuid: string;
  email: string;
  role: 'faskes';
  id_faskes: string;
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
