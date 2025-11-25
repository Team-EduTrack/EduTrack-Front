import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import StudentDashboard from "../pages/student/StudentDashboard";
import UserManagement from "../pages/admin/UserManagement";
import PrincipalDashBoard from "../pages/principal/principalDashboard";
import PrincipalUserManagement from "../pages/principal/PrincipalUserManagement";
import LectureManagement from "../pages/principal/LectureManagement";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/student/dashboard" element={<StudentDashboard />} />

      <Route path="/admin/users" element={<UserManagement />} />

      <Route path="/principal/dashboard" element={<PrincipalDashBoard />} />
      <Route path="/principal/users" element={<PrincipalUserManagement />} />
      <Route path="/principal/lectures" element={<LectureManagement />} />

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}
