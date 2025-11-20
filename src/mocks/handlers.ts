import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("http://localhost:8080/api/auth/login", async ({ request }) => {
    const { username, password } = await request.json() as { username: string; password: string };

    if (username === "test" && password === "1234") {
      return HttpResponse.json({ token: "fake-token-abc123", role: "STUDENT" });
    }

    return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }),
];
