// @flow
import {
	CHANGE_LAYOUT,
	CHANGE_LAYOUT_WIDTH,
	CHANGE_SIDEBAR_THEME,
	CHANGE_SIDEBAR_TYPE,
	CHANGE_TOPBAR_THEME,
	SHOW_RIGHT_SIDEBAR,
	CHANGE_SIDEBAR_THEME_IMAGE,
	CHANGE_PRELOADER,
	TOGGLE_LEFTMENU,
	SHOW_SIDEBAR,
	CHANGE_LAYOUT_MODE,
} from "./actionTypes";

//constants
import {
	layoutTypes,
	layoutModeTypes,
	layoutWidthTypes,
	topBarThemeTypes,
	leftBarThemeImageTypes,
	leftSidebarTypes,
	leftSideBarThemeTypes,
} from "../../constants/layout";

import { persistLayout, getLayout } from "../../utils/layoutStorage";

const INIT_STATE = {
	layoutType: getLayout("layoutType") || layoutTypes.HORIZONTAL,
	layoutModeType: getLayout("layoutModeType") || layoutModeTypes.LIGHT,
	layoutWidth: getLayout("layoutWidth") || layoutWidthTypes.FLUID,
	leftSideBarTheme:
		getLayout("leftSideBarTheme") || leftSideBarThemeTypes.COLORED,
	leftSideBarThemeImage:
		getLayout("leftSideBarThemeImage") || leftBarThemeImageTypes.NONE,
	leftSideBarType: getLayout("leftSideBarType") || leftSidebarTypes.DEFAULT,
	topbarTheme: getLayout("topbarTheme") || topBarThemeTypes.LIGHT,
	isPreloader: getLayout("isPreloader") || false,
	showRightSidebar: false,
	isMobile: false,
	showSidebar: true,
	leftMenu: false,
};

const Layout = (state = INIT_STATE, action) => {
	switch (action.type) {
		case CHANGE_LAYOUT:
			persistLayout("layoutType", action.payload);
			return {
				...state,
				layoutType: action.payload,
			};
		case CHANGE_PRELOADER:
			persistLayout("isPreloader", action.payload);
			return {
				...state,
				isPreloader: action.payload,
			};
		case CHANGE_LAYOUT_MODE:
			persistLayout("layoutModeType", action.payload);
			return {
				...state,
				layoutModeType: action.payload,
			};
		case CHANGE_LAYOUT_WIDTH:
			persistLayout("layoutWidth", action.payload);
			return {
				...state,
				layoutWidth: action.payload,
			};
		case CHANGE_SIDEBAR_THEME:
			persistLayout("leftSideBarTheme", action.payload);
			return {
				...state,
				leftSideBarTheme: action.payload,
			};
		case CHANGE_SIDEBAR_THEME_IMAGE:
			persistLayout("leftSideBarThemeImage", action.payload);
			return {
				...state,
				leftSideBarThemeImage: action.payload,
			};
		case CHANGE_SIDEBAR_TYPE:
			persistLayout("leftSideBarType", action.payload);
			return {
				...state,
				leftSideBarType: action.payload.sidebarType,
			};
		case CHANGE_TOPBAR_THEME:
			persistLayout("topbarTheme", action.payload);
			return {
				...state,
				topbarTheme: action.payload,
			};
		case SHOW_RIGHT_SIDEBAR:
			persistLayout("showRightSidebar", action.payload);
			return {
				...state,
				showRightSidebar: action.payload,
			};
		case SHOW_SIDEBAR:
			persistLayout("showSidebar", action.payload);
			return {
				...state,
				showSidebar: action.payload,
			};
		case TOGGLE_LEFTMENU:
			persistLayout("leftMenu", action.payload);
			return {
				...state,
				leftMenu: action.payload,
			};

		default:
			return state;
	}
};

export default Layout;
