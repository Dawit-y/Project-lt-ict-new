import React, { useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Badge,
  Progress,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import Chart from "react-apexcharts";

const ProjectSummary = ({ data }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Null-safe data extraction
  const performance = data?.performance || {};
  const budgetInfo = data?.budget_info || [];
  const project = data?.data || {};

  // Helper functions with null checks
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount) => {
    return `ETB ${formatNumber(amount)}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const [year, month, day] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day);
    } catch {
      return null;
    }
  };

  const getDurationDays = (startDate, endDate) => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (!start || !end) return 0;
    const diffTime = end - start;
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDuration = (days) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      const months = Math.floor((days % 365) / 30);
      return `${years} year${years !== 1 ? "s" : ""}${
        months > 0 ? ` ${months} month${months !== 1 ? "s" : ""}` : ""
      }`;
    }
    if (days >= 30) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return `${months} month${months !== 1 ? "s" : ""}${
        remainingDays > 0
          ? ` ${remainingDays} day${remainingDays !== 1 ? "s" : ""}`
          : ""
      }`;
    }
    return `${days} day${days !== 1 ? "s" : ""}`;
  };

  // Calculate project metrics with null checks
  const projectMetrics = {
    // Financial metrics
    totalBudget: project?.prj_total_estimate_budget || 0,
    actualFinancial: performance?.actual_financial || 0,
    plannedFinancial: performance?.planned_financial || 0,
    financialProgress: performance?.planned_financial
      ? Math.min(
          (performance.actual_financial / performance.planned_financial) * 100,
          100
        )
      : 0,

    // Physical metrics
    actualPhysical: performance?.actual_physical || 0,
    plannedPhysical: performance?.planned_physical || 0,
    physicalProgress: performance?.planned_physical
      ? Math.min(
          (performance.actual_physical / performance.planned_physical) * 100,
          100
        )
      : 0,

    // Time metrics
    startDate: project?.prj_start_date_plan_gc,
    endDate: project?.prj_end_date_plan_gc,
    durationDays: getDurationDays(
      project?.prj_start_date_plan_gc,
      project?.prj_end_date_plan_gc
    ),
    daysElapsed: project?.prj_start_date_plan_gc
      ? getDurationDays(
          project.prj_start_date_plan_gc,
          new Date().toISOString().split("T")[0].replace(/-/g, "/")
        )
      : 0,
    daysRemaining: Math.max(
      0,
      getDurationDays(
        new Date().toISOString().split("T")[0].replace(/-/g, "/"),
        project?.prj_end_date_plan_gc
      )
    ),

    // Budget breakdown
    releasedBudget: budgetInfo.reduce(
      (sum, item) => sum + (item?.released_amount || 0),
      0
    ),
    budgetTypes: budgetInfo.map((item) => ({
      type: item?.budget_type || "Unknown",
      amount: item?.released_amount || 0,
    })),

    // Beneficiaries
    urbanBeneficiaries: project?.prj_urban_ben_number || 0,
    ruralBeneficiaries: project?.prj_rural_ben_number || 0,
    totalBeneficiaries:
      (project?.prj_urban_ben_number || 0) +
      (project?.prj_rural_ben_number || 0),
  };

  // Color scheme
  const colors = {
    primary: "#3b5de7",
    success: "#45cb85",
    warning: "#eeb902",
    danger: "#ff5e5e",
    info: "#a162e8",
    dark: "#343a40",
    light: "#f8f9fa",
  };

  // Chart configurations

  const financialChart = {
    options: {
      chart: {
        type: "radialBar",
        height: 350,
        fontFamily: "inherit",
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: "75%", // Increased hollow size for better spacing
            background: "#fff",
          },
          track: {
            background: colors.light,
            strokeWidth: "60%", // Reduced stroke width
            margin: 0,
          },
          dataLabels: {
            name: {
              offsetY: -15, // Adjusted position
              color: colors.dark,
              fontSize: "12px", // Smaller font
              fontWeight: 600,
            },
            value: {
              color: colors.dark,
              fontSize: "18px", // Smaller font
              fontWeight: 700,
              offsetY: 5, // Adjusted position
              formatter: (val) => `${Math.round(val)}%`,
            },
            total: {
              show: true,
              label: "Financial Progress",
              color: colors.dark,
              fontSize: "14px", // Smaller font
              formatter: () =>
                `${formatCompactCurrency(
                  projectMetrics.actualFinancial
                )} / ${formatCompactCurrency(projectMetrics.plannedFinancial)}`,
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91],
        },
      },
      stroke: {
        dashArray: 4,
      },
      colors: [colors.primary],
      labels: ["Completion"],
    },
    series: [Math.min(100, Math.round(projectMetrics.financialProgress))],
  };

  // Helper function to format currency in a compact way (e.g., $10K instead of $10,000)
  function formatCompactCurrency(value) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return `${value}`;
  }

  const physicalChart = {
    options: {
      chart: {
        type: "radialBar",
        height: 350,
        fontFamily: "inherit",
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: "75%", // Increased hollow size for better label spacing
            background: "#fff",
          },
          track: {
            background: colors.light,
            strokeWidth: "60%", // Reduced thickness to match financial chart
            margin: 0,
          },
          dataLabels: {
            name: {
              offsetY: -15, // Adjusted upward
              color: colors.dark,
              fontSize: "12px", // Smaller font
              fontWeight: 600,
            },
            value: {
              color: colors.dark,
              fontSize: "24px", // Reduced from 30px to prevent overflow
              fontWeight: 700,
              offsetY: 5, // Centered vertically
              formatter: (val) => `${Math.round(val)}%`,
            },
            total: {
              show: true,
              label: "Physical Progress",
              color: colors.dark,
              fontSize: "14px", // Smaller font for compactness
              formatter: () =>
                `${projectMetrics.actualPhysical}% / ${projectMetrics.plannedPhysical}%`,
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91],
        },
      },
      stroke: {
        dashArray: 4,
      },
      colors: [colors.success], // Different color for distinction
      labels: ["Completion"],
    },
    series: [Math.min(100, Math.round(projectMetrics.physicalProgress))],
  };

  const budgetDistributionChart = {
    options: {
      chart: {
        type: "donut",
        height: 350,
        fontFamily: "inherit",
      },
      labels: projectMetrics.budgetTypes.map((item) => item.type),
      colors: [colors.primary, colors.info, colors.success, colors.warning],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      legend: {
        position: "right",
        fontFamily: "inherit",
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total Released",
                color: colors.dark,
                formatter: () => formatCurrency(projectMetrics.releasedBudget),
              },
            },
          },
        },
      },
    },
    series: projectMetrics.budgetTypes.map((item) => item.amount),
  };

  const timeProgressChart = {
    options: {
      chart: {
        type: "radialBar",
        height: 350,
        fontFamily: "inherit",
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: "75%", // Increased from 70% for better spacing
            background: "#fff",
          },
          track: {
            background: colors.light,
            strokeWidth: "60%", // Reduced from 67% for better proportions
            margin: 0,
          },
          dataLabels: {
            name: {
              offsetY: -15, // Adjusted positioning
              color: colors.dark,
              fontSize: "12px", // Slightly smaller
              fontWeight: 600,
            },
            value: {
              color: colors.dark,
              fontSize: "24px", // Reduced from 30px to prevent overflow
              fontWeight: 700,
              offsetY: 5, // Better vertical alignment
              formatter: (val) => `${Math.round(val)}%`,
            },
            total: {
              show: true,
              label: "Time Progress",
              color: colors.dark,
              fontSize: "14px", // Adjusted for better fit

              formatter: () => {
                return projectMetrics.durationDays > 0
                  ? `${Math.min(
                      100,
                      Math.round(
                        (projectMetrics.daysElapsed /
                          projectMetrics.durationDays) *
                          100
                      )
                    )} %`
                  : 0;
              },
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91],
        },
      },
      stroke: {
        dashArray: 4,
      },
      colors: [colors.info],
      labels: ["Elapsed"],
    },
    series: [
      projectMetrics.durationDays > 0
        ? Math.min(
            100,
            Math.round(
              (projectMetrics.daysElapsed / projectMetrics.durationDays) * 100
            )
          )
        : 0,
    ],
  };

  const beneficiariesChart = {
    options: {
      chart: {
        type: "bar",
        height: 350,
        fontFamily: "inherit",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      colors: [colors.primary, colors.success],
      xaxis: {
        categories: ["Urban", "Rural", "Total"],
      },
      yaxis: {
        title: {
          text: "Number of Beneficiaries",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val) => formatNumber(val),
        },
      },
    },
    series: [
      {
        name: "Beneficiaries",
        data: [
          projectMetrics.urbanBeneficiaries,
          projectMetrics.ruralBeneficiaries,
          projectMetrics.totalBeneficiaries,
        ],
      },
    ],
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardBody>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1" style={{ fontWeight: 600 }}>
              {project?.prj_name || "Project Dashboard"}
              {project?.prj_code && (
                <small className="text-muted ms-2">({project.prj_code})</small>
              )}
            </h4>
            <div className="d-flex align-items-center">
              <Badge
                color={project?.color_code || "light"}
                className="me-2"
                pill
              >
                {project?.status_name || "Unknown Status"}
              </Badge>
              <Badge color="light" className="text-dark">
                <i className="mdi mdi-account-group me-1"></i>
                {formatNumber(projectMetrics.totalBeneficiaries)} Beneficiaries
              </Badge>
            </div>
          </div>

          {project?.prj_end_date_plan_gc && (
            <Badge color="light" className="text-dark">
              <i className="mdi mdi-calendar-range me-1"></i>
              {project.prj_end_date_plan_gc}
              {projectMetrics.daysRemaining > 0 && (
                <span className="ms-2">
                  {projectMetrics.daysRemaining} days remaining
                </span>
              )}
            </Badge>
          )}
        </div>

        {/* Tabs */}
        <Nav tabs className="nav-tabs-custom mb-4">
          <NavItem>
            <NavLink
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            >
              <i className="mdi mdi-view-dashboard-outline me-1"></i> Overview
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={activeTab === "performance"}
              onClick={() => setActiveTab("performance")}
            >
              <i className="mdi mdi-chart-line me-1"></i> Performance
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={activeTab === "budget"}
              onClick={() => setActiveTab("budget")}
            >
              <i className="mdi mdi-cash-multiple me-1"></i> Budget
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={activeTab === "details"}
              onClick={() => setActiveTab("details")}
            >
              <i className="mdi mdi-information-outline me-1"></i> Details
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab} className="pt-3">
          {/* Overview Tab */}
          <TabPane tabId="overview">
            <Row>
              {/* Financial Progress */}
              <Col lg={4} md={6}>
                <Card className="shadow-none border">
                  <CardBody>
                    <h5 className="card-title">Financial Progress</h5>
                    <Chart
                      options={financialChart.options}
                      series={financialChart.series}
                      type="radialBar"
                      height={300}
                    />
                    <div className="mt-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Actual</span>
                        <span>
                          {formatCurrency(projectMetrics.actualFinancial)}
                        </span>
                      </div>
                      <Progress
                        value={Math.round(projectMetrics.financialProgress)}
                        color="primary"
                        style={{ height: "6px" }}
                      />
                      <div className="d-flex justify-content-between mt-1">
                        <span>Planned</span>
                        <span>
                          {formatCurrency(projectMetrics.plannedFinancial)}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              {/* Physical Progress */}
              <Col lg={4} md={6}>
                <Card className="shadow-none border">
                  <CardBody>
                    <h5 className="card-title">Physical Progress</h5>
                    <Chart
                      options={physicalChart.options}
                      series={physicalChart.series}
                      type="radialBar"
                      height={300}
                    />
                    <div className="mt-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Actual</span>
                        <span>{projectMetrics.actualPhysical}%</span>
                      </div>
                      <Progress
                        value={Math.round(projectMetrics.physicalProgress)}
                        color="success"
                        style={{ height: "6px" }}
                      />
                      <div className="d-flex justify-content-between mt-1">
                        <span>Planned</span>
                        <span>{projectMetrics.plannedPhysical}%</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              {/* Time Progress */}
              <Col lg={4} md={6}>
                <Card className="shadow-none border">
                  <CardBody>
                    <h5 className="card-title">Time Progress</h5>
                    <Chart
                      options={timeProgressChart.options}
                      series={timeProgressChart.series}
                      type="radialBar"
                      height={300}
                    />
                    <div className="mt-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Elapsed</span>
                        <span>
                          {formatDuration(projectMetrics.daysElapsed)}
                        </span>
                      </div>
                      <Progress
                        value={
                          projectMetrics.durationDays > 0
                            ? Math.round(
                                (projectMetrics.daysElapsed /
                                  projectMetrics.durationDays) *
                                  100
                              )
                            : 0
                        }
                        color="info"
                        style={{ height: "6px" }}
                      />
                      <div className="d-flex justify-content-between mt-1">
                        <span>Remaining</span>
                        <span>
                          {formatDuration(projectMetrics.daysRemaining)}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              {/* Beneficiaries */}
              <Col lg={6}>
                <Card className="shadow-none border">
                  <CardBody>
                    <h5 className="card-title">Beneficiaries</h5>
                    <Chart
                      options={beneficiariesChart.options}
                      series={beneficiariesChart.series}
                      type="bar"
                      height={300}
                    />
                  </CardBody>
                </Card>
              </Col>

              {/* Budget Distribution */}
              <Col lg={6}>
                <Card className="shadow-none border">
                  <CardBody>
                    <h5 className="card-title">Budget Distribution</h5>
                    {projectMetrics.budgetTypes.length > 0 ? (
                      <Chart
                        options={budgetDistributionChart.options}
                        series={budgetDistributionChart.series}
                        type="donut"
                        height={300}
                      />
                    ) : (
                      <div className="text-center py-4">
                        <i className="mdi mdi-information-outline display-4 text-muted"></i>
                        <p className="mt-2 mb-0">No budget data available</p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Performance Tab */}
          <TabPane tabId="performance">
            <Row>
              <Col lg={6}>
                <Card className="shadow-none border">
                  <CardBody>
                    <h5 className="card-title">Physical Performance</h5>
                    <div className="text-center mb-4">
                      <h1>{Math.round(projectMetrics.physicalProgress)}%</h1>
                      <p className="text-muted">Completion Rate</p>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Actual Progress</span>
                        <span>{projectMetrics.actualPhysical}%</span>
                      </div>
                      <Progress
                        value={projectMetrics.actualPhysical}
                        color="success"
                        style={{ height: "8px" }}
                      />
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Planned Progress</span>
                        <span>{projectMetrics.plannedPhysical}%</span>
                      </div>
                      <Progress
                        value={projectMetrics.plannedPhysical}
                        color="primary"
                        style={{ height: "8px" }}
                      />
                    </div>

                    <div className="mt-4">
                      <h6 className="mb-2">Performance Gap</h6>
                      <Badge
                        color={
                          projectMetrics.actualPhysical >=
                          projectMetrics.plannedPhysical
                            ? "success"
                            : "danger"
                        }
                        className="fs-6"
                      >
                        {projectMetrics.actualPhysical >=
                        projectMetrics.plannedPhysical
                          ? "Ahead by "
                          : "Behind by "}
                        {Math.abs(
                          projectMetrics.actualPhysical -
                            projectMetrics.plannedPhysical
                        )}
                        %
                      </Badge>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="shadow-none border">
                  <CardBody>
                    <h5 className="card-title">Financial Performance</h5>
                    <div className="text-center mb-4">
                      <h1>{Math.round(projectMetrics.financialProgress)}%</h1>
                      <p className="text-muted">Budget Utilization Rate</p>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Actual Expenditure</span>
                        <span>
                          {formatCurrency(projectMetrics.actualFinancial)}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(100, projectMetrics.financialProgress)}
                        color={
                          projectMetrics.financialProgress > 100
                            ? "danger"
                            : "primary"
                        }
                        style={{ height: "8px" }}
                      />
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Planned Expenditure</span>
                        <span>
                          {formatCurrency(projectMetrics.plannedFinancial)}
                        </span>
                      </div>
                      <Progress
                        value={100}
                        color="light"
                        style={{ height: "8px" }}
                      />
                    </div>

                    <div className="mt-4">
                      <h6 className="mb-2">Financial Status</h6>
                      <Badge
                        color={
                          projectMetrics.actualFinancial >
                          projectMetrics.plannedFinancial
                            ? "danger"
                            : projectMetrics.actualFinancial ===
                              projectMetrics.plannedFinancial
                            ? "success"
                            : "warning"
                        }
                        className="fs-6"
                      >
                        {projectMetrics.actualFinancial >
                        projectMetrics.plannedFinancial
                          ? "Over Budget by "
                          : projectMetrics.actualFinancial ===
                            projectMetrics.plannedFinancial
                          ? "On Budget"
                          : "Under Budget by "}
                        {projectMetrics.actualFinancial !==
                          projectMetrics.plannedFinancial &&
                          formatCurrency(
                            Math.abs(
                              projectMetrics.actualFinancial -
                                projectMetrics.plannedFinancial
                            )
                          )}
                      </Badge>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={12}>
                <Card className="shadow-none border">
                  <CardBody>
                    <h5 className="card-title">Time Performance</h5>
                    <Row>
                      <Col md={4}>
                        <div className="text-center p-3">
                          <h3>{formatDuration(projectMetrics.daysElapsed)}</h3>
                          <p className="text-muted mb-0">Days Elapsed</p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center p-3">
                          <h3>
                            {formatDuration(projectMetrics.daysRemaining)}
                          </h3>
                          <p className="text-muted mb-0">Days Remaining</p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="text-center p-3">
                          <h3>{formatDuration(projectMetrics.durationDays)}</h3>
                          <p className="text-muted mb-0">Total Duration</p>
                        </div>
                      </Col>
                    </Row>

                    <div className="mt-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>Project Timeline</span>
                        <span>
                          {Math.round(
                            (projectMetrics.daysElapsed /
                              projectMetrics.durationDays) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <Progress multi style={{ height: "10px" }}>
                        <Progress
                          bar
                          value={
                            projectMetrics.durationDays > 0
                              ? (projectMetrics.daysElapsed /
                                  projectMetrics.durationDays) *
                                100
                              : 0
                          }
                          color="info"
                        />
                        <Progress
                          bar
                          value={
                            projectMetrics.durationDays > 0
                              ? (projectMetrics.daysRemaining /
                                  projectMetrics.durationDays) *
                                100
                              : 0
                          }
                          color="light"
                        />
                      </Progress>
                      <div className="d-flex justify-content-between mt-1">
                        <small>
                          {project?.prj_start_date_plan_gc ||
                            "Start date not set"}
                        </small>
                        <small>
                          {project?.prj_end_date_plan_gc || "End date not set"}
                        </small>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Budget Tab */}
          <TabPane tabId="budget">
            <Row>
              <Col lg={6}>
                <Card className="shadow-none border">
                  <CardBody>
                    <h5 className="card-title">Budget Overview</h5>
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <tbody>
                          <tr>
                            <th>Total Estimated Budget</th>
                            <td className="text-end">
                              {formatCurrency(projectMetrics.totalBudget)}
                            </td>
                          </tr>
                          <tr
                            className={
                              projectMetrics.releasedBudget >
                              projectMetrics.totalBudget
                                ? "table-warning"
                                : "fw-bold"
                            }
                          >
                            <th>Total Released Budget</th>
                            <td className="text-end">
                              {formatCurrency(projectMetrics.releasedBudget)}
                              {projectMetrics.totalBudget > 0 && (
                                <small className="text-muted ms-2">
                                  (
                                  {(
                                    (projectMetrics.releasedBudget /
                                      projectMetrics.totalBudget) *
                                    100
                                  ).toFixed(2)}
                                  %)
                                </small>
                              )}
                              {projectMetrics.releasedBudget >
                                projectMetrics.totalBudget && (
                                <span
                                  className="badge bg-warning ms-2"
                                  title="Released budget exceeds total estimate"
                                >
                                  <i className="fas fa-exclamation-triangle"></i>
                                </span>
                              )}
                            </td>
                          </tr>

                          <tr>
                            <th>Actual Expenditure</th>
                            <td className="text-end">
                              {formatCurrency(projectMetrics.actualFinancial)}
                              {projectMetrics.releasedBudget > 0 && (
                                <small className="text-muted ms-2">
                                  (
                                  {(
                                    (projectMetrics.actualFinancial /
                                      projectMetrics.releasedBudget) *
                                    100
                                  ).toFixed(2)}
                                  % of released)
                                </small>
                              )}
                              {/* Warning if spending exceeds released */}
                              {projectMetrics.actualFinancial >
                                projectMetrics.releasedBudget && (
                                <span
                                  className="badge bg-danger ms-2"
                                  title="Expenditure exceeds released budget"
                                >
                                  <i className="fas fa-exclamation-circle"></i>
                                </span>
                              )}
                            </td>
                          </tr>

                          <tr
                            className={
                              projectMetrics.releasedBudget -
                                projectMetrics.actualFinancial <
                              0
                                ? "table-warning fw-bold"
                                : "fw-bold"
                            }
                          >
                            <th>Remaining Budget From Released</th>
                            <td className="text-end">
                              {formatCurrency(
                                projectMetrics.releasedBudget -
                                  projectMetrics.actualFinancial
                              )}
                              {projectMetrics.releasedBudget > 0 && (
                                <small className="text-muted ms-2">
                                  (
                                  {(
                                    ((projectMetrics.releasedBudget -
                                      projectMetrics.actualFinancial) /
                                      projectMetrics.releasedBudget) *
                                    100
                                  ).toFixed(2)}
                                  % remaining)
                                </small>
                              )}
                            </td>
                          </tr>

                          <tr
                            className={
                              projectMetrics.totalBudget -
                                projectMetrics.releasedBudget <
                              0
                                ? "table-warning fw-bold"
                                : "fw-bold"
                            }
                          >
                            <th>Unreleased Portion of Total Budget</th>
                            <td className="text-end">
                              {formatCurrency(
                                projectMetrics.totalBudget -
                                  projectMetrics.releasedBudget
                              )}
                              {projectMetrics.totalBudget > 0 && (
                                <small className="text-muted ms-2">
                                  (
                                  {(
                                    ((projectMetrics.totalBudget -
                                      projectMetrics.releasedBudget) /
                                      projectMetrics.totalBudget) *
                                    100
                                  ).toFixed(2)}
                                  % of total)
                                </small>
                              )}
                              {projectMetrics.totalBudget -
                                projectMetrics.releasedBudget <
                                0 && (
                                <span
                                  className="badge bg-warning ms-2"
                                  title="Released amount exceeds total budget"
                                >
                                  <i className="fas fa-exclamation-triangle"></i>
                                </span>
                              )}
                            </td>
                          </tr>

                          <tr
                            className={
                              projectMetrics.totalBudget -
                                projectMetrics.actualFinancial <
                              0
                                ? "table-danger fw-bold"
                                : "fw-bold"
                            }
                          >
                            <th>
                              Remaining Budget From Total Estimated (Not Used)
                            </th>
                            <td className="text-end">
                              {formatCurrency(
                                projectMetrics.totalBudget -
                                  projectMetrics.actualFinancial
                              )}
                              {projectMetrics.totalBudget > 0 && (
                                <small className="text-muted ms-2">
                                  (
                                  {(
                                    ((projectMetrics.totalBudget -
                                      projectMetrics.actualFinancial) /
                                      projectMetrics.totalBudget) *
                                    100
                                  ).toFixed(2)}
                                  % remaining)
                                </small>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="shadow-none border">
                  <CardBody>
                    <h5 className="card-title">Budget Utilization</h5>
                    {projectMetrics.plannedFinancial ||
                    projectMetrics.actualFinancial > 0 ? (
                      <Chart
                        options={financialChart.options}
                        series={financialChart.series}
                        type="radialBar"
                        height={300}
                      />
                    ) : (
                      <div className="text-center py-4">
                        <i className="mdi mdi-chart-line display-4 text-muted"></i>
                        <p className="mt-2 mb-0">
                          No budget data to display utilization
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Col>

              <Col lg={12}>
                <Card className="shadow-none border">
                  <CardBody>
                    <h5 className="card-title">Budget Breakdown</h5>
                    {projectMetrics.budgetTypes.length > 0 ? (
                      <>
                        <Chart
                          options={budgetDistributionChart.options}
                          series={budgetDistributionChart.series}
                          type="donut"
                          height={350}
                        />
                        <div className="table-responsive mt-3">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Budget Type</th>
                                <th className="text-end">Amount</th>
                                <th className="text-end">Percentage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {projectMetrics.budgetTypes.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.type}</td>
                                  <td className="text-end">
                                    {formatCurrency(item.amount)}
                                  </td>
                                  <td className="text-end">
                                    {projectMetrics.releasedBudget > 0
                                      ? (
                                          (item.amount /
                                            projectMetrics.releasedBudget) *
                                          100
                                        ).toFixed(2)
                                      : 0}
                                    %
                                  </td>
                                </tr>
                              ))}
                              <tr className="fw-bold">
                                <td>Total Released</td>
                                <td className="text-end">
                                  {formatCurrency(
                                    projectMetrics.releasedBudget
                                  )}
                                </td>
                                <td className="text-end">100%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-5">
                        <i className="mdi mdi-cash-remove display-4 text-muted"></i>
                        <h5 className="mt-3">
                          No Budget Information Available
                        </h5>
                        <p className="text-muted">
                          Budget breakdown data has not been provided for this
                          project
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Details Tab */}
          <TabPane tabId="details">
            <Row>
              <Col lg={6}>
                <Card className="shadow-none border">
                  <CardBody>
                    <h5 className="card-title">Project Information</h5>
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <tbody>
                          <tr>
                            <th width="40%">Project Name</th>
                            <td>{project?.prj_name || "-"}</td>
                          </tr>
                          <tr>
                            <th>Project Code</th>
                            <td>{project?.prj_code || "-"}</td>
                          </tr>
                          <tr>
                            <th>Sector</th>
                            <td>{project?.sector_name || "-"}</td>
                          </tr>
                          <tr>
                            <th>Category</th>
                            <td>{project?.project_category || "-"}</td>
                          </tr>
                          <tr>
                            <th>Status</th>
                            <td>
                              <Badge color={project?.color_code || "light"}>
                                {project?.status_name || "-"}
                              </Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>

                <Card className="shadow-none border mt-4">
                  <CardBody>
                    <h5 className="card-title">Location Information</h5>
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <tbody>
                          <tr>
                            <th width="40%">Zone (Owner)</th>
                            <td>{project?.zone_owner || "-"}</td>
                          </tr>
                          <tr>
                            <th>Woreda (Owner)</th>
                            <td>{project?.woreda_owner || "-"}</td>
                          </tr>
                          <tr>
                            <th>Zone (Location)</th>
                            <td>{project?.zone_location || "-"}</td>
                          </tr>
                          <tr>
                            <th>Woreda (Location)</th>
                            <td>{project?.woreda_location || "-"}</td>
                          </tr>
                          <tr>
                            <th>Location Description</th>
                            <td>{project?.prj_location_description || "-"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="shadow-none border">
                  <CardBody>
                    <h5 className="card-title">Timeline</h5>
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <tbody>
                          <tr>
                            <th width="40%">Planned Start Date</th>
                            <td>{project?.prj_start_date_plan_gc || "-"}</td>
                          </tr>
                          <tr>
                            <th>Actual Start Date</th>
                            <td>{project?.prj_start_date_gc || "-"}</td>
                          </tr>
                          <tr>
                            <th>Planned End Date</th>
                            <td>{project?.prj_end_date_plan_gc || "-"}</td>
                          </tr>
                          <tr>
                            <th>Duration</th>
                            <td>
                              {projectMetrics.durationDays > 0
                                ? `${projectMetrics.durationDays} days`
                                : "-"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>

                <Card className="shadow-none border mt-4">
                  <CardBody>
                    <h5 className="card-title">Beneficiaries</h5>
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <tbody>
                          <tr>
                            <th width="40%">Urban Beneficiaries</th>
                            <td>
                              {formatNumber(projectMetrics.urbanBeneficiaries)}
                            </td>
                          </tr>
                          <tr>
                            <th>Rural Beneficiaries</th>
                            <td>
                              {formatNumber(projectMetrics.ruralBeneficiaries)}
                            </td>
                          </tr>
                          <tr>
                            <th>Total Beneficiaries</th>
                            <td>
                              {formatNumber(projectMetrics.totalBeneficiaries)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>

                <Card className="shadow-none border mt-4">
                  <CardBody>
                    <h5 className="card-title">Additional Information</h5>
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <tbody>
                          <tr>
                            <th width="40%">Expected Outcome</th>
                            <td>{project?.prj_outcome || "-"}</td>
                          </tr>
                          <tr>
                            <th>Remarks</th>
                            <td>{project?.prj_remark || "-"}</td>
                          </tr>
                          <tr>
                            <th>Created On</th>
                            <td>{project?.prj_create_time || "-"}</td>
                          </tr>
                          <tr>
                            <th>Last Updated</th>
                            <td>{project?.prj_update_time || "-"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </CardBody>
    </Card>
  );
};

export default ProjectSummary;
