import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Nav,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";

//Import Components
import Accordian from "./accordian";

const FAQs = () => {
  const [activeTab, setactiveTab] = useState("1");

  return (
    <React.Fragment>
      <section className="section" id="faqs">
        <Container>
          <Row>
            <Col lg="12">
              <div className="text-center mb-5">
                <div className="small-title">FAQs</div>
                <h4>Frequently asked questions</h4>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <div className="vertical-nav">
                <Row>
                  <Col lg="2" sm="4">
                    <Nav pills className="flex-column">
                      <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                          setactiveTab("1");
                        }}
                      >
                        <i className="bx bx-help-circle nav-icon d-block mb-2" />
                        <p className="font-weight-bold mb-0">
                          General Questions
                        </p>
                      </NavLink>

                      <NavLink
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                          setactiveTab("2");
                        }}
                      >
                        <i className="bx bx-receipt nav-icon d-block mb-2" />
                        <p className="font-weight-bold mb-0">Portal Features</p>
                      </NavLink>

                      <NavLink
                        className={classnames({ active: activeTab === "3" })}
                        onClick={() => {
                          setactiveTab("3");
                        }}
                      >
                        <i className="bx bx-timer d-block nav-icon mb-2" />
                        <p className="font-weight-bold mb-0">How It Works</p>
                      </NavLink>
                    </Nav>
                  </Col>
                  <Col lg="10" sm="8">
                    <Card>
                      <CardBody>
                        <TabContent activeTab={activeTab}>
                          <TabPane tabId="1" id="general">
                            <h4 className="card-title mb-4">
                              General Questions
                            </h4>
                            <Accordian
                              question1="What is the CSO Project Management Portal?"
                              answer1="It’s a centralized digital platform developed by the Oromia Bureau of Finance (BoF) for Civil Society Organizations to register, submit proposals, and manage projects."
                              question2="Who can use this portal?"
                              answer2="Registered CSOs (local and international), Oromia BoF departments, partner sector offices (like Health and Education), and approved development partners such as UNDP and the World Bank."
                              question3="What are the benefits of using this portal?"
                              answer3="The portal streamlines registration, enables digital proposal submission, allows appraisal tracking, supports digital compliance reporting, and fosters collaboration with BoF."
                              question4="Is the platform secure?"
                              answer4="Yes. The portal is officially authorized by Oromia BoF and is designed with secure login and access features to protect your data and submissions."
                            />
                          </TabPane>

                          <TabPane tabId="2" id="features">
                            <h4 className="card-title mb-4">Portal Features</h4>
                            <Accordian
                              question1="What kind of proposals can be submitted?"
                              answer1="The portal supports submission of various development project proposals including education, health, agriculture, climate action, and more."
                              question2="Can I track my project's progress?"
                              answer2="Yes. The portal includes a project tracking feature that allows users to monitor milestones and submit implementation reports."
                              question3="How does appraisal work?"
                              answer3="Once a proposal is submitted, it undergoes an appraisal process involving BoF and relevant sector offices. Feedback and approval status are shared via the portal."
                              question4="What is the Transparency Dashboard?"
                              answer4="It’s a public-facing feature that shows key impact metrics like beneficiaries reached, enabling transparency and accountability."
                            />
                          </TabPane>

                          <TabPane tabId="3" id="howitworks">
                            <h4 className="card-title mb-4">How It Works</h4>
                            <Accordian
                              question1="How do I start using the portal?"
                              answer1="Begin by registering your CSO through the 'Register' button. Once approved, you’ll gain access to all features."
                              question2="What happens after I register?"
                              answer2="You can submit proposals, request appraisals, and access the project management and reporting tools."
                              question3="What documents are needed for proposal submission?"
                              answer3="Typically, you’ll need a project plan, budget, and supporting documentation. Templates are available on the portal."
                              question4="How do I receive support?"
                              answer4="You can reach out via the support section or email ngodirectorate@oromiabof.gov.et for help. A FAQ and downloadable guides are also available."
                            />
                          </TabPane>
                        </TabContent>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default FAQs;
