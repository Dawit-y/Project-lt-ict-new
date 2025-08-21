import { SET_AUTH_DATA, CLEAR_AUTH_DATA } from "./actionTypes";

export const setAuthData = (accessToken, userData) => ({
  type: SET_AUTH_DATA,
  payload: { accessToken, userData },
});

export const clearAuthData = (reason = null) => {
  return {
    type: "CLEAR_AUTH_DATA",
    payload: { reason },
  };
};
