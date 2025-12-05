import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const RevenueChart = ({ data }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Create gradient
    const createGradient = (ctx, chartArea) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, isDark ? 'rgba(59, 130, 246, 0.0)' : 'rgba(59, 130, 246, 0.0)');
        gradient.addColorStop(0.5, isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)');
        gradient.addColorStop(1, isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)');
        return gradient;
    };

    const chartData = {
        labels: data.map(item => item._id),
        datasets: [
            {
                label: 'Revenue',
                data: data.map(item => item.totalRevenue),
                borderColor: '#3b82f6',
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    return createGradient(ctx, chartArea);
                },
                borderWidth: 3,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#3b82f6',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2,
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                titleColor: isDark ? '#f1f5f9' : '#0f172a',
                bodyColor: isDark ? '#94a3b8' : '#64748b',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                titleFont: { size: 13, weight: '600' },
                bodyFont: { size: 14, weight: '500' },
                callbacks: {
                    label: function (context) {
                        return 'PKR ' + context.parsed.y.toLocaleString();
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: isDark ? '#94a3b8' : '#64748b',
                    font: { size: 11, weight: '500' },
                    padding: 8
                }
            },
            y: {
                grid: {
                    color: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(226, 232, 240, 0.8)',
                    drawBorder: false,
                    lineWidth: 1
                },
                ticks: {
                    color: isDark ? '#94a3b8' : '#64748b',
                    font: { size: 11, weight: '500' },
                    padding: 8,
                    callback: function (value) {
                        return 'PKR ' + (value / 1000).toFixed(0) + 'k';
                    }
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        }
    };

    return <Line data={chartData} options={options} />;
};

export default RevenueChart;
