import PropTypes from "prop-types";
import React, { useState, useEffect, Suspense, useMemo, lazy } from "react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { connect } from "react-redux";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import { authProtectedRoutes, publicRoutes } from "./routes/index";
import Authmiddleware from "./routes/route";

import ErrorElement from "./components/Common/ErrorElement";
import { SessionTimeoutProvider } from "./pages/Authentication/Context/SessionTimeoutContext";
import NotFound from "./components/Common/NotFound";
import Spinners from "./components/Common/Spinner";
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import Unauthorized from "./components/Common/Unauthorized";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NetworkAlert from "./components/Common/NetworkAlert";
import { scheduleTokenRefresh } from "./helpers/api_Lists";

function getLayout(layoutType) {
  // Check if layoutType exists in localStorage
  const storedLayoutType = localStorage.getItem("layoutType");
  let layoutCls = VerticalLayout;

  if (storedLayoutType) {
    layoutCls =
      storedLayoutType === "horizontal" ? HorizontalLayout : VerticalLayout;
  } else {
    switch (layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
  }
  return layoutCls;
}


const App = (props) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);
    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      toast.error("You are currently offline", { autoClose: 1000 });
    } else {
      toast.success("You are back online", { autoClose: 1000 });
    }
  }, [isOnline]);

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  useEffect(() => {
    scheduleTokenRefresh(authUser?.authorization?.token)
  }, [authUser])

  const LayoutProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({
      layoutType: layout.layoutType,
    })
  );
  const { layoutType } = useSelector(LayoutProperties);
  const Layout = useMemo(() => getLayout(layoutType), [layoutType]);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <NonAuthLayout>
                <SessionTimeoutProvider>
                  <ErrorBoundary>
                    <Suspense fallback={<Spinners />}>
                      {route.component}
                    </Suspense>
                  </ErrorBoundary>
                </SessionTimeoutProvider>
              </NonAuthLayout>
            }
            key={idx}
            exact={true}
            errorElement={<ErrorElement />}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <Authmiddleware>
                <SessionTimeoutProvider>
                  <Layout>
                    <ErrorBoundary>
                      <Suspense fallback={<Spinners />}>
                        {route.component}
                      </Suspense>
                    </ErrorBoundary>
                  </Layout>
                </SessionTimeoutProvider>
              </Authmiddleware>
            }
            key={idx}
            exact={true}
            errorElement={<ErrorElement />}
          />
        ))}

        <Route
          path="/unauthorized"
          element={
            <Layout>
              <ErrorBoundary>
                <Unauthorized />
              </ErrorBoundary>
            </Layout>
          }
        />
        <Route
          path="/not_found"
          element={
            <Layout>
              <ErrorBoundary>
                <NotFound />
              </ErrorBoundary>
            </Layout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </>
    )
  );

  return (
    <>
      {!isOnline && (
        <NetworkAlert AlertMessage={<b>No internet connection.</b>} />
      )}
      <RouterProvider router={router} />
    </>
  );
};

App.propTypes = {
  layout: PropTypes.any,
};

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  };
};

export default connect(mapStateToProps, null)(App);
