import React from "react";
import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

const ProjectSummary = ({ data }) => {
  const { t } = useTranslation();
  const additionalBudget = parseFloat(data?.additional_budget?.additional_budget) || 0;

  const budgetData = {
    totalBudget: parseFloat(data?.data?.prj_total_estimate_budget) + additionalBudget || 0,
    usedBudget: parseFloat(data?.performance?.used_amount) || 0,
    remainingAmount:
      (parseFloat(data?.data?.prj_total_estimate_budget) || 0) -
      (parseFloat(data?.performance?.used_amount) || 0),
  };

  const performanceData = {
    physicalPerformance: parseInt(data?.performance?.physical_performance) || 0,
  };

  const projectData = data?.data || {};
  let startDate = null;

  if (projectData.status_id >= 5) {
    startDate = projectData.prj_start_date_gc ? new Date(projectData.prj_start_date_gc) : null;
  } else {
    startDate = projectData.prj_start_date_plan_gc ? new Date(projectData.prj_start_date_plan_gc) : null;
  }

  const endDate = projectData.prj_end_date_plan_gc ? new Date(projectData.prj_end_date_plan_gc) : null;

  let timeData = null;
  let timeChartSeries = null;

  if (startDate && endDate && !isNaN(startDate) && !isNaN(endDate)) {
    const totalDurationMs = endDate - startDate;
    const usedTimeMs = Date.now() - startDate;
    const remainingTimeMs = endDate - Date.now();

    const totalDuration = Math.floor(totalDurationMs / (1000 * 60 * 60 * 24));
    const usedTime = Math.floor(usedTimeMs / (1000 * 60 * 60 * 24));
    const remainingTime = remainingTimeMs > 0 ? Math.floor(remainingTimeMs / (1000 * 60 * 60 * 24)) : 0;

    timeData = {
      totalDuration,
      usedTime: Math.min(usedTime, totalDuration),
      remainingTime,
    };

    timeChartSeries = [timeData.usedTime, timeData.remainingTime];
  }

  const budgetChartOptions = {
    colors: ["#50a5f1", "#f1b44c", "#f46a6a"],
    labels: [t("Used Budget"), t("Remaining Budget"), t("Additional Budget")],
  };
  const budgetChartSeries = [budgetData.usedBudget, budgetData.remainingAmount, additionalBudget];

  const timeChartOptions = {
    colors: ["#50a5f1", "#f1b44c"],
    labels: [t("Used Time"), t("Remaining Time")],
  };

  const performanceChartOptions = {
    colors: ["#50a5f1"],
    chart: { type: "radialBar" },
    plotOptions: {
      radialBar: {
        hollow: { size: "70%" },
        dataLabels: {
          name: { show: false },
          value: { fontSize: "22px" },
        },
      },
    },
  };
  const performanceChartSeries = [performanceData.physicalPerformance];

  return (
    <Card>
      <CardBody>
        <Row>
          {/* Budget Overview */}
          <Col md={4}>
            <CardTitle tag="h5" className="mb-4">{t("Budget Overview")}</CardTitle>
            <h6>{t("Current Total Budget")}: {budgetData.totalBudget.toLocaleString()} {t("birr")}</h6>
            <h6>{t("Additional Budget")}: {additionalBudget.toLocaleString()} {t("birr")}</h6>
            <h6>{t("Used Budget")}: {budgetData.usedBudget.toLocaleString()} {t("birr")}</h6>
            <h6>{t("Remaining Amount")}: {budgetData.remainingAmount.toLocaleString()} {t("birr")}</h6>
            <div>
              <Chart options={budgetChartOptions} series={budgetChartSeries} type="pie" width={350} height={350} />
            </div>
          </Col>

          {/* Physical Performance */}
          <Col md={4}>
            <CardTitle tag="h5">{t("Physical Performance")}</CardTitle>
            <div>
              <Chart options={performanceChartOptions} series={performanceChartSeries} type="radialBar" width={250} />
            </div>
          </Col>

          {/* Time Overview */}
          <Col md={4}>
            <CardTitle tag="h5" className="mb-4">{t("Time Overview")}</CardTitle>
            {timeData ? (
              <>
                <h6>{t("Total Project Duration")}: {timeData.totalDuration} {t("days")}</h6>
                <h6>{t("Used Time")}: {timeData.usedTime} {t("days")}</h6>
                <h6>{t("Remaining Time")}: {timeData.remainingTime} {t("days")}</h6>
                <div>
                  <Chart options={timeChartOptions} series={timeChartSeries} type="pie" width={350} height={350} />
                </div>
              </>
            ) : (
              <p>{t("Time data is unavailable.")}</p>
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ProjectSummary;
