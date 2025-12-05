import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import StatsCard from '../components/StatsCard';
import StockChart from '../components/StockChart';
import RevenueChart from '../components/RevenueChart';
import RecentTransactions from '../components/RecentTransactions';
import DateRangeSelector from '../components/DateRangeSelector';
import { getDashboardSummary } from '../services/api';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState(null);

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const fetchData = async () => {
        try {
            const params = dateRange ? {
                startDate: dateRange.startDate.toISOString(),
                endDate: dateRange.endDate.toISOString()
            } : {};
            const response = await getDashboardSummary(params);
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
        <div className="page-transition-enter">
            {/* KPI Cards */}
            <Row className="g-4 mb-5">
                <Col md={3}>
                    <div className="h-100" style={{
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                        }}>
                        <StatsCard title="Monthly Revenue" value={data.kpi.monthlyRevenue} gradient="var(--gradient-info)" />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="h-100" style={{
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                        }}>
                        <StatsCard title="Monthly Profit" value={data.kpi.monthlyProfit} gradient="var(--gradient-success)" />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="h-100" style={{
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                        }}>
                        <StatsCard title="Monthly Expenses" value={data.kpi.monthlyExpenses} gradient="var(--gradient-warning)" />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="h-100" style={{
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                        }}>
                        <StatsCard title="Monthly Loss" value={data.kpi.monthlyLoss} gradient="var(--gradient-danger)" />
                    </div>
                </Col>
            </Row>

            {/* Recent Transactions - Full Width */}
            <div className="mb-5">
                <RecentTransactions />
            </div>

            {/* Date Range Selector */}
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h5 style={{ color: 'var(--text-primary)', fontWeight: '600', margin: 0 }}>
                    Analytics Overview
                </h5>
                <DateRangeSelector onDateRangeChange={setDateRange} />
            </div>

            {/* Charts */}
            <Row className="g-4 justify-content-center">
                <Col md={6} className="d-flex justify-content-center">
                    <div className="p-4 w-100" style={{
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--card-shadow)',
                        border: 'var(--glass-border)',
                        height: '350px',
                        maxWidth: '550px',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                        }}>
                        <h6 className="text-uppercase mb-3 text-center" style={{
                            letterSpacing: '1px',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            fontWeight: 600
                        }}>Revenue Overview</h6>
                        <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                            <RevenueChart data={data.charts.revenueTrend} />
                        </div>
                    </div>
                </Col>
                <Col md={6} className="d-flex justify-content-center">
                    <div className="p-4 w-100" style={{
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--card-shadow)',
                        border: 'var(--glass-border)',
                        height: '350px',
                        maxWidth: '550px',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                        }}>
                        <h6 className="text-uppercase mb-3 text-center" style={{
                            letterSpacing: '1px',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            fontWeight: 600
                        }}>Stock Status</h6>
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
