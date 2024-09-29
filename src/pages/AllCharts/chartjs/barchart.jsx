import React from "react";
import { Bar } from "react-chartjs-2";
import getChartColorsArray from "../../../components/Common/ChartsDynamicColor";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const BarChart = ({ dataColors }) => {
  var barChartColor = getChartColorsArray(dataColors);
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Sales Analytics",
        backgroundColor: barChartColor[0],
        borderColor: barChartColor[0],
        borderWidth: 1,
        hoverBackgroundColor: barChartColor[1],
        hoverBorderColor: barChartColor[1],
        data: [65, 59, 81, 45, 56, 80, 50, 20],
      },
    ],
  }

  const option = {
    scales: {
      x: {
        barPercentage: 0.4
      },
      y: {

      }
    }
  }

  return <Bar width={751} height={300} data={data} options={option} />;
};

export default BarChart;
