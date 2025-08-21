import { combineReducers } from "redux";
import Layout from "./layout/reducer";
import authReducer from "./auth/reducer";
import projectListReducer from "./projectList/reducer";

const rootReducer = combineReducers({
  Layout,
  Auth: authReducer,
  projectListReducer,
});

export default rootReducer;
