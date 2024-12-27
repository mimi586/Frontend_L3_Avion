import { useState, useEffect } from "react";
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

function PieChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      const response = await fetch('http://localhost:8081/fetch_month/fetch_month');
      const monthlyData = await response.json();
      setData(formatData(monthlyData));
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const formatData = (monthlyData) => {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const backgroundColors = [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(255, 159, 64, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 99, 132, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(255, 159, 64, 0.5)'
    ];

    const labels = monthlyData.map((item) => monthNames[item.month - 1]);
    const reservations = monthlyData.map((item) => item.Reservation);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Réservations',
          borderColor: 'skyblue',
          backgroundColor: backgroundColors,
          data: reservations,
        },
      ],
    };
  };

  // Destroy the chart before rendering a new one
  useEffect(() => {
    return () => setData(null);
  }, []);

  return (
    <div className='bg-white border border-secondary rounded'>
      {data && <Pie data={data} options={{ 
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: 'rgba(54, 162, 235, 0.5)',
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`;
              }
            }
          }
        },
      }} />}
    </div>
  );
}

export default PieChart;
