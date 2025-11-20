import { useState } from "react";
import { useLogin } from "../../hooks/useAuth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="p-6 bg-white shadow-lg rounded-lg space-y-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold">로그인</h1>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="input input-bordered w-full"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary w-full mt-4"
          disabled={loginMutation.isLoading}
        >
          로그인
        </button>
        {loginMutation.isError && (
          <p className="text-red-500">
            로그인 실패. 아이디/비밀번호 확인하세요.
          </p>
        )}
      </form>
    </div>
  );
}
