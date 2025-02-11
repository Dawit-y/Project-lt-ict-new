import React, { useState } from "react";
import {
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
} from "reactstrap";
import classnames from "classnames";
import { isEmpty } from "lodash";

/**
 * A reusable right-side off-canvas component with dynamic navigation tabs.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.handleClick - Function to toggle the off-canvas visibility.
 * @param {boolean} props.showCanvas - Boolean to determine whether the off-canvas is open.
 * @param {number} props.canvasWidth - The width of the off-canvas as a percentage of the viewport width (e.g., 84 for 84vw).
 * @param {string} props.name - The title displayed in the off-canvas header.
 * @param {string | number} props.id - An identifier passed to each rendered component via the `passedId` prop.
 * @param {Object} props.components - An object where keys are the navigation item labels, and values are React components to be rendered in corresponding tabs.
 *
 * @returns {JSX.Element} The RightOffCanvas component.
 *
 * @example
 * <RightOffCanvas
 *   handleClick={handleToggle}
 *   showCanvas={true}
 *   canvasWidth={80}
 *   name="Project Overview"
 *   id={123}
 *   components={{
 *     Documents: ProjectDocument,
 *     Payments: ProjectPayment,
 *     Stakeholder: ProjectStakeholder,
 *   }}
 * />
 */

const RightOffCanvas = ({
  handleClick,
  showCanvas,
  canvasWidth,
  name,
  id,
  status = null,
  startDate = null,
  components,
}) => {
  const [activeTab1, setActiveTab1] = useState(Object.keys(components)[0]); // Default to the first nav item key

  const toggle1 = (tab) => {
    if (activeTab1 !== tab) {
      setActiveTab1(tab);
    }
  };

  const navItems = Object.keys(components);
  return (
    <React.Fragment>
      <Offcanvas
        isOpen={showCanvas}
        direction="end"
        toggle={handleClick}
        className={classnames("custom-offcanvas", {
          "custom-offcanvas-close": !showCanvas,
        })}
        style={{ width: `${canvasWidth}vw` }}
      >
        <OffcanvasHeader toggle={handleClick} className="ms-4 me-3">
          {name}
        </OffcanvasHeader>
        <OffcanvasBody>
          <Col lg={12}>
            <Card className={isEmpty(navItems) ? "m-0 p-0" : ""}>
              <CardBody className={isEmpty(navItems) ? "m-0 p-0" : ""}>
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
                          style={{
                            cursor: "pointer",
                            borderColor:
                              activeTab1 === navItem ? "#007bff" : "#ccc",
                          }}
                          className={classnames({
                            active: activeTab1 === navItem,
                            "bg-light": activeTab1 !== navItem,
                            "w-25": navItems.length === 1,
                          })}
                          onClick={() => {
                            toggle1(navItem);
                          }}
                        >
                          <span className="d-none d-sm-block">{navItem}</span>
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>
                )}
                <TabContent
                  activeTab={activeTab1}
                  className="p-3 text-muted mt-4"
                >
                  {navItems.map((navItem) => (
                    <TabPane key={navItem} tabId={navItem}>
                      {React.createElement(components[navItem], {
                        passedId: id,
                        isActive: activeTab1 === navItem,
                        projectName: name,
                        status: status,
                        startDate: startDate
                      })}
                    </TabPane>
                  ))}
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </OffcanvasBody>
      </Offcanvas>
    </React.Fragment>
  );
};

export default RightOffCanvas;
