import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { authState } from "../../../stores/authStore";

type Role = "ADMIN" | "PRINCIPAL" | "TEACHER" | "STUDENT";

type Props = {
  allowedRoles?: Role[];
};

function ClearAuthAndGoLogin({ state }: { state?: any }) {
  const resetAuth = useResetRecoilState(authState);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("auth");

    navigate("/login", { replace: true, state });
  }, [resetAuth, navigate, state]);

  return null;
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const auth = useRecoilValue(authState);
  const location = useLocation();

  const isLoggedIn = !!auth.isLoggedIn && !!auth.accessToken;

  if (!isLoggedIn) {
    return <ClearAuthAndGoLogin state={{ from: location }} />;
  }

  if (
    allowedRoles &&
    auth.user?.role &&
    !allowedRoles.includes(auth.user.role)
  ) {
    return <ClearAuthAndGoLogin />;
  }

  return <Outlet />;
}
