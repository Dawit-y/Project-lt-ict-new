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
import { useTranslation } from "react-i18next";

const ProjectPerformanceAnalysis = ({
  performanceData,
  allData,
  isOverallView,
  chartType,
  onChartTypeChange,
}) => {
  const [selectedView, setSelectedView] = useState("financial");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleTab = (tab) => activeTab !== tab && setActiveTab(tab);

  const { t } = useTranslation();

  // Ethiopian months in order (Hamle to Sene)
  const ETHIOPIAN_MONTHS = [
    t("Meskerem"), // Month 1 (September 6 - October 5)
    t("Tikimt"), // Month 2 (October 6 - November 4)
    t("Hidar"), // Month 3 (November 5 - December 4)
    t("Tahesas"), // Month 4 (December 5 - January 3)
    t("Tir"), // Month 5 (January 4 - February 2)
    t("Yekatit"), // Month 6 (February 3 - March 4)
    t("Megabit"), // Month 7 (March 5 - April 3)
    t("Miyazya"), // Month 8 (April 4 - May 3)
    t("Ginbot"), // Month 9 (May 4 - June 2)
    t("Sene"), // Month 10 (June 3 - July 7)
    t("Hamle"), // Month 11 (July 8 - August 6)
    t("Nehase"), // Month 12 (August 7 - September 5)
  ];

  // Extract month-wise data (still using 1-12 for data structure)
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
        planned: totalPlannedPhysical / 12, // Average planned physical progress
        actual: totalActualPhysical / 12, // Average actual physical progress
        variance: (totalActualPhysical - totalPlannedPhysical) / 12,
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
      // Physical totals - calculate averages per project
      const projectPhysicalPlanned =
        months.reduce(
          (sum, month) =>
            sum + (project[`prp_pyhsical_planned_month_${month}`] || 0),
          0
        ) / 12;

      const projectPhysicalActual =
        months.reduce(
          (sum, month) =>
            sum + (project[`prp_pyhsical_actual_month_${month}`] || 0),
          0
        ) / 12;

      totals.physical.planned += projectPhysicalPlanned;
      totals.physical.actual += projectPhysicalActual;
      totals.physical.variance +=
        projectPhysicalActual - projectPhysicalPlanned;

      // Financial totals - sum absolute values
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

      const projectBaseline = Math.min(
        project?.prp_physical_baseline || 0,
        100
      );
      const projectPerformance = Math.min(
        project?.prp_physical_performance || 0,
        100
      );

      totals.baseline.physical += projectBaseline;
      totals.performance.physical += projectPerformance;
      // Baseline and performance (averages)
      // totals.baseline.physical += project?.prp_physical_baseline || 0;
      totals.baseline.financial += project?.prp_budget_baseline || 0;
      // totals.performance.physical += project?.prp_physical_performance || 0;
      totals.performance.financial += project?.prp_total_budget_used || 0;
    });

    // Calculate averages for physical metrics
    totals.physical.planned = totals.physical.planned / data.length;
    totals.physical.actual = totals.physical.actual / data.length;
    totals.physical.variance = totals.physical.variance / data.length;

    // Calculate averages for baseline and performance
    totals.baseline.physical = totals.baseline.physical / data.length;
    totals.baseline.financial = totals.baseline.financial / data.length;
    totals.performance.physical = totals.performance.physical / data.length;

    totals.baseline.physical = Math.min(totals.baseline.physical, 100);
    totals.performance.physical = Math.min(totals.performance.physical, 100);

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
    const categories = ETHIOPIAN_MONTHS;
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
            const formattedValue = Number(val).toFixed(2);
            return selectedView === "physical"
              ? `${formattedValue}%`
              : `${formattedValue}${chartType === "pie" ? "M" : "M"} ${t(
                  "birr"
                )}`;
          },
        },
      },
    };

    if (chartType === "pie") {
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

        // For overall view, calculate average physical progress per month
        if (isOverallView) {
          months.forEach((month) => {
            data[month - 1] = data[month - 1] / allData.length;
          });
        }

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
                ? `${t("physical_progress_(%)")}`
                : `${t("budget_(Millions)")}`,
          },
          labels: {
            formatter: function (val) {
              const formattedValue = Number(val).toFixed(2);
              return selectedView === "physical"
                ? `${formattedValue}%`
                : `${formattedValue}${chartType === "pie" ? "M" : "M"} ${t(
                    "birr"
                  )}`;
            },
          },
        },
        fill: {
          opacity: 1,
        },
      };

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

        // For overall view, calculate average physical progress per month
        if (isOverallView) {
          months.forEach((month) => {
            planned[month - 1] = planned[month - 1] / allData.length;
            actual[month - 1] = actual[month - 1] / allData.length;
          });
        }

        series = [
          {
            name: isOverallView
              ? `${t("average_planned_physical")}`
              : `${t("planned_physical")}`,
            data: planned,
          },
          {
            name: isOverallView
              ? `${t("average_actual_physical")}`
              : `${t("actual_physical")}`,
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
              ? `${t("total_planned_budget_(M)")}`
              : `${t("planned_budget_(M)")}`,
            data: planned,
          },
          {
            name: isOverallView
              ? `${t("total_actual_budget_(M)")}`
              : `${t("actual_budget_(M)")}`,
            data: actual,
          },
        ];
      }
    }

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
                  ? `${t("overall_projects_performance")}`
                  : `${
                      performanceData?.prj_name || "Project"
                    } Performance Analysis`}
                {isOverallView && (
                  <Badge color="primary" className="ms-2">
                    {totals?.projectCount || 0} {t("projects")}
                  </Badge>
                )}
              </h4>
              <div className="d-flex gap-2">
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle caret className="btn btn-light">
                    {selectedView === "physical"
                      ? `${t("physical_view")}`
                      : `${t("financial_view")}`}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => setSelectedView("physical")}>
                      {t("physical_progress")}
                    </DropdownItem>
                    <DropdownItem onClick={() => setSelectedView("financial")}>
                      {t("financial_progress")}
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
                    <i className="mdi mdi-chart-bar"></i> {t("bar")}
                  </button>
                  <button
                    className={`btn btn-light ${
                      chartType === "pie" ? "active" : ""
                    }`}
                    onClick={() => onChartTypeChange("pie")}
                  >
                    <i className="mdi mdi-chart-pie"></i> {t("pie")}
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
                  {t("summary")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => {
                    toggleTab("2");
                  }}
                >
                  {t("monthly_progress")}
                </NavLink>
              </NavItem>
              {isOverallView && (
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "4" })}
                    onClick={() => {
                      toggleTab("4");
                    }}
                  >
                    {t("yearly_progress")}
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "3" })}
                  onClick={() => {
                    toggleTab("3");
                  }}
                >
                  {t("details")}
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
                          <p className="text-muted">{t("project_code")}</p>
                          <h4>{performanceData?.prj_code || "-"}</h4>

                          <p className="text-muted mt-4">{t("status")}</p>
                          <h5 className="mb-4">
                            {performanceData?.status_name || "-"}
                          </h5>
                        </>
                      )}

                      <Row>
                        <Col xs="6">
                          <div>
                            <p className="text-muted mb-2">
                              {t("total_planned")}
                            </p>
                            <h4>
                              {selectedView === "physical"
                                ? `${formatNumber(
                                    totals?.physical?.planned || 0
                                  )}%`
                                : `${formatNumber(
                                    totals?.financial?.planned || 0
                                  )} ${t("birr")}`}
                            </h4>
                          </div>
                        </Col>
                        <Col xs="6">
                          <div>
                            <p className="text-muted mb-2">
                              {t("total_actual")}
                            </p>
                            <h4>
                              {selectedView === "physical"
                                ? `${formatNumber(
                                    totals?.physical?.actual || 0
                                  )}%`
                                : `${formatNumber(
                                    totals?.financial?.actual || 0
                                  )} ${t("birr")}`}
                            </h4>
                          </div>
                        </Col>
                      </Row>

                      <div className="mt-4">
                        <p className="text-muted mb-2">{t("variance")}</p>
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
                              )} ${t("birr")}`}
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
                        <th>{t("month")}</th>
                        <th>
                          {t("planned")}{" "}
                          {selectedView === "physical"
                            ? `${t("physical")}`
                            : `${t("budget")}`}
                        </th>
                        <th>
                          {t("actual")}{" "}
                          {selectedView === "physical"
                            ? `${t("physical")}`
                            : `${t("budget")}`}
                        </th>
                        <th>{t("variance")}</th>
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
                                ) / allData.length
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
                                ) / allData.length
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

                        return (
                          <tr key={month}>
                            <td>{ETHIOPIAN_MONTHS[month - 1]}</td>
                            <td>
                              {selectedView === "physical"
                                ? `${formatNumber(planned)}%`
                                : `${formatNumber(planned)}M ${t("birr")}`}
                            </td>
                            <td>
                              {selectedView === "physical"
                                ? `${formatNumber(actual)}%`
                                : `${formatNumber(actual)}M ${t("birr")}`}
                            </td>
                            <td
                              className={
                                variance >= 0 ? "text-success" : "text-danger"
                              }
                            >
                              {selectedView === "physical"
                                ? `${formatNumber(Math.abs(variance))}%`
                                : `${formatNumber(Math.abs(variance))}M ${t(
                                    "birr"
                                  )}`}
                              {getStatusIndicator(variance)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </TabPane>
              {isOverallView && (
                <TabPane tabId="4">
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead className="table-light">
                        <tr>
                          <th>{t("year")}</th>
                          <th>
                            {t("total_planned")} (
                            {selectedView === "physical" ? "%" : `${t("birr")}`}
                            )
                          </th>
                          <th>
                            {t("total_actual")} (
                            {selectedView === "physical" ? "%" : `${t("birr")}`}
                            )
                          </th>
                          <th>{t("variance")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(
                          new Set(allData?.map((item) => item.year_name))
                        ).map((year) => {
                          const yearData = allData.filter(
                            (item) => item.year_name === year
                          );
                          const yearTotals = calculateOverallTotals(yearData);

                          return (
                            <tr key={year}>
                              <td>{year}</td>
                              <td>
                                {selectedView === "physical"
                                  ? `${formatNumber(
                                      yearTotals.physical.planned
                                    )}%`
                                  : `${formatNumber(
                                      yearTotals.financial.planned
                                    )} ${t("birr")}`}
                              </td>
                              <td>
                                {selectedView === "physical"
                                  ? `${formatNumber(
                                      yearTotals.physical.actual
                                    )}%`
                                  : `${formatNumber(
                                      yearTotals.financial.actual
                                    )} ${t("birr")}`}
                              </td>
                              <td
                                className={
                                  yearTotals[selectedView].variance >= 0
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                {selectedView === "physical"
                                  ? `${formatNumber(
                                      Math.abs(yearTotals.physical.variance)
                                    )}%`
                                  : `${formatNumber(
                                      Math.abs(yearTotals.financial.variance)
                                    )} ${t("birr")}`}
                                {getStatusIndicator(
                                  yearTotals[selectedView].variance
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </TabPane>
              )}

              <TabPane tabId="3">
                <Row>
                  <Col md="6">
                    <Card>
                      <CardBody>
                        <h5 className="card-title">
                          {t("baseline_comparison")}
                        </h5>
                        <div className="d-flex justify-content-between mt-3">
                          <div>
                            <p className="text-muted mb-1">
                              {t("physical_baseline")}
                            </p>
                            <h4>
                              {formatNumber(totals?.baseline?.physical || 0)}%
                            </h4>
                          </div>
                          <div>
                            <p className="text-muted mb-1">
                              {t("budget_baseline")}
                            </p>
                            <h4>
                              {formatNumber(totals?.baseline?.financial || 0)}{" "}
                              {t("birr")}
                            </h4>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="6">
                    <Card>
                      <CardBody>
                        <h5 className="card-title">
                          {t("performance_summary")}
                        </h5>
                        <div className="d-flex justify-content-between mt-3">
                          <div>
                            <p className="text-muted mb-1">
                              {t("physical_performance")}
                            </p>
                            <h4>
                              {formatNumber(totals?.performance?.physical || 0)}
                              %
                            </h4>
                          </div>
                          <div>
                            <p className="text-muted mb-1">
                              {t("budget_used")}
                            </p>
                            <h4>
                              {formatNumber(
                                totals?.performance?.financial || 0
                              )}{" "}
                              {t("birr")}
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
                          <h4 className="card-title mb-4">
                            {t("project_details")}
                          </h4>
                          <Row>
                            <Col md="4">
                              <p className="text-muted fw-bold mb-1">
                                {t("description")}
                              </p>
                              <p className="text-dark">
                                {performanceData?.prp_description ||
                                  `${t("no_description_available")}`}
                              </p>
                            </Col>
                            <Col md="4">
                              <p className="text-muted fw-bold mb-1">
                                {t("record_date")}
                              </p>
                              <p className="text-dark">
                                {performanceData?.prp_record_date_gc || "-"}
                              </p>
                            </Col>
                            <Col md="4">
                              <p className="text-muted fw-bold mb-1">
                                {t("quarter")}
                              </p>
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
