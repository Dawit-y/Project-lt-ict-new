import React, { useState, useEffect, Suspense, lazy } from "react";
import { Col, Nav, NavItem, NavLink, TabContent, TabPane, Spinner } from "reactstrap";
import classnames from "classnames";
import { useLocation } from "react-router-dom";
import Spinners from "../../../components/Common/Spinner";

const ProjectDetailTabDynamic = ({
  name,
  id,
  status = null,
  startDate = null,
  components
}) => {
  const location = useLocation();
  const [activeTab1, setActiveTab1] = useState("");

  const navItems = Object.keys(components);

  const toggleTab = (tab) => {
    if (activeTab1 !== tab) {
      setActiveTab1(tab);
    }
  };

  useEffect(() => {
    if (navItems.length > 0) {
      const tabKey = location.hash.slice(1); // Get key from hash (removes '#')
      const defaultTab = components[navItems[0]]?.path;
      setActiveTab1(tabKey || defaultTab);
    }
  }, [location.hash, navItems, components]);

  const renderTabComponent = () => {
    const matchedItem = Object.values(components).find(item => item.path === activeTab1);
    if (!matchedItem?.component) return null;

    const { component: Component } = matchedItem;

    return (
      <Suspense fallback={<Spinners top={"top-75"} />}>
        <Component
          passedId={id}
          isActive={true}
          projectName={name}
          status={status}
          startDate={startDate}
        />
      </Suspense>
    );
  };

  return (
    <React.Fragment>
      {navItems.length > 0 && (
        <Nav pills className="navtab-bg nav-justified">
          {navItems.map((navItem) => (
            <NavItem key={navItem} className="me-3 mb-3" style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
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
                onClick={() => toggleTab(components[navItem].path)}
              >
                <span className="d-none d-sm-block">{navItem}</span>
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      )}
      <TabContent activeTab={activeTab1} className="p-3 text-muted mt-4">
        {renderTabComponent()}
      </TabContent>
    </React.Fragment>
  );
};

export default ProjectDetailTabDynamic;
