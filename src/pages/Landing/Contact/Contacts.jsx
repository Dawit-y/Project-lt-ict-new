import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";

const Contacts = () => {
  return (
    <section
      className="section py-5"
      style={{ backgroundColor: "#f8f9fa" }}
      id="contact"
    >
      <Container>
        {/* Header */}
        <Row className="text-center mb-5">
          <Col>
            <h2 className="fw-bold">Need Help?</h2>
            <p className="text-muted fs-5">
              We're here to support CSOs at every stage of their journey.
            </p>
          </Col>
        </Row>

        {/* Contact Cards */}
        <Row className="gy-4 mb-5">
          <Col md="4">
            <Card className="border-0 shadow-sm rounded-4 h-100 text-center">
              <CardBody>
                <i className="mdi mdi-email-outline h1 text-primary mb-3 d-block"></i>
                <CardTitle tag="h5" className="fw-semibold">
                  Email Us
                </CardTitle>
                <p className="text-muted mb-0">
                  ngodirectorate@oromiabof.gov.et
                </p>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="border-0 shadow-sm rounded-4 h-100 text-center">
              <CardBody>
                <i className="mdi mdi-phone h1 text-success mb-3 d-block"></i>
                <CardTitle tag="h5" className="fw-semibold">
                  Call Us
                </CardTitle>
                <p className="text-muted mb-0">+251 XX XXX XXXX</p>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="border-0 shadow-sm rounded-4 h-100 text-center">
              <CardBody>
                <i className="mdi mdi-map-marker h1 text-danger mb-3 d-block"></i>
                <CardTitle tag="h5" className="fw-semibold">
                  Visit Office
                </CardTitle>
                <p className="text-muted mb-0">
                  NGO Directorate, Bureau of Finance,
                  <br /> Oromia Region
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Support Resources */}
        <Row className="gy-4 mb-5">
          <Col lg="6">
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <CardBody>
                <div className="d-flex align-items-center mb-3">
                  <i className="mdi mdi-help-circle-outline h2 text-warning me-3"></i>
                  <div>
                    <h5 className="fw-semibold mb-1">FAQ & Help Center</h5>
                    <p className="text-muted mb-2">
                      Answers to common questions and troubleshooting tips.
                    </p>
                    <p className="btn btn-outline-warning btn-sm rounded-pill">
                      <NavLink href="#faqs">View FAQs</NavLink>
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg="6">
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <CardBody>
                <div className="d-flex align-items-start mb-3">
                  <i className="mdi mdi-file-download-outline h2 text-info me-3"></i>
                  <div>
                    <h5 className="fw-semibold mb-1">Guides & Templates</h5>
                    <ul className="text-muted ps-3 mb-2">
                      <li>
                        <a
                          //   href="/docs/registration-guide.pdf"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Registration Guide (PDF)
                        </a>
                      </li>
                      <li>
                        <a
                          //   href="/docs/project-proposal-template.docx"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Proposal Template
                        </a>
                      </li>
                      <li>
                        <a
                          //   href="/docs/budget-template.xlsx"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Budget Template
                        </a>
                      </li>
                      <li>
                        <a
                          //   href="/docs/monitoring-framework.pdf"
                          target="_blank"
                          rel="noreferrer"
                        >
                          M&E Framework
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Webinar Section */}
        <Row>
          <Col lg="12">
            <Card className="border-0 shadow-sm rounded-4">
              <CardBody className="d-flex align-items-start">
                <i className="mdi mdi-video-outline h2 text-danger me-3"></i>
                <div>
                  <h5 className="fw-semibold mb-1">
                    Training Webinar: Donor Compliance
                  </h5>
                  <p className="text-muted">
                    Learn how to meet donor expectations and improve compliance
                    through detailed reporting and collaboration.
                  </p>
                  <Link
                    // to="/training/donor-compliance"
                    className="btn btn-danger btn-sm rounded-pill"
                  >
                    Watch Now
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contacts;
