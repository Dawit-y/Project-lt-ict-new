import { combineReducers } from "redux";
import Layout from "./layout/reducer";
import QueryEnabler from "./queryEnabler/reducer";
import authReducer from "./auth/reducer";

const rootReducer = combineReducers({
	Layout,
	QueryEnabler,
	Auth: authReducer,
});

export default rootReducer;
