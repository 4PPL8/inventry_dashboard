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

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <Spinner animation="border" variant="secondary" />
        </div>
    );

    if (error) return <Alert variant="light" className="border border-danger text-danger">{error}</Alert>;

    return (
        <div>
            {/* KPI Cards */}
            <Row className="g-4 mb-5">
                <Col md={3}>
                    <div className="p-4 h-100" style={{
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '12px',
                        boxShadow: 'var(--card-shadow)',
                        border: 'var(--glass-border)'
                    }}>
                        <StatsCard title="Monthly Revenue" value={data.kpi.monthlyRevenue} />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="p-4 h-100" style={{
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '12px',
                        boxShadow: 'var(--card-shadow)',
                        border: 'var(--glass-border)'
                    }}>
                        <StatsCard title="Monthly Profit" value={data.kpi.monthlyProfit} />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="p-4 h-100" style={{
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '12px',
                        boxShadow: 'var(--card-shadow)',
                        border: 'var(--glass-border)'
                    }}>
                        <StatsCard title="Monthly Expenses" value={data.kpi.monthlyExpenses} />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="p-4 h-100" style={{
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '12px',
                        boxShadow: 'var(--card-shadow)',
                        border: 'var(--glass-border)'
                    }}>
                        <StatsCard title="Monthly Loss" value={data.kpi.monthlyLoss} />
                    </div>
                </Col>
            </Row>

            {/* Charts */}
            <Row className="g-4 justify-content-center">
                <Col md={6} className="d-flex justify-content-center">
                    <div className="p-4 w-100" style={{
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '12px',
                        boxShadow: 'var(--card-shadow)',
                        border: 'var(--glass-border)',
                        height: '350px',
                        maxWidth: '550px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <h6 className="text-secondary text-uppercase mb-3 text-center" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Revenue Overview</h6>
                        <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                            <RevenueChart data={data.charts.revenueTrend} />
                        </div>
                    </div>
                </Col>
                <Col md={6} className="d-flex justify-content-center">
                    <div className="p-4 w-100" style={{
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '12px',
                        boxShadow: 'var(--card-shadow)',
                        border: 'var(--glass-border)',
                        height: '350px',
                        maxWidth: '550px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <h6 className="text-secondary text-uppercase mb-3 text-center" style={{ letterSpacing: '1px', fontSize: '0.8rem' }}>Stock Status</h6>
                        <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                            <StockChart data={data.charts.stockOverview} />
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
