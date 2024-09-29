import React from "react"
import ReactApexChart from "react-apexcharts"
import getChartColorsArray from "../../../components/Common/ChartsDynamicColor";

const DumbelColumnChart = ({dataColors}) => {
  const DumbelColumnChartColors = getChartColorsArray(dataColors);

  const series= [
    {
      data: [
        {
          x: '2008',
          y: [2800, 4500]
        },
        {
          x: '2009',
          y: [3200, 4100]
        },
        {
          x: '2010',
          y: [2950, 7800]
        },
        {
          x: '2011',
          y: [3000, 4600]
        },
        {
          x: '2012',
          y: [3500, 4100]
        },
        {
          x: '2013',
          y: [4500, 6500]
        },
        {
          x: '2014',
          y: [4100, 5600]
        }
      ]
    }
  ];
  const options = {    
    chart: {
        zoom: {
            enabled: false
        }
    },
    color: DumbelColumnChartColors,
    plotOptions: {
        bar: {
            isDumbbell: true,
            columnWidth: 3,
            dumbbellColors: DumbelColumnChartColors
        }
    },
    legend: {
        show: true,
        showForSingleSeries: true,
        position: 'top',
        horizontalAlign: 'left',
        customLegendItems: ['Product A', 'Product B']
    },
    fill: {
        type: 'gradient',
        gradient: {
            type: 'vertical',
            gradientToColors: ['#00E396'],
            inverseColors: true,
            stops: [0, 100]
        }
    },
    grid: {
        xaxis: {
            lines: {
                show: true
            }
        },
        yaxis: {
            lines: {
                show: false
            }
        }
    },
    xaxis: {
        tickPlacement: 'on'
    }
  }

  return (
    <ReactApexChart options={options} series={series} type="rangeBar" height="365" />
  )
}

export default DumbelColumnChart
