import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback, useState } from "react";
import SimpleBar from "simplebar-react";
import { Link, useLocation } from "react-router-dom";
import withRouter from "../Common/withRouter";
import { withTranslation } from "react-i18next";

const SidebarContent = (props) => {
  const ref = useRef();
  const path = useLocation();
  const [openItems, setOpenItems] = useState({});
  const [activeItem, setActiveItem] = useState(null); // Track the active item

  // Helper function to check if a submenu is open
  const isOpen = (index) => openItems[index] || false;

  const toggleOpen = (index) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [index]: !prevState[index], 
    }));
  };

  
  const setActiveMenuItem = (itemPath) => {
    setActiveItem(itemPath); 
  };

  // Function to open parent dropdown based on current path
  const openParentDropdown = useCallback(() => {
    const pathName = path.pathname;
    const menuData = props.sidedata;

    // Iterate over the menu to find the matching submenu
    menuData.forEach((menu, index) => {
      if (menu.submenu) {
        menu.submenu.forEach((submenu) => {
          if (submenu.path === pathName) {
            setOpenItems((prevState) => ({
              ...prevState,
              [index]: true, 
            }));
            setActiveMenuItem(submenu.path); // Set the active submenu
          }
        });
      }
    });
  }, [path.pathname, props.sidedata]);

  useEffect(() => {
    openParentDropdown();
  }, [openParentDropdown]);

  // Scroll element into view
  const scrollElement = (item) => {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  };

  
  const renderMenu = (menuData) => {
    return menuData.map((menu, index) => (
      <li
        key={index}
        className={`menu-item ${isOpen(index) ? "mm-active" : ""}`}
        style={{
          // backgroundColor: activeItem === menu.path ? "#007bff" : "", 
          color: activeItem === menu.path ? "#fff" : "", // Change text color when active
        }}
      >
        <Link
          to="/#"
          className="has-arrow"
          onClick={() => {
            toggleOpen(index);
            setActiveMenuItem(menu.path); // Set the active menu on click
          }}
          style={{
            color: activeItem === menu.path ? "#fff" : "", // Change text color when active
          }}
        >
          <i className={menu.icon}></i>
          <span>{props.t(menu.title)}</span>
        </Link>
        {menu.submenu && isOpen(index) && (
          <ul className="sub-menu" aria-expanded="true">
            {menu.submenu.map((submenu, subIndex) => (
              <li
                key={subIndex}
                className={`submenu-item ${
                  activeItem === submenu.path ? "active" : ""
                }`}
                style={{
                  // backgroundColor: activeItem === submenu.path ? "#007bff" : "", // Color submenu
                  color: activeItem === submenu.path ? "#fff" : "",
                }}
              >
                <Link
                  to={submenu.path}
                  onClick={() => setActiveMenuItem(submenu.path)} // Set active submenu on click
                  style={{
                    color: activeItem === submenu.path ? "#fff" : "", // Change text color when active
                  }}
                >
                  {props.t(submenu.name)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {renderMenu(props.sidedata)}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
  sidedata: PropTypes.array.isRequired,
};

export default withRouter(withTranslation()(SidebarContent));
