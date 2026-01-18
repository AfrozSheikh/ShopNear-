import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const SalesChart = ({ data }) => {
  const chartData = {
    labels: data.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales (₹)',
        data: data.values || [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export const OrdersChart = ({ data }) => {
  const chartData = {
    labels: data.labels || ['Requested', 'Accepted', 'Completed', 'Rejected'],
    datasets: [
      {
        label: 'Orders',
        data: data.values || [0, 0, 0, 0],
        backgroundColor: [
          'rgba(234, 179, 8, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Orders by Status',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export const ProductCategoryChart = ({ data }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: 'Products',
        data: data.values || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Products by Category',
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};
