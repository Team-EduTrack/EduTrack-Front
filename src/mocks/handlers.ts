import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("http://localhost:8080/api/users/signin", async ({ request }) => {
    const { loginId, password } = await request.json() as { loginId: string; password: string };

    if (loginId === "test" && password === "1234") {
      return HttpResponse.json({ accessToken: "fake-access-token-123",
      refreshToken: "fake-refresh-token-123" });
    }

    return HttpResponse.json(
      { status: 401, errorCode: "U-010", message: "아이디 또는 비밀번호 오류" },
      { status: 401 }
    );
  }),

  http.get("http://localhost:8080/api/users/me", () => {
    return HttpResponse.json({
      id: 1,
      role: "STUDENT",
      name: "홍길동",
      email: "a@a.com",
      phone: "010-1234-5678",
    });
  }),

];
