import axios from "axios";


export interface LoginPayload {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const loginApi = (payload: LoginPayload) =>
  axios.post<LoginResponse>("/api/users/signin", payload);

export const fetchMyInfo = () =>
  axios.get("/api/users/me");

//signup

export const signupApi = (data: any) => {
  return axios.post("/api/auth/signup", data);
};

export const sendEmailCode = (email: string) =>
  axios.post("/api/auth/send-email-verification", { email });

export const verifyEmailCode = (email: string, token: string) =>
  axios.post("/api/auth/verify-email", { email, token });

