import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { store } from "../store";
import { setAuthData, clearAuthData } from "../store/auth/actions";

const NODE_ENV = import.meta.env.VITE_NODE_ENV;
const API_URL =
	NODE_ENV === "development" ? "/api" : import.meta.env.VITE_BASE_API_URL;
const axiosApi = axios.create({ baseURL: API_URL, withCredentials: true });

const redirectToLogin = () => {
	window.location.href = "/login";
};

// Function to schedule token refresh before expiry
export const scheduleTokenRefresh = (token) => {
	if (!token) return;

	try {
		const decoded = jwtDecode(token);
		const currentTime = Math.floor(Date.now() / 1000);
		const expiresIn = decoded.exp - currentTime;

		if (expiresIn > 0) {
			const refreshTime = Math.max((expiresIn - 300) * 1000, 1000); // Refresh 5 mins before expiration
			setTimeout(refreshAccessToken, refreshTime);
		}
	} catch (error) {
		console.error("Error decoding token:", error);
	}
};

// Function to refresh access token
export const refreshAccessToken = async () => {
	try {
		const response = await post(`refreshtoken`, null, {
			withCredentials: true,
		});

		const state = store.getState();
		if (!state) {
			console.error("Store is not ready yet");
			throw new Error("Store not initialized");
		}
		store.dispatch(setAuthData(response.authorization.token, response.user));
		scheduleTokenRefresh(response.authorization.token);
	} catch (refreshError) {
		store.dispatch(clearAuthData());
		const isOnHomePage = window.location.pathname === "/";

		if (!isOnHomePage && !isOnLoginPage) {
			redirectToLogin();
		}

		return Promise.reject(refreshError);
	}

};

// Attach Authorization Header in Requests
axiosApi.interceptors.request.use(
	(config) => {
		const state = store.getState();
		const accessToken = state.Auth.accessToken;

		if (accessToken) {
			config.headers["Authorization"] = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
axiosApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		const state = store.getState();
		const logoutReason = state.Auth.logoutReason;

		// Prevent infinite loop by NOT retrying refresh request
		const isRefreshRequest = originalRequest.url.includes("refreshtoken");
		if (isRefreshRequest) {
			if (error.response?.status === 401) {
				store.dispatch(clearAuthData());

        const isOnHomePage = window.location.pathname === "/";
        console.log("isOnHomePage", isOnHomePage);

				if (!isOnHomePage && window.location.pathname !== "/login") {
					redirectToLogin();
				}
			}
			return Promise.reject(error);
		}

		const isOnLoginPage = window.location.pathname === "/login";

		// Retry logic for other 401s
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			logoutReason !== "timeout" &&
			!isOnLoginPage
		) {
			originalRequest._retry = true;
			try {
				await refreshAccessToken();

				const updatedState = store.getState();

				originalRequest.headers["Authorization"] =
					`Bearer ${updatedState.Auth.accessToken}`;

				return axiosApi(originalRequest);
			} catch (refreshError) {
				store.dispatch(clearAuthData());
        const isOnHomePage = window.location.pathname === "/";
        console.log("isOnHomePage", isOnHomePage);

				if (!isOnHomePage && !isOnLoginPage) {
					redirectToLogin();
				}

				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export async function get(url, config = {}) {
	return axiosApi
		.get(url, { ...config, withCredentials: true })
		.then((response) => response?.data);
}

export async function post(url, data, config = {}) {
	return axiosApi
		.post(url, { ...data }, { ...config, withCredentials: true })
		.then((response) => response?.data);
}

export async function put(url, data, config = {}) {
	return axiosApi
		.put(url, { ...data }, { ...config, withCredentials: true })
		.then((response) => response?.data);
}

export async function del(url, config = {}) {
	return axiosApi
		.delete(url, { ...config, withCredentials: true })
		.then((response) => response?.data);
}
