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
  const { t } = useTranslation();

  if (!transaction) return null;

  // Ethiopian months in order (Hamle to Sene)
  const ETHIOPIAN_MONTHS = {
    1: t("Meskerem"), // September 6 - October 5
    2: t("Tikimt"), // October 6 - November 4
    3: t("Hidar"), // November 5 - December 4
    4: t("Tahesas"), // December 5 - January 3
    5: t("Tir"), // January 4 - February 2
    6: t("Yekatit"), // February 3 - March 4
    7: t("Megabit"), // March 5 - April 3
    8: t("Miyazya"), // April 4 - May 3
    9: t("Ginbot"), // May 4 - June 2
    10: t("Sene"), // June 3 - July 7
    11: t("Hamle"), // July 8 - August 6
    12: t("Nehase"), // August 7 - September 5
  };

  // Ethiopian quarters (aligned with fiscal year)
  const ETHIOPIAN_QUARTERS = [
    [11, 12, 1], // Q1: Hamle, Nehase, Meskerem (Jul-Sep)
    [2, 3, 4], // Q2: Tikimt, Hidar, Tahesas (Oct-Dec)
    [5, 6, 7], // Q3: Tir, Yekatit, Megabit (Jan-Mar)
    [8, 9, 10], // Q4: Miyazya, Ginbot, Sene (Apr-Jun)
  ];

  const formatValue = (value, isPercentage = false, isCurrency = false) => {
    if (value === null || value === undefined) return "-";

    const numValue = Number(value);
    if (isNaN(numValue)) return value;

    if (isPercentage) {
      return `${numValue.toFixed(2)}%`;
    }
    if (isCurrency) {
      return `${t("birr")} ${numValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return numValue.toLocaleString();
  };

  // Prepare monthly data with Ethiopian month names
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

    return {
      month,
      monthName: ETHIOPIAN_MONTHS[month],
      monthShortName: ETHIOPIAN_MONTHS[month]?.substring(0, 3),
      plannedPhysical,
      actualPhysical,
      physicalVariance: actualPhysical - plannedPhysical,
      physicalAchievement:
        plannedPhysical > 0 ? (actualPhysical / plannedPhysical) * 100 : null,
      plannedFinancial,
      actualFinancial,
      financialVariance: actualFinancial - plannedFinancial,
      financialAchievement:
        plannedFinancial > 0
          ? (actualFinancial / plannedFinancial) * 100
          : null,
      status: transaction[`prp_status_month_${month}`],
    };
  });

  // Reordered for display (Hamle to Sene)
  const displayMonthlyData = [11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
    (month) => monthlyData.find((m) => m.month === month),
  );

  // Calculate quarterly summaries using Ethiopian fiscal quarters
  const quarters = ETHIOPIAN_QUARTERS.map((quarterMonths, qNum) => {
    const quarterData = monthlyData.filter((m) =>
      quarterMonths.includes(m.month),
    );
    const totals = quarterData.reduce(
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
      },
    );

    return {
      name: `${t("q")}${qNum + 1}`,
      months: quarterMonths,
      ...totals,
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

  // Annual summary (fixed calculation for average)
  const annualSummary = {
    TotalPhysicalPlanned: monthlyData.reduce(
      (sum, m) => sum + m.plannedPhysical,
      0,
    ),
    TotalPhysicalActual: monthlyData.reduce(
      (sum, m) => sum + m.actualPhysical,
      0,
    ),
    avgPhysicalPlanned:
      monthlyData.reduce((sum, m) => sum + m.plannedPhysical, 0) / 12,
    avgPhysicalActual:
      monthlyData.reduce((sum, m) => sum + m.actualPhysical, 0) / 12,
    totalPlannedFinancial: monthlyData.reduce(
      (sum, m) => sum + m.plannedFinancial,
      0,
    ),
    totalActualFinancial: monthlyData.reduce(
      (sum, m) => sum + m.actualFinancial,
      0,
    ),
    baselinePhysical: transaction.prp_physical_baseline,
    baselineFinancial: transaction.prp_budget_baseline,
  };

  const getStatusColor = (achievement) => {
    if (achievement === null || achievement === undefined) return "secondary";
    if (achievement >= 100) return "success";
    if (achievement >= 80) return "warning";
    return "danger";
  };

  const getVarianceColor = (value) => {
    if (value === null || value === undefined) return "";
    return value >= 0 ? "text-success" : "text-danger";
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="xl"
      scrollable
      className="border-0"
    >
      <ModalHeader toggle={toggle} className="border-bottom-0 pb-0">
        <div>
          <h5 className="mb-1 text-dark d-flex align-items-center gap-2">
            {t("project_performance_details")}
            <span className="badge bg-primary text-white">
              {t("annual_performance")}
            </span>
          </h5>
          <div className="text-muted small">
            {budgetYearMap[transaction.prp_budget_year_id]} •{" "}
            {transaction.prp_description || t("no_description")}
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="pt-0 mt-2">
        {/* Summary Cards */}
        <Row className="mb-4 g-3">
          {[
            {
              title: t("physical_performance"),
              icon: "bx bx-trending-up",
              metrics: [
                {
                  label: t("baseline"),
                  value: annualSummary.baselinePhysical,
                  format: true,
                },
                {
                  label: t("total_planned"),
                  value: annualSummary.TotalPhysicalPlanned,
                  format: true,
                },
                {
                  label: t("total_actual"),
                  value: annualSummary.TotalPhysicalActual,
                  format: true,
                },
              ],
            },
            {
              title: t("financial_performance"),
              icon: "bx bx-money",
              metrics: [
                {
                  label: t("baseline"),
                  value: annualSummary.baselineFinancial,
                  format: false,
                  currency: true,
                },
                {
                  label: t("planned_total"),
                  value: annualSummary.totalPlannedFinancial,
                  format: false,
                  currency: true,
                },
                {
                  label: t("actual_total"),
                  value: annualSummary.totalActualFinancial,
                  format: false,
                  currency: true,
                },
              ],
            },
            {
              title: t("performance_summary"),
              icon: "bx bx-bar-chart-alt-2",
              metrics: [
                {
                  label: t("physical_achievement"),
                  value:
                    annualSummary.avgPhysicalPlanned > 0
                      ? (annualSummary.avgPhysicalActual /
                          annualSummary.avgPhysicalPlanned) *
                        100
                      : null,
                  isPercentage: true,
                },
                {
                  label: t("financial_achievement"),
                  value:
                    annualSummary.totalPlannedFinancial > 0
                      ? (annualSummary.totalActualFinancial /
                          annualSummary.totalPlannedFinancial) *
                        100
                      : null,
                  isPercentage: true,
                },
                {
                  label: t("overall_status"),
                  component: (
                    <Badge
                      color={getStatusColor(
                        Math.min(
                          (annualSummary.avgPhysicalActual /
                            annualSummary.avgPhysicalPlanned) *
                            100,
                          (annualSummary.totalActualFinancial /
                            annualSummary.totalPlannedFinancial) *
                            100,
                        ),
                      )}
                      pill
                      className="px-3 py-1 fw-normal"
                    >
                      {annualSummary.avgPhysicalActual >=
                        annualSummary.avgPhysicalPlanned &&
                      annualSummary.totalActualFinancial >=
                        annualSummary.totalPlannedFinancial
                        ? t("on_track")
                        : annualSummary.avgPhysicalActual >=
                              annualSummary.avgPhysicalPlanned * 0.8 ||
                            annualSummary.totalActualFinancial >=
                              annualSummary.totalPlannedFinancial * 0.8
                          ? t("needs_attention")
                          : t("at_risk")}
                    </Badge>
                  ),
                },
              ],
            },
          ].map((section, idx) => (
            <Col md={4} key={idx}>
              <Card className="h-100 shadow-sm border">
                <CardHeader className="border-bottom bg-light">
                  <h6 className="mb-0 d-flex align-items-center">
                    <i className={`${section.icon} me-2 text-primary`}></i>
                    {section.title}
                  </h6>
                </CardHeader>
                <CardBody>
                  {section.metrics.map((metric, i) => (
                    <div key={i} className="mb-3">
                      <div className="text-muted small mb-1">
                        {metric.label}
                      </div>
                      {metric.component || (
                        <div className="d-flex align-items-center">
                          <span className="h5 mb-0 fw-semibold">
                            {metric.isPercentage
                              ? metric.value
                                ? `${metric.value.toFixed(2)}%`
                                : `${t("N/A")}`
                              : formatValue(
                                  metric.value,
                                  metric.format,
                                  metric.currency,
                                )}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Quarterly Breakdown */}
        <h5 className="mb-3 d-flex align-items-center text-dark">
          <i className="bx bx-calendar-quarter me-2 text-primary"></i>
          {t("quarterly_performance")}
        </h5>
        <Row className="mb-4 g-3">
          {quarters.map((q, idx) => {
            const physicalColor = getVarianceColor(q.physicalVariance);
            const financialColor = getVarianceColor(q.financialVariance);

            return (
              <Col md={3} key={idx}>
                <Card className="h-100 border shadow-sm">
                  <CardHeader className="border-bottom bg-light py-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 text-dark">{q.name}</h6>
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        {q.months
                          .map((m) => ETHIOPIAN_MONTHS[m]?.charAt(0))
                          .join("")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="mb-3">
                      <div className="text-muted small mb-1">
                        {t("physical_performance")}
                      </div>
                      <div className="d-flex justify-content-between align-items-end">
                        <div>
                          <div className="text-muted small">
                            {t("avg.planned")}
                          </div>
                          <div>{formatValue(q.plannedPhysical / 3, true)}</div>
                        </div>
                        <div className="text-end">
                          <div className="text-muted small">
                            {t("avg.actual")}
                          </div>
                          <div className={physicalColor}>
                            {formatValue(q.actualPhysical / 3, true)}
                          </div>
                        </div>
                      </div>
                      {q.physicalVariance !== 0 && (
                        <div className="mt-2">
                          <div className="text-muted small">
                            {t("variance")}
                          </div>
                          <div className={physicalColor}>
                            {q.physicalVariance > 0 ? "+" : ""}
                            {formatValue(q.physicalVariance / 3, true)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-2">
                      <div className="text-muted small mb-1">
                        {t("financial_performance")}
                      </div>
                      <div className="d-flex justify-content-between align-items-end">
                        <div>
                          <div className="text-muted small">{t("planned")}</div>
                          <div>
                            {formatValue(q.plannedFinancial, false, true)}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="text-muted small">{t("actual")}</div>
                          <div className={financialColor}>
                            {formatValue(q.actualFinancial, false, true)}
                          </div>
                        </div>
                      </div>
                      {q.financialVariance !== 0 && (
                        <div className="mt-2">
                          <div className="text-muted small">
                            {t("variance")}
                          </div>
                          <div className={financialColor}>
                            {q.financialVariance > 0 ? "+" : ""}
                            {formatValue(q.financialVariance, false, true)}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Monthly Details */}
        <h5 className="mb-3 d-flex align-items-center text-dark">
          <i className="bx bx-calendar me-2 text-primary"></i>
          {t("monthly_performance_details")}
        </h5>
        <div className="table-responsive">
          <Table bordered hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th width="15%">{t("month")}</th>
                <th className="text-end">{t("planned")}</th>
                <th className="text-end">{t("actual")}</th>
                <th className="text-end">{t("variance")}</th>
                <th className="text-end">{t("achievement%")}</th>
                <th width="15%">{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {displayMonthlyData.map((month, idx) => {
                const physicalColor = getVarianceColor(month.physicalVariance);
                const financialColor = getVarianceColor(
                  month.financialVariance,
                );
                const statusColor = getStatusColor(
                  Math.min(
                    month.physicalAchievement || 0,
                    month.financialAchievement || 0,
                  ),
                );

                return (
                  <tr key={idx}>
                    <td>
                      <div className="fw-medium text-dark">
                        {month.monthName}
                      </div>
                      <div className="small text-muted">
                        {month.monthShortName}
                      </div>
                    </td>
                    <td className="text-end">
                      <div>
                        <small className="d-block text-muted">
                          {t("physical")}
                        </small>
                        <span className="text-dark">
                          {formatValue(month.plannedPhysical, true)}
                        </span>
                      </div>
                      <div className="mt-1">
                        <small className="d-block text-muted">
                          {t("financial")}
                        </small>
                        <span className="text-dark">
                          {formatValue(month.plannedFinancial, false, true)}
                        </span>
                      </div>
                    </td>
                    <td className="text-end">
                      <div>
                        <small className="d-block text-muted">
                          {t("physical")}
                        </small>
                        <span className="text-dark">
                          {formatValue(month.actualPhysical, true)}
                        </span>
                      </div>
                      <div className="mt-1">
                        <small className="d-block text-muted">
                          {t("financial")}
                        </small>
                        <span className="text-dark">
                          {formatValue(month.actualFinancial, false, true)}
                        </span>
                      </div>
                    </td>
                    <td className="text-end">
                      <div>
                        <small className="d-block text-muted">
                          {t("physical")}
                        </small>
                        <span className={physicalColor}>
                          {formatValue(month.physicalVariance, true)}
                        </span>
                      </div>
                      <div className="mt-1">
                        <small className="d-block text-muted">
                          {t("financial")}
                        </small>
                        <span className={financialColor}>
                          {formatValue(month.financialVariance, false, true)}
                        </span>
                      </div>
                    </td>

                    <td className="text-end">
                      <div>
                        <small className="d-block text-muted">
                          {t("physical")}
                        </small>
                        <span
                          className={
                            month.physicalAchievement === null
                              ? ""
                              : month.physicalAchievement >= 100
                                ? "text-success"
                                : month.physicalAchievement >= 80
                                  ? "text-warning"
                                  : "text-danger"
                          }
                        >
                          {month.physicalAchievement
                            ? `${month.physicalAchievement.toFixed(0)}%`
                            : `${t("N/A")}`}
                        </span>
                      </div>
                      <div className="mt-1">
                        <small className="d-block text-muted">
                          {t("financial")}
                        </small>
                        <span
                          className={
                            month.financialAchievement === null
                              ? ""
                              : month.financialAchievement >= 100
                                ? "text-success"
                                : month.financialAchievement >= 80
                                  ? "text-warning"
                                  : "text-danger"
                          }
                        >
                          {month.financialAchievement
                            ? `${month.financialAchievement.toFixed(0)}%`
                            : `${t("N/A")}`}
                        </span>
                      </div>
                    </td>

                    <td>
                      <Badge
                        color="light"
                        className="w-100 py-1 fw-semibold text-muted border border-0 bg-transparent"
                        pill
                      >
                        {month.status
                          ? projectStatusMap[month.status]
                          : t("not_set")}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
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
