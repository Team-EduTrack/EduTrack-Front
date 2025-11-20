import React from "react";
import { useRecoilValue } from "recoil";
import { authState } from "./stores/authStore";
import AppRouter from "./router/AppRouter";

export default function App() {
  const auth = useRecoilValue(authState);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppRouter />

      {/* 테스트용 스타일 체크 */}
      {/* <div className="p-10">
        <h1 className="text-4xl font-bold text-blue-600">
          EduTrack Project 초기 화면
        </h1>
      </div> */}
    </div>
  );
}
