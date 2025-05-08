import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Badge,
} from "reactstrap";
import classnames from "classnames";
import ReactApexChart from "react-apexcharts";
import { formatNumber, calculatePercentage } from "../../utils/commonMethods";

const ProjectPerformanceAnalysis = ({
  performanceData,
  allData,
  isOverallView,
  chartType,
  onChartTypeChange,
}) => {
  const [selectedView, setSelectedView] = useState("financial"); // 'physical' or 'financial'
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleTab = (tab) => activeTab !== tab && setActiveTab(tab);

  // Extract month-wise data
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Calculate totals for single project
  const calculateSingleProjectTotals = (data) => {
    const totalPlannedPhysical = months.reduce(
      (sum, month) => sum + (data[`prp_pyhsical_planned_month_${month}`] || 0),
      0
    );
    const totalActualPhysical = months.reduce(
      (sum, month) => sum + (data[`prp_pyhsical_actual_month_${month}`] || 0),
      0
    );

    const totalPlannedFinancial = months.reduce(
      (sum, month) => sum + (data[`prp_finan_planned_month_${month}`] || 0),
      0
    );
    const totalActualFinancial = months.reduce(
      (sum, month) => sum + (data[`prp_finan_actual_month_${month}`] || 0),
      0
    );

    return {
      physical: {
        planned: totalPlannedPhysical,
        actual: totalActualPhysical,
        variance: totalActualPhysical - totalPlannedPhysical,
        variancePercentage: calculatePercentage(
          totalActualPhysical,
          totalPlannedPhysical
        ),
      },
      financial: {
        planned: totalPlannedFinancial,
        actual: totalActualFinancial,
        variance: totalActualFinancial - totalPlannedFinancial,
        variancePercentage: calculatePercentage(
          totalActualFinancial,
          totalPlannedFinancial
        ),
      },
      baseline: {
        physical: data?.prp_physical_baseline || 0,
        financial: data?.prp_budget_baseline || 0,
      },
      performance: {
        physical: data?.prp_physical_performance || 0,
        financial: data?.prp_total_budget_used || 0,
      },
    };
  };

  // Calculate totals for all projects
  const calculateOverallTotals = (data) => {
    const totals = {
      physical: { planned: 0, actual: 0, variance: 0 },
      financial: { planned: 0, actual: 0, variance: 0 },
      baseline: { physical: 0, financial: 0 },
      performance: { physical: 0, financial: 0 },
      projectCount: data.length,
    };

    data.forEach((project) => {
      // Physical totals
      const projectPhysicalPlanned = months.reduce(
        (sum, month) =>
          sum + (project[`prp_pyhsical_planned_month_${month}`] || 0),
        0
      );
      const projectPhysicalActual = months.reduce(
        (sum, month) =>
          sum + (project[`prp_pyhsical_actual_month_${month}`] || 0),
        0
      );

      totals.physical.planned += projectPhysicalPlanned;
      totals.physical.actual += projectPhysicalActual;
      totals.physical.variance +=
        projectPhysicalActual - projectPhysicalPlanned;

      // Financial totals
      const projectFinancialPlanned = months.reduce(
        (sum, month) =>
          sum + (project[`prp_finan_planned_month_${month}`] || 0),
        0
      );
      const projectFinancialActual = months.reduce(
        (sum, month) => sum + (project[`prp_finan_actual_month_${month}`] || 0),
        0
      );

      totals.financial.planned += projectFinancialPlanned;
      totals.financial.actual += projectFinancialActual;
      totals.financial.variance +=
        projectFinancialActual - projectFinancialPlanned;

      // Baseline and performance (averages)
      totals.baseline.physical += project?.prp_physical_baseline || 0;
      totals.baseline.financial += project?.prp_budget_baseline || 0;
      totals.performance.physical += project?.prp_physical_performance || 0;
      totals.performance.financial += project?.prp_total_budget_used || 0;
    });

    // Calculate averages for baseline and performance
    totals.baseline.physical = totals.baseline.physical / data.length;
    totals.baseline.financial = totals.baseline.financial / data.length;
    totals.performance.physical = totals.performance.physical / data.length;

    // Calculate percentages
    totals.physical.variancePercentage = calculatePercentage(
      totals.physical.actual,
      totals.physical.planned
    );
    totals.financial.variancePercentage = calculatePercentage(
      totals.financial.actual,
      totals.financial.planned
    );

    return totals;
  };

  // Prepare chart data and options
  const { chartOptions, chartSeries, totals } = useMemo(() => {
    const categories = months.map((month) => `Month ${month}`);
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
      },
      colors: ["#3b5de7", "#45cb85", "#e74c3c", "#f39c12", "#9b59b6"],
      legend: {
        position: "bottom",
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return selectedView === "physical"
              ? `${val}%`
              : `${val}${chartType === "pie" ? "M" : ""} Birr`;
          },
        },
      },
    };

    if (chartType === "pie") {
      // Pie chart specific options
      options = {
        ...options,
        labels: categories,
        plotOptions: {
          pie: {
            donut: {
              size: "65%",
            },
            dataLabels: {
              minAngleToShowLabel: 10,
            },
          },
        },
      };

      // Pie chart data - show only actual values
      if (selectedView === "physical") {
        const data = isOverallView
          ? allData.reduce((acc, project) => {
              months.forEach((month) => {
                acc[month - 1] =
                  (acc[month - 1] || 0) +
                  (project[`prp_pyhsical_actual_month_${month}`] || 0);
              });
              return acc;
            }, Array(12).fill(0))
          : months.map(
              (month) =>
                performanceData?.[`prp_pyhsical_actual_month_${month}`] || 0
            );

        series = data;
      } else {
        const data = isOverallView
          ? allData.reduce((acc, project) => {
              months.forEach((month) => {
                acc[month - 1] =
                  (acc[month - 1] || 0) +
                  (project[`prp_finan_actual_month_${month}`] || 0) / 1000000;
              });
              return acc;
            }, Array(12).fill(0))
          : months.map(
              (month) =>
                (performanceData?.[`prp_finan_actual_month_${month}`] || 0) /
                1000000
            );

        series = data;
      }
    } else {
      // Bar/Line chart options
      options = {
        ...options,
        plotOptions:
          chartType === "bar"
            ? {
                bar: {
                  horizontal: false,
                  columnWidth: "55%",
                  endingShape: "rounded",
                },
              }
            : {},
        dataLabels: {
          enabled: false,
        },
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
          categories,
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          title: {
            text:
              selectedView === "physical"
                ? "Physical Progress (%)"
                : "Budget (Millions)",
          },
        },
        fill: {
          opacity: 1,
        },
      };

      // Bar/Line chart data - show both planned and actual
      if (selectedView === "physical") {
        const planned = isOverallView
          ? allData.reduce((acc, project) => {
              months.forEach((month) => {
                acc[month - 1] =
                  (acc[month - 1] || 0) +
                  (project[`prp_pyhsical_planned_month_${month}`] || 0);
              });
              return acc;
            }, Array(12).fill(0))
          : months.map(
              (month) =>
                performanceData?.[`prp_pyhsical_planned_month_${month}`] || 0
            );

        const actual = isOverallView
          ? allData.reduce((acc, project) => {
              months.forEach((month) => {
                acc[month - 1] =
                  (acc[month - 1] || 0) +
                  (project[`prp_pyhsical_actual_month_${month}`] || 0);
              });
              return acc;
            }, Array(12).fill(0))
          : months.map(
              (month) =>
                performanceData?.[`prp_pyhsical_actual_month_${month}`] || 0
            );

        series = [
          {
            name: isOverallView ? "Total Planned Physical" : "Planned Physical",
            data: planned,
          },
          {
            name: isOverallView ? "Total Actual Physical" : "Actual Physical",
            data: actual,
          },
        ];
      } else {
        const planned = isOverallView
          ? allData.reduce((acc, project) => {
              months.forEach((month) => {
                acc[month - 1] =
                  (acc[month - 1] || 0) +
                  (project[`prp_finan_planned_month_${month}`] || 0) / 1000000;
              });
              return acc;
            }, Array(12).fill(0))
          : months.map(
              (month) =>
                (performanceData?.[`prp_finan_planned_month_${month}`] || 0) /
                1000000
            );

        const actual = isOverallView
          ? allData.reduce((acc, project) => {
              months.forEach((month) => {
                acc[month - 1] =
                  (acc[month - 1] || 0) +
                  (project[`prp_finan_actual_month_${month}`] || 0) / 1000000;
              });
              return acc;
            }, Array(12).fill(0))
          : months.map(
              (month) =>
                (performanceData?.[`prp_finan_actual_month_${month}`] || 0) /
                1000000
            );

        series = [
          {
            name: isOverallView
              ? "Total Planned Budget (M)"
              : "Planned Budget (M)",
            data: planned,
          },
          {
            name: isOverallView
              ? "Total Actual Budget (M)"
              : "Actual Budget (M)",
            data: actual,
          },
        ];
      }
    }

    // Calculate totals
    const calculatedTotals = isOverallView
      ? calculateOverallTotals(allData)
      : performanceData
      ? calculateSingleProjectTotals(performanceData)
      : {
          physical: {
            planned: 0,
            actual: 0,
            variance: 0,
            variancePercentage: 0,
          },
          financial: {
            planned: 0,
            actual: 0,
            variance: 0,
            variancePercentage: 0,
          },
          baseline: { physical: 0, financial: 0 },
          performance: { physical: 0, financial: 0 },
          projectCount: 0,
        };

    return {
      chartOptions: options,
      chartSeries: series,
      totals: calculatedTotals,
    };
  }, [performanceData, allData, isOverallView, selectedView, chartType]);

  // Status indicators
  const getStatusIndicator = (value) => {
    if (value > 0) {
      return <i className="mdi mdi-arrow-up ms-1 text-success" />;
    } else if (value < 0) {
      return <i className="mdi mdi-arrow-down ms-1 text-danger" />;
    }
    return <i className="mdi mdi-minus ms-1 text-muted" />;
  };

  return (
    <React.Fragment>
      <Col xl="12">
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="card-title mb-0">
                {isOverallView
                  ? "Overall Projects Performance"
                  : `${
                      performanceData?.prj_name || "Project"
                    } Performance Analysis`}
                {isOverallView && (
                  <Badge color="primary" className="ms-2">
                    {totals?.projectCount || 0} Projects
                  </Badge>
                )}
              </h4>
              <div className="d-flex gap-2">
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle caret className="btn btn-light">
                    {selectedView === "physical"
                      ? "Physical View"
                      : "Financial View"}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => setSelectedView("physical")}>
                      Physical Progress
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelectedView("financial")}>
                      Financial Progress
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-light ${
                      chartType === "bar" ? "active" : ""
                    }`}
                    onClick={() => onChartTypeChange("bar")}
                  >
                    <i className="mdi mdi-chart-bar"></i> Bar
                  </button>

                  <button
                    className={`btn btn-light ${
                      chartType === "pie" ? "active" : ""
                    }`}
                    onClick={() => onChartTypeChange("pie")}
                  >
                    <i className="mdi mdi-chart-pie"></i> Pie
                  </button>
                </div>
              </div>
            </div>

            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => {
                    toggleTab("1");
                  }}
                >
                  Summary
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => {
                    toggleTab("2");
                  }}
                >
                  Monthly Progress
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "3" })}
                  onClick={() => {
                    toggleTab("3");
                  }}
                >
                  Details
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent
              activeTab={activeTab}
              className="p-3 border border-top-0"
            >
              <TabPane tabId="1">
                <Row>
                  <Col lg="4">
                    <div className="mt-4">
                      {!isOverallView && (
                        <>
                          <p className="text-muted">Project Code</p>
                          <h4>{performanceData?.prj_code || "-"}</h4>

                          <p className="text-muted mt-4">Status</p>
                          <h5 className="mb-4">
                            {performanceData?.status_name || "-"}
                          </h5>
                        </>
                      )}

                      <Row>
                        <Col xs="6">
                          <div>
                            <p className="text-muted mb-2">Total Planned</p>
                            <h4>
                              {selectedView === "physical"
                                ? `${formatNumber(
                                    totals?.physical?.planned || 0
                                  )}%`
                                : `${formatNumber(
                                    totals?.financial?.planned || 0
                                  )} Birr`}
                            </h4>
                          </div>
                        </Col>
                        <Col xs="6">
                          <div>
                            <p className="text-muted mb-2">Total Actual</p>
                            <h4>
                              {selectedView === "physical"
                                ? `${formatNumber(
                                    totals?.physical?.actual || 0
                                  )}%`
                                : `${formatNumber(
                                    totals?.financial?.actual || 0
                                  )} Birr`}
                            </h4>
                          </div>
                        </Col>
                      </Row>

                      <div className="mt-4">
                        <p className="text-muted mb-2">Variance</p>
                        <h4
                          className={
                            totals?.[selectedView]?.variance >= 0
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {selectedView === "physical"
                            ? `${formatNumber(
                                Math.abs(totals?.physical?.variance || 0)
                              )}%`
                            : `${formatNumber(
                                Math.abs(totals?.financial?.variance || 0)
                              )} Birr`}
                          {getStatusIndicator(
                            totals?.[selectedView]?.variance || 0
                          )}
                          <span className="text-muted font-size-14 ms-2">
                            (
                            {formatNumber(
                              totals?.[selectedView]?.variancePercentage || 0
                            )}
                            %)
                          </span>
                        </h4>
                      </div>
                    </div>
                  </Col>

                  <Col lg="8">
                    <div id="project-performance-chart">
                      <ReactApexChart
                        options={chartOptions}
                        series={chartType === "pie" ? chartSeries : chartSeries}
                        type={chartType}
                        height={350}
                        className="apex-charts"
                      />
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-light">
                      <tr>
                        <th>Month</th>
                        <th>
                          Planned{" "}
                          {selectedView === "physical" ? "Physical" : "Budget"}
                        </th>
                        <th>
                          Actual{" "}
                          {selectedView === "physical" ? "Physical" : "Budget"}
                        </th>
                        <th>Variance</th>
                        {/* <th>%</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {months.map((month) => {
                        const planned =
                          selectedView === "physical"
                            ? isOverallView
                              ? allData.reduce(
                                  (sum, project) =>
                                    sum +
                                    (project[
                                      `prp_pyhsical_planned_month_${month}`
                                    ] || 0),
                                  0
                                )
                              : performanceData?.[
                                  `prp_pyhsical_planned_month_${month}`
                                ] || 0
                            : isOverallView
                            ? allData.reduce(
                                (sum, project) =>
                                  sum +
                                  (project[
                                    `prp_finan_planned_month_${month}`
                                  ] || 0),
                                0
                              ) / 1000000
                            : (performanceData?.[
                                `prp_finan_planned_month_${month}`
                              ] || 0) / 1000000;

                        const actual =
                          selectedView === "physical"
                            ? isOverallView
                              ? allData.reduce(
                                  (sum, project) =>
                                    sum +
                                    (project[
                                      `prp_pyhsical_actual_month_${month}`
                                    ] || 0),
                                  0
                                )
                              : performanceData?.[
                                  `prp_pyhsical_actual_month_${month}`
                                ] || 0
                            : isOverallView
                            ? allData.reduce(
                                (sum, project) =>
                                  sum +
                                  (project[`prp_finan_actual_month_${month}`] ||
                                    0),
                                0
                              ) / 1000000
                            : (performanceData?.[
                                `prp_finan_actual_month_${month}`
                              ] || 0) / 1000000;

                        const variance = actual - planned;
                        // const variancePercentage = planned
                        //   ? (variance / planned) * 100
                        //   : 0;

                        return (
                          <tr key={month}>
                            <td>Month {month}</td>
                            <td>
                              {selectedView === "physical"
                                ? `${planned}%`
                                : `${formatNumber(planned)}M Birr`}
                            </td>
                            <td>
                              {selectedView === "physical"
                                ? `${actual}%`
                                : `${formatNumber(actual)}M Birr`}
                            </td>
                            <td
                              className={
                                variance >= 0 ? "text-success" : "text-danger"
                              }
                            >
                              {selectedView === "physical"
                                ? `${formatNumber(Math.abs(variance))}%`
                                : `${formatNumber(Math.abs(variance))}M Birr`}
                              {getStatusIndicator(variance)}
                            </td>
                            {/* <td>{formatNumber(variancePercentage)}%</td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </TabPane>
              <TabPane tabId="3">
                <Row>
                  <Col md="6">
                    <Card>
                      <CardBody>
                        <h5 className="card-title">Baseline Comparison</h5>
                        <div className="d-flex justify-content-between mt-3">
                          <div>
                            <p className="text-muted mb-1">Physical Baseline</p>
                            <h4>
                              {formatNumber(totals?.baseline?.physical || 0)}%
                            </h4>
                          </div>
                          <div>
                            <p className="text-muted mb-1">Budget Baseline</p>
                            <h4>
                              {formatNumber(totals?.baseline?.financial || 0)}{" "}
                              Birr
                            </h4>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="6">
                    <Card>
                      <CardBody>
                        <h5 className="card-title">Performance Summary</h5>
                        <div className="d-flex justify-content-between mt-3">
                          <div>
                            <p className="text-muted mb-1">
                              Physical Performance
                            </p>
                            <h4>
                              {formatNumber(totals?.performance?.physical || 0)}
                              %
                            </h4>
                          </div>
                          <div>
                            <p className="text-muted mb-1">Budget Used</p>
                            <h4>
                              {formatNumber(
                                totals?.performance?.financial || 0
                              )}{" "}
                              Birr
                            </h4>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                {!isOverallView && (
                  <Row className="mt-4">
                    <Col md="12">
                      <Card className="shadow-sm border-0">
                        <CardBody>
                          <h4 className="card-title mb-4">Project Details</h4>
                          <Row>
                            <Col md="4">
                              <p className="text-muted fw-bold mb-1">
                                Description
                              </p>
                              <p className="text-dark">
                                {performanceData?.prp_description ||
                                  "No description available"}
                              </p>
                            </Col>
                            <Col md="4">
                              <p className="text-muted fw-bold mb-1">
                                Record Date
                              </p>
                              <p className="text-dark">
                                {performanceData?.prp_record_date_gc || "-"}
                              </p>
                            </Col>
                            <Col md="4">
                              <p className="text-muted fw-bold mb-1">Quarter</p>
                              <p className="text-dark">
                                {performanceData?.prp_quarter_id || "-"}
                              </p>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                )}
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default ProjectPerformanceAnalysis;
