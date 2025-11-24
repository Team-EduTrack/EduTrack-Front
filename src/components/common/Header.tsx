import { Link, useLocation } from "react-router-dom";

interface Menu {
  label: string;
  path: string;
}

interface Props {
  menus?: Menu[];
}

export default function PageHeader({ menus = [] }: Props) {
  const { pathname } = useLocation();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center gap-8 h-16">
          <h1 className="text-2xl font-bold text-gray-900">EduTrack</h1>
          {menus.length > 0 && (
            <nav className="flex gap-8">
              {menus.map((menu) => (
                <Link
                  key={menu.path}
                  to={menu.path}
                  className={`text-base font-medium transition-colors ${
                    pathname === menu.path ? "text-primary" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {menu.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
