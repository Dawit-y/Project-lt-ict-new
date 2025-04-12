import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  UncontrolledTooltip,
} from "reactstrap";

//Import Images
import { Link } from "react-router-dom";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "../../../../node_modules/swiper/swiper.scss";

import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar8 from "../../../assets/images/users/avatar-8.jpg";
import avatar5 from "../../../assets/images/users/avatar-5.jpg";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

const icoLandingTeam = [
  {
    id: 1,
    img: avatar2,
    author: "Mark Hurley",
    post: "CEO & Lead",
  },
  {
    id: 2,
    img: avatar3,
    author: "Calvin Smith",
    post: "Blockchain developer",
  },
  {
    id: 3,
    img: avatar8,
    author: "Vickie Sample",
    post: "Designer",
  },
  {
    id: 4,
    img: avatar5,
    author: "Alma Farley",
    post: "App developer",
  },
  {
    id: 6,
    img: avatar1,
    author: "Amy Hood",
    post: "Designer",
  },
];

const OurTeam = () => {
  return (
    <React.Fragment>
      <section className="section" id="team">
        <Container>
          <Row>
            <Col lg="12">
              <div className="text-center mb-5">
                <div className="small-title">Team</div>
                <h4>Meet our team</h4>
              </div>
            </Col>
          </Row>

          <Col lg={12}>
            <Swiper
              slidesPerView={1}
              spaceBetween={25}
              navigation
              pagination={{
                clickable: true,
              }}
              breakpoints={{
                678: {
                  slidesPerView: 2,
                },
                992: {
                  slidesPerView: 3,
                },
                1400: {
                  slidesPerView: 4,
                },
              }}
              loop={true}
              modules={[Pagination, Navigation]}
              className="owl-carousel owl-theme events navs-carousel"
              id="team-carousel"
              dir="ltr"
            >
              {icoLandingTeam.map((item, key) => (
                <SwiperSlide key={key} className="item">
                  <Card className="text-center team-box">
                    <CardBody>
                      <div>
                        <img src={item.img} alt="" className="rounded w-100" />
                      </div>

                      <div className="mt-3">
                        <h5>{item.author}</h5>
                        <p className="text-muted mb-0">{item.post}</p>
                      </div>
                    </CardBody>
                    <CardFooter className="bg-transparent border-top">
                      <div className="d-flex mb-0 team-social-links">
                        <div className="flex-fill">
                          <Link to="#" id="facebook">
                            <i className="mdi mdi-facebook"></i>
                          </Link>
                        </div>
                        <UncontrolledTooltip placement="top" target="facebook">
                          Facebook
                        </UncontrolledTooltip>

                        <div className="flex-fill">
                          <Link to="#" id="linkedin">
                            <i className="mdi mdi-linkedin"></i>
                          </Link>
                        </div>
                        <UncontrolledTooltip placement="top" target="linkedin">
                          Linkedin
                        </UncontrolledTooltip>

                        <div className="flex-fill">
                          <Link to="#" id="google">
                            <i className="mdi mdi-google"></i>
                          </Link>
                        </div>
                        <UncontrolledTooltip placement="top" target="google">
                          Google
                        </UncontrolledTooltip>
                      </div>
                    </CardFooter>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default OurTeam;
