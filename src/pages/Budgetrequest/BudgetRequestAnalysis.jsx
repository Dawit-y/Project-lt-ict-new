import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";

const BudgetRequestAnalysis = ({ data }) => {
  const [budgetData, setBudgetData] = useState({
    series: [0, 0, 0],
    approved: 0,
    rejected: 0,
    pending: 0,
    totalRequests: 0,
    totalRequested: 0,
    totalReleased: 0,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      let approvedCount = 0;
      let rejectedCount = 0;
      let pendingCount = 0;
      let totalRequested = 0;
      let totalReleased = 0;

      data.forEach((item) => {
        totalRequested += parseFloat(item.bdr_requested_amount) || 0;
        totalReleased += parseFloat(item.bdr_released_amount) || 0;

        if (item.bdr_request_status === "Approved") approvedCount++;
        else if (item.bdr_request_status === "Rejected") rejectedCount++;
        else if (item.bdr_request_status === "Requested") pendingCount++;
      });

      const totalRequests = approvedCount + rejectedCount + pendingCount;

      setBudgetData({
        series: [
          totalRequests > 0
            ? ((approvedCount / totalRequests) * 100).toFixed(2)
            : "0",
          totalRequests > 0
            ? ((rejectedCount / totalRequests) * 100).toFixed(2)
            : "0",
          totalRequests > 0
            ? ((pendingCount / totalRequests) * 100).toFixed(2)
            : "0",
        ],
        approved: approvedCount,
        rejected: rejectedCount,
        pending: pendingCount,
        totalRequests,
        totalRequested,
        totalReleased,
      });
    }
  }, [data]);

  const chartOptions = useMemo(
    () => ({
      plotOptions: {
        radialBar: {
          hollow: { size: "30%" },
          dataLabels: {
            name: { show: true },
            value: { show: true, formatter: (val) => `${val}%` },
          },
        },
      },
      colors: ["#34c38f", "#f46a6a", "#74788d"],
      labels: ["Approved", "Rejected", "Pending"],
    }),
    [budgetData]
  );

  return (
    <React.Fragment>
      <Row className="justify-content-center mt-2">
        <Col xl="12" lg="12" md="12">
          <Card>
            <CardBody>
              <h4 className="card-title mb-3">
                Overall Budget Request Analysis
              </h4>
              <Row>
                <Col lg={4}>
                  <div className="mt-5">
                    <p>Total Requested Amount</p>
                    <h4>{budgetData.totalRequested.toLocaleString()} ETB</h4>
                    <Row>
                      <Col xs="6">
                        <div>
                          <p className="mb-2">Released Amount</p>
                          <h5>
                            {budgetData.totalReleased.toLocaleString()} ETB
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
                <Col lg={4} sm="6">
                  <div id="wallet-balance-chart">
                    <ReactApexChart
                      options={chartOptions}
                      series={budgetData.series}
                      type="radialBar"
                      height={300}
                      className="apex-charts"
                    />
                  </div>
                </Col>
                <Col lg={4} sm={6} className="align-self-center">
                  <div>
                    <p className="mb-2">
                      <i className="mdi mdi-circle align-middle font-size-10 me-2 text-primary" />
                      Total Requests
                    </p>
                    <h6>{budgetData.totalRequests?.toLocaleString()}</h6>
                  </div>
                  <div>
                    <p className="mb-2">
                      <i className="mdi mdi-circle align-middle font-size-10 me-2 text-success" />
                      Approved Requests
                    </p>
                    <h6>{budgetData.approved?.toLocaleString()}</h6>
                  </div>
                  <div className="">
                    <p className="mb-2">
                      <i className="mdi mdi-circle align-middle font-size-10 me-2 text-danger" />
                      Rejected Requests
                    </p>
                    <h6>{budgetData.rejected?.toLocaleString()}</h6>
                  </div>
                  <div className="">
                    <p className="mb-2">
                      <i className="mdi mdi-circle align-middle font-size-10 me-2 text-secondary" />
                      Pending Requests
                    </p>
                    <h6>{budgetData.pending?.toLocaleString()}</h6>
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

export default BudgetRequestAnalysis;
