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

const RightOffCanvas = ({
  handleClick,
  showCanvas,
  canvasWidth,
  name,
  id,
  navItems,
  components,
}) => {
  const [activeTab1, setActiveTab1] = useState(1);

  const toggle1 = (tab) => {
    if (activeTab1 !== tab) {
      setActiveTab1(tab);
    }
  };
  
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
                      <NavItem key={index + 1} className="me-3">
                        <NavLink
                          style={{
                            cursor: "pointer",
                            borderColor:
                              activeTab1 === index + 1 ? "#007bff" : "#ccc",
                          }}
                          className={`${classnames({
                            active: activeTab1 === index + 1,
                            "bg-light": activeTab1 !== index + 1,
                            "w-25": navItems.length === 1,
                          })} ms-2 border-start border-2`}
                          onClick={() => {
                            toggle1(index + 1);
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
                  {components.map((Component, index) => (
                    <TabPane key={index + 1} tabId={index + 1}>
                      <Component passedId={id} />
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
