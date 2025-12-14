import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import error from "../../assets/images/error-img.png";

const CsoDataNotFound = () => {
  document.title = "Cso Data Not Found";

  return (
    <div className="account-pages my-5 pt-5">
      <Container style={{ marginTop: "100px" }}>
        <Row>
          <Col lg="12">
            <div className="text-center mb-5">
              <h3 className="text-uppercase">
                Cso Data Not Found
              </h3>
              <p className="mt-3 text-muted">
                The required CSO data could not be found. Please contact your system
              </p>
              <div className="mt-4 text-center">
                <Link className="btn btn-primary" to="/login">
                  Back to Login
                </Link>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8" xl="6">
            <img src={error} alt="No Access" className="img-fluid" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CsoDataNotFound;
