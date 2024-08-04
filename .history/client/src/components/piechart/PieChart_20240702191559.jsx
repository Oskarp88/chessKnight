// PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const chartData = {
    labels: ['Ganadas', 'Perdidas', 'Empates'],
    datasets: [
      {
        data: [data.won, data.lost, data.tied],
        backgroundColor: ['#80de83', '#F9A825', '#3498db'],
        hoverBackgroundColor: ['#4caf50', '#f57c00', '#2980b9'],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
