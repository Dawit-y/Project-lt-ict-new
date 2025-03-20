import React from "react";
import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";
import Chart from "react-apexcharts";

const ProjectSummary = ({ data }) => {
  console.log("data", data)
  const additionalBudget = parseFloat(data?.additional_budget?.additional_budget) || 0
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
    // Perform calculations only if both dates exist
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
    labels: ["Used Budget", "Remaining Budget", "Additional Budget"],
  };
  const budgetChartSeries = [budgetData.usedBudget, budgetData.remainingAmount, additionalBudget];

  const timeChartOptions = {
    colors: ["#50a5f1", "#f1b44c"],
    labels: ["Used Time", "Remaining Time"],
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
            <CardTitle tag="h5" className="mb-4">Budget Overview</CardTitle>
            <h6>Current Total Budget: {budgetData.totalBudget.toLocaleString()} birr</h6>
            <h6>Additional Budget: {additionalBudget.toLocaleString()} birr</h6>
            <h6>Used Budget: {budgetData.usedBudget.toLocaleString()} birr</h6>
            <h6>Remaining Amount: {budgetData.remainingAmount.toLocaleString()} birr</h6>
            <div>
              <Chart options={budgetChartOptions} series={budgetChartSeries} type="pie" width={350} height={350} />
            </div>
          </Col>

          {/* Physical Performance */}
          <Col md={4}>
            <CardTitle tag="h5">Physical Performance</CardTitle>
            <div>
              <Chart options={performanceChartOptions} series={performanceChartSeries} type="radialBar" width={250} />
            </div>
          </Col>

          {/* Time Overview - Show only if valid dates exist */}
          <Col md={4}>
            <CardTitle tag="h5" className="mb-4">Time Overview</CardTitle>
            {timeData ? (
              <>
                <h6>Total Project Duration: {timeData.totalDuration} days</h6>
                <h6>Used Time: {timeData.usedTime} days</h6>
                <h6>Remaining Time: {timeData.remainingTime} days</h6>
                <div>
                  <Chart options={timeChartOptions} series={timeChartSeries} type="pie" width={350} height={350} />
                </div>
              </>
            ) : (
              <p>Time data is unavailable.</p>
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ProjectSummary;
