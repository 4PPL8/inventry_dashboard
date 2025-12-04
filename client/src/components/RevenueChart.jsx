import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueChart = ({ data }) => {
    // Data is expected to be array of { _id: monthIndex, totalRevenue: number }
    // We need to map month index to label
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Create a map for easy lookup
    const dataMap = {};
    data.forEach(d => {
        dataMap[d._id] = d.totalRevenue;
    });

    const labels = months;
    const values = months.map((_, index) => dataMap[index + 1] || 0);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Monthly Revenue',
                data: values,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Revenue Trend (Last 12 Months)' },
        },
    };

    return <Line options={options} data={chartData} />;
};

export default RevenueChart;
