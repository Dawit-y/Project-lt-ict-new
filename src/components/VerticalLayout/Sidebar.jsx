import { useAccessToken } from "../../helpers/jwt-token-access/accessToken";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import withRouter from "../Common/withRouter";
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";
import {
  logo,
  logoLightPng,
  logoLightSvg,
  logoDark,
} from "../../constants/constantFile";
import { Card } from "reactstrap";

const SIDEDATA_CACHE_KEY = "sidedata_cache";

const Sidebar = (props) => {
  const accessToken = useAccessToken();
  const [sidedata, setSidedata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cachedData = localStorage.getItem(SIDEDATA_CACHE_KEY);
    if (cachedData) {
      setSidedata(JSON.parse(cachedData));
      setIsLoading(false);
    } else {
      fetchSidedata();
    }
  }, []);

  const fetchSidedata = async () => {
    try {
      const { data } = await post(`menus`);
      // Group data by `parent_menu`
      const groupedData = data.reduce((acc, curr) => {
        const { parent_menu, link_name, link_url, link_icon } = curr;
        if (!acc[parent_menu]) {
          acc[parent_menu] = {
            title: parent_menu,
            icon: link_icon,
            submenu: [],
          };
        }
        acc[parent_menu].submenu.push({
          name: link_name.replace(/-/g, " "),
          path: `/${link_url}`,
        });
        return acc;
      }, {});

      const groupedSidedata = Object.values(groupedData);
      setSidedata(groupedSidedata);
      localStorage.setItem(SIDEDATA_CACHE_KEY, JSON.stringify(groupedSidedata));
    } catch (error) {
      console.error("Error fetching sidedata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(SIDEDATA_CACHE_KEY);
  };

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
