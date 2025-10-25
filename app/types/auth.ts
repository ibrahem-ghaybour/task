// Auth Types
export interface User {
  id: number;
  username: string;
  role: string;
  email: string;
  permissions: string[];
}

export interface LoginPayload {
  username: string;
  password: string;
  provider: string;
  otp: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

export interface AuthResponse {
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  status: number;
  message: string;
}

export interface MeResponse {
  data: User;
  status: number;
  message: string;
}
