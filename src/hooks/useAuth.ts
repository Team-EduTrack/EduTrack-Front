import { useRecoilState } from "recoil";
import { useMutation } from "@tanstack/react-query";
import { authState } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { fetchMyInfo, loginApi } from "../api/auth";

export function useLogin() {
  const [, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginApi,

    async onSuccess(response) {
      const { accessToken, refreshToken } = response.data;

     
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

     
      const meResponse = await fetchMyInfo();
      const me = meResponse.data;

     //아카데미 정보 아직 백엔드 수정 필요
      const academy = me.academy || { id: null, name: null, code: null };

     
      setAuth({
        isLoggedIn: true,
        accessToken,
        refreshToken,
        user: {
          id: me.id,
          name: me.name,
          email: me.email,
          role: me.role,

          academyId: academy.id,
          academyName: academy.name,
          academyCode: academy.code,
        },
      });

      // 5) 역할 기반 리다이렉트
      switch (me.role) {
        case "STUDENT":
          navigate("/student/dashboard");
          break;
        case "TEACHER":
          navigate("/teacher/dashboard");
          break;
        case "PRINCIPAL":
          navigate("/principal/dashboard");
          break;
        case "ADMIN":
          navigate("/admin/users");
          break;
        default:
          navigate("/");
      }
    },
  });
}
