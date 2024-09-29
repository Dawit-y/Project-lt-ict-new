import React from "react";
import { Pie } from "react-chartjs-2";
import getChartColorsArray from "../../../components/Common/ChartsDynamicColor";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const PieChart = ({ dataColors }) => {
  var pieChartColors = getChartColorsArray(dataColors);
  const data = {
    labels: ["Desktops", "Tablets"],
    datasets: [
      {
        data: [300, 180],
        backgroundColor: pieChartColors,
        hoverBackgroundColor: pieChartColors,
        hoverBorderColor: "#fff",
      },
    ],
  };

  return <Pie width={734} height={269} data={data} className="chartjs-chart" />;
};

export default PieChart;
