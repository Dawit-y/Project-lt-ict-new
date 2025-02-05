import { combineReducers } from "redux";
import Layout from "./layout/reducer";
import Dashboard from "./dashboard/reducer";

const rootReducer = combineReducers({
  Layout,
  Dashboard,
});

export default rootReducer;
