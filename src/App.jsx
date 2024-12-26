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
import ErrorBoundary from "./components/Common/ErrorBoundary";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NetworkAlert from "./components/Common/NetworkAlert";

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
            errorElement={
              <NonAuthLayout>
                <ErrorElement />
              </NonAuthLayout>
            }
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
            errorElement={
              <Layout>
                <ErrorElement />
              </Layout>
            }
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </>
    )
  );

  return (
    <>
      {!isOnline && (
        <NetworkAlert AlertMessage={<b>Oops! No internet connection.</b>} />
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

// import PropTypes from "prop-types";
// import React, { useState, useEffect, Suspense } from "react";
// import {
//   createBrowserRouter,
//   createRoutesFromElements,
//   RouterProvider,
//   Route,
//   Outlet,
// } from "react-router-dom";
// import { connect } from "react-redux";
// import { useSelector } from "react-redux";
// import { createSelector } from "reselect";

// // Import Routes all
// import { authProtectedRoutes, publicRoutes } from "./routes/index";

// // Import all middleware
// import Authmiddleware from "./routes/route";

// // layouts Format
// import ErrorElement from "./components/Common/ErrorElement";
// import { SessionTimeoutProvider } from "./pages/Authentication/Context/SessionTimeoutContext";
// import NotFound from "./components/Common/NotFound";
// import Spinners from "./components/Common/Spinner";
// import VerticalLayout from "./components/VerticalLayout/";
// import HorizontalLayout from "./components/HorizontalLayout/";
// import NonAuthLayout from "./components/NonAuthLayout";
// import ErrorBoundary from "./components/Common/ErrorBoundary";

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import NetworkAlert from "./components/Common/NetworkAlert";

// // Project Components
// const Project = React.lazy(() => import("./pages/Project"));
// const ProjectDetails = React.lazy(() =>
//   import("./pages/Project/ProjectOverview/index")
// );
// const ProjectPlan = React.lazy(() => import("./pages/Projectplan"));

// const App = (props) => {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   useEffect(() => {
//     const handleOnlineStatusChange = () => {
//       setIsOnline(navigator.onLine);
//     };
//     window.addEventListener("online", handleOnlineStatusChange);
//     window.addEventListener("offline", handleOnlineStatusChange);
//     return () => {
//       window.removeEventListener("online", handleOnlineStatusChange);
//       window.removeEventListener("offline", handleOnlineStatusChange);
//     };
//   }, []);

//   useEffect(() => {
//     if (!isOnline) {
//       toast.error("You are currently offline", { autoClose: 1000 });
//     } else {
//       toast.success("You are back online", { autoClose: 1000 });
//     }
//   }, [isOnline]);

//   const LayoutProperties = createSelector(
//     (state) => state.Layout,
//     (layout) => ({
//       layoutType: layout.layoutType,
//     })
//   );

//   const { layoutType } = useSelector(LayoutProperties);

//   function getLayout(layoutType) {
//     const storedLayoutType = localStorage.getItem("layoutType");
//     let layoutCls = VerticalLayout;

//     if (storedLayoutType) {
//       layoutCls =
//         storedLayoutType === "horizontal" ? HorizontalLayout : VerticalLayout;
//     } else {
//       switch (layoutType) {
//         case "horizontal":
//           layoutCls = HorizontalLayout;
//           break;
//         default:
//           layoutCls = VerticalLayout;
//           break;
//       }
//     }

//     return layoutCls;
//   }

//   const Layout = getLayout(layoutType);

//   const router = createBrowserRouter(
//     createRoutesFromElements(
//       <>
//         {/* Public Routes */}
//         {publicRoutes.map((route, idx) => (
//           <Route
//             path={route.path}
//             element={
//               <NonAuthLayout>
//                 <SessionTimeoutProvider>
//                   <ErrorBoundary>
//                     <Suspense fallback={<Spinners />}>
//                       {route.component}
//                     </Suspense>
//                   </ErrorBoundary>
//                 </SessionTimeoutProvider>
//               </NonAuthLayout>
//             }
//             key={idx}
//             exact
//             errorElement={
//               <NonAuthLayout>
//                 <ErrorElement />
//               </NonAuthLayout>
//             }
//           />
//         ))}

//         {/* Authenticated Routes */}
//         {authProtectedRoutes.map((route, idx) => (
//           <Route
//             path={route.path}
//             element={
//               <Authmiddleware>
//                 <SessionTimeoutProvider>
//                   <Layout>
//                     <ErrorBoundary>
//                       <Suspense fallback={<Spinners />}>
//                         {route.component}
//                       </Suspense>
//                     </ErrorBoundary>
//                   </Layout>
//                 </SessionTimeoutProvider>
//               </Authmiddleware>
//             }
//             key={idx}
//             exact
//             errorElement={
//               <Layout>
//                 <ErrorElement />
//               </Layout>
//             }
//           />
//         ))}

//         {/* Fallback for unknown routes */}
//         <Route path="*" element={<NotFound />} />
//       </>
//     )
//   );

//   return (
//     <>
//       {!isOnline && (
//         <NetworkAlert AlertMessage={<b>Oops! No internet connection.</b>} />
//       )}
//       <RouterProvider router={router} />
//     </>
//   );
// };

// App.propTypes = {
//   layout: PropTypes.any,
// };

// const mapStateToProps = (state) => {
//   return {
//     layout: state.Layout,
//   };
// };

// export default connect(mapStateToProps, null)(App);
