import React from "react";
import { Container, Row, Col, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import heroimg from "../../../assets/images/crypto/heroimg.jpg";

const Section = () => {
  return (
    <section
      className="section hero-section"
      id="home"
      style={{
        backgroundColor: "#ffffff",
        padding: "190px 0",
      }}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <div>
              <h1
                className="fw-bold mb-4"
                style={{ fontSize: "42px", color: "#222" }}
              >
                Welcome to the CSO Project Management Portal
              </h1>
              <p style={{ fontSize: "16px", color: "#555" }}>
                A centralized platform for Civil Society Organizations (CSOs) to
                register, submit proposals, request appraisals, and manage
                projects in collaboration with the Oromia Bureau of Finance
                (BoF) and relevant sectors.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/register" className="btn btn-primary px-4 py-2">
                  Register
                </Link>
                <NavLink
                  href="#howitworks"
                  className="btn btn-outline-primary-light px-4 py-2"
                >
                  How it works
                </NavLink>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="text-center mt-4 mt-lg-0">
              <img
                src={heroimg}
                alt="Hero"
                className="img-fluid rounded-4"
                style={{
                  maxHeight: "400px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Section;
