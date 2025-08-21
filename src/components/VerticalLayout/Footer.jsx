import React from "react";
import { Container, Row, Col } from "reactstrap";
import {
  APP_NAME,
  FOOTER_TEXT,
  COPYRIGHT_YEAR,
} from "../../constants/constantFile";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>{COPYRIGHT_YEAR} © LT ICT.</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">{FOOTER_TEXT}</div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
