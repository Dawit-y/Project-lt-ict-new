import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Badge,
} from "reactstrap";
import classnames from "classnames";
import ReactApexChart from "react-apexcharts";
import {
  formatNumber,
  calculatePercentage,
} from "../../../utils/commonMethods";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const ProjectPaymentAnalysis = ({
  paymentData = null,
  allData = [],
  isOverallView = false,
  chartType = "bar",
  onChartTypeChange = () => {},
  paymentCategoryMap = {},
}) => {
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => activeTab !== tab && setActiveTab(tab);

  const { t } = useTranslation();

  // Safe calculation for single payment
  const calculateSinglePaymentTotals = (data) => {
    if (!data || typeof data !== "object") {
      return {
        payment: {
          amount: 0,
          percentage: 0,
        },
        details: {
          date: "-",
          type: "-",
          description: "-",
        },
      };
    }

    return {
      payment: {
        amount: Number(data?.prp_payment_amount) || 0,
        percentage: Number(data?.prp_payment_percentage) || 0,
      },
      details: {
        date: data?.prp_payment_date_gc || "-",
        type: paymentCategoryMap[data?.prp_type] || "-",
        description: data?.prp_description || "-",
      },
    };
  };

  // Safe calculation for all payments
  const calculateOverallTotals = (data) => {
    const totals = {
      totalAmount: 0,
      averagePercentage: 0,
      paymentCount: 0,
      byType: {},
    };

    if (!Array.isArray(data)) {
      return totals;
    }

    const validPayments = data.filter(
      (payment) =>
        payment && typeof payment === "object" && payment.prp_payment_amount
    );

    totals.paymentCount = validPayments.length;

    validPayments.forEach((payment) => {
      const amount = Number(payment?.prp_payment_amount) || 0;
      const percentage = Number(payment?.prp_payment_percentage) || 0;
      const type = paymentCategoryMap[payment?.prp_type] || "Unknown";

      totals.totalAmount += amount;
      totals.averagePercentage += percentage;

      if (!totals.byType[type]) {
        totals.byType[type] = {
          count: 0,
          totalAmount: 0,
          averagePercentage: 0,
        };
      }

      totals.byType[type].count++;
      totals.byType[type].totalAmount += amount;
      totals.byType[type].averagePercentage += percentage;
    });

    // Calculate averages
    if (totals.paymentCount > 0) {
      totals.averagePercentage = totals.averagePercentage / totals.paymentCount;
    }

    // Calculate averages for each type
    Object.keys(totals.byType).forEach((type) => {
      if (totals.byType[type].count > 0) {
        totals.byType[type].averagePercentage =
          totals.byType[type].averagePercentage / totals.byType[type].count;
      }
    });

    return totals;
  };

  // Prepare chart data with error handling
  const { chartOptions, chartSeries, totals } = useMemo(() => {
    const defaultReturn = {
      chartOptions: {},
      chartSeries: [],
      totals: isOverallView
        ? calculateOverallTotals(allData)
        : calculateSinglePaymentTotals(paymentData),
    };

    try {
      const calculatedTotals = isOverallView
        ? calculateOverallTotals(allData)
        : paymentData
        ? calculateSinglePaymentTotals(paymentData)
        : {
            payment: { amount: 0, percentage: 0 },
            details: { date: "-", type: "-", description: "-" },
            paymentCount: 0,
          };

      let series = [];
      let options = {
        chart: {
          height: 350,
          type: chartType,
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
          },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
          },
        },
        colors: [
          "#3b5de7",
          "#45cb85",
          "#e74c3c",
          "#f39c12",
          "#9b59b6",
          "#1abc9c",
          "#3498db",
        ],
        legend: {
          position: "bottom",
          itemMargin: {
            horizontal: 10,
            vertical: 5,
          },
          markers: {
            radius: 4,
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return `${formatNumber(val)} ${t("birr")}`;
            },
          },
        },
        dataLabels: {
          enabled: chartType === "pie",
          style: {
            fontSize: "12px",
            fontWeight: "bold",
          },
          dropShadow: {
            enabled: false,
          },
        },
      };

      if (chartType === "pie" || chartType === "donut") {
        if (isOverallView) {
          options = {
            ...options,
            labels: Object.keys(calculatedTotals.byType),
            plotOptions: {
              pie: {
                donut: {
                  size: "75%",
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: t("total_amount"),
                      formatter: function (w) {
                        return (
                          formatNumber(
                            w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                          ) +
                          " " +
                          t("birr")
                        );
                      },
                    },
                  },
                },
                dataLabels: {
                  minAngleToShowLabel: 10,
                },
              },
            },
          };
          series = Object.values(calculatedTotals.byType).map(
            (type) => type.totalAmount
          );
        } else {
          options = {
            ...options,
            labels: [t("payment_amount")],
            plotOptions: {
              pie: {
                donut: {
                  size: "65%",
                  labels: {
                    show: true,
                    name: {
                      show: true,
                      fontSize: "16px",
                    },
                    value: {
                      show: true,
                      formatter: function (val) {
                        return formatNumber(val) + " " + t("birr");
                      },
                    },
                  },
                },
              },
            },
          };
          series = [calculatedTotals.payment.amount];
        }
      } else {
        options = {
          ...options,
          plotOptions:
            chartType === "bar"
              ? {
                  bar: {
                    horizontal: false,
                    columnWidth: "70%",
                    endingShape: "rounded",
                    borderRadius: 4,
                  },
                }
              : {},
          stroke:
            chartType === "line"
              ? {
                  curve: "smooth",
                  width: [3, 3],
                }
              : {
                  show: true,
                  width: 2,
                  colors: ["transparent"],
                },
          xaxis: {
            categories: isOverallView
              ? Object.keys(calculatedTotals.byType)
              : [t("payment")],
            labels: {
              style: {
                fontSize: "12px",
              },
            },
          },
          yaxis: {
            title: {
              text: `${t("payment_amount")} (${t("birr")})`,
              style: {
                fontSize: "12px",
              },
            },
            labels: {
              formatter: function (val) {
                return `${formatNumber(val)}`;
              },
            },
          },
          fill: {
            opacity: 1,
          },
          grid: {
            borderColor: "#f1f1f1",
          },
        };

        series = [
          {
            name: isOverallView
              ? t("total_payment_amount")
              : t("payment_amount"),
            data: isOverallView
              ? Object.values(calculatedTotals.byType).map(
                  (type) => type.totalAmount
                )
              : [calculatedTotals.payment.amount],
          },
        ];
      }

      return {
        chartOptions: options,
        chartSeries: series,
        totals: calculatedTotals,
      };
    } catch (error) {
      console.error("Error generating chart data:", error);
      return defaultReturn;
    }
  }, [paymentData, allData, isOverallView, chartType, t, paymentCategoryMap]);

  return (
    <React.Fragment>
      <Col xl="12">
        <Card className="border-0 shadow-sm">
          <CardBody className="p-0">
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <h4 className="card-title mb-0">
                {isOverallView
                  ? `${t("overall_payments_analysis")}`
                  : `${paymentData?.prj_name || "Project"} ${t(
                      "payment_analysis"
                    )}`}
                {isOverallView && (
                  <Badge color="primary" className="ms-2" pill>
                    {totals?.paymentCount || 0} {t("payments")}
                  </Badge>
                )}
              </h4>
              <div className="d-flex gap-2">
                <div className="btn-group" role="group">
                  <button
                    className={`btn btn-sm ${
                      chartType === "bar"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => onChartTypeChange("bar")}
                  >
                    <i className="mdi mdi-chart-bar"></i> {t("bar")}
                  </button>
                  <button
                    className={`btn btn-sm ${
                      chartType === "pie"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => onChartTypeChange("pie")}
                  >
                    <i className="mdi mdi-chart-pie"></i> {t("pie")}
                  </button>
                  <button
                    className={`btn btn-sm ${
                      chartType === "donut"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => onChartTypeChange("donut")}
                  >
                    <i className="mdi mdi-chart-donut"></i> {t("donut")}
                  </button>
                </div>
              </div>
            </div>

            <Nav tabs className="px-4 pt-2">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => {
                    toggleTab("1");
                  }}
                >
                  <i className="mdi mdi-chart-areaspline me-1"></i>{" "}
                  {t("summary")}
                </NavLink>
              </NavItem>
              {isOverallView && (
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggleTab("2");
                    }}
                  >
                    <i className="mdi mdi-format-list-bulleted-type me-1"></i>{" "}
                    {t("by_payment_type")}
                  </NavLink>
                </NavItem>
              )}
              {!isOverallView && (
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "3" })}
                    onClick={() => {
                      toggleTab("3");
                    }}
                  >
                    <i className="mdi mdi-information-outline me-1"></i>{" "}
                    {t("details")}
                  </NavLink>
                </NavItem>
              )}
            </Nav>

            <TabContent activeTab={activeTab} className="p-4 border-top-0">
              <TabPane tabId="1">
                <Row>
                  <Col lg="4">
                    <div className="mt-0">
                      {!isOverallView && (
                        <Card className="mb-3 border">
                          <CardBody>
                            <p className="text-muted mb-1">
                              <i className="mdi mdi-barcode me-1"></i>{" "}
                              {t("project_code")}
                            </p>
                            <h4 className="text-primary">
                              {paymentData?.prj_code || "-"}
                            </h4>
                          </CardBody>
                        </Card>
                      )}

                      <Card className="mb-3 border">
                        <CardBody>
                          <Row>
                            <Col xs="6">
                              <div>
                                <p className="text-muted mb-2">
                                  <i className="mdi mdi-cash me-1"></i>{" "}
                                  {isOverallView
                                    ? t("total_payment_amount")
                                    : t("payment_amount")}
                                </p>
                                <h3 className="text-success">
                                  {formatNumber(
                                    totals?.payment?.amount ||
                                      totals?.totalAmount ||
                                      0
                                  )}{" "}
                                  <small className="text-muted">
                                    {t("birr")}
                                  </small>
                                </h3>
                              </div>
                            </Col>
                            <Col xs="6">
                              <div>
                                <p className="text-muted mb-2">
                                  <i className="mdi mdi-percent me-1"></i>{" "}
                                  {isOverallView
                                    ? t("average_payment_percentage")
                                    : t("payment_percentage")}
                                </p>
                                <h3 className="text-info">
                                  {formatNumber(
                                    totals?.payment?.percentage ||
                                      totals?.averagePercentage ||
                                      0
                                  )}
                                  <small>%</small>
                                </h3>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>

                      {isOverallView && (
                        <Card className="mb-3 border">
                          <CardBody>
                            <p className="text-muted mb-2">
                              <i className="mdi mdi-counter me-1"></i>{" "}
                              {t("number_of_payments")}
                            </p>
                            <h3 className="text-warning">
                              {totals?.paymentCount || 0}
                              <Badge color="light" className="ms-2" pill>
                                {t("payments")}
                              </Badge>
                            </h3>
                          </CardBody>
                        </Card>
                      )}

                      {/* New Payment Type Distribution Card */}
                      {isOverallView && (
                        <Card className="border">
                          <CardBody>
                            <h5 className="card-title">
                              <i className="mdi mdi-chart-arc me-1"></i>{" "}
                              {t("payment_type_distribution")}
                            </h5>
                            <div className="mt-3">
                              {Object.entries(totals?.byType || {}).map(
                                ([type, data]) => (
                                  <div key={type} className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                      <span className="text-muted">{type}</span>
                                      <span className="fw-bold">
                                        {formatNumber(data.totalAmount)}{" "}
                                        {t("birr")}
                                        <small className="text-muted ms-2">
                                          ({data.count} {t("payments")})
                                        </small>
                                      </span>
                                    </div>
                                    <div className="progress progress-sm">
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                          width: `${calculatePercentage(
                                            data.totalAmount,
                                            totals.totalAmount
                                          )}%`,
                                          backgroundColor:
                                            getColorForType(type),
                                        }}
                                        aria-valuenow={calculatePercentage(
                                          data.totalAmount,
                                          totals.totalAmount
                                        )}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                      ></div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      )}
                    </div>
                  </Col>

                  <Col lg="8">
                    <Card className="border-0 shadow-none">
                      <CardBody className="p-0">
                        <div id="payment-analysis-chart">
                          <ReactApexChart
                            options={chartOptions}
                            series={chartSeries}
                            type={chartType}
                            height={350}
                            className="apex-charts"
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              {isOverallView && (
                <TabPane tabId="2">
                  <div className="table-responsive">
                    <table className="table table-hover table-striped align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>{t("payment_type")}</th>
                          <th className="text-center">
                            {t("number_of_payments")}
                          </th>
                          <th className="text-end">
                            {t("total_amount")} ({t("birr")})
                          </th>
                          <th className="text-end">
                            {t("average_percentage")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(totals?.byType || {}).map(
                          ([type, data]) => (
                            <tr key={type}>
                              <td>
                                <span
                                  className="d-inline-block me-2"
                                  style={{
                                    width: "12px",
                                    height: "12px",
                                    backgroundColor: getColorForType(type),
                                    borderRadius: "2px",
                                  }}
                                ></span>
                                {type}
                              </td>
                              <td className="text-center">{data.count}</td>
                              <td className="text-end fw-bold">
                                {formatNumber(data.totalAmount)}
                              </td>
                              <td className="text-end">
                                {formatNumber(data.averagePercentage)}%
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabPane>
              )}

              <TabPane tabId="3">
                <Row>
                  <Col md={isOverallView ? "12" : "6"}>
                    <Card className="border">
                      <CardBody>
                        <h5 className="card-title">
                          <i className="mdi mdi-credit-card-outline me-1"></i>{" "}
                          {t("payment_details")}
                        </h5>
                        <div className="mt-3">
                          <Row>
                            <Col md="6">
                              <p className="text-muted mb-1">
                                <i className="mdi mdi-calendar me-1"></i>{" "}
                                {t("payment_date")}
                              </p>
                              <h4>{totals?.details?.date || "-"}</h4>
                            </Col>
                            <Col md="6">
                              <p className="text-muted mb-1">
                                <i className="mdi mdi-tag-outline me-1"></i>{" "}
                                {t("payment_type")}
                              </p>
                              <h4>{totals?.details?.type || "-"}</h4>
                            </Col>
                          </Row>
                          {!isOverallView && (
                            <Row className="mt-3">
                              <Col md="12">
                                <p className="text-muted mb-1">
                                  <i className="mdi mdi-text-box-outline me-1"></i>{" "}
                                  {t("description")}
                                </p>
                                <p className="text-dark">
                                  {totals?.details?.description ||
                                    t("no_description_available")}
                                </p>
                              </Col>
                            </Row>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </Col>

                  {!isOverallView && (
                    <Col md="6">
                      <Card className="border">
                        <CardBody>
                          <h5 className="card-title">
                            <i className="mdi mdi-information-outline me-1"></i>{" "}
                            {t("project_info")}
                          </h5>
                          <div className="mt-3">
                            <Row>
                              <Col md="6">
                                <p className="text-muted mb-1">
                                  <i className="mdi mdi-home-modern me-1"></i>{" "}
                                  {t("project_name")}
                                </p>
                                <h4>{paymentData?.prj_name || "-"}</h4>
                              </Col>
                              <Col md="6">
                                <p className="text-muted mb-1">
                                  <i className="mdi mdi-barcode me-1"></i>{" "}
                                  {t("project_code")}
                                </p>
                                <h4>{paymentData?.prj_code || "-"}</h4>
                              </Col>
                            </Row>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  )}
                </Row>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

// Helper function to get consistent colors for payment types
const getColorForType = (type) => {
  const colorMap = {
    Advance: "#3b5de7",
    Progress: "#45cb85",
    Final: "#e74c3c",
    Retention: "#f39c12",
    Other: "#9b59b6",
    Unknown: "#1abc9c",
  };
  return colorMap[type] || "#3498db";
};

ProjectPaymentAnalysis.propTypes = {
  paymentData: PropTypes.object,
  allData: PropTypes.array,
  isOverallView: PropTypes.bool,
  chartType: PropTypes.string,
  onChartTypeChange: PropTypes.func,
  paymentCategoryMap: PropTypes.object.isRequired,
};

ProjectPaymentAnalysis.defaultProps = {
  paymentData: null,
  allData: [],
  isOverallView: false,
  chartType: "bar",
  onChartTypeChange: () => {},
};

export default ProjectPaymentAnalysis;
