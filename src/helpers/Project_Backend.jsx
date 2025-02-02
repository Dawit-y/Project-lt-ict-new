import axios from "axios";
import { del, get, post, put } from "./api_Lists";
import * as url from "./url_Lists";

const apiUrl = import.meta.env.VITE_BASE_API_URL;


// GET Project dashboard components with Authorization header
export const getProjectDashboardComponent = async (endPoint) => {
  try {
    const response = await post(
      `${endPoint}/listgrid`
    );
    return response.data; // Return the response data directly
  } catch (e) {
    console.error("Error fetching dashboard components:", e);
    throw e; // Rethrow error for handling elsewhere
  }
};
// GET pROJECT DASHBOARD
export const getProjectDashboard = async (role) => {
  try {
    const response = await post(`${url.GET_PROJECT_DASHBOARD}`, role);
    return response.data; // Return the response data directly
  } catch (e) {
    console.log("Error fetching dashboard response:", e);
    throw e; // Rethrow the error for handling in the component
  }
};

// PROJECT TREE
export const getProjectTreeStatus=async()=>{
  
  try{
    const response=await post(url.GET_PROJECT_TREE);
    return response;
  }
  catch(error){
    console.log("errer on backend ")
    console.log(error);
  }
}
// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
const postFakeRegister = (data) => {
  return axios
    .post(url.POST_FAKE_REGISTER, data)
    .then((response) => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch((err) => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
const postFakeLogin = (data) => post(url.POST_FAKE_LOGIN, data);

// postForgetPwd
const postFakeForgetPwd = (data) => post(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
const postJwtProfile = (data) => post(url.POST_EDIT_JWT_PROFILE, data);

const postFakeProfile = (data) => post(url.POST_EDIT_PROFILE, data);

// Register Method
const postJwtRegister = (url, data) => {
  return axios
    .post(url, data)
    .then((response) => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch((err) => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
const postJwtLogin = (data) => post(`${apiUrl}login`, data);

// postForgetPwd
const postJwtForgetPwd = (data) =>
  post(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = (data) => post(url.SOCIAL_LOGIN, data);

// get Products
export const getProducts = () => get(url.GET_PRODUCTS);

// get Product detail
export const getProductDetail = (id) =>
  get(`${url.GET_PRODUCTS_DETAIL}/${id}`, { params: { id } });
//Email Chart
export const getDashboardEmailChart = (chartType) =>
  get(`${url.GET_DASHBOARD_EMAILCHART}/${chartType}`, { param: chartType });

// get chats
export const getChats = () => get(url.GET_CHATS);

// get groups
export const getGroups = () => get(url.GET_GROUPS);

// get Contacts
export const getContacts = () => get(url.GET_CONTACTS);

// get messages
export const getMessages = (roomId) =>
  get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } });
export {
  getLoggedInUser,
  isUserAuthenticated,
  postFakeRegister,
  postFakeLogin,
  postFakeProfile,
  postFakeForgetPwd,
  postJwtRegister,
  postJwtLogin,
  postJwtForgetPwd,
  postJwtProfile
  // this is for project tre
};