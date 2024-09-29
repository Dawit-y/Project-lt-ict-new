import React from "react"
import ReactApexChart from "react-apexcharts"
import getChartColorsArray from "../../../components/Common/ChartsDynamicColor";

const RangeAreaChart = ({dataColors}) => {
  const RangeAreaChartColors = getChartColorsArray(dataColors);

  const series= [
    {
        name: 'New York Temperature',
        data: [
            {
                x: 'Jan',
                y: [-2, 4]
            },
            {
                x: 'Feb',
                y: [-1, 6]
            },
            {
                x: 'Mar',
                y: [3, 10]
            },
            {
                x: 'Apr',
                y: [8, 16]
            },
            {
                x: 'May',
                y: [13, 22]
            },
            {
                x: 'Jun',
                y: [18, 26]
            },
            {
                x: 'Jul',
                y: [21, 29]
            },
            {
                x: 'Aug',
                y: [21, 28]
            },
            {
                x: 'Sep',
                y: [17, 24]
            },
            {
                x: 'Oct',
                y: [11, 18]
            },
            {
                x: 'Nov',
                y: [6, 12]
            },
            {
                x: 'Dec',
                y: [1, 7]
            }
        ]
    }
];
  const options = {    
    chart: {
        height: 350,
        type: 'rangeArea'
    },
    colors: RangeAreaChartColors,
    stroke: {
        curve: 'straight'
    },
    title: {
        text: 'New York Temperature (all year round)'
    },
    markers: {
        hover: {
            sizeOffset: 5
        }
    },
    dataLabels: {
        enabled: false
    },
    yaxis: {
        labels: {
            formatter: function(val) {
                return val + '°C'
            }
        }
    }
};

  return (
    <ReactApexChart options={options} series={series} type="rangeArea" height="365" />
  )
}

export default RangeAreaChart
