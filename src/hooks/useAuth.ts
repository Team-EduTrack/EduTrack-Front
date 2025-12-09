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

    async onSuccess(response) {
      const { accessToken, refreshToken } = response.data;
    
      // 토큰 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    
      // 사용자 정보 조회
      const meResponse = await fetchMyInfo();
      const me = meResponse.data;
    
      // 상태 저장
      setAuth({
        isLoggedIn: true,
        token: accessToken,
        refreshToken,
        role: me.role,
        user: me,
      });
    
      if (me.role === "STUDENT") navigate("/student/dashboard");
      if (me.role === "TEACHER") navigate("/teacher/dashboard");
      if (me.role === "PRINCIPAL") navigate("/principal/dashboard");
      if (me.role === "ADMIN") navigate("/admin/users");
    }
    
  });  
    
}
