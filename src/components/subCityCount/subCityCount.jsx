import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import './subcitycount.css';
import localforage from 'localforage';

function SubCityCountChart() {
  const [subcityData, setSubcityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubcityData();
  }, []);

  const fetchSubcityData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await localforage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        responseType: 'json',
      };
      const response = await axios.get('https://food-dispenser-api.onrender.com/v1/device/subCity', { headers });
      if (response.data.message === 'Unauthorized') {
        window.location.href = '/login';
        await localforage.removeItem('token');
        return;
      }
      const data = response.data.response;
      if(data !== subcityData){
        setSubcityData(data);
      }
      setLoading(false);
    } catch (error) {
      setError('Unable to fetch subcity data');
      setLoading(false);
    }
  };

  const subcityNames = subcityData.map((d) => d._id);
  const subcityCounts = subcityData.map((d) => d.count);

  const chartData = {
    labels: subcityNames,
    datasets: [
      {
        label: 'User Count',
        data: subcityCounts,
        backgroundColor: 'rgba(23, 165, 250, 0.82)',
        borderWidth: 1,
        borderColor: 'rgba(164, 192, 211, 0.8)',
        hoverBorderWidth: 3,
        // hoverBorderColor: '#110',
      },
    ],
  };
  
  const chartOptions = {
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          beginAtZero: true,
          font: {
            size: 16,
          },
        },
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.1)',
        },
        title: {
          display: true,
          text: '- Number of Users -',
          color: 'rgba(27, 29, 30, 0.82)',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
      x: {
        ticks: {
          stepSize: 1,
          font: {
            size: 16,
          },
        },
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: '- Subcity -',
          color: 'rgba(27, 29, 30, 0.82)',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            const subcity = subcityNames[context.dataIndex] || '';
            return `${label}: ${value} (${subcity})`;
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad',
    },
  };

  return (
    <div className="SubCityCountChart">
      <h2 className="SubCityCountChart-title">Users by Subcity</h2>
      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
        <Bar data={chartData} options={chartOptions} className='chart-canvas'/>
        <p class="SubCityCountChart-summary">
          <strong>Summary:</strong> <br />This Chart displays the distribution of users across different subcities. 
          The chart provides a visual representation of the number of registered users in each subcity, 
          allowing you to quickly identify which subcities have the most users. 
          The X-axis shows the subcity names, and the Y-axis shows the number of users in each subcity. 
          Each bar in the chart represents a subcity, and the height of the bar indicates the number of users in that subcity. 
          Users can hover over the bars to view the exact number of users in each subcity.
        </p>
  </>
      )}
    </div>
  );
}

export default SubCityCountChart;