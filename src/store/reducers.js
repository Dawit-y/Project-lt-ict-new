import { combineReducers } from "redux";
import Layout from "./layout/reducer";
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";
import Dashboard from "./dashboard/reducer";

const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  Dashboard,
});

export default rootReducer;
