import React, { useState, useMemo, useCallback } from "react";
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
  Progress,
} from "reactstrap";
import classnames from "classnames";
import ReactApexChart from "react-apexcharts";
import { formatNumber, formatLargeNumber } from "../../../utils/commonMethods";
import { useTranslation } from "react-i18next";

const BudgetRequestAnalysis = ({
  budgetRequestData,
  allData,
  isOverallView,
  chartType,
  onChartTypeChange,
}) => {
  const [activeTab, setActiveTab] = useState("1");
  const [chartExportOpen, setChartExportOpen] = useState(false);

  const { t } = useTranslation();

  // Memoized utility functions
  const memoizedFormatNumber = useCallback(formatNumber, []);
  const memoizedFormatLargeNumber = useCallback(formatLargeNumber, []);

  // Toggle functions
  const toggleChartExport = useCallback(
    () => setChartExportOpen((prev) => !prev),
    [],
  );
  const toggleTab = useCallback(
    (tab) => {
      if (activeTab !== tab) setActiveTab(tab);
    },
    [activeTab],
  );

  // Helper functions
  const calculatePercentage = useCallback((value, total) => {
    if (!total || total === 0) return 0;
    return ((value - total) / total) * 100;
  }, []);

  const getStatusIndicator = useCallback((value) => {
    if (value > 0) {
      return <i className="mdi mdi-arrow-up ms-1 text-success" />;
    } else if (value < 0) {
      return <i className="mdi mdi-arrow-down ms-1 text-danger" />;
    }
    return <i className="mdi mdi-minus ms-1 text-muted" />;
  }, []);

  // Data calculations
  const calculateSingleRequestTotals = useCallback(
    (data) => ({
      financial: {
        requested: data?.bdr_requested_amount || 0,
        released: data?.bdr_released_amount || 0,
        variance:
          (data?.bdr_released_amount || 0) - (data?.bdr_requested_amount || 0),
        variancePercentage: calculatePercentage(
          data?.bdr_released_amount || 0,
          data?.bdr_requested_amount || 0,
        ),
      },
      baseline: {
        financial: data?.bdr_financial_baseline || 0,
        physical: data?.bdr_physical_baseline || 0,
      },
      status: {
        approved: data?.status_name === "Approved" ? 1 : 0,
        rejected: data?.status_name === "Rejected" ? 1 : 0,
        recommended: data?.status_name === "Recommended" ? 1 : 0,
        requested: data?.status_name === "Requested" ? 1 : 0,
      },
    }),
    [calculatePercentage],
  );

  const calculateOverallTotals = useCallback(
    (data) => {
      const totals = {
        financial: { requested: 0, released: 0, variance: 0 },
        baseline: { financial: 0, physical: 0 },
        physical: { planned: 0, approved: 0 },
        status: { approved: 0, rejected: 0, recommended: 0, requested: 0 },
        requestCount: data.length,
      };

      data.forEach((request) => {
        totals.financial.requested += request.bdr_requested_amount || 0;
        totals.financial.released += request.bdr_released_amount || 0;
        totals.baseline.financial += request.bdr_financial_baseline || 0;
        totals.baseline.physical += request.bdr_physical_baseline || 0;
        totals.physical.planned += request.bdr_physical_planned || 0;
        totals.physical.approved += request.bdr_physical_approved || 0;

        if (request.status_name === "Approved") totals.status.approved++;
        else if (request.status_name === "Rejected") totals.status.rejected++;
        else if (request.status_name === "Recommended")
          totals.status.recommended++;
        else if (request.status_name === "Requested") totals.status.requested++;
      });

      totals.financial.variance =
        totals.financial.released - totals.financial.requested;
      totals.financial.variancePercentage = calculatePercentage(
        totals.financial.released,
        totals.financial.requested,
      );

      totals.baseline.financial = totals.baseline.financial / data.length;
      totals.baseline.physical = totals.baseline.physical / data.length;
      totals.physical.planned = totals.physical.planned / data.length;
      totals.physical.approved = totals.physical.approved / data.length;

      return totals;
    },
    [calculatePercentage],
  );

  // Memoized totals calculation
  const totals = useMemo(() => {
    return isOverallView
      ? calculateOverallTotals(allData)
      : budgetRequestData
        ? calculateSingleRequestTotals(budgetRequestData)
        : {
            financial: {
              requested: 0,
              released: 0,
              variance: 0,
              variancePercentage: 0,
            },
            baseline: { financial: 0, physical: 0 },
            status: { approved: 0, rejected: 0, recommended: 0, requested: 0 },
            requestCount: 0,
          };
  }, [
    budgetRequestData,
    allData,
    isOverallView,
    calculateOverallTotals,
    calculateSingleRequestTotals,
  ]);

  const yearlyData = useMemo(() => {
    if (!allData) return [];

    const yearMap = new Map();

    allData.forEach((item) => {
      const year = item.bdy_name;
      if (!yearMap.has(year)) {
        yearMap.set(year, {
          requested: 0,
          released: 0,
          count: 0,
          physicalPlanned: 0,
          physicalApproved: 0,
        });
      }
      const yearData = yearMap.get(year);
      yearData.requested += item.bdr_requested_amount || 0;
      yearData.released += item.bdr_released_amount || 0;
      yearData.physicalPlanned += item.bdr_physical_planned || 0;
      yearData.physicalApproved += item.bdr_physical_approved || 0;
      yearData.count++;
    });

    return Array.from(yearMap.entries())
      .map(([year, data]) => ({
        year,
        requested: data.requested,
        released: data.released,
        variance: data.released - data.requested,
        variancePercentage: calculatePercentage(data.released, data.requested),
        physicalPlanned: data.physicalPlanned / data.count, // Average physical planned
        physicalApproved: data.physicalApproved / data.count, // Average physical approved
      }))
      .sort((a, b) => a.year - b.year);
  }, [allData, calculatePercentage]);
  // For single request, we'll create yearly data from the single request's year
  const singleRequestYearlyData = useMemo(() => {
    if (isOverallView || !budgetRequestData) return [];

    return [
      {
        year: budgetRequestData.bdy_name,
        requested: budgetRequestData.bdr_requested_amount || 0,
        released: budgetRequestData.bdr_released_amount || 0,
        variance:
          (budgetRequestData.bdr_released_amount || 0) -
          (budgetRequestData.bdr_requested_amount || 0),
        variancePercentage: calculatePercentage(
          budgetRequestData.bdr_released_amount || 0,
          budgetRequestData.bdr_requested_amount || 0,
        ),
        physicalPlanned: budgetRequestData.bdr_physical_planned || 0,
        physicalApproved: budgetRequestData.bdr_physical_approved || 0,
      },
    ];
  }, [budgetRequestData, isOverallView, calculatePercentage]);

  // Memoized chart data
  const { chartOptions, chartSeries } = useMemo(() => {
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
      colors: ["#3b5de7", "#45cb85"],
      legend: {
        position: "bottom",
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return `${memoizedFormatNumber(val)} ${t("birr")}`;
          },
        },
      },
    };

    if (chartType === "pie") {
      options = {
        ...options,
        labels: [`${t("requested")}`, `${t("released")}`],
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

      if (isOverallView) {
        const totalRequested = allData.reduce(
          (sum, req) => sum + (req.bdr_requested_amount || 0),
          0,
        );
        const totalReleased = allData.reduce(
          (sum, req) => sum + (req.bdr_released_amount || 0),
          0,
        );
        series = [totalRequested, totalReleased];
      } else {
        series = [
          budgetRequestData?.bdr_requested_amount || 0,
          budgetRequestData?.bdr_released_amount || 0,
        ];
      }
    } else {
      options = {
        ...options,
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
            dataLabels: {
              enabled: false,
            },
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
        xaxis: {
          categories: [`${t("budget")}`],
          labels: {
            rotate: -45,
            style: {
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          title: {
            text: `${t("amount_(Birr)")}`,
          },
          labels: {
            formatter: function (val) {
              if (val >= 1000000000) {
                return (val / 1000000000).toFixed(1) + `${t("b")}`;
              }
              if (val >= 1000000) {
                return (val / 1000000).toFixed(1) + `${t("m")}`;
              }
              return val;
            },
          },
        },
      };

      if (isOverallView) {
        const requestedByYear = {};
        const releasedByYear = {};

        allData.forEach((request) => {
          const year = request.bdy_name;
          requestedByYear[year] =
            (requestedByYear[year] || 0) + (request.bdr_requested_amount || 0);
          releasedByYear[year] =
            (releasedByYear[year] || 0) + (request.bdr_released_amount || 0);
        });

        const years = Object.keys(requestedByYear).sort();
        const requestedData = years.map((year) => requestedByYear[year]);
        const releasedData = years.map((year) => releasedByYear[year]);

        options.xaxis.categories = years;
        series = [
          { name: `${t("total_requested")}`, data: requestedData },
          { name: `${t("total_released")}`, data: releasedData },
        ];
      } else {
        series = [
          {
            name: `${t("requested")}`,
            data: [budgetRequestData?.bdr_requested_amount || 0],
          },
          {
            name: `${t("released")}`,
            data: [budgetRequestData?.bdr_released_amount || 0],
          },
        ];
      }
    }

    return { chartOptions: options, chartSeries: series };
  }, [
    budgetRequestData,
    allData,
    isOverallView,
    chartType,
    memoizedFormatNumber,
  ]);

  // Memoized UI calculations
  const utilizationPercentage = useMemo(() => {
    return totals?.financial?.requested > 0
      ? Math.round(
          (totals?.financial?.released / totals?.financial?.requested) * 100,
        )
      : 0;
  }, [totals?.financial]);

  const utilizationColor = useMemo(() => {
    return utilizationPercentage > 75
      ? "success"
      : utilizationPercentage > 50
        ? "info"
        : "warning";
  }, [utilizationPercentage]);

  const statusItems = useMemo(
    () => [
      { status: "Approved", value: totals?.status.approved, color: "success" },
      { status: "Rejected", value: totals?.status.rejected, color: "danger" },
      {
        status: "Recommended",
        value: totals?.status.recommended,
        color: "info",
      },
      {
        status: "Requested",
        value: totals?.status.requested,
        color: "warning",
      },
    ],
    [totals?.status],
  );

  // Event handlers
  const handleBarChartClick = useCallback(() => {
    onChartTypeChange("bar");
  }, [onChartTypeChange]);

  const handlePieChartClick = useCallback(() => {
    onChartTypeChange("pie");
  }, [onChartTypeChange]);

  const exportChart = useCallback((type) => {
    const chartElement = document.querySelector(
      "#budget-request-chart .apexcharts-canvas",
    );
    if (chartElement) {
      const canvas = chartElement.querySelector("canvas");
      if (canvas) {
        const link = document.createElement("a");
        link.download = `${t("budget_analysis")}-${new Date()
          .toISOString()
          .slice(0, 10)}.${type}`;
        link.href =
          type === "png"
            ? canvas.toDataURL("image/png")
            : canvas.toDataURL("image/jpeg", 0.9);
        link.click();
      }
    }
  }, []);

  return (
    <React.Fragment>
      <Col xl="12">
        <Card className="shadow-sm">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="card-title mb-0">
                {isOverallView
                  ? t("overall_budget_requests")
                  : `${budgetRequestData?.prj_name || t("budget_request")} ${t(
                      "analysis",
                    )}`}
                {isOverallView && (
                  <Badge color="primary" className="ms-2">
                    {totals?.requestCount || 0} {t("requests")}
                  </Badge>
                )}
              </h4>
              <div className="d-flex gap-2">
                <div className="btn-group">
                  <button
                    className={`btn btn-light ${
                      chartType === "bar" ? "active" : ""
                    }`}
                    onClick={handleBarChartClick}
                  >
                    <i className="mdi mdi-chart-bar"></i> {t("bar")}
                  </button>
                  <button
                    className={`btn btn-light ${
                      chartType === "pie" ? "active" : ""
                    }`}
                    onClick={handlePieChartClick}
                  >
                    <i className="mdi mdi-chart-pie"></i> {t("pie")}
                  </button>
                </div>

                <Dropdown
                  isOpen={chartExportOpen}
                  toggle={toggleChartExport}
                  disabled={!chartOptions}
                >
                  <DropdownToggle caret className="btn-light">
                    <i className="mdi mdi-download"></i>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => exportChart("png")}>
                      {t("export_as_PNG")}
                    </DropdownItem>
                    <DropdownItem onClick={() => exportChart("jpg")}>
                      {t("export_as_JPG")}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>

            <Nav tabs className="nav-tabs-custom">
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => toggleTab("1")}
                >
                  <i className="mdi mdi-chart-areaspline me-1"></i>{" "}
                  {t("summary")}
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => toggleTab("2")}
                >
                  <i className="mdi mdi-calendar-clock me-1"></i>{" "}
                  {t("yearly_progress")}
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "3" })}
                  onClick={() => toggleTab("3")}
                >
                  <i className="mdi mdi-file-document-outline me-1"></i>{" "}
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
                  <Col xl={4} lg={5} md={12}>
                    <div className="mt-4">
                      {!isOverallView && (
                        <>
                          <p className="text-muted mb-1">{t("project_code")}</p>
                          <h4 className="mb-3">
                            {budgetRequestData?.prj_code || "-"}
                          </h4>

                          <p className="text-muted mb-1">{t("status")}</p>
                          <h5 className="mb-4">
                            <Badge
                              color={
                                budgetRequestData?.status_name === "Approved"
                                  ? "success"
                                  : budgetRequestData?.status_name ===
                                      "Rejected"
                                    ? "danger"
                                    : budgetRequestData?.status_name ===
                                        "Recommended"
                                      ? "info"
                                      : "warning"
                              }
                            >
                              {budgetRequestData?.status_name || "-"}
                            </Badge>
                          </h5>
                        </>
                      )}

                      <Row>
                        <Col xs="6">
                          <div className="border-end pe-3">
                            <p className="text-muted mb-2">
                              {t("total_requested")}
                            </p>
                            <h5 className="text-primary">
                              {memoizedFormatNumber(
                                totals?.financial?.requested || 0,
                              )}{" "}
                              {t("birr")}
                            </h5>
                          </div>
                        </Col>
                        <Col xs="6">
                          <div className="ps-3">
                            <p className="text-muted mb-2">
                              {t("total_released")}
                            </p>
                            <h5 className="text-success">
                              {memoizedFormatNumber(
                                totals?.financial?.released || 0,
                              )}{" "}
                              {t("birr")}
                            </h5>
                          </div>
                        </Col>
                      </Row>

                      <div className="mt-4">
                        <p className="text-muted mb-2">{t("variance")}</p>
                        <h4
                          className={
                            totals?.financial?.variance >= 0
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {memoizedFormatLargeNumber(
                            Math.abs(totals?.financial?.variance || 0),
                          )}{" "}
                          {t("birr")}
                          {getStatusIndicator(totals?.financial?.variance || 0)}
                          <span className="text-muted font-size-14 ms-2">
                            (
                            {memoizedFormatNumber(
                              totals?.financial?.variancePercentage || 0,
                            )}
                            %)
                          </span>
                        </h4>
                      </div>

                      <div className="mt-4">
                        <p className="text-muted mb-2">
                          {t("budget_utilization")}
                        </p>
                        <div className="d-flex align-items-center">
                          <Progress
                            className="flex-grow-1"
                            value={utilizationPercentage}
                            color={utilizationColor}
                          />
                          <span className="ms-2 text-muted">
                            {utilizationPercentage}%
                          </span>
                        </div>
                        <small className="text-muted">
                          {memoizedFormatNumber(
                            totals?.financial?.released || 0,
                          )}{" "}
                          {t("of")}{" "}
                          {memoizedFormatNumber(
                            totals?.financial?.requested || 0,
                          )}{" "}
                          {t("birr")}
                        </small>
                      </div>
                      {isOverallView && (
                        <Row className="mt-4">
                          <Col xs="6">
                            <div className="border-end pe-3">
                              <p className="text-muted mb-2">
                                {t("avg._physical_planned")}
                              </p>
                              <h4 className="text-primary">
                                {memoizedFormatNumber(
                                  totals?.physical?.planned || 0,
                                )}
                                %
                              </h4>
                            </div>
                          </Col>

                          <Col xs="6">
                            <div className="pe-3">
                              <p className="text-muted mb-2">
                                {t("avg._physical_approved")}
                              </p>
                              <h4 className="text-primary">
                                {memoizedFormatNumber(
                                  totals?.physical?.approved || 0,
                                )}
                                %
                              </h4>
                            </div>
                          </Col>
                        </Row>
                      )}

                      {isOverallView && (
                        <div className="mt-4">
                          <Row className="g-2">
                            {statusItems.map((item, index) => (
                              <Col key={index} xs={6} sm={3}>
                                <div className="text-center p-2 rounded">
                                  <p
                                    className="text-muted mb-1 text-truncate"
                                    style={{ fontSize: "12px" }}
                                  >
                                    {item.status}
                                  </p>
                                  <h4 className={`text-${item.color} mb-0`}>
                                    {item.value || 0}
                                  </h4>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}
                    </div>
                  </Col>

                  <Col xl={8} lg={7} md={12}>
                    <div id="budget-request-chart">
                      {chartOptions && chartSeries && (
                        <ReactApexChart
                          options={chartOptions}
                          series={chartSeries}
                          type={chartType}
                          height={350}
                          className="apex-charts"
                        />
                      )}
                    </div>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tabId="2">
                <div className="table-responsive">
                  <table className="table table-bordered table-hover table-striped">
                    <thead className="table-light">
                      <tr>
                        <th>{t("year")}</th>
                        <th>{t("total_requested_(Birr)")}</th>
                        <th>{t("total_released_(Birr)")}</th>
                        <th>{t("variance")}</th>
                        <th>{t("avg._physical_planned")}(%)</th>
                        <th>{t("avg._physical_approved")} (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(isOverallView
                        ? yearlyData
                        : singleRequestYearlyData
                      ).map((yearData) => (
                        <tr key={yearData.year}>
                          <td>{yearData.year}</td>
                          <td>{memoizedFormatNumber(yearData.requested)}</td>
                          <td>{memoizedFormatNumber(yearData.released)}</td>
                          <td
                            className={
                              yearData.variance >= 0
                                ? "text-success"
                                : "text-danger"
                            }
                          >
                            {memoizedFormatNumber(Math.abs(yearData.variance))}
                            {getStatusIndicator(yearData.variance)}
                          </td>
                          <td>
                            {memoizedFormatNumber(yearData.physicalPlanned)}
                          </td>
                          <td>
                            {memoizedFormatNumber(yearData.physicalApproved)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabPane>

              <TabPane tabId="3">
                <Row>
                  <Col md="6">
                    <Card className="shadow-sm border-0">
                      <CardBody>
                        <h5 className="card-title">
                          <i className="mdi mdi-scale-balance me-1"></i>{" "}
                          {t("baseline_comparison")}
                        </h5>
                        <div className="d-flex justify-content-between mt-3">
                          <div>
                            <p className="text-muted mb-1">
                              {t("financial_baseline")}
                            </p>
                            <h4>
                              {memoizedFormatNumber(
                                totals?.baseline?.financial || 0,
                              )}{" "}
                              {t("birr")}
                            </h4>
                          </div>
                          <div>
                            <p className="text-muted mb-1">
                              {t("physical_baseline")}
                            </p>
                            <h4>
                              {memoizedFormatNumber(
                                totals?.baseline?.physical || 0,
                              )}
                              %
                            </h4>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col md="6">
                    <Card className="shadow-sm border-0">
                      <CardBody>
                        <h5 className="card-title">
                          <i className="mdi mdi-chart-box-outline me-1"></i>{" "}
                          {t("performance_metrics")}
                        </h5>
                        <div className="mt-3">
                          <p className="text-muted mb-1">
                            {t("efficiency_ratio")}
                          </p>
                          <div className="d-flex align-items-center">
                            <Progress
                              className="flex-grow-1"
                              value={utilizationPercentage}
                              color="info"
                            />
                            <span className="ms-2">
                              {utilizationPercentage}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-muted mb-1">
                            {t("budget_absorption_rate")}
                          </p>
                          <div className="d-flex align-items-center">
                            <Progress
                              className="flex-grow-1"
                              value={totals?.baseline?.physical || 0}
                              color="success"
                            />
                            <span className="ms-2">
                              {memoizedFormatNumber(
                                totals?.baseline?.physical || 0,
                              )}
                              %
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                {!isOverallView && budgetRequestData && (
                  <Row className="mt-4">
                    <Col md="12">
                      <Card className="shadow-sm border-0">
                        <CardBody>
                          <h4 className="card-title mb-4">
                            <i className="mdi mdi-file-document-outline me-1"></i>{" "}
                            {t("request_details")}
                          </h4>
                          <Row>
                            <Col md="4" className="mb-3">
                              <p className="text-muted fw-bold mb-1">
                                {t("description")}
                              </p>
                              <p className="text-dark">
                                {budgetRequestData?.bdr_description ||
                                  t("no_description_available")}
                              </p>
                            </Col>
                            <Col md="4" className="mb-3">
                              <p className="text-muted fw-bold mb-1">
                                {t("requested_date")}
                              </p>
                              <p className="text-dark">
                                {budgetRequestData?.bdr_requested_date_gc ||
                                  "-"}
                              </p>
                            </Col>
                            <Col md="4" className="mb-3">
                              <p className="text-muted fw-bold mb-1">
                                {t("released_date")}
                              </p>
                              <p className="text-dark">
                                {budgetRequestData?.bdr_released_date_gc || "-"}
                              </p>
                            </Col>
                            <Col md="4" className="mb-3">
                              <p className="text-muted fw-bold mb-1">
                                {t("action_remark")}
                              </p>
                              <p className="text-dark">
                                {budgetRequestData?.bdr_action_remark || "-"}
                              </p>
                            </Col>
                            <Col md="4" className="mb-3">
                              <p className="text-muted fw-bold mb-1">
                                {t("request_type")}
                              </p>
                              <p className="text-dark">
                                {budgetRequestData?.bdr_request_type === 6
                                  ? "Capital"
                                  : "Recurrent"}
                              </p>
                            </Col>
                            <Col md="4" className="mb-3">
                              <p className="text-muted fw-bold mb-1">
                                {t("priority_level")}
                              </p>
                              <p className="text-dark">
                                {budgetRequestData?.bdr_priority_level === 1
                                  ? "High"
                                  : budgetRequestData?.bdr_priority_level === 2
                                    ? "Medium"
                                    : "Low"}
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

export default React.memo(BudgetRequestAnalysis);
