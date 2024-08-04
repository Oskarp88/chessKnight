// PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data , user}) => {
  const chartData = {
    labels: ['Ganadas', 'Perdidas', 'Empates'],
    datasets: [
      {
        data: [
          `${data === 'fast' ? user.gamesWonFast : data === 'blitz' ? user.gamesWonBlitz : user.gamesWonBullet}`, 
          `${data === 'fast' ? user.gamesLostFast : data === 'blitz' ? user.gamesLostBlitz : user.gamesLostBullet}`, 
          `${data === 'fast' ? user.gamesTiedFast : data === 'blitz' ? user.gamesTiedBlitz : user.gamesTiedBullet}`],
            backgroundColor: ['#80de83', '#E74C3C', '#3498db'
        ],
        hoverBackgroundColor: ['#4caf50', '#B03A2E', '#2980b9'],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
