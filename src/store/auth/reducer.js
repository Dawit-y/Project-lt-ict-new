const initialState = {
  accessToken: null,
  userData: null,
  logoutReason: null, // <-- new field
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_AUTH_DATA":
      return {
        ...state,
        accessToken: action.payload.accessToken,
        userData: action.payload.userData,
        logoutReason: null, // clear reason on new login
      };
    case "CLEAR_AUTH_DATA":
      return {
        ...initialState,
        logoutReason: action.payload?.reason || null,
      };
    default:
      return state;
  }
};

export default authReducer;
