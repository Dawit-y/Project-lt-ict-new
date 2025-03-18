import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_BASE_API_URL;
const axiosApi = axios.create({ baseURL: API_URL });

const redirectToLogin = () => {
  window.location.href = "/login";
};

let refreshTimeout;
const getStoredUser = () => JSON.parse(localStorage.getItem("authUser"));

// Function to update stored user data
const updateStoredUser = (newAuthData) => {
  localStorage.setItem("authUser", JSON.stringify(newAuthData));
  scheduleTokenRefresh(newAuthData.authorization.token);
};

// Function to schedule token refresh before expiry
export const scheduleTokenRefresh = (token) => {
  if (!token) return;

  try {
    const decoded = jwtDecode(token); // Decode JWT payload
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const expiresIn = decoded.exp - currentTime; // Remaining time until expiration

    if (expiresIn > 0) {
      const refreshTime = Math.max((expiresIn - 300) * 1000, 1000); // Refresh 5 mins before expiration
      //const refreshTime = 60 * 1000; // 1 minute

      clearTimeout(refreshTimeout); // Clear previous timeout
      refreshTimeout = setTimeout(refreshAccessToken, refreshTime);
      // console.log(`Token will refresh in ${refreshTime / 1000} seconds`);
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }
};

// Function to refresh access token
const refreshAccessToken = async () => {
  const storedUser = getStoredUser();
  if (!storedUser?.authorization?.refresh_token) {
    console.warn("No refresh token available.");
    redirectToLogin();
    return;
  }

  try {
    const { data } = await axios.post(`${API_URL}refreshtoken`, null, {
      headers: {
        Authorization: `Bearer ${storedUser?.authorization?.refresh_token}`,
      },
    });
    updateStoredUser(data);
    // console.log("Access token refreshed successfully!");
  } catch (error) {
    console.error("Failed to refresh token:", error);
    localStorage.removeItem("authUser");
    redirectToLogin();
  }
};

// Attach Authorization Header in Requests
axiosApi.interceptors.request.use(
  (config) => {
    const storedUser = getStoredUser();
    if (storedUser?.authorization?.token) {
      config.headers["Authorization"] =
        `${storedUser.authorization.type} ${storedUser.authorization.token}`;
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

    if (error.response?.status === 401 && !error?.response?.data?.message.includes("Incorrect email") && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken();

        const storedUser = getStoredUser();
        originalRequest.headers["Authorization"] =
          `${storedUser.authorization.type} ${storedUser.authorization.token}`;

        return axiosApi(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed in response intercept:", refreshError);
        localStorage.removeItem("authUser");
        redirectToLogin()
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Schedule token refresh when the app starts
const storedUser = getStoredUser();
if (storedUser?.authorization?.token) {
  scheduleTokenRefresh(storedUser.authorization.token);
}

export async function get(url, config = {}) {
  return axiosApi.get(url, { ...config }).then((response) => response?.data);
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then((response) => response?.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response?.data);
}

export async function del(url, config = {}) {
  return axiosApi
    .delete(url, { ...config })
    .then((response) => response?.data);
}
