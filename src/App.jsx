import PropTypes from "prop-types";
import React, { useState, useEffect, Suspense } from "react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { connect } from "react-redux";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// Import Routes all
import { authProtectedRoutes, publicRoutes } from "./routes/index";

// Import all middleware
import Authmiddleware from "./routes/route";

// layouts Format
import ErrorElement from "./components/Common/ErrorElement";
import { SessionTimeoutProvider } from "./pages/Authentication/Context/SessionTimeoutContext";
import NotFound from "./components/Common/NotFound";
import Spinners from "./components/Common/Spinner";
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const LayoutProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({
      layoutType: layout.layoutType,
    })
  );

  const { layoutType } = useSelector(LayoutProperties);

  function getLayout(layoutType) {
    let layoutCls = VerticalLayout;
    switch (layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  const Layout = getLayout(layoutType);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <NonAuthLayout>
                <SessionTimeoutProvider>
                  <Suspense fallback={<Spinners />}>{route.component}</Suspense>
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
                    <Suspense fallback={<Spinners />}>
                      {route.component}
                    </Suspense>
                  </Layout>
                </SessionTimeoutProvider>
              </Authmiddleware>
            }
            key={idx}
            exact={true}
            errorElement={<ErrorElement />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
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
