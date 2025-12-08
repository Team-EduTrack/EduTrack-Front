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

// export const loginApi = async (payload: LoginPayload) => {
//   const res = await axios.post<LoginResponse>("/api/users/signin", payload);
//   console.log("로그인 API 응답:", res);
//   return res;
// };

