import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../../../stores/authStore";
import { FiBell, FiUser } from "react-icons/fi";

const menuByRole = {
  STUDENT: [
    { label: "출석 현황", path: "/student/attendance" },
    { label: "강의 목록", path: "/student/classes" },
  ],
  TEACHER: [
    { label: "출석 체크", path: "/teacher/attendance" },
    { label: "학생 관리", path: "/teacher/students" },
  ],
  ADMIN: [
    { label: "학원 관리", path: "/admin/academy" },
    { label: "계정 관리", path: "/admin/users" },
  ],
};

export default function Header() {
  const { role } = useRecoilValue(authState);
  const menus = menuByRole[role] || [];

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* 로고 */}
          <Link to="/login" className="font-bold text-3xl">
            EduTrack
          </Link>

          {/* 카테고리 메뉴 */}
          <div className="ml-4 flex gap-4">
            {menus.map((m) => (
              <Link
                key={m.path}
                to={m.path}
                className="font-medium hover:text-primary"
              >
                {m.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex-none ml-4 flex gap-1">
          <button className="btn btn-ghost btn-circle">
            <FiBell size={20} />
          </button>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <FiUser size={20} />
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box w-40 p-2 shadow"
            >
              <li>
                <button className="justify-between">내 정보</button>
              </li>

              <li>
                <button className="text-red-500 font-semibold">로그아웃</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
