import { http, HttpResponse } from "msw";

const emailCodeStore: Record<string, string> = {};

export const handlers = [
  http.post("/api/users/signin", async ({ request }) => {
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

  http.get("/api/users/me", () => {
    return HttpResponse.json({
      id: 1,
      role: "STUDENT",
      name: "홍길동",
      email: "a@a.com",
      phone: "010-1234-5678",
    });
  }),

  http.post(
    "/api/users/email/send",
    async ({ request }) => {
      const { email } = await request.json();

      console.log("[MSW] 이메일 인증 요청:", email);

      // 이미 가입된 이메일 테스트용
      if (email === "used@mail.com") {
        return HttpResponse.json(
          {
            status: 400,
            errorCode: "U-010",
            message: "이미 가입된 이메일입니다.",
          },
          { status: 400 }
        );
      }

      // 랜덤 6자리 코드 생성
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      emailCodeStore[email] = code;

      console.log("[MSW] 발송된 인증코드:", code);

      return HttpResponse.json(
        { success: true },
        { status: 200 }
      );
    }
  ),

  //이메일 인증
  http.post(
    "/api/users/email/confirm",
    async ({ request }) => {
      const { email, code } = await request.json();

      console.log("[MSW] 인증번호 검증:", email, code);

      const savedCode = emailCodeStore[email];

      if (!savedCode) {
        return HttpResponse.json(
          {
            status: 400,
            errorCode: "U-011",
            message: "코드가 발송되지 않았습니다.",
          },
          { status: 400 }
        );
      }

      if (savedCode !== code) {
        return HttpResponse.json(
          {
            status: 400,
            errorCode: "U-011",
            message: "코드 불일치",
          },
          { status: 400 }
        );
      }
      return HttpResponse.json(
        { success: true },
        { status: 200 }
      );
    }
  ),

  //회원가입
  http.post("/api/users/signup", async ({ request }) => {
  const body = await request.json();
  console.log("[MSW] 회원가입 요청:", body);

  return HttpResponse.json(
    {
      id: 1,
      success: true,
      message: "회원가입 성공!",
    },
    { status: 200 }
  );
}),

];
