import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";

const PaymentAnalysis = ({ data }) => {
  // Initialize state for payment data
  const [paymentDatas, setPaymentDatas] = useState({
    series: [],
    availablebalance: 0,
    active: 0,
    not_active: 0,
    Advance: { name: "Total Advance Payment", cost: 0 },
    Interim: { name: "Total Interim Payment", cost: 0 },
    Final: { name: "Total Final Payment", cost: 0 },
    other: { name: "Total Other Payment", cost: 0 },
  });

  const [averagePercentages, setAveragePercentages] = useState({
    AdvanceAverage: 0,
    InterimAverage: 0,
    FinalAverage: 0,
    OtherAverage: 0,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const totals = { Advance: 0, Interim: 0, Final: 0, Other: 0 };
      const percentages = {
        AdvancePercentage: 0,
        InterimPercentage: 0,
        FinalPercentage: 0,
        OtherPercentage: 0,
      };
      const counts = {
        AdvanceCount: 0,
        InterimCount: 0,
        FinalCount: 0,
        OtherCount: 0,
      };
      let totalactive = 0;
      let totalnot_active = 0;

      data.forEach((item) => {
        const amount = item.prp_payment_amount || 0;

        // Accumulate totals based on payment types
        if (item.prp_type === "Advance") totals.Advance += amount;
        else if (item.prp_type === "Interim") totals.Interim += amount;
        else if (item.prp_type === "Final") totals.Final += amount;
        else totals.Other += amount;

        // Accumulate percentage calculations for averages
        const payment_percentage = item.prp_payment_percentage || 0;
        if (item.prp_type === "Advance") {
          percentages.AdvancePercentage += payment_percentage;
          counts.AdvanceCount++;
        } else if (item.prp_type === "Interim") {
          percentages.InterimPercentage += payment_percentage;
          counts.InterimCount++;
        } else if (item.prp_type === "Final") {
          percentages.FinalPercentage += payment_percentage;
          counts.FinalCount++;
        } else {
          percentages.OtherPercentage += payment_percentage;
          counts.OtherCount++;
        }

        // Update total active and not_active based on status
        if (item.prp_status === 1) {
          totalactive += amount;
        } else {
          totalnot_active += amount;
        }
      });

      // Calculate dynamic averages
      setAveragePercentages({
        AdvanceAverage:
          counts.AdvanceCount > 0
            ? Math.ceil(percentages.AdvancePercentage / counts.AdvanceCount)
            : 0,
        InterimAverage:
          counts.InterimCount > 0
            ? Math.ceil(percentages.InterimPercentage / counts.InterimCount)
            : 0,
        FinalAverage:
          counts.FinalCount > 0
            ? Math.ceil(percentages.FinalPercentage / counts.FinalCount)
            : 0,
        OtherAverage:
          counts.OtherCount > 0
            ? Math.ceil(percentages.OtherPercentage / counts.OtherCount)
            : 0,
      });

      // Calculate the total available balance and set state
      const availablebalance =
        totals.Advance + totals.Interim + totals.Final + totals.Other;

      setPaymentDatas({
        series: [
          averagePercentages.AdvanceAverage,
          averagePercentages.InterimAverage,
          averagePercentages.FinalAverage,
          averagePercentages.OtherAverage,
        ],
        availablebalance,
        active: totalactive,
        not_active: totalnot_active,
        Advance: { name: "Total Advance Payment", cost: totals.Advance },
        Interim: { name: "Total Interim Payment", cost: totals.Interim },
        Final: { name: "Total Final Payment", cost: totals.Final },
        other: { name: "Total Other Payment", cost: totals.Other },
      });
    }
  }, [data]);

  const walletOptions = {
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 360,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
        },
        track: {
          show: true,
          background: "#f2f2f2",
          strokeWidth: "97%",
          opacity: 1,
          margin: 12,
        },
        dataLabels: {
          name: { show: true, fontSize: "16px", fontWeight: 600, offsetY: -10 },
          value: {
            show: true,
            fontSize: "14px",
            offsetY: 4,
            formatter: function (e) {
              return e + "%";
            },
          },
          total: {
            show: true,
            label: "Total",
            color: "#373d3f",
            fontSize: "16px",
            fontWeight: 600,
            formatter: function (e) {
              return (
                e.globals.seriesTotals.reduce(function (e, t) {
                  return e + t;
                }, 0) + "%"
              );
            },
          },
        },
      },
    },
    stroke: { lineCap: "round" },
    colors: ["#227B94", "#e91e63", "#9c27b0", "#9c3330"],
    labels: ["Advance", "Interim", "Final", "Other"],
    legend: { show: false },
  };

  console.log("data data data" + paymentDatas.series);

  return (
    <React.Fragment>
      <Row className="justify-content-center mb-5">
        <Col xl="10" lg="9" md="12">
          <Card>
            <CardBody>
              <div className="float-end">
                <select
                  defaultValue="1"
                  className="form-select form-select-sm ms-2"
                >
                  <option value="1">March</option>
                  <option value="2">February</option>
                  <option value="3">January</option>
                  <option value="4">December</option>
                </select>
              </div>
              <h4 className="card-title mb-3">
                Overall Project Payment Analysis
              </h4>
              <Row>
                <Col lg="4">
                  <div className="mt-4">
                    <p>Total Costs of Payments</p>
                    <h4>
                      {paymentDatas.availablebalance.toLocaleString()} ETB
                    </h4>
                    <p className="text-muted mb-4">
                      ~ {paymentDatas.Advance.cost.toLocaleString()} ETB (
                      {averagePercentages.AdvanceAverage}
                      %)
                      <i className="mdi mdi-arrow-up ms-1 text-success" />{" "}
                      Advance
                    </p>

                    <Row>
                      <Col xs="6">
                        <div>
                          <p className="mb-2">Active Payments</p>
                          <h5>{paymentDatas.active.toLocaleString()} ETB</h5>
                        </div>
                      </Col>
                      <Col xs="6">
                        <div>
                          <p className="mb-2">Not Active Payments</p>
                          <h5>
                            {paymentDatas.not_active.toLocaleString()} ETB
                          </h5>
                        </div>
                      </Col>
                    </Row>
                    <div className="mt-4">
                      <Link to="#" className="btn btn-primary btn-sm">
                        View more <i className="mdi mdi-arrow-right ms-1" />
                      </Link>
                    </div>
                  </div>
                </Col>
                <Col lg="4" sm="6">
                  <div>
                    <div id="wallet-balance-chart">
                      <ReactApexChart
                        options={walletOptions}
                        series={paymentDatas.series}
                        type="radialBar"
                        height={300}
                        className="apex-charts"
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={4} sm={6} className="align-self-center">
                  <div>
                    <p className="mb-2">
                      <i className="mdi mdi-circle align-middle font-size-10 me-2 text-primary" />
                      Advance Payment
                    </p>
                    <h6>
                      {paymentDatas.Advance.name} ={" "}
                      <span className="text-muted font-size-13">
                        {paymentDatas.Advance.cost.toLocaleString()} ETB
                      </span>
                    </h6>
                  </div>
                  <div className="mt-4 pt-2">
                    <p className="mb-2">
                      <i className="mdi mdi-circle align-middle font-size-10 me-2 text-warning" />
                      Interim Payment
                    </p>
                    <h6>
                      {paymentDatas.Interim.name} ={" "}
                      <span className="text-muted font-size-13">
                        {paymentDatas.Interim.cost.toLocaleString()} ETB
                      </span>
                    </h6>
                  </div>
                  <div className="mt-4 pt-2">
                    <p className="mb-2">
                      <i className="mdi mdi-circle align-middle font-size-10 me-2 text-info" />
                      Final Payment
                    </p>
                    <h6>
                      {paymentDatas.Final.name} ={" "}
                      <span className="text-muted font-size-13">
                        {paymentDatas.Final.cost.toLocaleString()} ETB
                      </span>
                    </h6>
                  </div>
                  <div className="mt-4 pt-2">
                    <p className="mb-2">
                      <i className="mdi mdi-circle align-middle font-size-10 me-2 text-secondary" />
                      Other Payment
                    </p>
                    <h6>
                      {paymentDatas.other.name} ={" "}
                      <span className="text-muted font-size-13">
                        {paymentDatas.other.cost.toLocaleString()} ETB
                      </span>
                    </h6>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default PaymentAnalysis;
