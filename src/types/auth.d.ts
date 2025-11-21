export interface LoginPayload {
    loginId: string;
    password: string;
  }
  
  export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
  }

  export interface MeResponse {
    id: number;
    role: string;
    name: string;
    email: string;
    phone: string;
  }
  