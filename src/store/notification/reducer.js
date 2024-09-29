// reducer.js
import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  MARK_NOTIFICATIONS_AS_READ_REQUEST,
  MARK_NOTIFICATIONS_AS_READ_SUCCESS,
  MARK_NOTIFICATIONS_AS_READ_FAILURE,
} from "./actionTypes";

const initialState = {
  notifications: [],
  previledge: {},
  loading: false,
  error: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload.data.filter(
          (notification) => notification.not_is_read === 0
        ),
        previledge: action.payload.previledge,
      };
    case FETCH_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case MARK_NOTIFICATIONS_AS_READ_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case MARK_NOTIFICATIONS_AS_READ_SUCCESS:
      const updatedNotificationIds = action.payload.data
        .split(",")
        .map((id) => parseInt(id, 10));
      return {
        ...state,
        loading: false,
        notifications: state.notifications.map((notification) =>
          updatedNotificationIds.includes(notification.not_id)
            ? { ...notification, not_is_read: 1 }
            : notification
        ),
      };
    case MARK_NOTIFICATIONS_AS_READ_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default notificationReducer;
