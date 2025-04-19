import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { NavbarToggler, NavLink, Container, Collapse } from "reactstrap";
import Scrollspy from "react-scrollspy";
import { Link } from "react-router-dom";

//Import Images
import logoDark from "../../../assets/images/logo-dark.png";

const Navbar_Page = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [navClass, setNavClass] = useState("");

  const toggle = () => setIsOpenMenu(!isOpenMenu);

  useEffect(() => {
    window.addEventListener("scroll", scrollNavigation, true);
    return () => {
      window.removeEventListener("scroll", scrollNavigation, true);
    };
  }, []);

  const scrollNavigation = () => {
    const scrollTop = document.documentElement.scrollTop;
    setNavClass(scrollTop > 50 ? "shadow-sm" : "");
  };

  return (
    <React.Fragment>
      <nav
        className={`navbar navbar-expand-lg navigation fixed-top bg-white ${navClass}`}
        id="navbar"
      >
        <Container>
          <Link className="navbar-logo" to="/">
            <img src={logoDark} alt="logo" height="50" className="logo" />
          </Link>

          <NavbarToggler
            className="btn btn-sm px-3 font-size-16 d-lg-none header-item waves-effect waves-light"
            onClick={toggle}
            type="button"
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
                "howitworks",
                "announcements",
                "news",
                "faqs",
                "contact",
              ]}
              currentClassName="active"
              className="ms-auto navbar-nav nav"
              id="navbar-example"
            >
              <li className="nav-item">
                <NavLink href="#home" className="text-dark">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#about" className="text-dark">
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#features" className="text-dark">
                  Features
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#howitworks" className="text-dark">
                  How It Works
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#roadmap" className="text-dark">
                  Announcements
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#news" className="text-dark">
                  News
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#faqs" className="text-dark">
                  FAQs
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink href="#contact" className="text-dark">
                  Contact
                </NavLink>
              </li>
            </Scrollspy>

            <div className="my-2 ms-lg-2">
              <Link to="/login" className="btn btn-outline-primary w-xs">
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
