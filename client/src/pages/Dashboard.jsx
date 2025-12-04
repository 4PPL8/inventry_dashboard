import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import StatsCard from '../components/StatsCard';
import StockChart from '../components/StockChart';
import RevenueChart from '../components/RevenueChart';
import { getDashboardSummary } from '../services/api';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getDashboardSummary();
            setData(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load dashboard data');
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div>
            <h2 className="mb-4">Dashboard</h2>

            {/* KPI Cards */}
            <Row>
                <Col md={3}>
                    <StatsCard title="Monthly Revenue" value={data.kpi.monthlyRevenue} color="success" />
                </Col>
                <Col md={3}>
                    <StatsCard title="Monthly Profit" value={data.kpi.monthlyProfit} color="info" />
                </Col>
                <Col md={3}>
                    <StatsCard title="Monthly Expenses" value={data.kpi.monthlyExpenses} color="warning" />
                </Col>
                <Col md={3}>
                    <StatsCard title="Monthly Loss" value={data.kpi.monthlyLoss} color="danger" />
                </Col>
            </Row>

            {/* Charts */}
            <Row className="mt-4">
                <Col md={8}>
                    <div className="p-3 bg-white shadow-sm rounded">
                        <RevenueChart data={data.charts.revenueTrend} />
                    </div>
                </Col>
                <Col md={4}>
                    <div className="p-3 bg-white shadow-sm rounded">
                        <StockChart data={data.charts.stockOverview} />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
