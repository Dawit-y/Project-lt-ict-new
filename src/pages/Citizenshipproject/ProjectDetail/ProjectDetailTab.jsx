import React, { useState, useEffect } from "react";
import { Col, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { isEmpty } from "lodash";
import { useLocation } from "react-router-dom";
const ProjectDetailTab = ({
  canvasWidth,
  name,
  id,
  status = null,
  startDate = null,
  components,
}) => {
  const location = useLocation();
  //const [activeTab1, setActiveTab1] = useState(Object.keys(components)[0]);
  const [activeTab1, setActiveTab1] = useState("");
  const toggle1 = (tab) => {
    if (activeTab1 !== tab) {
      setActiveTab1(tab);
    }
  };
  const navItems = Object.keys(components);
  useEffect(() => {
    if (Object.keys(navItems).length > 0) {
      const tabKey = location.hash.slice(1); // Get key from hash (removes '#')
      if (tabKey) {
        setActiveTab1(tabKey);
      } else {
        setActiveTab1(components[navItems[0]].path);
      }
    }
  }, [location.hash, navItems]);

  return (
    <React.Fragment>
      {navItems && (
        <Nav pills className="navtab-bg nav-justified">
          {navItems.map((navItem, index) => (
            <NavItem
              key={navItem}
              className="me-3 mb-3"
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              <NavLink
                href={`#${components[navItem].path}`}
                style={{
                  cursor: "pointer",
                  borderColor: activeTab1 === navItem ? "#007bff" : "#ccc",
                }}
                className={classnames({
                  active: activeTab1 === components[navItem].path,
                  "bg-light": activeTab1 !== components[navItem].path,
                  "w-25": navItems.length === 1,
                })}
                onClick={() => {
                  toggle1(components[navItem].path);
                }}
              >
                <span className="d-none d-sm-block">{navItem}</span>
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      )}
      <TabContent activeTab={activeTab1} className="p-3 text-muted mt-4">
        {navItems.map((navItem) => (
          <TabPane
            key={components[navItem].path}
            tabId={components[navItem].path}
          >
            {React.createElement(components[navItem].component, {
              passedId: id,
              isActive: activeTab1 === components[navItem].path,
              projectName: name,
              status: status,
              startDate: startDate,
            })}
          </TabPane>
        ))}
      </TabContent>
    </React.Fragment>
  );
};
export default ProjectDetailTab;
