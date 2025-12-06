import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

import logolight from "../../../assets/images/logo-light.png";

const Footer = () => {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { title: "About Us", link: "#" },
        { title: "Features", link: "#" },
        { title: "Announcements", link: "#" },
        { title: "News", link: "#" },
        { title: "FAQs", link: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { title: "Terms of Use", link: "#" },
        { title: "Privacy Policy", link: "#" },
      ],
    },
    {
      title: "Links",
      links: [
        { title: "Register", link: "#" },
        { title: "Contact Support", link: "#" },
        { title: "FAQs", link: "#" },
      ],
    },
  ];

  return (
		<React.Fragment>
			<footer className="bg-white text-dark py-5 border-top">
				<Container>
					<Row className="mb-5">
						{footerLinks.map((footerLink, index) => (
							<Col lg="3" sm="6" className="mb-4 mb-lg-0" key={index}>
								<h5 className="mb-3 text-uppercase">{footerLink.title}</h5>
								<ul className="list-unstyled">
									{footerLink.links.map((link, key) => (
										<li key={key} className="mb-2">
											<Link
												to={link.link}
												className="text-muted text-decoration-none"
											>
												{link.title}
											</Link>
										</li>
									))}
								</ul>
							</Col>
						))}

						<Col lg="3" sm="6" className="mb-4 mb-lg-0">
							<h5 className="mb-3 text-uppercase">Latest News</h5>
							<div className="mb-3">
								<Link to="#" className="text-decoration-none text-dark">
									<span className="badge bg-success mb-2">New feature</span>
									<h6 className="fw-semibold mb-1">
										Automated report reminders for overdue submissions.
									</h6>
									<p className="text-muted mb-0">
										<i className="bx bx-calendar me-1" /> 04 Mar, 2020
									</p>
								</Link>
							</div>
							<div>
								<Link to="#" className="text-decoration-none text-dark">
									<span className="badge bg-success mb-2">Maintenance</span>
									<h6 className="fw-semibold mb-1">
										System maintenance scheduled
									</h6>
									<p className="text-muted mb-0">
										<i className="bx bx-calendar me-1" /> on April 5, 2025 (2:00
										AM – 6:00 AM).
									</p>
								</Link>
							</div>
						</Col>
					</Row>

					<hr className="my-4" />

					<Row className="align-items-center">
						<Col md="6">
							<img src={logolight} alt="Logo" height="50" className="mb-3" />
							<p className="mb-1 text-muted">
								&copy; {new Date().getFullYear()} Design & Develop by OTECH
								Engineering and LT Ict Solutions
							</p>
							<p className="small text-muted">
								🔒 Authorized by the Oromia Bureau of Finance (BoF) ⚠ Only
								registered CSOs and approved partners can access the system
							</p>
						</Col>
					</Row>
				</Container>
			</footer>
		</React.Fragment>
	);
};

export default Footer;
