import React from "react";
import Navbar_Page from "./Navbar/Navbar";
import Section from "./HeroSection/Section";
import AboutUs from "./AboutUs/about-us";
import Features from "./Features/features";
import RoadMap from "./RoadMap/road-map";
// import OurTeam from "./Team/our-team";
import Blog from "./Blog/blog";
import FAQs from "./Faqs/FAQs";
import Footer from "./Footer/footer";
import HowItWorks from "./HeroSection/How-it-works";
import Contacts from "./Contact/Contacts";

const LandingPage = () => {
  return (
    <>
      <Navbar_Page />
      <Section />
      <AboutUs />
      <Features />
      <HowItWorks />
      <RoadMap />
      {/* <OurTeam /> */}
      <Blog />
      <FAQs />
      <Contacts />
      <Footer />
    </>
  );
};

export default LandingPage;
