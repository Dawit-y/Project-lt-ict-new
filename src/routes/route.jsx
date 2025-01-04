import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authProtectedRoutes } from ".";
import { Spinner } from "reactstrap";

function extractPaths(menuStructure) {
  const paths = [];

  function traverse(submenu) {
    submenu.forEach((item) => {
      if (item.path) paths.push(item.path);
      if (item.submenu) traverse(item.submenu);
    });
  }

  traverse(menuStructure);
  return [...paths, "/", "/dashboard"];
}

function extractAuthPaths(routes) {
  return routes.map((route) => route.path);
}

const SIDEDATA_CACHE_KEY = "sidedata_cache";

const AuthMiddleware = ({ children }) => {
  const [sidedata, setSidedata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const cachedData = localStorage.getItem(SIDEDATA_CACHE_KEY);
    if (cachedData) {
      setSidedata(JSON.parse(cachedData));
      setIsLoading(false);
    } else {
      fetchSidedata();
    }
  }, []);

  const fetchSidedata = async () => {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}menus`,
        {
          method: "POST",
          headers: {
            Authorization:
              storedUser.authorization.type +
              " " +
              storedUser.authorization.token,
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      // Group data by `parent_menu`
      const groupedData = data.data.reduce((acc, curr) => {
        const { parent_menu, link_name, link_url, link_icon } = curr;
        if (!acc[parent_menu]) {
          acc[parent_menu] = {
            title: parent_menu.charAt(0).toUpperCase() + parent_menu.slice(1),
            icon: link_icon,
            submenu: [],
          };
        }
        acc[parent_menu].submenu.push({
          name: link_name.replace(/-/g, " "),
          path: `/${link_url}`,
        });
        return acc;
      }, {});

      const groupedSidedata = Object.values(groupedData);
      setSidedata(groupedSidedata);
      localStorage.setItem(SIDEDATA_CACHE_KEY, JSON.stringify(groupedSidedata));
    } catch (error) {
      console.error("Error fetching sidedata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const authPaths = extractAuthPaths(authProtectedRoutes);
  const allowedPaths = sidedata.length > 0 ? extractPaths(sidedata) : [];

  if (allowedPaths.includes("/Project")) {
    allowedPaths.push(
      "/Project/:id",
      "/Project/:id/project_plan",
      "/Project/:id/budget_request",
      "/Project/:id/budget_expenditure"
    );
  }

  const isAuthenticated = sessionStorage.getItem("authUser");

  if (isLoading) {
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

  if (!authPaths.includes(currentPath)) {
    return <Navigate to="*" />;
  }

  if (!allowedPaths.includes(currentPath)) {
    return <Navigate to="/unauthorized" />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthMiddleware;
