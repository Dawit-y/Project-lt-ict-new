import { del, get, post, put } from "./api_Lists";

const GET_PROJECT_DASHBOARD = "superset_dashboard";

// GET Project dashboard components with Authorization header
export const getProjectDashboardComponent = async (endPoint) => {
  try {
    const response = await post(`${endPoint}/listgrid`);
    return response.data; // Return the response data directly
  } catch (e) {
    console.error("Error fetching dashboard components:", e);
    throw e; // Rethrow error for handling elsewhere
  }
};

// GET pROJECT DASHBOARD
export const getProjectDashboard = async (role) => {
  try {
    const response = await post(`${GET_PROJECT_DASHBOARD}`, role);
    return response.data; // Return the response data directly
  } catch (e) {
    console.log("Error fetching dashboard response:", e);
    throw e; // Rethrow the error for handling in the component
  }
};
