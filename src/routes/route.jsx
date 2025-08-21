import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authProtectedRoutes } from ".";
import { Spinner } from "reactstrap";
import { useFetchSideData } from "../queries/side_data_query";
import { useAuthUser } from "../hooks/useAuthUser";
import { useIsRestoring } from "@tanstack/react-query";

// these are paths that are allowed if the user is authenticated
const allowedPathsIfAuthenticated = [
	"/",
	"/dashboard",
	"/profile",
	"/notifications",
	"/supersetdashboard",
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

	const {
		data: sidedata = [],
		isLoading,
		isError,
		refetch,
		failureCount,
	} = useFetchSideData(userId);

	const authPaths = extractAuthPaths(authProtectedRoutes);
	const allowedPaths = sidedata.length > 0 ? extractPaths(sidedata) : [];

	const isAnyProjectPath = (path) => {
		const combinedProjectPathRegex =
			/^\/(Project(detail)?|citizenship_project_detail|projectdetail_cso)\/\d+(\/\w+)?(#\w+)?$/i;
		return combinedProjectPathRegex.test(path);
	};

	if (isAnyProjectPath(currentPath)) {
		allowedPaths.push("/projectdetail/:id");
		allowedPaths.push("/citizenship_project_detail/:id");
		allowedPaths.push("/projectdetail_cso/:id");
	}

	const isBudgetRequestApprovalPath = (path) => {
		const budgetRequestApprovalRegex =
			/^\/budget_request_approval\/\d+(\/\w+)?(#\w+)?$/i;
		return budgetRequestApprovalRegex.test(path);
	};

	if (isBudgetRequestApprovalPath(currentPath)) {
		allowedPaths.push("/budget_request_approval/:id");
	}

	const isAuthenticated = storedUser && Object.keys(storedUser).length > 0;

	useEffect(() => {
		if (sidedata.length === 0 && !isLoading && !isError && userId) {
			const timer = setTimeout(() => {
				refetch();
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [sidedata.length, isLoading, isError, userId, refetch]);

	if (isError && failureCount >= 3) {
		return (
			<div
				style={{
					width: "100wh",
					height: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
				}}
			>
				<p>Failed to load navigation data. Please try again.</p>
				<button onClick={() => refetch()} className="btn btn-primary mt-2">
					Retry
				</button>
			</div>
		);
	}

	if (
		isRestoring ||
		isLoading ||
		authLoading ||
		(sidedata.length === 0 && !isError)
	) {
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

	if (
		!authPaths.includes(currentPath) &&
		!isAnyProjectPath(currentPath) &&
		!isBudgetRequestApprovalPath(currentPath)
	) {
		return <Navigate to="/not_found" />;
	}

	if (
		!allowedPaths.includes(currentPath) &&
		!isAnyProjectPath(currentPath) &&
		!isBudgetRequestApprovalPath(currentPath)
	) {
		return <Navigate to="/unauthorized" />;
	}

	return <React.Fragment>{children}</React.Fragment>;
};

export default AuthMiddleware;
