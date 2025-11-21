import axiosInstance from "./axiosInstance";

export interface LoginPayload {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

//API 요청
export const loginApi = (payload: LoginPayload) =>
  axiosInstance.post<LoginResponse>("/users/signin", payload);

export const fetchMyInfo = () =>
    axiosInstance.get("/users/me");
