import React from "react";
import { Container, Row, Col } from "reactstrap";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "../../../../node_modules/swiper/swiper.scss";
// import "swiper/swiper-bundle.css";

const announcements = [
  {
    date: "June 2025",
    title: "Latest Update",
    disc: "New feature Automated report reminders for overdue submissions.",
  },
  {
    date: "June 2025",
    title: "Funding",
    disc: "Active Funding Opportunities and Highlighted Grants Section (with filters: Deadline, Amount, Sector).",
  },
  {
    date: "June 2025",
    title: "Example Grants",
    disc: "Education Grant – $50,000 | Deadline: 30 Oct 2024 & Climate Action Fund – Open for Applications.",
  },
  {
    date: "June 2025",
    title: "Testimonials",
    disc: "Quotes from NGOs This portal cut our reporting time by 50%!",
  },
  {
    date: "June 2025",
    title: "Case Studies",
    disc: "Brief impact stories with photos/videos.",
  },
  {
    date: "April 2025",
    title: "Scheduled Maintenance",
    disc: "System maintenance scheduled on April 5, 2025 (2:00 AM – 6:00 AM).",
  },
];

const RoadMap = () => {
  return (
    <React.Fragment>
      <section className="section bg-white" id="roadmap">
        <Container>
          <Row>
            <Col lg="12">
              <div className="text-center mb-5">
                <div className="small-title">Announcements 📢</div>
                <h4>Latest Updates</h4>
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col lg="12">
              <div className="hori-timeline">
                <Swiper
                  slidesPerView={1}
                  // spaceBetween={10}
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
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  modules={[Pagination, Navigation, Autoplay]}
                  className="owl-carousel owl-theme events navs-carousel"
                  id="timeline-carousel"
                >
                  {announcements.map((item, index) => (
                    <SwiperSlide key={index} className="item event-list">
                      <div>
                        <div className="event-date">
                          <div className="text-primary mb-1">{item.date}</div>
                          <h5 className="mb-4">{item.title}</h5>
                        </div>
                        <div className="event-down-icon">
                          <i className="bx bx-down-arrow-circle h1 text-primary down-arrow-icon"></i>
                        </div>

                        <div className="mt-3 px-3">
                          <p className="text-muted">{item.disc}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default RoadMap;
