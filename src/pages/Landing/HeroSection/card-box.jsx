import React from "react";
import { Col, Card, CardBody } from "reactstrap";

const CardBox = ({ info }) => {
  return (
    <>
      {info.map((info, index) => (
        <Col lg="3" md="6" sm="12" key={index} className="mb-4">
          <Card className={`border shadow-sm text-center bg-light`}>
            <CardBody>
              <div className="mb-3">
                <i className={`${info.icon} mdi-36px text-${info.color}`}></i>
              </div>
              <h5 className="mb-1 fw-semibold">{info.title}</h5>
              <h6 className="text-muted mb-2">{info.value}</h6>
              <p className="text-muted small">{info.rate}</p>
            </CardBody>
          </Card>
        </Col>
      ))}
    </>
  );
};

export default CardBox;
