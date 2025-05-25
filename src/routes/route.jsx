import React from "react"
import { Navigate, useLocation } from "react-router-dom";
import { authProtectedRoutes } from ".";
import { Spinner } from "reactstrap";
import { useFetchSideData } from "../queries/side_data_query";
import { useSearchCsoInfos } from "../queries/csoinfo_query";
import { useAuthUser } from "../hooks/useAuthUser";
import { useIsRestoring } from "@tanstack/react-query";

// these are paths that are allowed if the user is authenticated
const allowedPathsIfAuthenticated = [
  "/",
  "/dashboard",
  "/profile",
  "/notifications",
  "/supersetdashboard"
];

function extractPaths(menuStructure) {
  const paths = [];

  function traverse(submenu) {
    submenu.forEach((item) => {
      if (item.path) paths.push(item.path);
      if (item.submenu) traverse(item.submenu);
    });
  }

  traverse(menuStructure);
  return [...paths, ...allowedPathsIfAuthenticated];
}

function extractAuthPaths(routes) {
  return routes.map((route) => route.path);
}

const AuthMiddleware = ({ children }) => {
  const isRestoring = useIsRestoring();
  const location = useLocation();
  const currentPath = location.pathname;

  const { user: storedUser, isLoading: authLoading, userId } = useAuthUser();
  const { data: sidedata = [], isLoading } = useFetchSideData(userId);

  const ownerId = storedUser?.user?.usr_owner_id
  const userType = storedUser?.user?.usr_user_type
  const param = ownerId ? { cso_id: ownerId } : null;
  const { data } = useSearchCsoInfos(param)
  const csoStatus = data?.data?.length > 0 ? data.data[0].cso_status : null;

  const authPaths = extractAuthPaths(authProtectedRoutes);
  const allowedPaths = sidedata.length > 0 ? extractPaths(sidedata) : [];

  const isCSOProjectPath = (path) => {
    const csoProjectPathRegex = /^\/projectdetail_cso\/\d+(#\w+)?$/i;
    return csoProjectPathRegex.test(path);
  };

  if (isCSOProjectPath(currentPath)) {
    allowedPaths.push("/projectdetail_cso/:id");
  }

  const isAuthenticated = localStorage.getItem("authUser");

  if (isRestoring || isLoading || authLoading) {
    return (
      <div
        style={{
          width: "100wh",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner color="primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if ((csoStatus === null || csoStatus === 0) && userType !== 4) {
    return <Navigate to="/not_approved" />;
  }

  if (!authPaths.includes(currentPath) && !isCSOProjectPath(currentPath)) {
    return <Navigate to="/not_found" />;
  }

  if (!allowedPaths.includes(currentPath) && !isCSOProjectPath(currentPath)) {
    return <Navigate to="/unauthorized" />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthMiddleware;