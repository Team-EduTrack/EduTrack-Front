import { atom } from "recoil";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  role: "ADMIN"|"PRINCIPAL" | "TEACHER" | "STUDENT" | null;
}

export const authState = atom<AuthState>({
  key: "authState",
  default: {
    isLoggedIn: false,
    token: null,
    role: null,
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
  ]
});
