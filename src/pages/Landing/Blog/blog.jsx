import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

//Import Images
import blog1 from "../../../assets/images/crypto/blog/img-1.jpg";
import blog2 from "../../../assets/images/crypto/blog/img-2.jpg";
import blog3 from "../../../assets/images/crypto/blog/img-3.jpg";

const Blog = () => {
  const blogs = [
    {
      imgUrl: blog1,
      tag: "CSO Portal",
      date: "04 Mar, 2020",
      title:
        "Getting Started with the CSO Project Management Portal: A Complete Guide",
      desc: "This blog walks new users through everything they need to know to start using the portal—from registering their CSO to submitting their first proposal.",
    },
    {
      imgUrl: blog2,
      tag: "CSO Portal",
      date: "12 Feb, 2020",
      title:
        "Top 6 Features of the CSO Project Management Portal You Should Be Using",
      desc: "Discover the portal’s most powerful features, including digital proposal submission, project tracking, and government collaboration tools.",
    },
    {
      imgUrl: blog3,
      tag: "CSO Portal",
      date: "06 Jan, 2020",
      title:
        "How to Register Your CSO on the Oromia BoF Portal in 4 Simple Steps",
      desc: "A step-by-step blog post that simplifies the CSO registration process, ensuring no important detail is missed.",
    },
  ];

  return (
    <React.Fragment>
      <section className="section bg-white" id="news">
        <Container>
          <Row>
            <Col lg="12">
              <div className="text-center mb-5">
                <div className="small-title">Blog</div>
                <h4>Latest News</h4>
              </div>
            </Col>
          </Row>

          <Row>
            {blogs.map((blog, key) => (
              <Col xl="4" sm="6" key={key}>
                <div className="blog-box mb-4 mb-xl-0">
                  <div className="position-relative">
                    <img
                      src={blog.imgUrl}
                      alt=""
                      className="rounded img-fluid mx-auto d-block"
                    />
                    <div className="blog-badge font-size-11 badge bg-primary">
                      {blog.tag}
                    </div>
                  </div>

                  <div className="mt-4 text-muted">
                    <p className="mb-2">
                      <i className="bx bx-calendar ms-1" /> {blog.date}
                    </p>
                    <h5 className="mb-3">{blog.title}</h5>
                    <p>{blog.desc}</p>

                    <div>
                      <Link to="#">Read more</Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default Blog;
