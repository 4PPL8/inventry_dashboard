import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StockChart = ({ data }) => {
    const chartData = {
        labels: data.map(d => d.category),
        datasets: [
            {
                label: 'Stock Quantity',
                data: data.map(d => d.quantity),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Stock Overview by Category' },
        },
    };

    return <Bar options={options} data={chartData} />;
};

export default StockChart;
