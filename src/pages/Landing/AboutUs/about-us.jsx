import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

//Images
import client1 from "../../../assets/images/clients/1.png";
import client2 from "../../../assets/images/clients/2.png";
import client3 from "../../../assets/images/clients/3.png";
import client4 from "../../../assets/images/clients/4.png";
import client5 from "../../../assets/images/clients/5.png";
import client6 from "../../../assets/images/clients/6.png";

const AboutUs = () => {
  return (
    <React.Fragment>
      <section
        className="section py-6"
        id="about"
        style={{
          background: "linear-gradient(to right, #f9fafb, #ffffff)",
          minHeight: "100vh",
        }}
      >
        <Container>
          <Row>
            <Col lg="12">
              <div className="text-center mb-5">
                <div className="small-title text-uppercase text-primary fw-bold">
                  About us
                </div>
                <h2 className="display-5 fw-semibold">
                  What is CSO Project Management Portal?
                </h2>
              </div>
            </Col>
          </Row>

          <Row className="align-items-center mb-5">
            <Col lg="7">
              <div className="text-muted pe-lg-5">
                <h3 className="mb-4 text-dark fw-bold">
                  Empowering Collaboration Through Innovation
                </h3>
                <p>
                  The <strong>CSO Project Management Portal</strong> is an
                  official digital platform launched by the
                  <strong> Oromia Bureau of Finance (BoF)</strong> to empower
                  Civil Society Organizations (CSOs) working in the Oromia
                  Region.
                </p>
                <ul className="mb-4 ps-3">
                  <li>
                    Streamlines collaboration between CSOs, government, and
                    donors.
                  </li>
                  <li>Centralized, transparent, and user-friendly system.</li>
                  <li>
                    Register CSOs, submit proposals, track progress, and report
                    compliance.
                  </li>
                  <li>Seamlessly integrates with BoF and sector offices.</li>
                </ul>
                <p>
                  Whether you're a local NGO, development partner, or government
                  stakeholder, the portal simplifies project management and
                  enhances impact.
                </p>
                <div className="d-flex flex-wrap gap-3 mt-4">
                  <Link to="#" className="btn btn-primary btn-lg px-4">
                    Read More
                  </Link>
                  <Link to="#" className="btn btn-outline-primary btn-lg px-4">
                    How It Works
                  </Link>
                </div>
              </div>
            </Col>

            <Col lg="5" className="mt-5 mt-lg-0">
              <Card className="border-0 shadow-lg h-100">
                <CardBody className="p-4">
                  <div className="mb-4 text-center">
                    <i
                      className="mdi mdi-lightbulb h1"
                      style={{ color: "#FFC107" }}
                    />
                    <h5 className="fw-bold mt-3">Why We Exist</h5>
                  </div>
                  <ul className="text-muted ps-3">
                    <li>Digitize and simplify NGO project workflows</li>
                    <li>Enhance coordination with the Oromia government</li>
                    <li>
                      Ensure transparency, efficiency, and timely reporting
                    </li>
                    <li>
                      Support development goals with smarter collaboration
                    </li>
                  </ul>
                </CardBody>
                <div className="card-footer bg-white border-0 text-center py-3">
                  <Link
                    to="#"
                    className="btn btn-link text-primary fw-semibold"
                  >
                    Register
                  </Link>
                </div>
              </Card>
            </Col>
          </Row>

          <hr className="my-5" />

          <Row>
            <Col lg="12">
              <div className="text-center mb-4">
                <h4 className="fw-semibold">Our Partners</h4>
                <p className="text-muted">
                  Organizations that trust and work with us
                </p>
              </div>
              <Swiper
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  678: { slidesPerView: 2 },
                  992: { slidesPerView: 3 },
                  1400: { slidesPerView: 4 },
                }}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                loop={true}
                modules={[Pagination, Navigation, Autoplay]}
                className="clients-carousel"
              >
                {[client1, client2, client3, client4, client5, client6].map(
                  (client, index) => (
                    <SwiperSlide
                      key={index}
                      className="d-flex justify-content-center"
                    >
                      <div
                        className="client-images p-3 bg-white shadow-sm rounded"
                        style={{ maxWidth: "150px" }}
                      >
                        <img
                          src={client}
                          alt="client"
                          className="img-fluid d-block mx-auto"
                        />
                      </div>
                    </SwiperSlide>
                  )
                )}
              </Swiper>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default AboutUs;
