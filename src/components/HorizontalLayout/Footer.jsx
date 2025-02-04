import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap"
import {FOOTER_TEXT,COPYRIGHT_YEAR} from "../../constants/constantFile";
const Footer = () => {
  const storedUser = sessionStorage.getItem("authUser");
  const User = storedUser ? JSON.parse(storedUser) : null; // Handle null case
  const [userProfile, setUserProfile] = useState(User);
  const userDetail=userProfile.user.user_detail;
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>{COPYRIGHT_YEAR} -- {userDetail}</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                {FOOTER_TEXT}
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}
export default Footer