import React from "react";
import { Container, Row, Col } from "reactstrap";

//Import Components
import FeatureBox from "./feature-box";

//Import images
import feature1 from "../../../assets/images/crypto/features-img/img-1.png";
import feature2 from "../../../assets/images/crypto/features-img/img-2.png";

const Features = () => {
  const featureData = [
    {
      num: "01",
      title: "CSO Registration",
      image: feature1,
      features: [
        "Easily register your CSO with up-to-date profile information.",
        "Manage and update your organization's details anytime.",
      ],
      desc: "This feature allows Civil Society Organizations (CSOs) to register digitally and maintain accurate, up-to-date organizational profiles, ensuring compliance and transparency with government regulations and partner requirements.",
    },
    {
      num: "02",
      title: "Proposal Submission",
      image: feature2,
      features: [
        "Submit new project proposals for timely review.",
        "Get your ideas reviewed and approved quickly.",
      ],
      desc: "Organizations can digitally submit detailed project proposals for approval, streamlining the approval process and ensuring that proposals reach the appropriate departments quickly and efficiently for review and feedback.",
    },
    {
      num: "03",
      title: "Appraisal Requests",
      image: feature1,
      features: [
        "Request and receive official project appraisals.",
        "Coordinate evaluations with BoF and relevant sectors.",
      ],
      desc: "Easily initiate appraisal requests for proposed projects and activities. This ensures timely evaluation from the Bureau of Finance (BoF) and sector offices, promoting transparent and accountable project planning and funding decisions.",
    },
    {
      num: "04",
      title: "Project Tracking",
      image: feature2,
      features: [
        "Track your project milestones and progress.",
        "Report your project’s status in real time.",
      ],
      desc: "This tool allows organizations to track project implementation, submit regular progress reports, and ensure that activities align with timelines and objectives. It enhances transparency and enables effective monitoring by all stakeholders.",
    },
    {
      num: "05",
      title: "Government Collaboration",
      image: feature1,
      features: [
        "Strengthen ties with Oromia BoF and partners.",
        "Coordinate with government and collaborators.",
      ],
      desc: "Facilitates streamlined communication and coordination between CSOs, the Oromia Bureau of Finance, and sector partners, enabling efficient planning, collaboration, and implementation of shared development goals across all involved entities.",
    },
    {
      num: "06",
      title: "Digital Reporting",
      image: feature2,
      features: [
        "File digital reports to donors and authorities.",
        "Ensure compliance through easy report submission.",
      ],
      desc: "Organizations can submit timely digital reports to both government bodies and donors, ensuring transparency, accountability, and compliance with funding and operational guidelines—all through a simplified, user-friendly platform.",
    },
  ];

  return (
    <React.Fragment>
      <section className="section" id="features">
        <Container>
          <Row>
            <Col lg="12">
              <div className="text-center mb-5">
                <div className="small-title">Features</div>
                <h4>Key Features What the Portal Offers</h4>
              </div>
            </Col>
          </Row>

          {featureData.map((item, index) => (
            <Row
              key={index}
              className={`align-items-center ${
                index !== 0 ? "mt-5 pt-md-5" : "pt-4"
              }`}
            >
              {index % 2 === 0 ? (
                <>
                  <Col md="6" sm="8">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-fluid mx-auto d-block"
                    />
                  </Col>
                  <Col md="5" className="ms-auto">
                    <FeatureBox
                      num={item.num}
                      title={item.title}
                      features={item.features.map((desc, i) => ({
                        id: i + 1,
                        desc,
                      }))}
                      desc={item.desc}
                    />
                  </Col>
                </>
              ) : (
                <>
                  <Col md="5">
                    <FeatureBox
                      num={item.num}
                      title={item.title}
                      features={item.features.map((desc, i) => ({
                        id: i + 1,
                        desc,
                      }))}
                      desc={item.desc}
                    />
                  </Col>
                  <Col md="6" sm="8" className="ms-md-auto">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-fluid mx-auto d-block"
                    />
                  </Col>
                </>
              )}
            </Row>
          ))}
        </Container>
      </section>
    </React.Fragment>
  );
};

export default Features;
