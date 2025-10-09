import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

//Import Images
import error from "../../assets/images/error-img.png";

const NotFound = () => {
  //meta title
  document.title = "404 Error Page ";

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-5">
        <Container className="mt-5">
          <Row>
            <Col lg="12">
              <div className="text-center mb-5">
                <h1 className="display-2 fw-medium">
                  4<i className="bx bx-buoy bx-spin text-primary display-3" />4
                </h1>
                <h4 className="text-uppercase">Sorry, page not found</h4>
                <div className="mt-5 text-center">
                  <Link className="btn btn-primary " to="/dashboard">
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="8" xl="6">
              <div>
                <img src={error} alt="" className="img-fluid" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NotFound;
