import React from "react";
import Navbar_Page from "./Navbar/Navbar";
import Section from "./HeroSection/Section";
import CardsMini from "./HeroSection/cards-mini";
import AboutUs from "./AboutUs/about-us";
import Features from "./Features/features";
import RoadMap from "./RoadMap/road-map";
import OurTeam from "./Team/our-team";
import Blog from "./Blog/blog";
import FAQs from "./Faqs/FAQs";
import Footer from "./Footer/footer";

const LandingPage = () => {
  return (
    <>
      <Navbar_Page />
      <Section />
      <CardsMini />
      <AboutUs />
      <Features />
      <RoadMap />
      <OurTeam />
      <Blog />
      <FAQs />
      <Footer />
    </>
  );
};

export default LandingPage;
