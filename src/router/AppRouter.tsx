import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import StudentDashboard from "../pages/student/Dashboard";

// 추후 역할별 페이지 import

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/student/dashboard" element={<StudentDashboard />} />

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}
