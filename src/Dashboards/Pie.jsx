// import React from "react";
// import ReactEcharts from "echarts-for-react";
// import getChartColorsArray from "../components/Common/ChartsDynamicColor";

// const Pie = ({chartData, dataColors }) => {
//   const PieEChartColors = getChartColorsArray(dataColors);
//   const options = {
//     toolbox: {
//       show: false,
//     },
//     tooltip: {
//       trigger: "item",
//       formatter: "{a} <br/>{b} : {c} ({d}%)",
//     },
//     legend: {
//       orient: "vertical",
//       left: "left",
//       data: ["Laptop", "Tablet", "Mobile", "Others", "Desktop"],
//       textStyle: {
//         color: ["#8791af"],
//       },
//     },
//     color: PieEChartColors,
//     series: [
//       {
//         name: "Total sales",
//         type: "pie",
//         radius: "55%",
//         center: ["50%", "60%"],
//         data: chartData,
//         itemStyle: {
//           emphasis: {
//             shadowBlur: 10,
//             shadowOffsetX: 0,
//             shadowColor: "rgba(0, 0, 0, 0.5)",
//           },
//         },
//       },
//     ],
//   };
//   return (
//     <React.Fragment>
//       <ReactEcharts style={{ height: "350px" }} option={options} />
//     </React.Fragment>
//   );
// };
// export default Pie;

import React from "react";
import ReactEcharts from "echarts-for-react";
import getChartColorsArray from "../components/Common/ChartsDynamicColor";

const Pie = ({ chartData, dataColors }) => {
  const PieEChartColors = getChartColorsArray(dataColors);
  const options = {
    toolbox: {
      show: false,
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
   /* legend: {
      orient: "vertical",
      left: "left",
      data: chartData,
      textStyle: {
        color: ["#8791af"],
      },
    },*/
    color: PieEChartColors,
    series: [
      {
        name: "---",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: chartData,
        itemStyle: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  return (
    <React.Fragment>
      {/* Adjust height to 200px */}
      <ReactEcharts style={{ height: "250px" }} option={options} />
    </React.Fragment>
  );
};
export default Pie;