import { combineReducers } from "redux";
import Layout from "./layout/reducer";
import authReducer from "./auth/reducer";

const rootReducer = combineReducers({
	Layout,
	Auth: authReducer,
});

export default rootReducer;
