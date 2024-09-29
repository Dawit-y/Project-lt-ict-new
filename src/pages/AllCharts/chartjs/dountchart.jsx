import React from "react";
import { Doughnut } from "react-chartjs-2";
import getChartColorsArray from "../../../components/Common/ChartsDynamicColor";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const DountChart = ({ dataColors }) => {
  var doughnutChartColors = getChartColorsArray(dataColors);
  const data = {
    labels: ["Desktops", "Tablets"],
    datasets: [
      {
        data: [300, 210],
        backgroundColor: doughnutChartColors,
        hoverBackgroundColor: doughnutChartColors,
        hoverBorderColor: "#fff",
      },
    ],
  };

  return <Doughnut width={734} height={269} data={data} className="chartjs-chart" />;
};

export default DountChart;
