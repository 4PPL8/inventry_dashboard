import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StockChart = ({ data }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Create gradient for bars
    const createGradient = (ctx, chartArea, color) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, color + '80'); // 50% opacity
        gradient.addColorStop(1, color); // 100% opacity
        return gradient;
    };

    // Color mapping based on stock levels
    const getBarColor = (quantity) => {
        if (quantity < 20) return '#ef4444'; // Red for low stock
        if (quantity < 40) return '#f59e0b'; // Orange for medium stock
        return '#10b981'; // Green for good stock
    };

    const chartData = {
        labels: data.map(item => item.name),
        datasets: [
            {
                label: 'Stock Level',
                data: data.map(item => item.quantity),
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    const quantity = data[context.dataIndex]?.quantity || 0;
                    const color = getBarColor(quantity);
                    return createGradient(ctx, chartArea, color);
                },
                borderColor: data.map(item => getBarColor(item.quantity)),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 'flex',
                maxBarThickness: 40,
                hoverBackgroundColor: (context) => {
                    const quantity = data[context.dataIndex]?.quantity || 0;
                    return getBarColor(quantity);
                },
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
                        const quantity = context.parsed.y;
                        let status = '';
                        if (quantity < 20) status = ' (Low Stock)';
                        else if (quantity < 40) status = ' (Medium Stock)';
                        else status = ' (Good Stock)';
                        return quantity + ' units' + status;
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
                    font: { size: 10, weight: '500' },
                    padding: 8,
                    maxRotation: 45,
                    minRotation: 45
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
                    stepSize: 20
                },
                beginAtZero: true
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
            delay: (context) => {
                return context.dataIndex * 50; // Stagger animation
            }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default StockChart;
