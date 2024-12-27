import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

function LineChart() {
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
    const labels = monthlyData.map((item) => monthNames[item.month - 1]);
    const reservations = monthlyData.map((item) => item.Reservation);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Reservation',
          borderColor: 'skyblue',
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
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
      {data && <Line data={data} />}
    </div>
  );
}

export default LineChart;
