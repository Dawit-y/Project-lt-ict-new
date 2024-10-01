import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import withRouter from "../Common/withRouter";
import {APP_NAME} from "../../constants/constantFile";

// i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";
import {logo,logoLightPng,logoLightSvg,logoDark} from "../../constants/constantFile";

const Sidebar = (props) => {
  const [sidedata, setSidedata] = useState([]);

  // Fetch sidedata from API
  useEffect(() => {
    const fetchSidedata = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}menus`,
          {
            // Replace with your API endpoint
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Adjust headers if needed
            },
            body: JSON.stringify({}),
          }
        );

        const data = await response.json();

        // Group data by `parent_menu`
        const groupedData = data.data.reduce((acc, curr) => {
          const { parent_menu, link_name, link_url, link_icon } = curr;
          if (!acc[parent_menu]) {
            acc[parent_menu] = {
              title: parent_menu.charAt(0).toUpperCase() + parent_menu.slice(1),
              icon: link_icon,
              submenu: [],
            };
          }
          acc[parent_menu].submenu.push({
            //   name: link_name.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase()),
            name: link_name.replace(/-/g, " "),
            path: `/${link_url}`,
          });
          return acc;
        }, {});
        setSidedata(Object.values(groupedData)); // Set fetched data to state
      } catch (error) {
        console.error("Error fetching sidedata:", error);
      }
    };

    fetchSidedata();
  }, []); // Empty dependency array ensures it runs once on mount

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              
              {/* <img src={logo} alt="" height="22" /> */}
            </span>
            <span className="logo-lg">
              {/* <img src={logoDark} alt="" height="17" /> */}
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              {/* <img src={logoLightSvg} alt="" height="22" /> */}
            </span>
            <span className="logo-lg">
              <img src={logoLightPng} alt="" height="19" />
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
  type: PropTypes.string,
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
