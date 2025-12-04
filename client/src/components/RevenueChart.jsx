import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueChart = ({ data }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const color = isDark ? '#ffffff' : '#000000';
    const gridColor = isDark ? '#333333' : '#e5e5e5';

    const chartData = {
        labels: data.map(item => item._id),
        datasets: [
            {
                label: 'Revenue',
                data: data.map(item => item.totalRevenue),
                borderColor: color,
                backgroundColor: color,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? '#000000' : '#ffffff',
                titleColor: color,
                bodyColor: color,
                borderColor: gridColor,
                borderWidth: 1,
                padding: 10,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: isDark ? '#888888' : '#666666' }
            },
            y: {
                grid: { color: gridColor, drawBorder: false },
                ticks: { color: isDark ? '#888888' : '#666666' }
            }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default RevenueChart;
