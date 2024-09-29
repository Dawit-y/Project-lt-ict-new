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
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import classnames from "classnames";
import { useFormik } from "formik";
import * as Yup from "yup";
import ProjectDocument from "../../pages/Projectdocument/index";
import ProjectPayment from "../../pages/Projectpayment";
import ProjectStakeholder from "../../pages/Projectstakeholder";
import Projectcontractor from "../../pages/Projectcontractor";
import Budgetrequest from "../../pages/Budgetrequest";

const RightOffCanvas = ({ handleClick, showCanvas, canvasWidth, data }) => {
  //meta title
  document.title = "Right OffCanvas | For Project";

  const toggle1 = (tab) => {
    if (activeTab1 !== tab) {
      setActiveTab1(tab);
    }
  };

  const [activeTab1, setActiveTab1] = useState("5");

  return (
    <React.Fragment>
      {/* Right offcanvas */}
      <Offcanvas
        isOpen={showCanvas}
        direction="end"
        toggle={handleClick}
        style={{ width: `${canvasWidth}vw` }}
      >
        <OffcanvasHeader toggle={handleClick}>{data.prj_name}</OffcanvasHeader>
        <OffcanvasBody>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Nav pills className="navtab-bg nav-justified">
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: activeTab1 === "5",
                      })}
                      onClick={() => {
                        toggle1("5");
                      }}
                    >
                      {/* <ProjectDocument/> */}
                      <span className="d-block d-sm-none">
                        <i className="fas fa-home"></i>
                      </span>
                      <span className="d-none d-sm-block">Documents</span>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: activeTab1 === "6",
                      })}
                      onClick={() => {
                        toggle1("6");
                      }}
                    >
                      <span className="d-block d-sm-none">
                        <i className="far fa-user"></i>
                      </span>
                      <span className="d-none d-sm-block">Payments</span>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: activeTab1 === "7",
                      })}
                      onClick={() => {
                        toggle1("7");
                      }}
                    >
                      <span className="d-block d-sm-none">
                        <i className="far fa-envelope"></i>
                      </span>
                      <span className="d-none d-sm-block">
                        Project Stakeholder
                      </span>
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: activeTab1 === "8",
                      })}
                      onClick={() => {
                        toggle1("8");
                      }}
                    >
                      <span className="d-block d-sm-none">
                        <i className="fas fa-cog"></i>
                      </span>
                      <span className="d-none d-sm-block">
                        Projectcontractor
                      </span>
                    </NavLink>
                  </NavItem>
                  {/* budget request */}
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: activeTab1 === "10",
                      })}
                      onClick={() => {
                        toggle1("10");
                      }}
                    >
                      <span className="d-block d-sm-none">
                        <i className="fas fa-cog"></i>
                      </span>
                      <span className="d-none d-sm-block">Budgetrequest</span>
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent
                  activeTab={activeTab1}
                  className="p-3 text-muted mt-4"
                >
                  <TabPane tabId="5">
                    {/* <ProjectDocument /> */}
                    <ProjectDocument documentData={data.prj_id} />
                  </TabPane>

                  <TabPane tabId="6">
                    <ProjectPayment projectid={data.prj_id} />
                  </TabPane>

                  <TabPane tabId="7">
                    <ProjectStakeholder projectid={data.prj_id} />
                  </TabPane>

                  <TabPane tabId="8">
                    {/* <Projectcontractor/> */}
                    <Projectcontractor projectid={data.prj_id} />
                  </TabPane>
                  {/* budget request */}
                  <TabPane tabId="10">
                    {/* <Projectcontractor/> */}
                    <Budgetrequest projectid={data.prj_id} />
                  </TabPane>
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
