import React, { useEffect } from "react";
import withRouter from "../../components/Common/withRouter";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { clearAuthData } from "../../store/auth/actions";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { post } from "../../helpers/api_Lists";
import Spinners from "../../components/Common/Spinner";

const logout = async () => {
	await post("/logout");
};

const Logout = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	const { mutate } = useMutation({
		mutationFn: logout,
		onSuccess: () => {
			queryClient.clear();
			dispatch(clearAuthData());
			navigate("/login", { replace: true });
		},
		onError: () => {
			queryClient.clear();
			dispatch(clearAuthData());
			navigate("/login", { replace: true });
		},
	});

	useEffect(() => {
		mutate();
	}, [mutate]);

	return <Spinners />;
};

export default withRouter(Logout);
