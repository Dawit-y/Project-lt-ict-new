import React from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Table,
} from "reactstrap";
import { useTranslation } from "react-i18next";

const ProjectPerformanceModal = ({
  isOpen,
  toggle,
  transaction,
  budgetYearMap,
  budgetMonthMap,
  projectStatusMap,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (!transaction) return null;

  // Enhanced month names with proper ordering
  const monthNames = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  // Helper function to format values with improved visual presentation
  const formatValue = (value, isPercentage = false, isCurrency = false) => {
    if (value === null || value === undefined)
      return <span className="text-muted">-</span>;

    const numValue = Number(value);
    if (isNaN(numValue)) return value;

    if (isPercentage) {
      return (
        <span className={numValue < 0 ? "text-danger" : ""}>
          {`${numValue.toFixed(2)}%`}
        </span>
      );
    }
    if (isCurrency) {
      return (
        <span className={numValue < 0 ? "text-danger" : ""}>
          {`Birr ${numValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
        </span>
      );
    }
    return numValue.toLocaleString();
  };

  // Prepare monthly data with proper ordering and enhanced structure
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const plannedPhysical =
      Number(transaction[`prp_pyhsical_planned_month_${month}`]) || 0;
    const actualPhysical =
      Number(transaction[`prp_pyhsical_actual_month_${month}`]) || 0;
    const plannedFinancial =
      Number(transaction[`prp_finan_planned_month_${month}`]) || 0;
    const actualFinancial =
      Number(transaction[`prp_finan_actual_month_${month}`]) || 0;

    const physicalVariance = actualPhysical - plannedPhysical;
    const financialVariance = actualFinancial - plannedFinancial;

    return {
      month,
      monthName: monthNames[month] || `Month ${month}`,
      monthShortName: monthNames[month]?.substring(0, 3) || `M${month}`,
      plannedPhysical,
      actualPhysical,
      physicalVariance,
      physicalAchievement:
        plannedPhysical > 0 ? (actualPhysical / plannedPhysical) * 100 : null,
      plannedFinancial,
      actualFinancial,
      financialVariance,
      financialAchievement:
        plannedFinancial > 0
          ? (actualFinancial / plannedFinancial) * 100
          : null,
      status: transaction[`prp_status_month_${month}`],
    };
  });

  // Calculate quarterly summaries with enhanced data
  const quarters = [
    { name: "Q1", months: [11, 12, 1], color: "primary" },
    { name: "Q2", months: [2, 3, 4], color: "primary" },
    { name: "Q3", months: [5, 6, 7], color: "primary" },
    { name: "Q4", months: [8, 9, 10], color: "primary" },
  ].map((q) => {
    const quarterMonths = monthlyData.filter((m) => q.months.includes(m.month));

    const totals = quarterMonths.reduce(
      (acc, m) => ({
        plannedPhysical: acc.plannedPhysical + m.plannedPhysical,
        actualPhysical: acc.actualPhysical + m.actualPhysical,
        plannedFinancial: acc.plannedFinancial + m.plannedFinancial,
        actualFinancial: acc.actualFinancial + m.actualFinancial,
      }),
      {
        plannedPhysical: 0,
        actualPhysical: 0,
        plannedFinancial: 0,
        actualFinancial: 0,
      }
    );

    return {
      ...q,
      ...totals,
      avgPhysicalPlanned: totals.plannedPhysical / 3,
      avgPhysicalActual: totals.actualPhysical / 3,
      physicalVariance: totals.actualPhysical - totals.plannedPhysical,
      financialVariance: totals.actualFinancial - totals.plannedFinancial,
      physicalAchievement:
        totals.plannedPhysical > 0
          ? (totals.actualPhysical / totals.plannedPhysical) * 100
          : null,
      financialAchievement:
        totals.plannedFinancial > 0
          ? (totals.actualFinancial / totals.plannedFinancial) * 100
          : null,
    };
  });

  // Calculate annual totals with enhanced metrics
  const annualSummary = {
    avgPhysicalPlanned:
      monthlyData.reduce((sum, m) => sum + m.plannedPhysical, 0) / 12,
    avgPhysicalActual:
      monthlyData.reduce((sum, m) => sum + m.actualPhysical, 0) / 12,
    totalPlannedFinancial: monthlyData.reduce(
      (sum, m) => sum + m.plannedFinancial,
      0
    ),
    totalActualFinancial: monthlyData.reduce(
      (sum, m) => sum + m.actualFinancial,
      0
    ),
    baselinePhysical: transaction.prp_physical_baseline,
    baselineFinancial: transaction.prp_budget_baseline,
    physicalVariance: monthlyData.reduce(
      (sum, m) => sum + (m.actualPhysical - m.plannedPhysical),
      0
    ),
    financialVariance: monthlyData.reduce(
      (sum, m) => sum + (m.actualFinancial - m.plannedFinancial),
      0
    ),
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="xl"
      scrollable
      className="performance-modal"
    >
      <ModalHeader toggle={toggle} className="border-0 pb-1 bg-light">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            <h4 className="mb-0 text-primary">
              <i className="bx bx-line-chart me-2"></i>
              {t("Project Performance Details")}{" "}
              <Badge color="primary" pill>
                {t("Annual Report")}
              </Badge>
            </h4>
            <div className="text-muted small">
              {budgetYearMap[transaction.prp_budget_year_id]} |{" "}
              {transaction.prp_description || t("No description")}
            </div>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="pt-0 mt-2">
        {/* Summary Cards with enhanced design */}
        <Row className="mb-4 g-3">
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <CardHeader
                className="text-white py-2"
                style={{ backgroundColor: "rgba(164, 176, 255, 0.9)" }}
              >
                <h6 className="mb-0">
                  <i className="bx bx-trending-up me-2"></i>
                  {t("Physical Performance")}
                </h6>
              </CardHeader>
              <CardBody>
                <div className="performance-metric">
                  <div className="metric-label">{t("Baseline")}</div>
                  <div className="metric-value text-dark">
                    {formatValue(annualSummary.baselinePhysical, true)}
                  </div>
                </div>
                <div className="performance-metric">
                  <div className="metric-label">{t("Planned Avg")}</div>
                  <div className="metric-value">
                    {formatValue(annualSummary.avgPhysicalPlanned, true)}
                  </div>
                </div>
                <div className="performance-metric">
                  <div className="metric-label">{t("Actual Avg")}</div>
                  <div
                    className={`metric-value ${
                      annualSummary.avgPhysicalActual <
                      annualSummary.avgPhysicalPlanned
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    {formatValue(annualSummary.avgPhysicalActual, true)}
                    {annualSummary.physicalVariance !== 0 && (
                      <small
                        className={`ms-2 ${
                          annualSummary.physicalVariance < 0
                            ? "text-danger"
                            : "text-success"
                        }`}
                      >
                        ({annualSummary.physicalVariance > 0 ? "+" : ""}
                        {formatValue(annualSummary.physicalVariance, true)})
                      </small>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <CardHeader
                className=" text-white py-2"
                style={{ backgroundColor: "rgba(7, 142, 47, 0.49)" }}
              >
                <h6 className="mb-0">
                  <i className="bx bx-money me-2"></i>
                  {t("Financial Performance")}
                </h6>
              </CardHeader>
              <CardBody>
                <div className="performance-metric">
                  <div className="metric-label">{t("Baseline")}</div>
                  <div className="metric-value text-dark">
                    {formatValue(annualSummary.baselineFinancial, false, true)}
                  </div>
                </div>
                <div className="performance-metric">
                  <div className="metric-label">{t("Planned Total")}</div>
                  <div className="metric-value">
                    {formatValue(
                      annualSummary.totalPlannedFinancial,
                      false,
                      true
                    )}
                  </div>
                </div>
                <div className="performance-metric">
                  <div className="metric-label">{t("Actual Total")}</div>
                  <div
                    className={`metric-value ${
                      annualSummary.totalActualFinancial <
                      annualSummary.totalPlannedFinancial
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    {formatValue(
                      annualSummary.totalActualFinancial,
                      false,
                      true
                    )}
                    {annualSummary.financialVariance !== 0 && (
                      <small
                        className={`ms-2 ${
                          annualSummary.financialVariance < 0
                            ? "text-danger"
                            : "text-success"
                        }`}
                      >
                        ({annualSummary.financialVariance > 0 ? "+" : ""}
                        {formatValue(
                          annualSummary.financialVariance,
                          false,
                          true
                        )}
                        )
                      </small>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <CardHeader
                className=" text-white py-2"
                style={{ backgroundColor: "rgba(249, 188, 11, 0.5)" }}
              >
                <h6 className="mb-0">
                  <i className="bx bx-bar-chart-alt-2 me-2"></i>
                  {t("Performance Summary")}
                </h6>
              </CardHeader>
              <CardBody>
                <div className="performance-metric">
                  <div className="metric-label">
                    {t("Physical Achievement")}
                  </div>
                  <div className="metric-value">
                    {annualSummary.avgPhysicalPlanned > 0 ? (
                      <span
                        className={
                          (annualSummary.avgPhysicalActual /
                            annualSummary.avgPhysicalPlanned) *
                            100 <
                          100
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {(
                          (annualSummary.avgPhysicalActual /
                            annualSummary.avgPhysicalPlanned) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </div>
                </div>
                <div className="performance-metric">
                  <div className="metric-label">
                    {t("Financial Achievement")}
                  </div>
                  <div className="metric-value">
                    {annualSummary.totalPlannedFinancial > 0 ? (
                      <span
                        className={
                          (annualSummary.totalActualFinancial /
                            annualSummary.totalPlannedFinancial) *
                            100 <
                          100
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {(
                          (annualSummary.totalActualFinancial /
                            annualSummary.totalPlannedFinancial) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </div>
                </div>
                <div className="performance-metric">
                  <div className="metric-label">{t("Overall Status")}</div>
                  <div className="metric-value">
                    <Badge
                      color={
                        annualSummary.avgPhysicalActual >=
                          annualSummary.avgPhysicalPlanned &&
                        annualSummary.totalActualFinancial >=
                          annualSummary.totalPlannedFinancial
                          ? "success"
                          : annualSummary.avgPhysicalActual >=
                              annualSummary.avgPhysicalPlanned * 0.8 ||
                            annualSummary.totalActualFinancial >=
                              annualSummary.totalPlannedFinancial * 0.8
                          ? "warning"
                          : "danger"
                      }
                      pill
                    >
                      {annualSummary.avgPhysicalActual >=
                        annualSummary.avgPhysicalPlanned &&
                      annualSummary.totalActualFinancial >=
                        annualSummary.totalPlannedFinancial
                        ? t("On Track")
                        : annualSummary.avgPhysicalActual >=
                            annualSummary.avgPhysicalPlanned * 0.8 ||
                          annualSummary.totalActualFinancial >=
                            annualSummary.totalPlannedFinancial * 0.8
                        ? t("Needs Attention")
                        : t("At Risk")}
                    </Badge>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Quarterly Breakdown with enhanced visualization */}
        <h5 className="mb-3 d-flex align-items-center">
          <i className="bx bx-calendar-quarter me-2 text-primary"></i>
          {t("Quarterly Performance Breakdown")}
        </h5>
        <Row className="mb-4 g-3">
          {quarters.map((q, idx) => (
            <Col md={3} key={idx} className="quarter-col">
              <Card
                className={`border-0 shadow-sm h-100 border-top-4 border-${q.color}`}
              >
                <CardHeader className={`bg-${q.color}-subtle py-2`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className={`mb-0 text-${q.color}`}>
                      <i className={`bx bx-${q.name.toLowerCase()} me-2`}></i>
                      {q.name}
                    </h6>
                    <Badge color={q.color} pill>
                      {q.months
                        .map((m) => monthNames[m].substring(0, 1))
                        .join("")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="quarter-metric">
                    <div className="metric-label small">{t("Physical")}</div>
                    <div className="metric-value">
                      <span className="text-muted me-2">
                        {formatValue(q.avgPhysicalPlanned, true)}
                      </span>
                      <span
                        className={
                          q.avgPhysicalActual < q.avgPhysicalPlanned
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {formatValue(q.avgPhysicalActual, true)}
                        {q.physicalVariance !== 0 && (
                          <small
                            className={`ms-1 ${
                              q.physicalVariance < 0
                                ? "text-danger"
                                : "text-success"
                            }`}
                          >
                            ({q.physicalVariance > 0 ? "+" : ""}
                            {formatValue(q.physicalVariance, true)})
                          </small>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="quarter-metric">
                    <div className="metric-label small">{t("Financial")}</div>
                    <div className="metric-value">
                      <span className="text-muted me-2">
                        {formatValue(q.plannedFinancial, false, true)}
                      </span>
                      <span
                        className={
                          q.actualFinancial < q.plannedFinancial
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {formatValue(q.actualFinancial, false, true)}
                        {q.financialVariance !== 0 && (
                          <small
                            className={`ms-1 ${
                              q.financialVariance < 0
                                ? "text-danger"
                                : "text-success"
                            }`}
                          >
                            ({q.financialVariance > 0 ? "+" : ""}
                            {formatValue(q.financialVariance, false, true)})
                          </small>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="quarter-metric small mt-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">{t("Achievement")}:</span>
                      <span
                        className={
                          q.physicalAchievement < 100 ||
                          q.financialAchievement < 100
                            ? "text-warning"
                            : "text-success"
                        }
                      >
                        {q.physicalAchievement?.toFixed(0) ?? "N/A"}% /{" "}
                        {q.financialAchievement?.toFixed(0) ?? "N/A"}%
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Monthly Details Table with enhanced design */}
        <h5 className="mb-3 d-flex align-items-center">
          <i className="bx bx-calendar me-2 text-primary"></i>
          {t("Monthly Performance Details")}
        </h5>
        <div className="table-responsive">
          <Table bordered hover className="mb-0 performance-table">
            <thead className="table-light">
              <tr>
                <th className="text-center">{t("Month")}</th>
                <th className="text-center">{t("Physical")} (%)</th>
                <th className="text-center">{t("Financial")} (Birr)</th>
                <th className="text-center">{t("Variance")}</th>
                <th className="text-center">{t("Achievement")}</th>
                <th className="text-center">{t("Status")}</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((month, idx) => (
                <tr
                  key={idx}
                  className={
                    month.actualPhysical < month.plannedPhysical ||
                    month.actualFinancial < month.plannedFinancial
                      ? "table-warning"
                      : ""
                  }
                >
                  <td className="text-center fw-medium">
                    <div className="month-indicator">
                      <div className="month-name">{month.monthName}</div>
                      <div className="month-short">{month.monthShortName}</div>
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted me-2">
                        {formatValue(month.plannedPhysical, true)}
                      </span>
                      <span
                        className={
                          month.actualPhysical < month.plannedPhysical
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {formatValue(month.actualPhysical, true)}
                      </span>
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted me-2">
                        {formatValue(month.plannedFinancial, false, true)}
                      </span>
                      <span
                        className={
                          month.actualFinancial < month.plannedFinancial
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {formatValue(month.actualFinancial, false, true)}
                      </span>
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="d-flex flex-column">
                      <small
                        className={
                          month.physicalVariance < 0
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {formatValue(month.physicalVariance, true)}
                      </small>
                      <small
                        className={
                          month.financialVariance < 0
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        {formatValue(month.financialVariance, false, true)}
                      </small>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="d-flex flex-column small">
                      <span
                        className={
                          month.physicalAchievement < 100
                            ? "text-warning"
                            : "text-success"
                        }
                      >
                        {month.physicalAchievement
                          ? `${month.physicalAchievement.toFixed(0)}%`
                          : "N/A"}
                      </span>
                      <span
                        className={
                          month.financialAchievement < 100
                            ? "text-warning"
                            : "text-success"
                        }
                      >
                        {month.financialAchievement
                          ? `${month.financialAchievement.toFixed(0)}%`
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="text-center">
                    <Badge
                      color={
                        month.actualPhysical >= month.plannedPhysical &&
                        month.actualFinancial >= month.plannedFinancial
                          ? "success"
                          : month.actualPhysical >=
                              month.plannedPhysical * 0.8 ||
                            month.actualFinancial >=
                              month.plannedFinancial * 0.8
                          ? "warning"
                          : "danger"
                      }
                      pill
                    >
                      {month.status
                        ? projectStatusMap[month.status]
                        : t("Not set")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* CSS for enhanced visual presentation */}
        <style jsx>{`
          .performance-metric {
            margin-bottom: 0.75rem;
          }
          .metric-label {
            font-size: 0.85rem;
            color: #6c757d;
          }
          .metric-value {
            font-size: 1.1rem;
            font-weight: 500;
          }
          .quarter-metric {
            margin-bottom: 0.5rem;
          }
          .month-indicator {
            display: flex;
            flex-direction: column;
          }
          .month-name {
            font-size: 0.9rem;
          }
          .month-short {
            font-size: 0.75rem;
            color: #6c757d;
          }
          .performance-table th {
            white-space: nowrap;
          }
          .performance-table td {
            vertical-align: middle;
          }
          .quarter-col:nth-child(1) .card {
            border-top-color: #727cf5 !important;
          }
          .quarter-col:nth-child(2) .card {
            border-top-color: #727cf5 !important;
          }
          .quarter-col:nth-child(3) .card {
            border-top-color: #727cf5 !important;
          }
          .quarter-col:nth-child(4) .card {
            border-top-color: #727cf5 !important;
          }
        `}</style>
      </ModalBody>
    </Modal>
  );
};

ProjectPerformanceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  transaction: PropTypes.object,
  budgetYearMap: PropTypes.object.isRequired,
  budgetMonthMap: PropTypes.object.isRequired,
  projectStatusMap: PropTypes.object.isRequired,
};

export default ProjectPerformanceModal;
