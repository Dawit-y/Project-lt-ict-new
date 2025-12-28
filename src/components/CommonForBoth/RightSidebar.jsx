import React from "react";
import PropTypes from "prop-types";
import {
  FormGroup,
  Button,
  ButtonGroup,
} from "reactstrap";
import { connect } from "react-redux";
import {
  changeLayout,
  changeLayoutMode,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changePreloader,
  changeTopbarTheme,
  showRightSidebarAction,
} from "../../store/actions";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import {
  layoutTypes,
  layoutModeTypes,
  layoutWidthTypes,
  topBarThemeTypes,
  leftSidebarTypes,
} from "../../constants/layout";
const RightSidebar = (props) => {
  const handleLayoutChange = (layoutType) => {
    props.changeLayout(layoutType);
  };
  const handleLayoutWidthChange = (layoutWidth) => {
    props.changeLayoutWidth(layoutWidth);
  };
  const handleTopbarThemeChange = (theme) => {
    props.changeTopbarTheme(theme);
  };
  const buttonClass = "me-2 mb-2 rounded"; // spacing class for all buttons
  return (
    <>
      <div className="right-bar" id="right-bar">
        <SimpleBar style={{ height: "900px" }}>
          <div className="h-100">
            <div className="rightbar-title px-3 py-4">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  props.showRightSidebarAction(false);
                }}
                className="right-bar-toggle float-end"
              >
                <i className="mdi mdi-close noti-icon" />
              </Link>
              <h5 className="m-0">Settings</h5>
            </div>
            <hr className="my-0" />
            <div className="p-4">
              {/* Layout */}
              <FormGroup>
                <span className="mb-2 d-block">Layouts</span>
                <ButtonGroup>
                  <Button
                    color={props.layoutType === layoutTypes.VERTICAL ? "primary" : "light"}
                    active={props.layoutType === layoutTypes.VERTICAL}
                    onClick={() => handleLayoutChange(layoutTypes.VERTICAL)}
                    className={buttonClass}
                  >
                    Vertical
                  </Button>
                  <Button
                    color={props.layoutType === layoutTypes.HORIZONTAL ? "primary" : "light"}
                    active={props.layoutType === layoutTypes.HORIZONTAL}
                    onClick={() => handleLayoutChange(layoutTypes.HORIZONTAL)}
                    className={buttonClass}
                  >
                    Horizontal
                  </Button>
                </ButtonGroup>
              </FormGroup>
              <hr />
              {/* Layout Mode */}
              <FormGroup>
                <span className="mb-2 d-block">Layout Mode</span>
                <ButtonGroup>
                  <Button
                    color={props.layoutModeType === layoutModeTypes.LIGHT ? "primary" : "light"}
                    active={props.layoutModeType === layoutModeTypes.LIGHT}
                    onClick={() => props.changeLayoutMode(layoutModeTypes.LIGHT)}
                    className={buttonClass}
                  >
                    Light
                  </Button>
                  <Button
                    color={props.layoutModeType === layoutModeTypes.DARK ? "primary" : "light"}
                    active={props.layoutModeType === layoutModeTypes.DARK}
                    onClick={() => props.changeLayoutMode(layoutModeTypes.DARK)}
                    className={buttonClass}
                  >
                    Dark
                  </Button>
                </ButtonGroup>
              </FormGroup>
              <hr />
              {/* Layout Width */}
              <FormGroup>
                <span className="mb-2 d-block">Layout Width</span>
                <ButtonGroup>
                  <Button
                    color={props.layoutWidth === layoutWidthTypes.FLUID ? "primary" : "light"}
                    active={props.layoutWidth === layoutWidthTypes.FLUID}
                    onClick={() => handleLayoutWidthChange(layoutWidthTypes.FLUID)}
                    className={buttonClass}
                  >
                    Fluid
                  </Button>
                  <Button
                    color={props.layoutWidth === layoutWidthTypes.BOXED ? "primary" : "light"}
                    active={props.layoutWidth === layoutWidthTypes.BOXED}
                    onClick={() => handleLayoutWidthChange(layoutWidthTypes.BOXED)}
                    className={buttonClass}
                  >
                    Boxed
                  </Button>
                  <Button
                    color={props.layoutWidth === layoutWidthTypes.SCROLLABLE ? "primary" : "light"}
                    active={props.layoutWidth === layoutWidthTypes.SCROLLABLE}
                    onClick={() => handleLayoutWidthChange(layoutWidthTypes.SCROLLABLE)}
                    className={buttonClass}
                  >
                    Scrollable
                  </Button>
                </ButtonGroup>
              </FormGroup>
              <hr />
              {/* Topbar Theme */}
              <FormGroup>
                <span className="mb-2 d-block">Topbar Theme</span>
                <ButtonGroup>
                  <Button
                    color={props.topbarTheme === topBarThemeTypes.LIGHT ? "primary" : "light"}
                    active={props.topbarTheme === topBarThemeTypes.LIGHT}
                    onClick={() => handleTopbarThemeChange(topBarThemeTypes.LIGHT)}
                    className={buttonClass}
                  >
                    Light
                  </Button>
                  <Button
                    color={props.topbarTheme === topBarThemeTypes.DARK ? "primary" : "light"}
                    active={props.topbarTheme === topBarThemeTypes.DARK}
                    onClick={() => handleTopbarThemeChange(topBarThemeTypes.DARK)}
                    className={buttonClass}
                  >
                    Dark
                  </Button>
                </ButtonGroup>
              </FormGroup>
              {/* Sidebar Type (Vertical only) */}
              {props.layoutType === layoutTypes.VERTICAL && (
                <>
                  <hr />
                  <FormGroup>
                    <span className="mb-2 d-block">Left Sidebar Type</span>
                    <ButtonGroup>
                      <Button
                        color={props.leftSideBarType === leftSidebarTypes.DEFAULT ? "primary" : "light"}
                        active={props.leftSideBarType === leftSidebarTypes.DEFAULT}
                        onClick={() => props.changeSidebarType(leftSidebarTypes.DEFAULT)}
                        className={buttonClass}
                      >
                        Default
                      </Button>
                      <Button
                        color={props.leftSideBarType === leftSidebarTypes.COMPACT ? "primary" : "light"}
                        active={props.leftSideBarType === leftSidebarTypes.COMPACT}
                        onClick={() => props.changeSidebarType(leftSidebarTypes.COMPACT)}
                        className={buttonClass}
                      >
                        Compact
                      </Button>
                      <Button
                        color={props.leftSideBarType === leftSidebarTypes.ICON ? "primary" : "light"}
                        active={props.leftSideBarType === leftSidebarTypes.ICON}
                        onClick={() => props.changeSidebarType(leftSidebarTypes.ICON)}
                        className={buttonClass}
                      >
                        Icon
                      </Button>
                    </ButtonGroup>
                  </FormGroup>
                </>
              )}
            </div>
          </div>
        </SimpleBar>
      </div>
      <div className="rightbar-overlay" />
    </>
  );
};
RightSidebar.propTypes = {
  changeLayout: PropTypes.func,
  changeLayoutWidth: PropTypes.func,
  changePreloader: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarThemeImage: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  layoutType: PropTypes.any,
  layoutModeType: PropTypes.any,
  layoutWidth: PropTypes.any,
  leftSideBarType: PropTypes.any,
  topbarTheme: PropTypes.any,
  changeLayoutMode: PropTypes.func,
  showRightSidebarAction: PropTypes.func,
};
const mapStateToProps = (state) => ({
  ...state.Layout,
});
export default connect(mapStateToProps, {
  changeLayout,
  changeLayoutMode,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changeLayoutWidth,
  changeTopbarTheme,
  changePreloader,
  showRightSidebarAction,
})(RightSidebar);