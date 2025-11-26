import { Link, useLocation } from "react-router-dom";
import { FiBell, FiUser } from "react-icons/fi";

const menuByRole = {
  STUDENT: {
    home: "/student/dashboard",
    menus: [
      { label: "출석 현황", path: "/student/attendance" },
      { label: "강의 목록", path: "/student/classes" },
    ],
  },
  TEACHER: {
    home: "/teacher/dashboard",
    menus: [
      { label: "강의 관리", path: "/teacher/lectures" },
      { label: "시험 관리", path: "/teacher/exams" },
      { label: "성적 관리", path: "/teacher/grades" },
    ],
  },
  ADMIN: {
    home: "/admin/users",
    menus: [
      { label: "학원 관리", path: "/admin/academy" },
      { label: "계정 관리", path: "/admin/users" },
    ],
  },
};

type Role = keyof typeof menuByRole;

function getRoleFromPath(pathname: string): Role {
  if (pathname.startsWith("/teacher")) return "TEACHER";
  if (pathname.startsWith("/admin")) return "ADMIN";
  return "STUDENT";
}

export default function Header() {
  const { pathname } = useLocation();
  const role = getRoleFromPath(pathname);
  const { home, menus } = menuByRole[role];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to={home} className="font-bold text-2xl text-gray-900">
            EduTrack
          </Link>
          <nav className="flex gap-8">
            {menus.map((m) => (
              <Link
                key={m.path}
                to={m.path}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(m.path)
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {m.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <FiBell size={20} />
          </button>

          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <FiUser size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
