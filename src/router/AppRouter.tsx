import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import StudentDashboard from "../pages/student/Dashboard";
import Layout from "../components/common/layout/Layout";

// 추후 역할별 페이지 import

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<Layout />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        {/* <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
      </Route>

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}
