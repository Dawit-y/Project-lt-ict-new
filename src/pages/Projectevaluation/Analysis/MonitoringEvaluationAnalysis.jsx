import React, { useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Badge,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Progress,
} from "reactstrap";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

const MonitoringEvaluationAnalysis = ({
  monitoringEvaluationData,
  allData,
  isOverallView,
  evaluationTypes = [],
  visitTypes = [],
  periodTypes = [],
}) => {
  const [activeTab, setActiveTab] = useState("progress");
  const { t } = useTranslation();

  // Calculate duration in days between dates (YYYY/MM/DD format)
  const getDurationDays = (startDate, endDate) => {
    try {
      const parseDate = (dateStr) => {
        const [year, month, day] = dateStr.split("/").map(Number);
        return new Date(year, month - 1, day);
      };
      const diffTime = parseDate(endDate) - parseDate(startDate);
      return Math.round(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num || 0);
  };

  // Format currency in Ethiopian Birr
  const formatCurrency = (amount) => {
    return `${t("etb")} ${formatNumber(amount)}`;
  };

  // Process data for display
  const processedData = monitoringEvaluationData
    ? {
        ...monitoringEvaluationData,
        evaluationType:
          evaluationTypes.find(
            (et) =>
              et.value === monitoringEvaluationData.mne_transaction_type_id,
          )?.label || t("unknown"),
        visitType:
          visitTypes.find(
            (vt) => vt.value === monitoringEvaluationData.mne_visit_type,
          )?.label || t("unknown"),
        periodType:
          periodTypes.find(
            (pt) => pt.met_id === monitoringEvaluationData.mne_type_id,
          )?.met_name_en || t("unknown"),
        durationDays: getDurationDays(
          monitoringEvaluationData.mne_start_date,
          monitoringEvaluationData.mne_end_date,
        ),
        formattedFinancial: formatCurrency(
          monitoringEvaluationData.mne_financial || 0,
        ),
        formattedFinancialZone: formatCurrency(
          monitoringEvaluationData.mne_financial_zone || 0,
        ),
        formattedFinancialRegion: formatCurrency(
          monitoringEvaluationData.mne_financial_region || 0,
        ),
        // Fixed total financial calculation
        totalFinancial:
          (monitoringEvaluationData.mne_financial || 0) +
          (monitoringEvaluationData.mne_financial_zone || 0) +
          (monitoringEvaluationData.mne_financial_region || 0),
        formattedTotalFinancial: formatCurrency(
          (monitoringEvaluationData.mne_financial || 0) +
            (monitoringEvaluationData.mne_financial_zone || 0) +
            (monitoringEvaluationData.mne_financial_region || 0),
        ),
        physicalPercentage: monitoringEvaluationData.mne_physical || 0,
        physicalZonePercentage: monitoringEvaluationData.mne_physical_zone || 0,
        physicalRegionPercentage:
          monitoringEvaluationData.mne_physical_region || 0,
        // Fixed average physical calculation - only average levels that have values
        averagePhysical: (() => {
          const levels = [
            monitoringEvaluationData.mne_physical,
            monitoringEvaluationData.mne_physical_zone,
            monitoringEvaluationData.mne_physical_region,
          ].filter((val) => val !== undefined && val !== null);
          return levels.length > 0
            ? (
                levels.reduce((sum, val) => sum + val, 0) / levels.length
              ).toFixed(2)
            : 0;
        })(),
      }
    : null;

  // Prepare data for overall analysis
  const overallStats = {
    totalProjects: allData.length,
    // Fixed total financial calculation
    totalFinancial: allData.reduce(
      (sum, item) =>
        sum +
        (item.mne_financial || 0) +
        (item.mne_financial_zone || 0) +
        (item.mne_financial_region || 0),
      0,
    ),

    totalFinancialWoreda: allData.reduce(
      (sum, item) => sum + (item.mne_financial || 0),
      0,
    ),
    totalFinancialZone: allData.reduce(
      (sum, item) => sum + (item.mne_financial_zone || 0),
      0,
    ),
    totalFinancialRegion: allData.reduce(
      (sum, item) => sum + (item.mne_financial_region || 0),
      0,
    ),

    // Fixed average physical progress calculation
    avgPhysical: (() => {
      const totalPhysical = allData.reduce((sum, item) => {
        const levels = [
          item.mne_physical,
          item.mne_physical_zone,
          item.mne_physical_region,
        ].filter((val) => val !== undefined && val !== null);
        return (
          sum +
          (levels.length > 0
            ? levels.reduce((levelSum, val) => levelSum + val, 0) /
              levels.length
            : 0)
        );
      }, 0);
      return allData.length > 0 ? totalPhysical / allData.length : 0;
    })(),

    evaluationTypes: evaluationTypes.map((type) => ({
      ...type,
      count: allData.filter(
        (item) => item.mne_transaction_type_id === type.value,
      ).length,
      percentage:
        (allData.filter((item) => item.mne_transaction_type_id === type.value)
          .length /
          (allData.length || 1)) *
        100,
    })),

    visitTypes: visitTypes.map((type) => ({
      ...type,
      count: allData.filter((item) => item.mne_visit_type === type.value)
        .length,
      percentage:
        (allData.filter((item) => item.mne_visit_type === type.value).length /
          (allData.length || 1)) *
        100,
    })),

    periodTypes: periodTypes.map((type) => {
      const filteredData = allData.filter(
        (item) => item.mne_type_id === type.met_id,
      );
      const count = filteredData.length;

      // Calculate averages properly for each level
      const avgPhysical =
        count > 0
          ? filteredData.reduce(
              (sum, item) => sum + (item.mne_physical || 0),
              0,
            ) / count
          : 0;

      const avgPhysicalZone =
        count > 0
          ? filteredData.reduce(
              (sum, item) => sum + (item.mne_physical_zone || 0),
              0,
            ) / count
          : 0;

      const avgPhysicalRegion =
        count > 0
          ? filteredData.reduce(
              (sum, item) => sum + (item.mne_physical_region || 0),
              0,
            ) / count
          : 0;

      const avgFinancial =
        count > 0
          ? filteredData.reduce(
              (sum, item) => sum + (item.mne_financial || 0),
              0,
            ) / count
          : 0;

      const avgFinancialZone =
        count > 0
          ? filteredData.reduce(
              (sum, item) => sum + (item.mne_financial_zone || 0),
              0,
            ) / count
          : 0;

      const avgFinancialRegion =
        count > 0
          ? filteredData.reduce(
              (sum, item) => sum + (item.mne_financial_region || 0),
              0,
            ) / count
          : 0;

      const totalAvgPhysical =
        (avgPhysical + avgPhysicalZone + avgPhysicalRegion) / 3;
      const totalAvgFinancial =
        avgFinancial + avgFinancialZone + avgFinancialRegion;

      return {
        ...type,
        count,
        percentage: count > 0 ? (count / allData.length) * 100 : 0,
        avgPhysical,
        avgPhysicalZone,
        avgPhysicalRegion,
        avgFinancial,
        avgFinancialZone,
        avgFinancialRegion,
        totalAvgPhysical,
        totalAvgFinancial,
      };
    }),
  };

  // Modern color palette
  const colors = {
    primary: "#3b5de7",
    success: "#45cb85",
    warning: "#eeb902",
    danger: "#ff5e5e",
    info: "#a162e8",
    dark: "#343a40",
  };

  // Chart configurations
  const hierarchyChart = {
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: { show: true },
        fontFamily: "inherit",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 8,
          distributed: false,
          endingShape: "rounded",
        },
      },
      colors: [colors.primary, colors.success],
      dataLabels: { enabled: false },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
        curve: "smooth",
      },
      xaxis: {
        categories: [
          `${t("region_level")}`,
          `${t("zone_level")}`,
          `${t("woreda_level")}`,
        ],
        labels: {
          style: {
            fontSize: "13px",
            fontFamily: "inherit",
            fontWeight: 500,
          },
        },
      },
      yaxis: [
        {
          title: {
            text: `${t("financial_(etb)")}`,
            style: {
              fontSize: "13px",
              color: colors.primary,
              fontFamily: "inherit",
            },
          },
          labels: {
            formatter: (val) => formatNumber(val),
            style: {
              colors: colors.primary,
            },
          },
        },
        {
          opposite: true,
          title: {
            text: `${t("physical_(%)")}`,
            style: {
              fontSize: "13px",
              color: colors.success,
              fontFamily: "inherit",
            },
          },
          min: 0,
          max: 100,
          labels: {
            formatter: (val) => `${val}%`,
            style: {
              colors: colors.success,
            },
          },
        },
      ],
      legend: {
        position: "top",
        fontSize: "14px",
        fontFamily: "inherit",
        markers: {
          radius: 12,
        },
      },
      tooltip: {
        y: [
          {
            formatter: (val) => `${t("etb")} ${formatNumber(val)}`,
            title: {
              formatter: () => {
                t("financial");
              },
            },
          },
          {
            formatter: (val) => `${val}%`,
            title: {
              formatter: () => {
                t("physical");
              },
            },
          },
        ],
        style: {
          fontFamily: "inherit",
        },
      },
      grid: {
        borderColor: "#f1f1f1",
        padding: {
          top: 0,
          right: 30,
          bottom: 0,
          left: 20,
        },
      },
    },
    series: [
      {
        name: `${t("financial_(etb)")}`,
        data: [
          processedData?.mne_financial_region || 0,
          processedData?.mne_financial_zone || 0,
          processedData?.mne_financial || 0,
        ],
      },
      {
        name: `${t("physical_(%)")}`,
        data: [
          processedData?.mne_physical_region || 0,
          processedData?.mne_physical_zone || 0,
          processedData?.mne_physical || 0,
        ],
      },
    ],
  };

  const evaluationTypeChart = {
    options: {
      chart: {
        type: "donut",
        height: 350,
        fontFamily: "inherit",
      },
      labels: overallStats.evaluationTypes.map((type) => t(type.label)),
      colors: [colors.primary, colors.info],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: "100%" },
            legend: { position: "bottom" },
          },
        },
      ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: "16px",
                fontFamily: "inherit",
              },
              value: {
                fontSize: "24px",
                fontWeight: 600,
                fontFamily: "inherit",
                formatter: (val) => `${val}`,
              },
              total: {
                show: true,
                label: `${t("total_evaluations")}`,
                color: colors.dark,
                fontFamily: "inherit",
                formatter: () => overallStats.totalProjects,
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "right",
        fontFamily: "inherit",
      },
      tooltip: {
        y: {
          formatter: (val) =>
            `${val} (${Math.round((val / overallStats.totalProjects) * 100)}%)`,
          title: {
            formatter: () => "",
          },
        },
      },
    },
    series: overallStats.evaluationTypes.map((type) => type.count),
  };

  const visitTypeChart = {
    options: {
      chart: {
        type: "pie",
        height: 350,
        fontFamily: "inherit",
      },
      labels: overallStats.visitTypes.map((type) => t(type.label)),
      colors: [colors.warning, colors.danger],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: "100%" },
            legend: { position: "bottom" },
          },
        },
      ],
      plotOptions: {
        pie: {
          customScale: 0.9,
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: `${t("total_visits")}`,
                color: colors.dark,
                fontFamily: "inherit",
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val, { seriesIndex }) => {
          return `${t(
            overallStats.visitTypes[seriesIndex].label,
          )}\n${val.toFixed(2)}%)`;
        },
        style: {
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 500,
        },
        dropShadow: {
          enabled: false,
        },
      },
      legend: {
        position: "right",
        fontFamily: "inherit",
      },
    },
    series: overallStats.visitTypes.map((type) => type.count),
  };

  const periodTypeChart = {
    options: {
      chart: {
        type: "radialBar",
        height: 320,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        foreColor: "#334155",

        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
        },
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: -90,
          endAngle: 90,
          hollow: {
            margin: 15,
            size: "40%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: "13px",
              fontWeight: 600,
              offsetY: 10,
            },
            value: {
              show: true,
              fontSize: "22px",
              fontWeight: 700,
              formatter: function (val) {
                return val;
              },
              offsetY: -20,
            },
            total: {
              show: true,
              label: `${t("total")}`,
              color: "#1E293B",
              fontSize: "13px",
              fontWeight: 600,
              formatter: function (w) {
                return overallStats.totalProjects.toLocaleString();
              },
            },
          },
          track: {
            background: "#F1F5F9",
            strokeWidth: "90%",
            margin: 10,
          },
        },
      },
      colors: [
        "#6366F1", // indigo-500
        "#10B981", // emerald-500
        "#F59E0B", // amber-500
        "#3B82F6", // blue-500
        "#EF4444", // red-500
      ],
      stroke: {
        lineCap: "round",
        width: 3,
      },
      labels: overallStats.periodTypes.map((type) => t(type.met_name_en)),
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 992,
          options: {
            chart: {
              height: 300,
            },
          },
        },
      ],
    },
    series: overallStats.periodTypes.map((type) => type.count),
  };

  return (
    <Card
      className="border-0 shadow-sm mb-4"
      style={{ fontFamily: "Segoe UI, Roboto, sans-serif" }}
    >
      <CardBody>
        {/* Header */}
        {!isOverallView && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <Badge
                color="info"
                className="me-2"
                pill
                style={{ fontSize: "0.9rem", padding: "0.4em 0.8em" }}
              >
                {t(processedData.evaluationType)}
              </Badge>
              <Badge
                color="warning"
                className="me-2"
                pill
                style={{ fontSize: "0.9rem", padding: "0.4em 0.8em" }}
              >
                {t(processedData.visitType)}
              </Badge>
              <Badge
                color="success"
                pill
                style={{ fontSize: "0.9rem", padding: "0.4em 0.8em" }}
              >
                {t(processedData.periodType)}
              </Badge>
            </div>
          </div>
        )}

        <h4 className="mb-4" style={{ fontFamily: "inherit", fontWeight: 600 }}>
          {isOverallView ? (
            <>
              {t("overall_monitoring_&_evaluation_analysis")}{" "}
              <Badge color="light" className="text-primary">
                {allData.length} {t("projects")}
              </Badge>
              <div>
                <Badge color="light" className="text-primary me-2">
                  <i className="mdi mdi-calendar-range me-1"></i>
                  {new Date(
                    Math.min(
                      ...allData.map((item) =>
                        new Date(item.mne_start_date).getTime(),
                      ),
                    ),
                  ).toLocaleDateString()}{" "}
                  -{" "}
                  {new Date(
                    Math.max(
                      ...allData.map((item) =>
                        new Date(item.mne_end_date).getTime(),
                      ),
                    ),
                  ).toLocaleDateString()}
                </Badge>
              </div>
            </>
          ) : (
            <>
              {processedData.prj_name}
              <small className="text-muted ms-2">
                ({processedData.prj_code})
              </small>
            </>
          )}
        </h4>

        {/* Tabs */}
        <Nav tabs className="nav-tabs-custom mb-3">
          <NavItem>
            <NavLink
              active={activeTab === "progress"}
              onClick={() => setActiveTab("progress")}
              style={{ fontFamily: "inherit" }}
            >
              <i className="mdi mdi-chart-bar me-1"></i> {t("progress_metrics")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={activeTab === "details"}
              onClick={() => setActiveTab("details")}
              style={{ fontFamily: "inherit" }}
            >
              <i className="mdi mdi-information-outline me-1"></i>{" "}
              {t("project_details")}
            </NavLink>
          </NavItem>
          {!isOverallView && (
            <NavItem>
              <NavLink
                active={activeTab === "qualitative"}
                onClick={() => setActiveTab("qualitative")}
                style={{ fontFamily: "inherit" }}
              >
                <i className="mdi mdi-text-box-check-outline me-1"></i>{" "}
                {t("evaluation_insights")}
              </NavLink>
            </NavItem>
          )}
        </Nav>

        <TabContent
          activeTab={activeTab}
          className="p-3 border border-top-0 rounded-bottom"
        >
          {/* Progress Tab */}
          <TabPane tabId="progress">
            {isOverallView ? (
              <>
                <Row className="mb-1">
                  <Col lg={4}>
                    <Card className="shadow-none border-0 bg-gradient-primary">
                      <CardBody className="text-center">
                        <h5 className="mb-3">{t("total_projects")}</h5>
                        <h1 className="mb-0">{overallStats.totalProjects}</h1>
                        <div className="mt-2">
                          <Badge color="light" pill className="text-primary">
                            <i className="mdi mdi-database me-1"></i>{" "}
                            {t("all_records")}
                          </Badge>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card className="shadow-none border-0 bg-gradient-success ">
                      <CardBody className="text-center">
                        <h5 className=" mb-3">{t("total_financial")}</h5>
                        <h1 className="mb-0">
                          {formatCurrency(overallStats.totalFinancial)}
                        </h1>
                        <div className="mt-2">
                          <Badge color="light" pill className="text-success">
                            <i className="mdi mdi-cash-multiple me-1"></i>{" "}
                            {t("etb")}
                          </Badge>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card className="shadow-none border-0 bg-gradient-info ">
                      <CardBody className="text-center">
                        <h5 className="mb-3">{t("avg_physical_progress")}</h5>
                        {/* <h1 className="mb-0">
                          {Math.round(overallStats.avgPhysical)}%
                        </h1> */}
                        <h1 className="mb-0">
                          {Math.min(100, Math.round(overallStats.avgPhysical))}%
                        </h1>

                        <div className="mt-3">
                          <Progress
                            value={Math.round(overallStats.avgPhysical)}
                            style={{ height: "6px" }}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                <Row className="g-2 mb-5">
                  <Col md={4}>
                    <div className="p-2 bg-white rounded border text-center">
                      <h6 className="mb-1 text-muted">
                        {t("total_financial_region")}
                      </h6>
                      <h4 className="mb-0 text-primary">
                        {formatCurrency(overallStats.totalFinancialRegion)}
                      </h4>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="p-2 bg-white rounded border text-center">
                      <h6 className="mb-1 text-muted">
                        {t("total_financial_zone")}
                      </h6>
                      <h4 className="mb-0 text-success">
                        {formatCurrency(overallStats.totalFinancialZone)}
                      </h4>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="p-2 bg-white rounded border text-center">
                      <h6 className="mb-1 text-muted">
                        {t("total_financial_woreda")}
                      </h6>
                      <h4 className="mb-0 text-info">
                        {formatCurrency(overallStats.totalFinancialWoreda)}
                      </h4>
                    </div>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col lg={6}>
                    <Card className="shadow-none border">
                      <CardBody>
                        <h5 className="card-title d-flex align-items-center">
                          <i className="mdi mdi-chart-pie me-2 text-primary"></i>
                          {t("evaluation_type_distribution")}
                        </h5>
                        <Chart
                          options={evaluationTypeChart.options}
                          series={evaluationTypeChart.series}
                          type="donut"
                          height={350}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={6}>
                    <Card className="shadow-none border">
                      <CardBody>
                        <h5 className="card-title d-flex align-items-center">
                          <i className="mdi mdi-chart-arc me-2 text-warning"></i>
                          {t("visit_type_analysis")}
                        </h5>
                        <Chart
                          options={visitTypeChart.options}
                          series={visitTypeChart.series}
                          type="pie"
                          height={350}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col lg={12}>
                    <Card className="border-0 shadow-sm">
                      <CardBody className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div>
                            <h5 className="card-title mb-1 d-flex align-items-center">
                              <i
                                className="mdi mdi-chart-arc me-2"
                                style={{ color: "#6366F1", fontSize: "1.5rem" }}
                              ></i>
                              <span style={{ fontWeight: 600 }}>
                                {t("project_evaluation_metrics")}
                              </span>
                            </h5>
                            <p className="text-muted mb-0">
                              {t("performance_analysis_by_evaluation_period")}
                            </p>
                          </div>
                          <Badge pill bg="light" className="fw-medium">
                            <i className="mdi mdi-calendar-range me-1"></i>
                            {t("period_analysis")}
                          </Badge>
                        </div>

                        <Row>
                          <Col lg={6} className="pe-lg-4">
                            <div className="chart-container position-relative">
                              <Chart
                                options={periodTypeChart.options}
                                series={periodTypeChart.series}
                                type="radialBar"
                                height={320}
                              />
                            </div>
                          </Col>

                          <Col lg={6} className="ps-lg-4 mt-4 mt-lg-0">
                            <div className="table-responsive">
                              <table className="table table-hover table-sm align-middle">
                                <thead className="bg-light">
                                  <tr>
                                    <th className="ps-3">{t("period_type")}</th>
                                    <th className="text-end">
                                      {t("projects")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {overallStats.periodTypes.map(
                                    (type, index) => (
                                      <tr key={index}>
                                        <td
                                          className="ps-3 fw-medium"
                                          style={{
                                            color:
                                              periodTypeChart.options.colors[
                                                index
                                              ],
                                          }}
                                        >
                                          <i className="mdi mdi-circle-small me-1"></i>
                                          {t(type.met_name_en)}
                                        </td>
                                        <td className="text-end">
                                          {type.count.toLocaleString()}
                                        </td>
                                      </tr>
                                    ),
                                  )}
                                  <tr className="bg-light fw-semibold">
                                    <td className="ps-3">
                                      {t("total_average")}
                                    </td>
                                    <td className="text-end">
                                      {overallStats.totalProjects.toLocaleString()}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-3">
                              <div className="d-flex align-items-center text-muted">
                                <i className="mdi mdi-information-outline me-2"></i>
                                <small>
                                  {t(
                                    "financial_values_represent_average_expenditure",
                                  )}
                                </small>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </>
            ) : (
              <Row>
                <Col lg={12} className="mb-4">
                  <Card className="shadow-none border">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-chart-bar me-2 text-primary"></i>
                        {t("hierarchical_progress_comparison")}
                      </h5>
                      <Chart
                        options={hierarchyChart.options}
                        series={hierarchyChart.series}
                        type="bar"
                        height={350}
                      />
                    </CardBody>
                  </Card>
                </Col>
                {/* In the progress tab for single project view */}
                <Col lg={6}>
                  <Card className="shadow-none border mb-4">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-cash-multiple me-2 text-primary"></i>
                        {t("financial_progress")}
                      </h5>
                      <div className="text-center mb-3">
                        <h3>{processedData.formattedTotalFinancial}</h3>
                        <small className="text-muted">
                          {t("total_budget_utilization")}
                        </small>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>{t("region_level")}</span>
                          <span>
                            {formatCurrency(processedData.mne_financial_region)}
                          </span>
                        </div>

                        <div className="d-flex justify-content-between mb-1 mt-3">
                          <span>{t("zone_level")}</span>
                          <span>
                            {formatCurrency(processedData.mne_financial_zone)}
                          </span>
                        </div>

                        <div className="d-flex justify-content-between mb-1 mt-3">
                          <span>{t("woreda_level")}</span>
                          <span>
                            {formatCurrency(processedData.mne_financial)}
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col lg={6}>
                  <Card className="shadow-none border mb-4">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-progress-check me-2 text-success"></i>
                        {t("physical_progress")}
                      </h5>
                      <div className="text-center mb-3">
                        <h3>{processedData.averagePhysical}%</h3>
                        <small className="text-muted">
                          {t("average_completion_percentage")}
                        </small>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>{t("region_level")}</span>
                          <span>{processedData.mne_physical_region}%</span>
                        </div>
                        <Progress
                          color="success"
                          value={processedData.mne_physical_region}
                          style={{ height: "8px" }}
                        />

                        <div className="d-flex justify-content-between mb-1 mt-3">
                          <span>{t("zone_level")}</span>
                          <span>{processedData.mne_physical_zone}%</span>
                        </div>
                        <Progress
                          color="success"
                          value={processedData.mne_physical_zone}
                          style={{ height: "8px" }}
                        />

                        <div className="d-flex justify-content-between mb-1 mt-3">
                          <span>{t("woreda_level")}</span>
                          <span>{processedData.mne_physical}%</span>
                        </div>
                        <Progress
                          color="success"
                          value={processedData.mne_physical}
                          style={{ height: "8px" }}
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}
          </TabPane>

          {/* Details Tab */}
          {isOverallView ? (
            <TabPane tabId="details">
              <Row>
                <Col lg={6}>
                  <Card className="shadow-none border mb-4">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-information-outline me-2 text-primary"></i>
                        {t("projects_summary")}
                      </h5>
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">{t("total_projects")}</th>
                              <td className="text-end">
                                {overallStats.totalProjects}
                              </td>
                            </tr>
                            <tr>
                              <th>{t("average_duration")}</th>
                              <td className="text-end">
                                {Math.round(
                                  allData.reduce(
                                    (sum, item) =>
                                      sum +
                                      getDurationDays(
                                        item.mne_start_date,
                                        item.mne_end_date,
                                      ),
                                    0,
                                  ) / allData.length,
                                )}{" "}
                                {t("days")}
                              </td>
                            </tr>
                            <tr>
                              <th>{t("monitoring_visits")}</th>
                              <td className="text-end">
                                {
                                  overallStats.evaluationTypes.find(
                                    (et) => et.label === "monitoring",
                                  )?.count
                                }{" "}
                                (
                                {Math.round(
                                  overallStats.evaluationTypes.find(
                                    (et) => et.label === "monitoring",
                                  )?.percentage,
                                )}
                                %)
                              </td>
                            </tr>
                            <tr>
                              <th>{t("evaluation_visits")}</th>
                              <td className="text-end">
                                {
                                  overallStats.evaluationTypes.find(
                                    (et) => et.label === "evaluation",
                                  )?.count
                                }{" "}
                                (
                                {Math.round(
                                  overallStats.evaluationTypes.find(
                                    (et) => et.label === "evaluation",
                                  )?.percentage,
                                )}
                                %)
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
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-progress-check me-2 text-primary"></i>
                        {t("physical_progress_summary")}
                      </h5>
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">{t("average_progress")}</th>
                              <td className="text-end">
                                {Math.round(overallStats.avgPhysical)}%
                              </td>
                            </tr>
                            {overallStats.periodTypes.map((period) => (
                              <tr key={period.met_id}>
                                <th>
                                  {t("avg")} {t(period.met_name_en)}
                                </th>
                                <td className="text-end">
                                  {Math.round(period.totalAvgPhysical)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={12}>
                  <Card className="shadow-none border mb-4">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-cash-multiple me-2 text-primary"></i>
                        {t("financial_summary")}
                      </h5>
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">{t("total_budget")}</th>
                              <td className="text-end">
                                {formatCurrency(overallStats.totalFinancial)}
                              </td>
                            </tr>
                            {overallStats.periodTypes.map((period) => (
                              <tr key={period.met_id}>
                                <th>
                                  {t("avg")} {t(period.met_name_en)}
                                </th>
                                <td className="text-end">
                                  {formatCurrency(
                                    Math.round(period.totalAvgFinancial),
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          ) : (
            <TabPane tabId="details">
              <Row>
                <Col lg={6}>
                  <Card className="shadow-none border mb-4">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-information-outline me-2 text-primary"></i>
                        {t("project_information")}
                      </h5>
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">{t("project_name")}</th>
                              <td>{processedData?.prj_name || "-"}</td>
                            </tr>
                            <tr>
                              <th>{t("project_code")}</th>
                              <td>{processedData?.prj_code || "-"}</td>
                            </tr>
                            <tr>
                              <th>{t("duration")}</th>
                              <td>
                                {processedData?.mne_start_date || "-"} to{" "}
                                {processedData?.mne_end_date || "-"}
                                {processedData?.durationDays && (
                                  <Badge color="light" className="ms-2">
                                    {processedData.durationDays} days
                                  </Badge>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <th>{t("team_members")}</th>
                              <td>
                                {processedData?.mne_team_members
                                  ? processedData.mne_team_members
                                      .split(",")
                                      .map((member, i) => (
                                        <Badge
                                          key={i}
                                          color="light"
                                          className="me-1 mb-1"
                                        >
                                          {member.trim()}
                                        </Badge>
                                      ))
                                  : "-"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={6}>
                  <Card className="shadow-none border mb-4">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-cash-multiple me-2 text-primary"></i>
                        {t("financial_metrics")}
                      </h5>
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">{t("zone_level")}</th>
                              <td className="text-end">
                                {processedData?.formattedFinancialRegion || "-"}
                              </td>
                            </tr>
                            <tr>
                              <th>{t("zone_level")}</th>
                              <td className="text-end">
                                {processedData?.formattedFinancialZone || "-"}
                              </td>
                            </tr>
                            <tr>
                              <th>{t("woreda_level")}</th>
                              <td className="text-end">
                                {processedData?.formattedFinancial || "-"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={12}>
                  <Card className="shadow-none border">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-progress-check me-2 text-primary"></i>
                        {t("physical_metrics")}
                      </h5>
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">{t("region_level")}</th>
                              <td className="text-end">
                                {processedData?.mne_physical_region || "-"}%
                              </td>
                            </tr>
                            <tr>
                              <th>{t("zone_level")}</th>
                              <td className="text-end">
                                {processedData?.mne_physical_zone || "-"}%
                              </td>
                            </tr>
                            <tr>
                              <th>{t("woreda_level")}</th>
                              <td className="text-end">
                                {processedData?.mne_physical || "-"}%
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          )}

          {/* Qualitative Tab */}
          {!isOverallView && (
            <TabPane tabId="qualitative">
              <Row>
                <Col lg={6}>
                  <Card className="shadow-none border mb-4">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-thumb-up-outline me-2 text-success"></i>
                        {t("strengths")}
                      </h5>
                      <div className="p-3 bg-light rounded">
                        {processedData?.mne_strength ? (
                          <div className="d-flex">
                            <i className="mdi mdi-check-circle-outline text-success me-2 mt-1"></i>
                            <div>{processedData.mne_strength}</div>
                          </div>
                        ) : (
                          <div className="text-muted">
                            {t("no_strengths_recorded")}
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="shadow-none border mb-4">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-alert-circle-outline me-2 text-warning"></i>
                        {t("challenges")}
                      </h5>
                      <div className="p-3 bg-light rounded">
                        {processedData?.mne_challenges ? (
                          <div className="d-flex">
                            <i className="mdi mdi-alert-outline text-warning me-2 mt-1"></i>
                            <div>{processedData.mne_challenges}</div>
                          </div>
                        ) : (
                          <div className="text-muted">
                            {t("no_challenges_recorded")}
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={6}>
                  <Card className="shadow-none border mb-4">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-thumb-down-outline me-2 text-danger"></i>
                        {t("weaknesses")}
                      </h5>
                      <div className="p-3 bg-light rounded">
                        {processedData?.mne_weakness ? (
                          <div className="d-flex">
                            <i className="mdi mdi-close-circle-outline text-danger me-2 mt-1"></i>
                            <div>{processedData.mne_weakness}</div>
                          </div>
                        ) : (
                          <div className="text-muted">
                            {t("no_weaknesses_recorded")}
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="shadow-none border mb-4">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-lightbulb-on-outline me-2 text-info"></i>
                        {t("recommendations")}
                      </h5>
                      <div className="p-3 bg-light rounded">
                        {processedData?.mne_recommendations ? (
                          <div className="d-flex">
                            <i className="mdi mdi-lightbulb-outline text-info me-2 mt-1"></i>
                            <div>{processedData.mne_recommendations}</div>
                          </div>
                        ) : (
                          <div className="text-muted">
                            {t("no_recommendations_provided")}
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={12}>
                  <Card className="shadow-none border">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-message-text-outline text-primary me-2"></i>
                        {t("feedback")}
                      </h5>
                      <div className="p-3 bg-light rounded">
                        {processedData?.mne_feedback ||
                          t("no_feedback_provided")}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          )}
        </TabContent>
      </CardBody>
    </Card>
  );
};

export default MonitoringEvaluationAnalysis;
