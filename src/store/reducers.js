import { combineReducers } from "redux";
import Layout from "./layout/reducer";
import QueryEnabler from "./queryEnabler/reducer";

const rootReducer = combineReducers({
	Layout,
	QueryEnabler,
});

export default rootReducer;
