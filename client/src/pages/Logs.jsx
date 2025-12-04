import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Breadcrumb, Spinner, Badge } from 'react-bootstrap';
import { getLogsYears, getLogsMonths, getLogsDays, getDayDetails, searchLogs } from '../services/api';

const Logs = () => {
    const [view, setView] = useState('years'); // years, months, days, details, search
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        loadYears();
    }, []);

    const loadYears = async () => {
        setLoading(true);
        try {
            const res = await getLogsYears();
            setData(res.data);
            setView('years');
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleYearClick = async (year) => {
        setSelectedYear(year);
        setLoading(true);
        try {
            const res = await getLogsMonths(year);
            setData(res.data);
            setView('months');
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleMonthClick = async (month) => {
        setSelectedMonth(month);
        setLoading(true);
        try {
            const res = await getLogsDays(selectedYear, month);
            setData(res.data);
            setView('days');
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleDayClick = async (day) => {
        setSelectedDay(day);
        setLoading(true);
        try {
            const res = await getDayDetails(selectedYear, selectedMonth, day);
            setData(res.data);
            setView('details');
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim() && !startDate && !endDate) return loadYears();

        setLoading(true);
        try {
            const res = await searchLogs(searchQuery, startDate, endDate);
            setData(res.data);
            setView('search');
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const resetView = () => {
        setSearchQuery('');
        setStartDate('');
        setEndDate('');
        setSelectedYear(null);
        setSelectedMonth(null);
        setSelectedDay(null);
        loadYears();
    };

    const renderBreadcrumbs = () => {
        if (view === 'search') return <Breadcrumb.Item active style={{ color: 'var(--text-primary)' }}>Search Results</Breadcrumb.Item>;
        return (
            <Breadcrumb style={{ '--bs-breadcrumb-divider-color': 'var(--text-secondary)' }}>
                <Breadcrumb.Item
                    onClick={resetView}
                    style={{
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        textDecoration: 'none'
                    }}
                    className="breadcrumb-custom"
                >
                    Logs
                </Breadcrumb.Item>
                {selectedYear && (
                    <Breadcrumb.Item
                        onClick={() => handleYearClick(selectedYear)}
                        active={view === 'months'}
                        style={{
                            cursor: view === 'months' ? 'default' : 'pointer',
                            color: 'var(--text-primary)',
                            textDecoration: 'none'
                        }}
                        className="breadcrumb-custom"
                    >
                        {selectedYear}
                    </Breadcrumb.Item>
                )}
                {selectedMonth && (
                    <Breadcrumb.Item
                        onClick={() => handleMonthClick(selectedMonth)}
                        active={view === 'days'}
                        style={{
                            cursor: view === 'days' ? 'default' : 'pointer',
                            color: 'var(--text-primary)',
                            textDecoration: 'none'
                        }}
                        className="breadcrumb-custom"
                    >
                        {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })}
                    </Breadcrumb.Item>
                )}
                {selectedDay && <Breadcrumb.Item active style={{ color: 'var(--text-primary)' }}>{selectedDay}</Breadcrumb.Item>}
            </Breadcrumb>
        );
    };

    const renderContent = () => {
        if (loading) return <Spinner animation="border" />;

        if (view === 'years') {
            return (
                <Row className="g-3">
                    {data.map(year => (
                        <Col key={year} xs={6} sm={4} md={3} className="mb-3">
                            <Card
                                className="text-center cursor-pointer h-100"
                                onClick={() => handleYearClick(year)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: 'var(--bg-card)',
                                    border: 'var(--glass-border)',
                                    boxShadow: 'var(--card-shadow)',
                                    borderRadius: '12px',
                                    padding: '2rem 1rem',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    minHeight: '120px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                                }}
                            >
                                <h3 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.75rem' }}>{year}</h3>
                            </Card>
                        </Col>
                    ))}
                    {data.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No logs available.</p>}
                </Row>
            );
        }

        if (view === 'months') {
            return (
                <Row className="g-3">
                    {data.map(item => (
                        <Col key={item._id} xs={6} sm={4} md={3} className="mb-3">
                            <Card
                                className="text-center cursor-pointer h-100"
                                onClick={() => handleMonthClick(item._id)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: 'var(--bg-card)',
                                    border: 'var(--glass-border)',
                                    boxShadow: 'var(--card-shadow)',
                                    borderRadius: '12px',
                                    padding: '1.5rem 1rem',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    minHeight: '140px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                                }}
                            >
                                <h4 style={{
                                    color: 'var(--text-primary)',
                                    marginBottom: '0.75rem',
                                    fontSize: '1.25rem',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {new Date(selectedYear, item._id - 1).toLocaleString('default', { month: 'long' })}
                                </h4>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                    {item.count} Transactions
                                </div>
                                <div style={{ color: '#10b981', fontSize: '1rem', fontWeight: '600' }}>
                                    PKR {item.revenue.toLocaleString()}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            );
        }

        if (view === 'days') {
            return (
                <Row className="g-3">
                    {data.map(item => (
                        <Col key={item._id} xs={6} sm={4} md={3} lg={2} className="mb-3">
                            <Card
                                className="text-center cursor-pointer h-100"
                                onClick={() => handleDayClick(item._id)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: 'var(--bg-card)',
                                    border: 'var(--glass-border)',
                                    boxShadow: 'var(--card-shadow)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                                }}
                            >
                                <h5 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Day {item._id}</h5>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{item.count} Txns</div>
                                <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '600' }}>PKR {item.revenue.toLocaleString()}</div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            );
        }

        if (view === 'details' || view === 'search') {
            return (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Party</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(txn => (
                            <tr key={txn._id}>
                                <td>{new Date(txn.date).toLocaleString()}</td>
                                <td>
                                    <Badge bg="dark">
                                        {txn.type}
                                    </Badge>
                                </td>
                                <td>{txn.partyName || '-'}</td>
                                <td>
                                    <ul className="list-unstyled mb-0">
                                        {txn.items.map((item, idx) => (
                                            <li key={idx}>
                                                {item.productName} ({item.quantity})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>PKR {txn.totalAmount.toLocaleString()}</td>
                                <td>{txn.notes}</td>
                            </tr>
                        ))}
                        {data.length === 0 && <tr><td colSpan="6" className="text-center">No transactions found</td></tr>}
                    </tbody>
                </Table>
            );
        }
    };

    return (
        <Container>
            <div className="mb-4">
                <h2 style={{ marginBottom: '1.5rem' }}>Logs</h2>
                <Form onSubmit={handleSearch}>
                    <Row className="g-2 align-items-end">
                        <Col xs={12} md={4}>
                            <Form.Group>
                                <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Search</Form.Label>
                                <Form.Control
                                    type="search"
                                    placeholder="Search by party, product, notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        backgroundColor: 'var(--bg-card)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6} md={3}>
                            <Form.Group>
                                <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{
                                        backgroundColor: 'var(--bg-card)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={6} md={3}>
                            <Form.Group>
                                <Form.Label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>End Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={{
                                        backgroundColor: 'var(--bg-card)',
                                        border: 'var(--glass-border)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={2}>
                            <Button
                                type="submit"
                                className="w-100"
                                style={{
                                    backgroundColor: 'var(--text-primary)',
                                    color: 'var(--bg-dark)',
                                    border: 'none',
                                    fontWeight: '500'
                                }}
                            >
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>

            {renderBreadcrumbs()}
            <div className="mt-4">
                {renderContent()}
            </div>
        </Container>
    );
};

export default Logs;
