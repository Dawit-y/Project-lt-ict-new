import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import bgHero from "../../../assets/images/crypto/bg-ico-hero.jpg";
import heroimg from "../../../assets/images/crypto/heroimg.jpg";

const Section = () => {
  return (
    <React.Fragment>
      <section
        className="section hero-section"
        id="home"
        style={{
          backgroundImage: `url(${bgHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        <div className="bg-overlay bg-primary" />
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="text-white-50">
                <h1
                  className="text-white fw-semibold mb-3 hero-title"
                  style={{ fontSize: "45px" }}
                >
                  Skote - Ico Landing for a cryptocurrency business
                </h1>
                <p className="font-size-14">
                  It will be as simple as occidental in fact to an English
                  person, it will seem like simplified as a skeptical Cambridge
                </p>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <Link to="#" className="btn btn-success">
                    Get Whitepaper
                  </Link>
                  <Link to="#" className="btn btn-light">
                    How it work
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-img">
                <img
                  src={heroimg}
                  alt="Hero Image"
                  className="img-fluid rounded-4"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default Section;
