import { useRecoilState } from "recoil";
import { useMutation } from "@tanstack/react-query";
import { authState } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { fetchMyInfo, loginApi } from "../api/auth";

//auth관련 모든 함수 모음

export function useLogin() {
  const [, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginApi, 

    async onSuccess(data) {
      // 토큰 저장
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // 사용자 정보 조회
      const me = await fetchMyInfo(); 

      // 상태 저장
      setAuth({
        isLoggedIn: true,
        token: data.accessToken,
        refreshToken: data.refreshToken,
        role: me.data.role,
        user: me,
      });

      if (me.data.role === "STUDENT") navigate("/student/dashboard");
      if (me.data.role === "TEACHER") navigate("/teacher/dashboard");
      if (me.data.role === "PRINCIPAL") navigate("/principal/dashboard");
    },
  });  
    
}
