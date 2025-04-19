import React from "react";
import { Container, Row } from "reactstrap";
import CardBox from "./card-box";

const HowItWorks = () => {
  const steps = [
    {
      title: "Register",
      color: "success",
      icon: "mdi mdi-account-plus",
      value: "Step 1",
      rate: "Create your CSO profile and gain access to the system.",
    },
    {
      title: "Submit Proposal",
      color: "primary",
      icon: "mdi mdi-file-document-edit-outline",
      value: "Step 2",
      rate: "Upload your project documents for appraisal.",
    },
    {
      title: "Get Approval",
      color: "warning",
      icon: "mdi mdi-check-decagram",
      value: "Step 3",
      rate: "Receive evaluations from BoF and sector offices.",
    },
    {
      title: "Manage Projects",
      color: "info",
      icon: "mdi mdi-chart-box-outline",
      value: "Step 4",
      rate: "Track project progress and submit final reports.",
    },
  ];

  return (
    <main
      className="min-vh-100 d-flex align-items-center bg-white"
      id="howitworks"
    >
      <section className="w-100 py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">How It Works</h2>
            <p className="text-muted">
              A simple step-by-step process for CSOs to manage projects with the
              Oromia Bureau of Finance.
            </p>
          </div>
          <Row>
            <CardBox info={steps} />
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default HowItWorks;
