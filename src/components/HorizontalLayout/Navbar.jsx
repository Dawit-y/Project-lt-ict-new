import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Row, Col, Collapse } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../Common/withRouter";
import classname from "classnames";
import { withTranslation } from "react-i18next";

import { connect } from "react-redux";
import { useFetchSideData } from "../../queries/side_data_query";
import { useAuthUser } from "../../hooks/useAuthUser";

const Navbar = (props) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null); // Track active menu
  const { user: storedUser, isLoading: authLoading, userId } = useAuthUser();
  const { data: sidedata = [], isLoading } = useFetchSideData(userId);

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
  connect(mapStatetoProps, {})(withTranslation()(Navbar)),
);
