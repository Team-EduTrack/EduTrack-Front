import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import StudentDashboard from "../pages/student/StudentDashboard";
import TeacherDashboard from "../pages/teacher/Dashboard";
import LectureManagement from "../pages/teacher/LectureManagement";
import LectureDetail from "../pages/teacher/LectureDetail";
import ExamManagement from "../pages/teacher/ExamManagement";
import GradeManagement from "../pages/teacher/GradeManagement";
import GradeDetail from "../pages/teacher/GradeDetail";
import StudentDetail from "../pages/teacher/StudentDetail";
import AssignmentGrading from "../pages/teacher/AssignmentGrading";

import UserManagement from "../pages/admin/UserManagement";
import Layout from "../components/common/layout/Layout";

import PrincipalDashBoard from "../pages/principal/Dashboard";
import PrincipalLectureManagement from "../pages/principal/LectureManagement";
import PrincipalUserManagement from "../pages/principal/UserManagement";
import StudentLectureDetail from "../pages/student/LectureDetail";
import LectureTasks from "../pages/student/LectureTasks";
import AssignmentSubmit from "../pages/student/AssignmentSubmit";
import ExamTake from "../pages/student/ExamTake";
import GradeReport from "../pages/student/GradeReport";
import StudentLectureList from "../pages/student/LectureList";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<Layout />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/lectures" element={<StudentLectureList />} />
        <Route
          path="/student/lectures/:lectureId"
          element={<StudentLectureDetail />}
        />
        <Route path="/student/tasks" element={<LectureTasks />} />
        <Route
          path="/student/tasks/assignment/:assignmentId"
          element={<AssignmentSubmit />}
        />
        <Route path="/student/tasks/exam/:examId" element={<ExamTake />} />
        <Route path="/student/grades/:lectureId?" element={<GradeReport />} />

        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/lectures" element={<LectureManagement />} />
        <Route
          path="/teacher/lectures/:lectureId"
          element={<LectureDetail />}
        />
        <Route path="/teacher/exams" element={<ExamManagement />} />
        <Route path="/teacher/grades" element={<GradeManagement />} />
        <Route path="/teacher/grades/:lectureId" element={<GradeDetail />} />
        <Route
          path="/teacher/students/:studentId"
          element={<StudentDetail />}
        />
        <Route
          path="/teacher/assignments/:assignmentId"
          element={<AssignmentGrading />}
        />
        <Route path="/principal/dashboard" element={<PrincipalDashBoard />} />
        <Route
          path="/principal/lectures"
          element={<PrincipalLectureManagement />}
        />
        <Route
          path="/principal/lectures/:lectureId"
          element={<GradeDetail />}
        />
        <Route path="/principal/users" element={<PrincipalUserManagement />} />

        <Route path="/admin/users" element={<UserManagement />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}
