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

    async onSuccess(response, variables) {
      const { accessToken, refreshToken } = response.data;

      
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

     
      const meResponse = await fetchMyInfo();
      const me = meResponse.data; 

    
      setAuth({
        isLoggedIn: true,
        accessToken,
        refreshToken,
        user: {
          id: me.id,
          name: me.name,
          email: me.email,
          role: me.role,
          loginId: variables.loginId,
          academy: me.academy
            ? {
                id: me.academy.id,
                name: me.academy.name,
                code: me.academy.code,
              }
            : null,
        },
      });

     
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

