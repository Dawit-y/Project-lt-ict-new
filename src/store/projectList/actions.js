import {
  SET_PROJECT_LIST_STATE,
  RESET_PROJECT_LIST_STATE,
} from "./actionTypes";

export const setProjectListState = (payload) => ({
  type: SET_PROJECT_LIST_STATE,
  payload,
});

export const resetProjectListState = () => ({
  type: RESET_PROJECT_LIST_STATE,
});
