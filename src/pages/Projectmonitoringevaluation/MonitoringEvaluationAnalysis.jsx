import React, { useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Badge,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Progress,
} from "reactstrap";
import Chart from "react-apexcharts";

const MonitoringEvaluationAnalysis = ({
  selectedData,
  allData = [],
  evaluationTypes = [],
  visitTypes = [],
  periodTypes = [],
  onBackToOverview,
}) => {
  const [activeTab, setActiveTab] = useState("progress");

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
    return `ETB ${formatNumber(amount)}`;
  };

  // Process data for display
  const processedData = selectedData
    ? {
        ...selectedData,
        evaluationType:
          evaluationTypes.find(
            (et) => et.value === selectedData.mne_transaction_type_id
          )?.label || "Unknown",
        visitType:
          visitTypes.find((vt) => vt.value === selectedData.mne_visit_type)
            ?.label || "Unknown",
        periodType:
          periodTypes.find((pt) => pt.met_id === selectedData.mne_type_id)
            ?.met_name_en || "Unknown",
        durationDays: getDurationDays(
          selectedData.mne_start_date,
          selectedData.mne_end_date
        ),
        formattedFinancial: formatCurrency(selectedData.mne_financial || 0),
        formattedFinancialZone: formatCurrency(
          selectedData.mne_financial_zone || 0
        ),
        formattedFinancialRegion: formatCurrency(
          selectedData.mne_financial_region || 0
        ),
        // Fixed total financial calculation
        totalFinancial:
          (selectedData.mne_financial || 0) +
          (selectedData.mne_financial_zone || 0) +
          (selectedData.mne_financial_region || 0),
        formattedTotalFinancial: formatCurrency(
          (selectedData.mne_financial || 0) +
            (selectedData.mne_financial_zone || 0) +
            (selectedData.mne_financial_region || 0)
        ),
        physicalPercentage: selectedData.mne_physical || 0,
        physicalZonePercentage: selectedData.mne_physical_zone || 0,
        physicalRegionPercentage: selectedData.mne_physical_region || 0,
        // Fixed average physical calculation - only average levels that have values
        averagePhysical: (() => {
          const levels = [
            selectedData.mne_physical,
            selectedData.mne_physical_zone,
            selectedData.mne_physical_region,
          ].filter((val) => val !== undefined && val !== null);
          return levels.length > 0
            ? (
                levels.reduce((sum, val) => sum + val, 0) / levels.length
              ).toFixed(2)
            : 0;
        })(),
      }
    : null;

  const isOverallView = !selectedData;

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
      0
    ),

    totalFinancialWoreda: allData.reduce(
      (sum, item) => sum + (item.mne_financial || 0),
      0
    ),
    totalFinancialZone: allData.reduce(
      (sum, item) => sum + (item.mne_financial_zone || 0),
      0
    ),
    totalFinancialRegion: allData.reduce(
      (sum, item) => sum + (item.mne_financial_region || 0),
      0
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
        (item) => item.mne_transaction_type_id === type.value
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
        (item) => item.mne_type_id === type.met_id
      );
      const count = filteredData.length;

      // Calculate averages properly for each level
      const avgPhysical =
        count > 0
          ? filteredData.reduce(
              (sum, item) => sum + (item.mne_physical || 0),
              0
            ) / count
          : 0;

      const avgPhysicalZone =
        count > 0
          ? filteredData.reduce(
              (sum, item) => sum + (item.mne_physical_zone || 0),
              0
            ) / count
          : 0;

      const avgPhysicalRegion =
        count > 0
          ? filteredData.reduce(
              (sum, item) => sum + (item.mne_physical_region || 0),
              0
            ) / count
          : 0;

      const avgFinancial =
        count > 0
          ? filteredData.reduce(
              (sum, item) => sum + (item.mne_financial || 0),
              0
            ) / count
          : 0;

      const avgFinancialZone =
        count > 0
          ? filteredData.reduce(
              (sum, item) => sum + (item.mne_financial_zone || 0),
              0
            ) / count
          : 0;

      const avgFinancialRegion =
        count > 0
          ? filteredData.reduce(
              (sum, item) => sum + (item.mne_financial_region || 0),
              0
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
        categories: ["Region Level", "Zone Level", "Woreda Level"],
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
            text: "Financial (ETB)",
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
            text: "Physical (%)",
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
            formatter: (val) => `ETB ${formatNumber(val)}`,
            title: {
              formatter: () => "Financial",
            },
          },
          {
            formatter: (val) => `${val}%`,
            title: {
              formatter: () => "Physical",
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
        name: "Financial (ETB)",
        data: [
          processedData?.mne_financial_region || 0,
          processedData?.mne_financial_zone || 0,
          processedData?.mne_financial || 0,
        ],
      },
      {
        name: "Physical (%)",
        data: [
          processedData?.mne_physical_region || 0,
          processedData?.mne_physical_zone || 0,
          processedData?.mne_physical || 0,
        ],
      },
    ],
  };

  const progressRadialChart = (value, color, title, isCurrency = false) => ({
    options: {
      chart: {
        type: "radialBar",
        height: 350,
        fontFamily: "inherit",
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: {
            margin: 0,
            size: "65%",
            background: "transparent",
          },
          track: {
            background: "#f1f1f1",
            strokeWidth: "97%",
            margin: 5,
          },
          dataLabels: {
            name: {
              fontSize: "16px",
              color: "#495057",
              offsetY: 120,
              fontFamily: "inherit",
            },
            value: {
              offsetY: 76,
              fontSize: "28px",
              fontWeight: 600,
              color: color,
              fontFamily: "inherit",
              formatter: (val) =>
                isCurrency ? `ETB ${formatNumber(val)}` : `${val}%`,
            },
          },
        },
      },
      colors: [color],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 0.8,
          stops: [0, 50, 65, 91],
          colorStops: [
            {
              offset: 0,
              color: color,
              opacity: 1,
            },
            {
              offset: 100,
              color: color,
              opacity: 0.7,
            },
          ],
        },
      },
      stroke: {
        lineCap: "round",
      },
    },
    series: [value],
  });

  const evaluationTypeChart = {
    options: {
      chart: {
        type: "donut",
        height: 350,
        fontFamily: "inherit",
      },
      labels: overallStats.evaluationTypes.map((type) => type.label),
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
                label: "Total Evaluations",
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
      labels: overallStats.visitTypes.map((type) => type.label),
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
                label: "Total Visits",
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
          return `${overallStats.visitTypes[seriesIndex].label}\n${val.toFixed(
            2
          )}%)`;
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
        height: 350,
        fontFamily: "inherit",
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: "13px",
              fontFamily: "inherit",
              offsetY: 10,
            },
            value: {
              show: true,
              fontSize: "20px",
              fontFamily: "inherit",
              fontWeight: 600,
              formatter: function (val) {
                return val;
              },
              offsetY: -20,
            },
            total: {
              show: true,
              label: "Total Projects",
              color: colors.dark,
              fontSize: "14px",
              fontFamily: "inherit",
              formatter: function (w) {
                return overallStats.totalProjects;
              },
            },
          },
          track: {
            background: "#f1f1f1",
            strokeWidth: "97%",
          },
        },
      },
      colors: [
        colors.primary,
        colors.success,
        colors.warning,
        colors.info,
        colors.danger,
      ],
      labels: overallStats.periodTypes.map((type) => type.met_name_en),
      legend: {
        position: "right",
        offsetY: 0,
        height: 300,
        fontFamily: "inherit",
        markers: {
          radius: 3,
        },
        itemMargin: {
          vertical: 10,
        },
        formatter: function (seriesName, opts) {
          const type = overallStats.periodTypes[opts.seriesIndex];
          return [
            seriesName,
            `Projects: ${type.count}`,
            `Avg Physical: ${Math.round(type.avgPhysical)}%`,
            `Avg Financial: ETB ${formatNumber(Math.round(type.avgFinancial))}`,
          ].join("\n");
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 500,
            },
            legend: {
              position: "bottom",
              height: "auto",
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
            <Button
              color="light"
              onClick={onBackToOverview}
              className="d-flex align-items-center"
              style={{ fontFamily: "inherit" }}
            >
              <i className="mdi mdi-arrow-left me-2"></i> Back to Overview
            </Button>

            <div>
              <Badge
                color="info"
                className="me-2"
                pill
                style={{ fontSize: "0.9rem", padding: "0.4em 0.8em" }}
              >
                {processedData.evaluationType}
              </Badge>
              <Badge
                color="warning"
                className="me-2"
                pill
                style={{ fontSize: "0.9rem", padding: "0.4em 0.8em" }}
              >
                {processedData.visitType}
              </Badge>
              <Badge
                color="success"
                pill
                style={{ fontSize: "0.9rem", padding: "0.4em 0.8em" }}
              >
                {processedData.periodType}
              </Badge>
            </div>
          </div>
        )}

        <h4 className="mb-4" style={{ fontFamily: "inherit", fontWeight: 600 }}>
          {isOverallView ? (
            <>
              Overall Monitoring & Evaluation Analysis{" "}
              <Badge color="light" className="text-primary">
                {allData.length} Projects
              </Badge>
              <div>
                <Badge color="light" className="text-primary me-2">
                  <i className="mdi mdi-calendar-range me-1"></i>
                  {new Date(
                    Math.min(
                      ...allData.map((item) =>
                        new Date(item.mne_start_date).getTime()
                      )
                    )
                  ).toLocaleDateString()}{" "}
                  -{" "}
                  {new Date(
                    Math.max(
                      ...allData.map((item) =>
                        new Date(item.mne_end_date).getTime()
                      )
                    )
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
              <i className="mdi mdi-chart-bar me-1"></i> Progress Metrics
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={activeTab === "details"}
              onClick={() => setActiveTab("details")}
              style={{ fontFamily: "inherit" }}
            >
              <i className="mdi mdi-information-outline me-1"></i> Project
              Details
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
                Evaluation Insights
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
                        <h5 className="mb-3">Total Projects</h5>
                        <h1 className="mb-0">{overallStats.totalProjects}</h1>
                        <div className="mt-2">
                          <Badge color="light" pill className="text-primary">
                            <i className="mdi mdi-database me-1"></i> All
                            Records
                          </Badge>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card className="shadow-none border-0 bg-gradient-success ">
                      <CardBody className="text-center">
                        <h5 className=" mb-3">Total Financial</h5>
                        <h1 className="mb-0">
                          {formatCurrency(overallStats.totalFinancial)}
                        </h1>
                        <div className="mt-2">
                          <Badge color="light" pill className="text-success">
                            <i className="mdi mdi-cash-multiple me-1"></i> ETB
                          </Badge>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card className="shadow-none border-0 bg-gradient-info ">
                      <CardBody className="text-center">
                        <h5 className="mb-3">Avg Physical Progress</h5>
                        <h1 className="mb-0">
                          {Math.round(overallStats.avgPhysical)}%
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
                        Total Financial Region
                      </h6>
                      <h4 className="mb-0 text-primary">
                        {formatCurrency(overallStats.totalFinancialRegion)}
                      </h4>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="p-2 bg-white rounded border text-center">
                      <h6 className="mb-1 text-muted">Total Financial Zone</h6>
                      <h4 className="mb-0 text-success">
                        {formatCurrency(overallStats.totalFinancialZone)}
                      </h4>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="p-2 bg-white rounded border text-center">
                      <h6 className="mb-1 text-muted">
                        Total Financial Woreda
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
                          Evaluation Type Distribution
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
                          Visit Type Analysis
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
                    <Card className="shadow-none border">
                      <CardBody>
                        <h5 className="card-title d-flex align-items-center">
                          <i className="mdi mdi-calendar-multiple-check me-2 text-info"></i>
                          Evaluation Periods Analysis
                        </h5>
                        <Chart
                          options={periodTypeChart.options}
                          series={periodTypeChart.series}
                          type="radialBar"
                          height={350}
                        />
                        <div className="mt-3 text-center text-muted small">
                          <i className="mdi mdi-information-outline me-1"></i>
                          Hover over the legend items to see detailed metrics
                          for each period type
                        </div>
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
                        Hierarchical Progress Comparison
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
                        Financial Progress
                      </h5>
                      <div className="text-center mb-3">
                        <h3>{processedData.formattedTotalFinancial}</h3>
                        <small className="text-muted">
                          Total Budget Utilization
                        </small>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Region Level</span>
                          <span>
                            {formatCurrency(processedData.mne_financial_region)}
                          </span>
                        </div>

                        <div className="d-flex justify-content-between mb-1 mt-3">
                          <span>Zone Level</span>
                          <span>
                            {formatCurrency(processedData.mne_financial_zone)}
                          </span>
                        </div>

                        <div className="d-flex justify-content-between mb-1 mt-3">
                          <span>Woreda Level</span>
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
                        Physical Progress
                      </h5>
                      <div className="text-center mb-3">
                        <h3>{processedData.averagePhysical}%</h3>
                        <small className="text-muted">
                          Average Completion Percentage (Region, Zone, Woreda)
                        </small>
                      </div>
                      <div className="mt-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Region Level</span>
                          <span>{processedData.mne_physical_region}%</span>
                        </div>
                        <Progress
                          color="success"
                          value={processedData.mne_physical_region}
                          style={{ height: "8px" }}
                        />

                        <div className="d-flex justify-content-between mb-1 mt-3">
                          <span>Zone Level</span>
                          <span>{processedData.mne_physical_zone}%</span>
                        </div>
                        <Progress
                          color="success"
                          value={processedData.mne_physical_zone}
                          style={{ height: "8px" }}
                        />

                        <div className="d-flex justify-content-between mb-1 mt-3">
                          <span>Woreda Level</span>
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
                        Projects Summary
                      </h5>
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">Total Projects</th>
                              <td className="text-end">
                                {overallStats.totalProjects}
                              </td>
                            </tr>
                            <tr>
                              <th>Average Duration</th>
                              <td className="text-end">
                                {Math.round(
                                  allData.reduce(
                                    (sum, item) =>
                                      sum +
                                      getDurationDays(
                                        item.mne_start_date,
                                        item.mne_end_date
                                      ),
                                    0
                                  ) / allData.length
                                )}{" "}
                                days
                              </td>
                            </tr>
                            <tr>
                              <th>Monitoring Visits</th>
                              <td className="text-end">
                                {
                                  overallStats.evaluationTypes.find(
                                    (et) => et.label === "monitoring"
                                  )?.count
                                }{" "}
                                (
                                {Math.round(
                                  overallStats.evaluationTypes.find(
                                    (et) => et.label === "monitoring"
                                  )?.percentage
                                )}
                                %)
                              </td>
                            </tr>
                            <tr>
                              <th>Evaluation Visits</th>
                              <td className="text-end">
                                {
                                  overallStats.evaluationTypes.find(
                                    (et) => et.label === "evaluation"
                                  )?.count
                                }{" "}
                                (
                                {Math.round(
                                  overallStats.evaluationTypes.find(
                                    (et) => et.label === "evaluation"
                                  )?.percentage
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
                        Physical Progress Summary
                      </h5>
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">Average Progress</th>
                              <td className="text-end">
                                {Math.round(overallStats.avgPhysical)}%
                              </td>
                            </tr>
                            {overallStats.periodTypes.map((period) => (
                              <tr key={period.met_id}>
                                <th>Avg {period.met_name_en}</th>
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
                        Financial Summary
                      </h5>
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">Total Budget</th>
                              <td className="text-end">
                                {formatCurrency(overallStats.totalFinancial)}
                              </td>
                            </tr>
                            {overallStats.periodTypes.map((period) => (
                              <tr key={period.met_id}>
                                <th>Avg {period.met_name_en}</th>
                                <td className="text-end">
                                  {formatCurrency(
                                    Math.round(period.totalAvgFinancial)
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
                        Project Information
                      </h5>
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">Project Name</th>
                              <td>{processedData?.prj_name || "-"}</td>
                            </tr>
                            <tr>
                              <th>Project Code</th>
                              <td>{processedData?.prj_code || "-"}</td>
                            </tr>
                            <tr>
                              <th>Duration</th>
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
                              <th>Team Members</th>
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
                        Financial Metrics
                      </h5>
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">Region Level</th>
                              <td className="text-end">
                                {processedData?.formattedFinancialRegion || "-"}
                              </td>
                            </tr>
                            <tr>
                              <th>Zone Level</th>
                              <td className="text-end">
                                {processedData?.formattedFinancialZone || "-"}
                              </td>
                            </tr>
                            <tr>
                              <th>Woreda Level</th>
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
                        Physical Metrics
                      </h5>
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <tbody>
                            <tr>
                              <th width="40%">Region Level</th>
                              <td className="text-end">
                                {processedData?.mne_physical_region || "-"}%
                              </td>
                            </tr>
                            <tr>
                              <th>Zone Level</th>
                              <td className="text-end">
                                {processedData?.mne_physical_zone || "-"}%
                              </td>
                            </tr>
                            <tr>
                              <th>Woreda Level</th>
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
                        Strengths
                      </h5>
                      <div className="p-3 bg-light rounded">
                        {processedData?.mne_strength ? (
                          <div className="d-flex">
                            <i className="mdi mdi-check-circle-outline text-success me-2 mt-1"></i>
                            <div>{processedData.mne_strength}</div>
                          </div>
                        ) : (
                          <div className="text-muted">
                            No strengths recorded
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="shadow-none border mb-4">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-alert-circle-outline me-2 text-warning"></i>
                        Challenges
                      </h5>
                      <div className="p-3 bg-light rounded">
                        {processedData?.mne_challenges ? (
                          <div className="d-flex">
                            <i className="mdi mdi-alert-outline text-warning me-2 mt-1"></i>
                            <div>{processedData.mne_challenges}</div>
                          </div>
                        ) : (
                          <div className="text-muted">
                            No challenges recorded
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
                        Weaknesses
                      </h5>
                      <div className="p-3 bg-light rounded">
                        {processedData?.mne_weakness ? (
                          <div className="d-flex">
                            <i className="mdi mdi-close-circle-outline text-danger me-2 mt-1"></i>
                            <div>{processedData.mne_weakness}</div>
                          </div>
                        ) : (
                          <div className="text-muted">
                            No weaknesses recorded
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="shadow-none border mb-4">
                    <CardBody>
                      <h5 className="card-title d-flex align-items-center">
                        <i className="mdi mdi-lightbulb-on-outline me-2 text-info"></i>
                        Recommendations
                      </h5>
                      <div className="p-3 bg-light rounded">
                        {processedData?.mne_recommendations ? (
                          <div className="d-flex">
                            <i className="mdi mdi-lightbulb-outline text-info me-2 mt-1"></i>
                            <div>{processedData.mne_recommendations}</div>
                          </div>
                        ) : (
                          <div className="text-muted">
                            No recommendations provided
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
                        Feedback
                      </h5>
                      <div className="p-3 bg-light rounded">
                        {processedData?.mne_feedback || "No feedback provided"}
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
