import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Row, Col, Collapse } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../Common/withRouter";
import classname from "classnames";

//i18n
import { withTranslation } from "react-i18next";

import { connect } from "react-redux";

const Navbar = (props) => {
  const [sidedata, setSidedata] = useState([]);

  // Cache key for storing sidedata in localStorage
  const SIDEDATA_CACHE_KEY = "sidedata_cache";

  // Fetch sidedata from API
  useEffect(() => {
    const fetchSidedata = async () => {
      try {
        // Check if cached sidedata exists in localStorage
        const cachedData = localStorage.getItem(SIDEDATA_CACHE_KEY);

        if (cachedData) {
          // If cache exists, parse and set it in state
          setSidedata(JSON.parse(cachedData));
        } else {
          // Fetch data from API if not cached
          const response = await fetch(
            `${import.meta.env.VITE_BASE_API_URL}menus`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
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
                title:
                  parent_menu.charAt(0).toUpperCase() + parent_menu.slice(1),
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
  }, []); // Empty dependency array ensures it runs once on mount

  const [users, setusers] = useState(false);

  useEffect(() => {
    var matchingMenuItem = null;
    var ul = document.getElementById("navigation");
    var items = ul.getElementsByTagName("a");
    removeActivation(items);
    for (var i = 0; i < items.length; ++i) {
      if (window.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  });

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;
      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        if (parent.classList.contains("active")) {
          parent.classList.remove("active");
        }
      }
    }
  };

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add("active"); // li
            }
          }
        }
      }
    }
    return false;
  }

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
                  <li className="nav-item dropdown">
                    <div className="nav-link  arrow-none">
                      <i className={`${menu.icon} me-2`}></i>
                      {props.t(menu.title)} {props.menuOpen}
                      <div className="arrow-down"></div>
                    </div>
                    <div
                      className={classname("dropdown-menu", { show: users })}
                    >
                      {menu.submenu.map((submenu, index) => (
                        <Link to={submenu.path} className="dropdown-item">
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
