import { combineReducers } from "redux";
import Layout from "./layout/reducer";
import Dashboard from "./dashboard/reducer";
import QueryEnabler from "./queryEnabler/reducer";

const rootReducer = combineReducers({
	Layout,
	Dashboard,
	QueryEnabler,
});

export default rootReducer;
