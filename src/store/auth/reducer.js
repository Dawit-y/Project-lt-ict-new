const initialState = {
	accessToken: null,
  userData: null,
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case "SET_AUTH_DATA":
			return {
				...state,
				accessToken: action.payload.accessToken,
        userData: action.payload.userData,
			};
		case "CLEAR_AUTH_DATA":
			return {
				...initialState,
			};
		default:
			return state;
	}
};

export default authReducer;
