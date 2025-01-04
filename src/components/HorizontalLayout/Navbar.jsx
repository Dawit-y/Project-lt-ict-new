import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Row, Col, Collapse } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../Common/withRouter";
import classname from "classnames";
// i18n
import { withTranslation } from "react-i18next";

import { connect } from "react-redux";

const Navbar = (props) => {
  const [sidedata, setSidedata] = useState([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null); // Track active menu

  const SIDEDATA_CACHE_KEY = "sidedata_cache";

  useEffect(() => {
    const fetchSidedata = async () => {
      try {
        const cachedData = localStorage.getItem(SIDEDATA_CACHE_KEY);

        if (cachedData) {
          setSidedata(JSON.parse(cachedData));
        } else {
          const storedUser = JSON.parse(sessionStorage.getItem("authUser"));
          const response = await fetch(
            `${import.meta.env.VITE_BASE_API_URL}menus`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                  storedUser.authorization.type +
                  " " +
                  storedUser.authorization.token,
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

          // Set fetched data to state
          setSidedata(groupedSidedata);

          // Cache the data in localStorage
          localStorage.setItem(
            SIDEDATA_CACHE_KEY,
            JSON.stringify(groupedSidedata)
          );
        }
      } catch (error) {
        console.error("Error fetching sidedata:", error);
      }
    };

    fetchSidedata();
  }, []);

  const handleMenuClick = (index) => {
    setActiveMenuIndex(index === activeMenuIndex ? null : index); // Toggle active menu
  };

  const handleSubmenuClick = () => {
    setActiveMenuIndex(null); // Collapse all submenus
  };

  return (
    <React.Fragment>
      <div className="topnav">
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
