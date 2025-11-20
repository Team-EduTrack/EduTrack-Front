import { atom } from "recoil";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  role: "PRINCIPAL" | "TEACHER" | "STUDENT" | null;
}

export const authState = atom<AuthState>({
  key: "authState",
  default: {
    isLoggedIn: false,
    token: null,
    role: null,
  },
});
