import PropTypes from "prop-types";
import React, { useState, useEffect, Suspense, useMemo, lazy } from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
	Route,
} from "react-router-dom";
import { connect, useDispatch } from "react-redux";

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
import Header from "./components/HorizontalLayout/Header";
import NonAuthLayout from "./components/NonAuthLayout";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import Unauthorized from "./components/Common/Unauthorized";
const AccountVerification = lazy(() =>
	import("./components/Common/AccountVerification")
);

import NetworkAlert from "./components/Common/NetworkAlert";
import { scheduleTokenRefresh, refreshAccessToken } from "./helpers/api_Lists";
import { changeLayout } from "./store/layout/actions.js";
import "./App.css";

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

const LayoutProperties = createSelector(
	(state) => state.Layout,
	(layout) => ({
		layoutType: layout.layoutType,
	})
);

const authProperties = createSelector(
	(state) => state.Auth,
	(auth) => ({
		accessToken: auth.accessToken,
	})
);

const ApprovalPage = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(changeLayout("horizontal"));
	}, [dispatch]);

	return (
		<div id="layout-wrapper">
			<Header />
			<div className="main-content">
				<ErrorBoundary>
					<Suspense fallback={<Spinners />}>
						<AccountVerification />
					</Suspense>
				</ErrorBoundary>
			</div>
		</div>
	);
};

const App = () => {
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	const [isAuthResolved, setIsAuthResolved] = useState(false);

	const { accessToken } = useSelector(authProperties);
	const { layoutType } = useSelector(LayoutProperties);
	const Layout = useMemo(() => getLayout(layoutType), [layoutType]);

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
		scheduleTokenRefresh(accessToken);
	}, [accessToken]);

	useEffect(() => {
		const resolveAuth = async () => {
			if (!accessToken) {
				try {
					await refreshAccessToken();
				} catch (err) {
					// silent fail
				}
			}
			setIsAuthResolved(true);
		};
		resolveAuth();
	}, []);

	// Wait for refresh check to complete
	if (!isAuthResolved) {
		return <Spinners />;
	}

	const router = createBrowserRouter(
		createRoutesFromElements(
			<>
				{publicRoutes.map((route, idx) => (
					<Route
						key={idx}
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
						exact={true}
						errorElement={<ErrorElement />}
					/>
				))}

				{authProtectedRoutes.map((route, idx) => (
					<Route
						key={idx}
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
						exact={true}
						errorElement={<ErrorElement />}
					/>
				))}

				<Route
					path="/not_approved"
					element={
						<>
							<ApprovalPage />
						</>
					}
					errorElement={<ErrorElement />}
				/>
				<Route
					path="/unauthorized"
					element={
						<Layout>
							<ErrorBoundary>
								<Unauthorized />
							</ErrorBoundary>
						</Layout>
					}
					errorElement={<ErrorElement />}
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
					errorElement={<ErrorElement />}
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
