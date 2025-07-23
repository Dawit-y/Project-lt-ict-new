import React, { useEffect } from "react";
import withRouter from "../../components/Common/withRouter";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { clearAuthData } from "../../store/auth/actions";
import { useDispatch } from "react-redux";

const Logout = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	useEffect(() => {
		queryClient.clear();
		dispatch(clearAuthData());
		navigate("/login");
	}, []);

	return <></>;
};

export default withRouter(Logout);
