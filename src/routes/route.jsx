import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authProtectedRoutes } from ".";
import { Spinner } from "reactstrap";
import { useFetchSideData } from "../queries/side_data_query";
import { useSearchCsoInfos } from "../queries/csoinfo_query";
import { useAuthUser } from "../hooks/useAuthUser";
import { useIsRestoring } from "@tanstack/react-query";
import NoRoleAssigned from "../components/Common/NoRoleAssigned";
import CsoDataNotFound from "../components/Common/CsoDataNotFound";

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
		isLoading: sideDataLoading,
		isError,
	} = useFetchSideData(userId);

	const ownerId = storedUser?.usr_owner_id;
	const userType = storedUser?.usr_user_type;

	const { param, isValidParam } = useMemo(() => {
		const param = {
			cso_id: ownerId,
		};

		const isValidParam =
			Object.keys(param).length > 0 &&
			Object.values(param).every(
				(value) => value !== null && value !== undefined
			);

		return { param, isValidParam };
	}, [ownerId]);
	const { data, isLoading: csoInfoLoading } = useSearchCsoInfos(
		param,
		isValidParam
	);

	if (data?.data?.length === 0 && userType !== 4) {
		return <CsoDataNotFound />;
	}

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

	const isAuthenticated = storedUser && Object.keys(storedUser).length > 0;

	if (isRestoring || sideDataLoading || authLoading || csoInfoLoading) {
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
		isAuthenticated &&
		!sideDataLoading &&
		sidedata.length === 0 &&
		!isError
	) {
		return <NoRoleAssigned />;
	}

	if ((csoStatus === null || csoStatus === 0) && userType !== 4) {
		return <Navigate to="/not_approved" />;
	}

	const isAuthorizedPath =
		authPaths.includes(currentPath) || isCSOProjectPath(currentPath);
	if (!isAuthorizedPath) {
		return <Navigate to="/not_found" />;
	}

	const isAllowedPath =
		allowedPaths.includes(currentPath) || isCSOProjectPath(currentPath);
	if (!isAllowedPath) {
		return <Navigate to="/unauthorized" />;
	}

	return <React.Fragment>{children}</React.Fragment>;
};

export default AuthMiddleware;
