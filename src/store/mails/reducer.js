import {
  GET_MAILS_LIST_FAIL,
  GET_MAILS_LIST_SUCCESS,
  GET_SELECTED_MAILS_SUCCESS,
  GET_SELECTED_MAILS_FAIL,
  SET_FOLDER_SELECTED_MAILS_SUCCESS,
  SET_FOLDER_SELECTED_MAILS_FAIL,
  SELECT_FOLDER_SUCCESS,
  SELECT_FOLDER_FAIL,
  DELETE_MAIL_SUCCESS,
  DELETE_MAIL_FAIL,
  TRASH_MAIL_SUCCESS,
  TRASH_MAIL_FAIL,
  STARED_MAIL_SUCCESS,
  STARED_MAIL_FAIL,
  GET_MAIL_ID_SUCCESS,
  GET_MAIL_ID_FAIL
} from "./actionTypes";

const INIT_STATE = {
  mailslists: [],
  mailsListsId: [],
  error: {},
  selectedmails: [],
  folderId: [],
  folders: [],
  loading: true
};

const Mails = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_MAILS_LIST_SUCCESS:
      return {
        ...state,
        mailslists: action.payload,
        loading: true
      };

    case GET_MAILS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case SELECT_FOLDER_SUCCESS:
      return {
        ...state,
        folders: action.payload,
      };

    case SELECT_FOLDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SELECTED_MAILS_SUCCESS:
      return {
        ...state,
        selectedmails: action.payload ? (action.payload.length > 1) ? action.payload : state.selectedmails.includes(action.payload)
          ? state.selectedmails.filter((id) => id !== action.payload)
          : [...state.selectedmails, action.payload] : []
      };

    case GET_SELECTED_MAILS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_MAIL_SUCCESS:
      return {
        ...state,
        mailslists: state.mailslists.filter(
          (mail) => mail.id !== action.payload
        )
      };

    case DELETE_MAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case TRASH_MAIL_SUCCESS:
      return {
        ...state,
        mailslists: state.mailslists.map((mail) => {
          if (mail.id === action.payload) {
            return { ...mail, category: "trash" };
          }
          return mail;
        })
      };

    case TRASH_MAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case STARED_MAIL_SUCCESS:
      return {
        ...state,
        mailslists: state.mailslists.map((mail) => {
          if (mail.id === action.payload) {
            const newCategory = mail.category === "starred" ? "inbox" : "starred";
            return { ...mail, category: newCategory };
          }
          return mail;
        })
      };

    case STARED_MAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case SET_FOLDER_SELECTED_MAILS_SUCCESS:
      return {
        ...state,
        selectedmails: state.selectedmails,
        folderId: action.payload,
      };

    case SET_FOLDER_SELECTED_MAILS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_MAIL_ID_SUCCESS:
      return {
        ...state,
        mailsListsId: action.payload
      };

    case GET_MAIL_ID_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default Mails;