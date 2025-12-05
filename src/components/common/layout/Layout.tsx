import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <main className="mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
