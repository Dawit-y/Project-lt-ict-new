import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { debounce } from "lodash";

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

  useEffect(() => {
    const processData = debounce(() => {
      if (data && data.length > 0) {
        const totals = { Advance: 0, Interim: 0, Final: 0, Other: 0 };
        let totalactive = 0;
        let totalnot_active = 0;

        data.forEach((item) => {
          const amount = item.prp_payment_amount || 0;

          // Accumulate totals based on payment types
          if (item.prp_type === "Advance") totals.Advance += amount;
          else if (item.prp_type === "Interim") totals.Interim += amount;
          else if (item.prp_type === "Final") totals.Final += amount;
          else totals.Other += amount;

          // Update total active and not_active based on status
          if (item.prp_status === 1) {
            totalactive += amount;
          } else {
            totalnot_active += amount;
          }
        });

        // Calculate the total available balance
        const availablebalance =
          totals.Advance + totals.Interim + totals.Final + totals.Other;

        // Calculate the percentages for the series
        const series = [
          parseFloat(((totals.Advance / availablebalance) * 100).toFixed(2)),
          parseFloat(((totals.Interim / availablebalance) * 100).toFixed(2)),
          parseFloat(((totals.Final / availablebalance) * 100).toFixed(2)),
          parseFloat(((totals.Other / availablebalance) * 100).toFixed(2)),
        ];

        // Set the updated state
        setPaymentDatas({
          series,
          availablebalance,
          active: totalactive,
          not_active: totalnot_active,
          Advance: { name: "Total Advance Payment", cost: totals.Advance },
          Interim: { name: "Total Interim Payment", cost: totals.Interim },
          Final: { name: "Total Final Payment", cost: totals.Final },
          other: { name: "Total Other Payment", cost: totals.Other },
        });
      }
    }, 300); // 300ms debounce to prevent excessive updates
    processData();
  }, [data]);

  const GraphOptions = {
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
            label: "Max Value Is", // This can be a static placeholder text
            color: "#373d3f",
            fontSize: "14px",
            fontWeight: 600,
            formatter: function (e) {
              // Get the highest value from the series
              const maxValue = Math.max(...e.globals.series);
              // Get the index of the highest value
              const maxIndex = e.globals.series.indexOf(maxValue);
              // Get the corresponding label for the highest value
              const maxLabel = e.globals.labels[maxIndex];
              // Display the maxLabel above and maxValue below using a line break
              // return maxLabel + "\n" + maxValue + "%";
              // Display the maxLabel only
              return maxLabel;
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

  // console.log("data data data" + paymentDatas.series);

  const memoizedSeries = useMemo(
    () => paymentDatas.series,
    [paymentDatas.series]
  );
  const memoizedOptions = useMemo(() => GraphOptions, [GraphOptions]);

  return (
    <React.Fragment>
      <Row className="justify-content-center mb-5 mt-2">
        <Col xl="12" lg="12" md="12">
          <Card>
            <CardBody>
              <div className="float-end">
                <select
                  defaultValue="1"
                  className="form-select form-select-sm ms-2"
                >
                  <option value="1">2021</option>
                  <option value="2">2022</option>
                  <option value="3">2023</option>
                  <option value="4">2024</option>
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
                      {parseFloat(
                        (
                          (paymentDatas.Advance.cost /
                            (paymentDatas.Advance.cost +
                              paymentDatas.Interim.cost +
                              paymentDatas.Final.cost +
                              paymentDatas.other.cost)) *
                          100
                        ).toFixed(2)
                      )}
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
                        options={memoizedOptions}
                        series={memoizedSeries}
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
