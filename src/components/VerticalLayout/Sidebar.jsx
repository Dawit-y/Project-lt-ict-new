import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import withRouter from "../Common/withRouter";
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";
import {
  logoLightPng,

} from "../../constants/constantFile";
import { useFetchSideData } from "../../queries/side_data_query";
import { useAuthUser } from "../../hooks/useAuthUser";

const Sidebar = (props) => {
  const { user: storedUser, isLoading: authLoading, userId } = useAuthUser();
  const { data: sidedata = [], isLoading } = useFetchSideData(userId);

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box bg-light">
          <Link to="/" className="logo logo-inf0-light">
            <span className="logo-sm"></span>
            <span className="logo-lg">
              <img src={logoLightPng} alt="" height="55" />
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? (
            <SidebarContent sidedata={sidedata} />
          ) : (
            <SidebarContent sidedata={sidedata} />
          )}
        </div>

        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.any,
};

const mapStatetoProps = (state) => {
  return {
    layout: state.Layout,
  };
};

export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
