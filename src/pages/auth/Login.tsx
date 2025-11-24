import { useState } from "react";
import { useLogin } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate({ loginId: username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* //대표이미지 */}
      <div className="md:w-1/2 w-full bg-gray-50 px-8 py-10 flex items-center  flex-col justify-center text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">EduTrack</h1>
        <p className="text-gray-600 leading-relaxed">
          학습 패턴이 말해주는 나만의 가이드
        </p>
      </div>

      {/* 로그인폼 */}
      <div className="md:p-7 w-full px-8 py-10 max-w-md">
        <form
          className="p-8 bg-white shadow-lg rounded-lg space-y-4"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold text-center">EduTrack</h1>
          <p className="text-sm mb-1">아이디</p>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="아이디를 입력해주세요."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className="text-sm mb-1">비밀번호</p>
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {loginMutation.isError && (
            <p className="text-red-500 text-sm">
              아이디와 비밀번호를 다시 한 번 확인해주세요.
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={loginMutation.isLoading}
          >
            로그인
          </button>
          <div className="flex justify-center gap-6 ">
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-sm text-gray-400 hover:underline"
              >
                아이디 / 비밀번호 찾기
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-sm text-gray-400 hover:underline"
              >
                회원가입
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
