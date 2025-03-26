import React from "react";
import PropTypes from "prop-types";
import { Row, Col, FormGroup } from "reactstrap";

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

//SimpleBar
import SimpleBar from "simplebar-react";

import { Link } from "react-router-dom";

import "../../components/CommonForBoth/rightbar.scss";

//Import images
import bgimg1 from "../../assets/images/sidebar/img1.jpg";
import bgimg2 from "../../assets/images/sidebar/img2.jpg";
import bgimg3 from "../../assets/images/sidebar/img3.jpg";
import bgimg4 from "../../assets/images/sidebar/img4.jpg";
import layout1 from "../../assets/images/layouts/layout-1.jpg";
import layout2 from "../../assets/images/layouts/layout-2.jpg";
import layout3 from "../../assets/images/layouts/layout-3.jpg";

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

const RightSidebar = props => {

  // Save layout changes to localStorage
  const handleLayoutChange = (layoutType) => {
    props.changeLayout(layoutType);
  };

  const handleLayoutWidthChange = (layoutWidth) => {
    props.changeLayoutWidth(layoutWidth);
  };

  const handleTopbarThemeChange = (theme) => {
    props.changeTopbarTheme(theme);
  };

  return (
    <React.Fragment>
      <div className="right-bar" id="right-bar">
        <SimpleBar style={{ height: "900px" }}>
          <div data-simplebar className="h-100">
            <div className="rightbar-title px-3 py-4">
              <Link
                to="#"
                onClick={e => {
                  e.preventDefault()
                  props.showRightSidebarAction(false)
                }}
                className="right-bar-toggle float-end"
              >
                <i className="mdi mdi-close noti-icon" />
              </Link>
              <h5 className="m-0">Settings</h5>
            </div>

            <hr className="my-0" />

            <div className="p-4">
              <div className="radio-toolbar">
                <span className="mb-2 d-block">Layouts</span>
                <input
                  type="radio"
                  id="radioVertical"
                  name="radioFruit"
                  value={layoutTypes.VERTICAL}
                  checked={props.layoutType === layoutTypes.VERTICAL}
                  onChange={e => handleLayoutChange(e.target.value)}
                />
                <label className="me-1" htmlFor="radioVertical">Vertical</label>
                <input
                  type="radio"
                  id="radioHorizontal"
                  name="radioFruit"
                  value={layoutTypes.HORIZONTAL}
                  checked={props.layoutType === layoutTypes.HORIZONTAL}
                  onChange={e => handleLayoutChange(e.target.value)}
                />
                <label htmlFor="radioHorizontal">Horizontal</label>
              </div>

              <hr className="mt-1" />
              <div className="radio-toolbar">
                <span className="mb-2 d-block">Layouts Mode</span>
                <input
                  type="radio"
                  id="radioLight"
                  name="radioLight"
                  value={layoutModeTypes.LIGHT}
                  checked={props.layoutModeType === layoutModeTypes.LIGHT}
                  onChange={e => props.changeLayoutMode(e.target.value)}
                />
                <label className="me-1" htmlFor="radioLight">Light</label>
                <input
                  type="radio"
                  id="radioDark"
                  name="radioDark"
                  value={layoutModeTypes.DARK}
                  checked={props.layoutModeType === layoutModeTypes.DARK}
                  onChange={e => props.changeLayoutMode(e.target.value)}
                />
                <label htmlFor="radioDark">Dark</label>
              </div>

              <hr className="mt-1" />
              <div className="radio-toolbar">
                <span className="mb-2 d-block" id="radio-title">
                  Layout Width
                </span>
                <input
                  type="radio"
                  id="radioFluid"
                  name="radioWidth"
                  value={layoutWidthTypes.FLUID}
                  checked={props.layoutWidth === layoutWidthTypes.FLUID}
                  onChange={e => handleLayoutWidthChange(e.target.value)}
                />
                <label className="me-1" htmlFor="radioFluid">Fluid</label>
                <input
                  type="radio"
                  id="radioBoxed"
                  name="radioWidth"
                  value={layoutWidthTypes.BOXED}
                  checked={props.layoutWidth === layoutWidthTypes.BOXED}
                  onChange={e => handleLayoutWidthChange(e.target.value)}
                />
                <label htmlFor="radioBoxed" className="me-1">
                  Boxed
                </label>
                <input
                  type="radio"
                  id="radioscrollable"
                  name="radioscrollable"
                  value={layoutWidthTypes.SCROLLABLE}
                  checked={props.layoutWidth === layoutWidthTypes.SCROLLABLE}
                  onChange={e => handleLayoutWidthChange(e.target.value)}
                />
                <label htmlFor="radioscrollable">Scrollable</label>
              </div>

              <hr className="mt-1" />
              <div className="radio-toolbar">
                <span className="mb-2 d-block" id="radio-title">
                  Topbar Theme
                </span>
                <input
                  type="radio"
                  id="radioThemeLight"
                  name="radioTheme"
                  value={topBarThemeTypes.LIGHT}
                  checked={props.topbarTheme === topBarThemeTypes.LIGHT}
                  onChange={e => handleTopbarThemeChange(e.target.value)}
                />
                <label className="me-1" htmlFor="radioThemeLight">Light</label>
                <input
                  type="radio"
                  id="radioThemeDark"
                  name="radioTheme"
                  value={topBarThemeTypes.DARK}
                  checked={props.topbarTheme === topBarThemeTypes.DARK}
                  onChange={e => handleTopbarThemeChange(e.target.value)}
                />
                <label className="me-1" htmlFor="radioThemeDark">Dark</label>
                {props.layoutType === "vertical" ? null : (
                  <>
                    <input
                      type="radio"
                      id="radioThemeColored"
                      name="radioTheme"
                      value={topBarThemeTypes.COLORED}
                      checked={props.topbarTheme === topBarThemeTypes.COLORED}
                      onChange={e => handleTopbarThemeChange(e.target.value)}
                    />
                    <label className="me-1" htmlFor="radioThemeColored">Colored</label>{" "}
                  </>
                )}
              </div>

              {props.layoutType === "vertical" ? (
                <React.Fragment>
                  <hr className="mt-1" />
                  <div className="radio-toolbar">
                    <span className="mb-2 d-block" id="radio-title">
                      Left Sidebar Type{" "}
                    </span>
                    <input
                      type="radio"
                      id="sidebarDefault"
                      name="sidebarType"
                      value={leftSidebarTypes.DEFAULT}
                      checked={props.leftSideBarType === leftSidebarTypes.DEFAULT}
                      onChange={e => props.changeSidebarType(e.target.value)}
                    />
                    <label className="me-1" htmlFor="sidebarDefault">Default</label>
                    <input
                      type="radio"
                      id="sidebarCompact"
                      name="sidebarType"
                      value={leftSidebarTypes.COMPACT}
                      checked={props.leftSideBarType === leftSidebarTypes.COMPACT}
                      onChange={e => props.changeSidebarType(e.target.value)}
                    />
                    <label className="me-1" htmlFor="sidebarCompact">Compact</label>
                    <input
                      type="radio"
                      id="sidebarIcon"
                      name="sidebarType"
                      value={leftSidebarTypes.ICON}
                      checked={props.leftSidebarType === leftSidebarTypes.ICON}
                      onChange={e => props.changeSidebarType(e.target.value)}
                    />
                    <label className="me-1" htmlFor="sidebarIcon">Icon</label>
                  </div>
                  <hr className="mt-1" />
                </React.Fragment>
              ) : null}
              {/*preloader here*/}
            </div>
          </div>
        </SimpleBar>
      </div>
      <div className="rightbar-overlay"></div>
    </React.Fragment>
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
  isPreloader: PropTypes.any,
  layoutType: PropTypes.any,
  layoutModeType: PropTypes.any,
  changeLayoutMode: PropTypes.func,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarThemeImage: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  topbarTheme: PropTypes.any,
  onClose: PropTypes.func,
};

const mapStateToProps = state => {
  return { ...state.Layout };
};

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

