import { combineReducers } from "redux";
import Layout from "./layout/reducer";
import authReducer from "./auth/reducer";
import listReducer from "./projectList/reducer";

const rootReducer = combineReducers({
	Layout,
	Auth: authReducer,
	projectList: listReducer,
	citizenProjectList: listReducer,
	citizenProject: listReducer,
	csoProjectList: listReducer,
});

export default rootReducer;
