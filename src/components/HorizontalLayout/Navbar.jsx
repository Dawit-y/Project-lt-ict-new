import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Row, Col, Collapse } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../Common/withRouter";
import classname from "classnames";
import { post } from "../../helpers/api_Lists";
// i18n
import { withTranslation } from "react-i18next";

import { connect } from "react-redux";

export const SIDEDATA_CACHE_KEY = "sidedata_cache";
const Navbar = (props) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null); // Track active menu

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

  const handleMenuClick = (index) => {
    setActiveMenuIndex(index === activeMenuIndex ? null : index); // Toggle active menu
  };

  const handleSubmenuClick = () => {
    setActiveMenuIndex(null); // Collapse all submenus
  };

  return (
    <React.Fragment>
      <div className="topnav" style={{ zIndex: "" }}>
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                {sidedata.map((menu, index) => (
                  <li key={index} className="nav-item dropdown">
                    <div
                      className="nav-link arrow-none"
                      onClick={() => handleMenuClick(index)} // Toggle submenu
                    >
                      <i className={`${menu.icon} me-2`}></i>
                      {props.t(menu.title)}
                      <div className="arrow-down"></div>
                    </div>

                    <div
                      style={{
                        zIndex: 2000,
                        maxHeight: "500px", // Set a max height
                        overflowY: "auto", // Enable scrolling when content overflows
                      }}
                      className={classname("dropdown-menu", {
                        show: activeMenuIndex === index,
                      })}
                    >
                      {menu.submenu.map((submenu, subIndex) => (
                        <Link
                          key={subIndex}
                          to={submenu.path}
                          className="dropdown-item"
                          onClick={handleSubmenuClick} // Collapse all on click
                          style={{ zIndex: 200 }}
                        >
                          {props.t(submenu.name)}
                        </Link>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = (state) => {
  const { leftMenu } = state.Layout;
  return { leftMenu };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
);
