import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { NavbarToggler, NavLink, Container, Collapse } from "reactstrap";
import Scrollspy from "react-scrollspy";
import { Link } from "react-router-dom";

//Import Images
import logoDark from "../../../assets/images/logo-dark.png";
import logoLight from "../../../assets/images/logo-light.png";

const Navbar_Page = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [navClass, setNavClass] = useState("");

  const toggle = () => setIsOpenMenu(!isOpenMenu);

  useEffect(() => {
    window.addEventListener("scroll", scrollNavigation, true);
  });

  const scrollNavigation = () => {
    var scrollUp = document.documentElement.scrollTop;
    if (scrollUp > 50) {
      setNavClass("sticky nav-sticky");
    } else {
      setNavClass("");
    }

    const element = document.querySelectorAll(".nav-item");
    element.forEach((item) => {
      item.firstChild.classList.remove("active");
      if (item.classList.contains("active")) {
        item.firstChild.classList.add("active");
      }
    });
  };

  return (
    <React.Fragment>
      <nav
        className={
          "navbar navbar-expand-lg navigation fixed-top sticky " + navClass
        }
        id="navbar"
      >
        <Container>
          <Link className="navbar-logo" to="/">
            <img src={logoDark} alt="" height="50" className="logo logo-dark" />
            <img
              src={logoLight}
              alt=""
              height="50"
              className="logo logo-light"
            />
          </Link>

          <NavbarToggler
            className="btn btn-sm px-3 font-size-16 d-lg-none header-item waves-effect waves-light"
            onClick={toggle}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fa fa-fw fa-bars"></i>
          </NavbarToggler>

          <Collapse
            isOpen={isOpenMenu}
            className="navbar-collapse"
            id="navbarSupportedContent"
          >
            <Scrollspy
              offset={-18}
              items={[
                "home",
                "about",
                "features",
                "roadmap",
                "team",
                "news",
                "faqs",
              ]}
              currentClassName="active"
              className="ms-auto navbar-nav nav"
              id="navbar-example"
            >
              <li className="nav-item">
                <NavLink href="#home">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#about">About</NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#features">Features</NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#roadmap">Roadmap</NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#team">Team</NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#news">News</NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#faqs">FAQs</NavLink>
              </li>
            </Scrollspy>

            <div className="my-2 ms-lg-2">
              <Link to="/login" className="btn btn-outline-success w-xs">
                Sign in
              </Link>
            </div>
          </Collapse>
        </Container>
      </nav>
    </React.Fragment>
  );
};

Navbar_Page.propTypes = {
  imglight: PropTypes.any,
  navClass: PropTypes.string,
};

export default Navbar_Page;
