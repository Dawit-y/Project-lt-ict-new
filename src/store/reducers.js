import { combineReducers } from "redux";
import Layout from "./layout/reducer";
import authReducer from "./auth/reducer";
import projectListReducer from "./projectList/projectListReducer";
import citizenProjectReducer from "./projectList/citizenProjectReducer";
import citizenProjectListReducer from "./projectList/citizenProjectListReducer";

const rootReducer = combineReducers({
	Layout,
	Auth: authReducer,
	projectList: projectListReducer,
	citizenProjectList: citizenProjectListReducer,
	citizenProject: citizenProjectReducer,
});

export default rootReducer;
