import { useRecoilValue } from "recoil";
import { authState } from "../stores/authStore";

export function useAuth() {
  const auth = useRecoilValue(authState);

  return {
    isLoggedIn: auth.isLoggedIn,
    user: auth.user,
    role: auth.user?.role,
    academyId: auth.user?.academy?.id ?? null,
  };
}
