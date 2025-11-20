import { useRecoilState } from "recoil";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { authState } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
    token: string;
    role: "PRINCIPAL" | "TEACHER" | "STUDENT";
  }

export function useLogin() {
  const [, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) =>
      axiosInstance.post("/auth/login", payload).then(res => res.data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setAuth({ isLoggedIn: true, token: data.token, role: data.role });

      // 역할에 따른 리다이렉트
      if (data.role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (data.role === "TEACHER") {
        navigate("/teacher/dashboard");
      } else if (data.role === "PRINCIPAL") {
        navigate("/principal/dashboard");
      } else {
        navigate("/"); // 기본 경로
      }
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
    },
  });
}
