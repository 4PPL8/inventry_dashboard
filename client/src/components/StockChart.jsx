import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StockChart = ({ data }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const color = isDark ? '#ffffff' : '#000000';
    const gridColor = isDark ? '#333333' : '#e5e5e5';

    const chartData = {
        labels: data.map(item => item.name),
        datasets: [
            {
                label: 'Stock Level',
                data: data.map(item => item.quantity),
                backgroundColor: color,
                borderRadius: 2,
                barThickness: 20,
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

    return <Bar data={chartData} options={options} />;
};

export default StockChart;
