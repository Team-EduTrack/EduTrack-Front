import { atom } from "recoil";

export type UserRole = "ADMIN" | "PRINCIPAL" | "TEACHER" | "STUDENT";

export interface AuthUser {
  id: number | null;
  name: string | null;
  email: string | null;
  role: UserRole | null;
  
  //아카데미정보 백엔드 수정 필요
  academyId: number | null;
  academyName: string | null;
  academyCode: string | null;
}

export interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
}

export const authState = atom<AuthState>({
  key: "authState",
  default: {
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
    user: null,
  },

  effects: [
    ({ setSelf, onSet }) => {
      const saved = localStorage.getItem("auth");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSelf(parsed);
        } catch (e) {
          console.error("localStorage auth 파싱 오류:", e);
        }
      }

      onSet((newValue) => {
        if (newValue.isLoggedIn) {
          localStorage.setItem("auth", JSON.stringify(newValue));
        } else {
          localStorage.removeItem("auth");
        }
      });
    },
  ],
});

